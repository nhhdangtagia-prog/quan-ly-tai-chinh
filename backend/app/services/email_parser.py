import re
import base64
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

@dataclass
class ParsedTransaction:
    amount: float
    transaction_type: str  # 'income' or 'expense'
    description: str
    bank_name: str
    raw_text: str
    message_id: str
    date: datetime
    balance: Optional[float] = None

# Regex patterns cho các ngân hàng VN phổ biến
BANK_PATTERNS = {
    "Vietcombank": {
        "senders": ["info@vietcombank.com.vn", "vcbdigibank@vietcombank.com.vn"],
        "debit_pattern": r"(?:So tien ghi No|Ghi no|Chi)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
        "credit_pattern": r"(?:So tien ghi Co|Ghi co|Nhan)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
        "desc_pattern": r"(?:Noi dung|Mo ta|Description)[^\w]*([^
<]+)",
        "balance_pattern": r"(?:So du|Balance)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
    },
    "MB Bank": {
        "senders": ["alert@mbbank.com.vn", "mbbank@mbbank.com.vn"],
        "debit_pattern": r"(?:So tien|Amount)[^\d-]*-\s*([\d,\.]+)(?:VND|vnd|\.00|d|đ)",
        "credit_pattern": r"(?:So tien|Amount)[^\d\+]*\+\s*([\d,\.]+)(?:VND|vnd|\.00|d|đ)",
        "desc_pattern": r"(?:Noi dung|Mo ta)[^\w]*([^
<]+)",
        "balance_pattern": r"(?:So du|Du)[^\d]*([\d,\.]+)(?:VND|vnd|d|đ)",
    },
    "Techcombank": {
        "senders": ["no-reply@techcombank.com.vn", "donotreply@techcombank.com.vn"],
        "debit_pattern": r"(?:Ghi no|No|So tien tru)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
        "credit_pattern": r"(?:Ghi co|Co|So tien nhan)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
        "desc_pattern": r"(?:Noi dung|ND)[^\w]*([^
<]+)",
        "balance_pattern": r"(?:SD|So du)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
    },
    "VPBank": {
        "senders": ["vpbankonline@vpbank.com.vn", "noreply@vpbank.com.vn"],
        "debit_pattern": r"(?:Ghi no|Chi|Tru)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
        "credit_pattern": r"(?:Ghi co|Cong|Nhan)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
        "desc_pattern": r"(?:Noi dung|Mo ta)[^\w]*([^
<]+)",
        "balance_pattern": r"(?:So du|SD)[^\d]*([\d,\.]+)\s*(?:VND|vnd|d|đ)",
    },
    "MoMo": {
        "senders": ["support@momo.vn", "no-reply@momo.vn"],
        "debit_pattern": r"(?:Ban da thanh toan|Chi|Tru|Giao dich thanh cong)[^\d]*([\d,\.]+)\s*(?:d|dong|VND|đ|VNĐ)",
        "credit_pattern": r"(?:Nhan duoc|Chuyen den)[^\d]*([\d,\.]+)\s*(?:d|dong|VND|đ|VNĐ)",
        "desc_pattern": r"(?:Noi dung|Den|Tu|Dich vu)[^\w]*([^
<]+)",
        "balance_pattern": None,
    },
}

def parse_amount(text: str) -> float:
    """Parse số tiền từ string: '1,234,567' or '1.234.567' -> 1234567.0"""
    cleaned = re.sub(r'[^\d]', '', text)
    return float(cleaned) if cleaned else 0.0

class GmailParser:
    """Parse giao dịch từ Gmail API"""
    
    def __init__(self, settings):
        self.settings = settings
    
    def _get_credentials(self, user: User) -> Optional[Credentials]:
        if not user.google_access_token:
            return None
            
        # Thường tokens sẽ được mã hóa, hàm này giả lập việc lấy token
        return Credentials(
            token=user.google_access_token,
            refresh_token=user.google_refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=self.settings.google_client_id,
            client_secret=self.settings.google_client_secret,
        )
        
    async def fetch_and_parse(self, user: User, max_results: int = 20) -> List[ParsedTransaction]:
        """Fetch email từ Gmail và parse giao dịch"""
        creds = self._get_credentials(user)
        if not creds:
            logger.warning(f"User {user.email} missing Google credentials")
            return []
            
        try:
            service = build('gmail', 'v1', credentials=creds)
            
            # Build sender filter query
            all_senders = []
            for bank_patterns in BANK_PATTERNS.values():
                all_senders.extend(bank_patterns["senders"])
            
            sender_query = " OR ".join([f"from:{s}" for s in all_senders])
            # Fetch các email gần đây từ ngân hàng (có thể add thêm is:unread nếu cần)
            query = f"({sender_query})"
            
            results = service.users().messages().list(userId='me', q=query, maxResults=max_results).execute()
            messages = results.get('messages', [])
            
            parsed_txns = []
            for msg in messages:
                msg_id = msg['id']
                try:
                    # Lấy chi tiết email
                    message = service.users().messages().get(userId='me', id=msg_id, format='full').execute()
                    
                    # Extract headers
                    headers = message.get('payload', {}).get('headers', [])
                    sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), '')
                    date_str = next((h['value'] for h in headers if h['name'].lower() == 'date'), '')
                    
                    try:
                        # Rất cơ bản, có thể cần datetime thư viện tốt hơn cho timezone (dateutil)
                        # Ở đây dùng datetime.now() làm fallback tạm
                        date_obj = datetime.now()
                    except Exception:
                        date_obj = datetime.now()
                    
                    # Xác định ngân hàng
                    bank_name = self.identify_bank(sender)
                    if not bank_name:
                        continue
                        
                    # Extract body
                    body = self._get_email_body(message.get('payload', {}))
                    if not body:
                        continue
                        
                    txn = self.parse_email_body(body, bank_name, msg_id, date_obj)
                    if txn:
                        parsed_txns.append(txn)
                        
                except Exception as e:
                    logger.error(f"Error parsing email {msg_id}: {e}")
                    
            return parsed_txns
            
        except Exception as e:
            logger.error(f"Gmail API Error for user {user.email}: {e}")
            return []
            
    def _get_email_body(self, payload: dict) -> str:
        """Extract text content from Gmail payload"""
        if 'parts' in payload:
            for part in payload['parts']:
                if part.get('mimeType') == 'text/plain':
                    data = part.get('body', {}).get('data')
                    if data:
                        return base64.urlsafe_b64decode(data).decode('utf-8')
                elif part.get('mimeType') == 'text/html':
                    # Lấy HTML nếu không có text/plain
                    data = part.get('body', {}).get('data')
                    if data:
                        import re
                        html = base64.urlsafe_b64decode(data).decode('utf-8')
                        return re.sub('<[^<]+?>', ' ', html) # remove tags basic
            # Đệ quy nếu nested multipart
            for part in payload['parts']:
                if 'parts' in part:
                    return self._get_email_body(part)
        elif 'body' in payload and 'data' in payload['body']:
            data = payload['body']['data']
            return base64.urlsafe_b64decode(data).decode('utf-8')
        return ""
    
    def identify_bank(self, sender: str) -> Optional[str]:
        """Xác định ngân hàng dựa vào sender email"""
        for bank_name, patterns in BANK_PATTERNS.items():
            if any(s.lower() in sender.lower() for s in patterns["senders"]):
                return bank_name
        return None
    
    def parse_email_body(self, body: str, bank_name: str, message_id: str, date: datetime) -> Optional[ParsedTransaction]:
        """Parse nội dung email để extract giao dịch bằng Regex"""
        patterns = BANK_PATTERNS.get(bank_name)
        if not patterns:
            return None
        
        # Clean text
        clean_body = body.replace('\r', '').replace('&nbsp;', ' ').strip()
        
        debit_match = re.search(patterns["debit_pattern"], clean_body, re.IGNORECASE)
        credit_match = re.search(patterns["credit_pattern"], clean_body, re.IGNORECASE)
        desc_match = re.search(patterns["desc_pattern"], clean_body, re.IGNORECASE)
        
        balance_match = None
        if patterns.get("balance_pattern"):
            balance_match = re.search(patterns["balance_pattern"], clean_body, re.IGNORECASE)
            
        desc = desc_match.group(1).strip() if desc_match else f"Giao dịch {bank_name}"
        # Cắt bớt nếu desc quá dài
        desc = desc[:200]
        
        balance = parse_amount(balance_match.group(1)) if balance_match else None
        
        if debit_match:
            return ParsedTransaction(
                amount=parse_amount(debit_match.group(1)),
                transaction_type="expense",
                description=desc,
                bank_name=bank_name,
                raw_text=clean_body[:500],
                message_id=message_id,
                date=date,
                balance=balance,
            )
        elif credit_match:
            return ParsedTransaction(
                amount=parse_amount(credit_match.group(1)),
                transaction_type="income",
                description=desc,
                bank_name=bank_name,
                raw_text=clean_body[:500],
                message_id=message_id,
                date=date,
                balance=balance,
            )
        return None
import google.generativeai as genai
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Simple in-memory cache để tiết kiệm quota API
_cache: dict[str, str] = {}

if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)

DEFAULT_CATEGORIES = [
    "Ăn uống", "Di chuyển", "Mua sắm", "Giải trí", "Y tế",
    "Hóa đơn", "Nhà ở", "Giáo dục", "Du lịch", "Lương",
    "Đầu tư", "Tiết kiệm", "Khác"
]

async def categorize_transaction(description: str, categories: list[str] = None) -> str:
    """Phân loại giao dịch bằng Gemini AI"""
    if not description or description.strip() == "":
        return "Khác"
    
    cats = categories or DEFAULT_CATEGORIES
    cache_key = f"{description.lower().strip()}"
    
    if cache_key in _cache:
        return _cache[cache_key]
    
    if not settings.gemini_api_key:
        logger.warning("GEMINI_API_KEY is not set. Fallback to 'Khác'")
        return "Khác"
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""Nhiệm vụ: Phân loại danh mục chi tiêu cho một giao dịch.
        
Danh sách danh mục cho phép: {', '.join(cats)}.

Mô tả giao dịch (từ SMS/Email ngân hàng): "{description}"

CHỈ TRẢ VỀ DUY NHẤT 1 TÊN DANH MỤC TRONG DANH SÁCH TRÊN. KHÔNG GIẢI THÍCH, KHÔNG CHẤM CÂU."""
        
        response = model.generate_content(prompt)
        result = response.text.strip().replace('.', '').replace('"', '')
        
        # Validate result
        for cat in cats:
            if cat.lower() == result.lower():
                _cache[cache_key] = cat
                return cat
                
        # Fuzzy match (ví dụ AI trả lời "Danh mục: Ăn uống")
        for cat in cats:
            if cat.lower() in result.lower():
                _cache[cache_key] = cat
                return cat
                
        return "Khác"
    except Exception as e:
        logger.error(f"Gemini API error categorizing '{description}': {e}")
        return "Khác"

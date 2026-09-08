import logging
from telegram import Bot
from app.config import settings

logger = logging.getLogger(__name__)

async def send_telegram_message(chat_id: str, text: str):
    """Gửi tin nhắn Telegram cho user"""
    if not settings.telegram_bot_token or not chat_id:
        return
        
    try:
        bot = Bot(token=settings.telegram_bot_token)
        await bot.send_message(chat_id=chat_id, text=text, parse_mode='HTML')
    except Exception as e:
        logger.error(f"Lỗi khi gửi tin nhắn Telegram tới {chat_id}: {e}")

async def notify_new_transaction(chat_id: str, amount: float, type: str, bank: str, category: str, desc: str):
    """Thông báo khi có giao dịch tự động mới"""
    if type == "expense":
        money_str = f"-{amount:,.0f}đ"
        icon = "🔴"
    else:
        money_str = f"+{amount:,.0f}đ"
        icon = "🟢"
        
    text = f"<b>{icon} Giao dịch mới từ {bank}</b>\n\n"
    text += f"Số tiền: <b>{money_str}</b>\n"
    text += f"Nội dung: <i>{desc}</i>\n"
    
    if category == "Khác" or category == "Chưa phân loại":
        text += f"\n⚠️ <b>AI chưa nhận diện được khoản chi này!</b>\n"
        text += f"Sếp vui lòng mở App lên để phân loại thủ công lại nhé."
    else:
        text += f"Danh mục (AI dự đoán): <b>{category}</b>"

    await send_telegram_message(chat_id, text)

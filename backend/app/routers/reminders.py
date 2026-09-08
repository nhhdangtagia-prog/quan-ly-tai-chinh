from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderResponse
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ReminderResponse])
async def get_reminders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Reminder).where(Reminder.user_id == current_user.id))
    return result.scalars().all()
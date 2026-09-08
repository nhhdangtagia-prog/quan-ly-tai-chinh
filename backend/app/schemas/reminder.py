from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date
from app.models.reminder import ReminderType

class ReminderBase(BaseModel):
    reminder_type: ReminderType
    title: str
    description: Optional[str] = None
    person_name: Optional[str] = None
    event_date: date
    remind_days_before: List[int] = [1, 3, 7]
    repeat_yearly: bool = True
    telegram_enabled: bool = True

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    person_name: Optional[str] = None
    event_date: Optional[date] = None
    remind_days_before: Optional[List[int]] = None
    repeat_yearly: Optional[bool] = None
    telegram_enabled: Optional[bool] = None

class ReminderResponse(ReminderBase):
    id: UUID
    user_id: UUID
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
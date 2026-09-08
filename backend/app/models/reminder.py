import uuid
from datetime import datetime, date
from sqlalchemy import String, Boolean, DateTime, Date, ForeignKey, func, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum

class ReminderType(str, enum.Enum):
    birthday = "birthday"
    anniversary = "anniversary"
    event = "event"
    custom = "custom"

class Reminder(Base):
    __tablename__ = "reminders"
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reminder_type: Mapped[ReminderType] = mapped_column(Enum(ReminderType), default=ReminderType.event)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    person_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    remind_days_before: Mapped[list] = mapped_column(JSON, default=lambda: [1, 3, 7])
    repeat_yearly: Mapped[bool] = mapped_column(Boolean, default=True)
    telegram_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="reminders")
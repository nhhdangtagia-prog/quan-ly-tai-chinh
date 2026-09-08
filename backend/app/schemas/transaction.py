from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from app.models.transaction import TransactionType, TransactionSource

class TransactionBase(BaseModel):
    wallet_id: UUID
    transaction_type: TransactionType
    amount: Decimal
    category_id: Optional[UUID] = None
    description: str
    note: Optional[str] = None
    transaction_date: datetime

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = None
    category_id: Optional[UUID] = None
    description: Optional[str] = None
    note: Optional[str] = None
    transaction_date: Optional[datetime] = None

class TransactionResponse(TransactionBase):
    id: UUID
    user_id: UUID
    to_wallet_id: Optional[UUID] = None
    currency: str
    source: TransactionSource
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
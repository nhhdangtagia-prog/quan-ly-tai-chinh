from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from app.models.wallet import WalletType

class WalletBase(BaseModel):
    name: str
    wallet_type: WalletType
    balance: Decimal = Decimal('0')
    currency: str = "VND"
    color: str = "#6366f1"
    icon: str = "💳"

class WalletCreate(WalletBase):
    pass

class WalletUpdate(BaseModel):
    name: Optional[str] = None
    wallet_type: Optional[WalletType] = None
    balance: Optional[Decimal] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class WalletResponse(WalletBase):
    id: UUID
    user_id: UUID
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TransferRequest(BaseModel):
    from_wallet_id: UUID
    to_wallet_id: UUID
    amount: Decimal
    description: str = "Chuyển tiền"
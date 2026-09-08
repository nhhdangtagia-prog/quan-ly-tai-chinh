from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
from app.database import get_db
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.wallet import WalletCreate, WalletUpdate, WalletResponse, TransferRequest
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[WalletResponse])
async def get_wallets(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Wallet).where(Wallet.user_id == current_user.id))
    return result.scalars().all()
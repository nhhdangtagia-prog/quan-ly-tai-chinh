from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
from app.database import get_db
from app.models.user import User
from app.models.wallet import Wallet
from app.schemas.wallet import WalletCreate, WalletUpdate, WalletResponse
from app.deps import get_current_user

router = APIRouter()

@router.get('/', response_model=List[WalletResponse])
async def get_wallets(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Wallet).where(Wallet.user_id == current_user.id))
    return result.scalars().all()

@router.post('/', response_model=WalletResponse)
async def create_wallet(wallet_in: WalletCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_wallet = Wallet(**wallet_in.model_dump(), user_id=current_user.id)
    db.add(db_wallet)
    await db.commit()
    await db.refresh(db_wallet)
    return db_wallet

@router.put('/{wallet_id}', response_model=WalletResponse)
async def update_wallet(wallet_id: uuid.UUID, wallet_in: WalletUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Wallet).where(Wallet.id == wallet_id, Wallet.user_id == current_user.id))
    db_wallet = result.scalar_one_or_none()
    if not db_wallet:
        raise HTTPException(status_code=404, detail='Wallet not found')
    
    update_data = wallet_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_wallet, field, value)
        
    await db.commit()
    await db.refresh(db_wallet)
    return db_wallet

@router.delete('/{wallet_id}')
async def delete_wallet(wallet_id: uuid.UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Wallet).where(Wallet.id == wallet_id, Wallet.user_id == current_user.id))
    db_wallet = result.scalar_one_or_none()
    if not db_wallet:
        raise HTTPException(status_code=404, detail='Wallet not found')
        
    await db.delete(db_wallet)
    await db.commit()
    return {'message': 'Wallet deleted successfully'}

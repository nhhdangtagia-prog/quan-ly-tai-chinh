from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.deps import get_current_user
from app.services.email_parser import GmailParser
from app.config import settings

router = APIRouter()

@router.post("/sync-gmail")
async def sync_gmail(background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    parser = GmailParser(settings)
    
    # Normally we'd do this in a background task
    async def process_sync():
        try:
            txns = await parser.fetch_and_parse(current_user)
            print(f"Found {len(txns)} transactions from Gmail")
            # Logic to save txns to DB...
            # In complete app, we'd loop txns, classify via AI, then save to DB
        except Exception as e:
            print(f"Error syncing: {e}")
            
    background_tasks.add_task(process_sync)
    return {"message": "Syncing started in background"}

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Transaction).where(Transaction.user_id == current_user.id))
    return result.scalars().all()
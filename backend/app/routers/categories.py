from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.category import Category
from app.schemas.category import CategoryResponse
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Category).where(or_(Category.user_id == current_user.id, Category.user_id == None)))
    return result.scalars().all()
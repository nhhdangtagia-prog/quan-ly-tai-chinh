from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.category import CategoryType

class CategoryBase(BaseModel):
    name: str
    icon: str = "💡"
    color: str = "#6366f1"
    category_type: CategoryType

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    category_type: Optional[CategoryType] = None

class CategoryResponse(CategoryBase):
    id: UUID
    user_id: Optional[UUID] = None
    is_default: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, TelegramLinkRequest
from app.deps import get_current_user
from app.config import settings
from app.services.auth_service import (
    get_google_oauth_url, 
    exchange_code_for_tokens, 
    get_google_user_info,
    create_access_token,
    encrypt_token
)
from datetime import timedelta
import uuid

router = APIRouter()

@router.get("/google")
async def google_auth():
    # Chuyển hướng người dùng sang trang đăng nhập của Google
    url = get_google_oauth_url()
    return RedirectResponse(url=url)

@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    try:
        # 1. Đổi code lấy token từ Google
        tokens = await exchange_code_for_tokens(code)
        access_token = tokens.get("access_token")
        refresh_token = tokens.get("refresh_token")
        
        # 2. Lấy thông tin user
        user_info = await get_google_user_info(access_token)
        email = user_info.get("email")
        name = user_info.get("name")
        picture = user_info.get("picture")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
            
        # 3. Tìm hoặc tạo user trong DB
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            user = User(
                email=email,
                name=name,
                avatar_url=picture,
                google_access_token=encrypt_token(access_token),
                google_refresh_token=encrypt_token(refresh_token) if refresh_token else None,
                telegram_link_token=str(uuid.uuid4())[:8] # Tạo mã link telegram ngẫu nhiên
            )
            db.add(user)
        else:
            user.name = name
            user.avatar_url = picture
            user.google_access_token = encrypt_token(access_token)
            if refresh_token:
                user.google_refresh_token = encrypt_token(refresh_token)
                
        await db.commit()
        await db.refresh(user)
        
        # 4. Tạo JWT token cho frontend
        jwt_token = create_access_token(
            data={"sub": str(user.id)}, 
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
        )
        
        # 5. Redirect về frontend kèm token
        return RedirectResponse(url=f"{settings.frontend_url}/login?token={jwt_token}")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout():
    return {"message": "Logged out"}

@router.get("/telegram/link-token")
async def get_telegram_link_token(current_user: User = Depends(get_current_user)):
    return {"token": current_user.telegram_link_token}

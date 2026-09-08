from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import json
import httpx
from fastapi import HTTPException
from app.config import settings

# JWT Config
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = settings.algorithm
SECRET_KEY = settings.secret_key

# Encryption for Google Tokens
try:
    if settings.fencoding_key:
        fernet = Fernet(settings.fencoding_key.encode())
    else:
        fernet = Fernet(Fernet.generate_key())
except Exception:
    fernet = Fernet(Fernet.generate_key())

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def encrypt_token(token: str) -> str:
    if not token:
        return token
    return fernet.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    if not encrypted_token:
        return encrypted_token
    try:
        return fernet.decrypt(encrypted_token.encode()).decode()
    except Exception:
        return ""

def get_google_oauth_url() -> str:
    # URL to redirect to Google for login & consent
    client_id = settings.google_client_id
    redirect_uri = settings.google_redirect_uri
    scope = "openid email profile https://www.googleapis.com/auth/gmail.readonly"
    
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"response_type=code&"
        f"client_id={client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"scope={scope}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    return url

async def exchange_code_for_tokens(code: str) -> dict:
    # Exchange auth code for access & refresh tokens
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "redirect_uri": settings.google_redirect_uri,
        "grant_type": "authorization_code",
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to exchange token: {response.text}")
        return response.json()

async def get_google_user_info(access_token: str) -> dict:
    # Get user profile info
    user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient() as client:
        response = await client.get(user_info_url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        return response.json()

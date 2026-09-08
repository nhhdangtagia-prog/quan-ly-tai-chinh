from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    fencoding_key: str = ""
    
    google_client_id: str
    google_client_secret: str
    google_redirect_uri: str = "http://localhost:8000/api/auth/google/callback"
    
    telegram_bot_token: str = ""
    gemini_api_key: str = ""
    
    frontend_url: str = "http://localhost:5173"
    allowed_origins: str = "http://localhost:5173"
    
    imap_host: str = "imap.gmail.com"
    imap_port: int = 993
    imap_email: str = ""
    imap_password: str = ""
    
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    @property
    def origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
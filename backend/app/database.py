from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings
import re

def get_async_database_url(url: str) -> str:
    return re.sub(r'^postgresql://', 'postgresql+asyncpg://', url)

engine = create_async_engine(
    get_async_database_url(settings.database_url),
    echo=False,
    pool_pre_ping=True,
    connect_args={"prepared_statement_cache_size": 0}
)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
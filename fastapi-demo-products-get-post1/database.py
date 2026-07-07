import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

db_url = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:Ragul123123@localhost:5432/ragul",
)

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(db_url)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database.database import Base

user_allergies = Table(
    "user_allergies",
    Base.metadata,

    Column("user_id", Integer, ForeignKey("users.id")),
    Column("allergy_id", Integer, ForeignKey("allergies.id"))
)
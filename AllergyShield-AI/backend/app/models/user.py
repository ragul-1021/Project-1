from sqlalchemy import Column,Integer,String,DateTime
from app.database.database import Base
from sqlalchemy.orm import relationship
from app.models.user_allergy import user_allergies
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    allergies = relationship(
        "Allergy",
        secondary=user_allergies,
        back_populates="users"
    )
    
    
    
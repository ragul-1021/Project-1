from sqlalchemy import Column,String,Integer
from app.database.database import Base
from sqlalchemy.orm import relationship
from app.models.user_allergy import user_allergies

class Allergy(Base):
    __tablename__ = "allergies"
    
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,unique=True,nullable=False)
    users = relationship(
        "User",
        secondary=user_allergies,
        back_populates="allergies"
    )
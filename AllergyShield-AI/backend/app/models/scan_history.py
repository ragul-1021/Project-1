from sqlalchemy import String,Integer,Text,ForeignKey,DateTime,Column
from sqlalchemy.sql import func
from app.database.database import Base

class ScanHistory(Base):
    __tablename__ = "scan_history"
    
    id = Column(Integer,index=True,primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_path = Column(String,nullable=False)
    extracted_text = Column(Text,nullable=False)
    scanned_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String,nullable=False)
    detected_allergens = Column(Text)
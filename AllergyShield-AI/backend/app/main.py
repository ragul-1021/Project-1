from fastapi import FastAPI
from app.models.user import User
from app.database.database import Base,engine
from app.models.user import User
from app.api.auth import router as auth_router
from app.api.scan import router as scan_router
from app.models.scan_history import ScanHistory
from app.api.allergy import router as allergy_router
from app.models.allergy import Allergy
from app.api.barcode import router as barcode_router
from app.api.dashboard import router as dashboard_router

app = FastAPI()

app.include_router(dashboard_router,tags=["Dashboard"])
app.include_router(barcode_router, tags=["Barcode"])
app.include_router(allergy_router,prefix="/allergy",tags=["Allergies"])
app.include_router(auth_router,prefix="/auth",tags=["Authentication"])
app.include_router(scan_router,tags=["OCR"])
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {
        "message" :"Welcome to AllergyShield-AI"
    }

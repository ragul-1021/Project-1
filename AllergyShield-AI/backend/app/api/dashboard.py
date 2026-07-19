from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.scan_history import ScanHistory

router = APIRouter()

@router.get("/dashboard")
def dashboard(db : Session = Depends(get_db),current_user : User = Depends(get_current_user)):
    total_scans  = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id).count()
    safe_products = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id,ScanHistory.status == "Safe").count()
    unsafe_products = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id,ScanHistory.status == "Unsafe").count()
    return {
    "total_scans": total_scans,
    "safe_products": safe_products,
    "unsafe_products": unsafe_products
}
    
@router.get("/recent-scans")
def recent_scans(db: Session = Depends(get_db),current_user : User = Depends(get_current_user)):
    scans = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id).order_by(ScanHistory.id.desc()).limit(5).all()
    return [
    {
        "scan_id": scan.id,
        "status": scan.status,
        "detected_allergens": scan.detected_allergens,
        "image_path": scan.image_path
    }
    for scan in scans
]
    
@router.get("/common-allergen")
def create_allergens(db: Session = Depends(get_db),current_user : User = Depends(get_current_user)):
    scans = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id).all()
    allergen_count={}
    for scan in scans:
        allergens = scan.detected_allergens.split(",")
        for allergen in allergens:
            allergen = allergen.strip()
            if allergen:
                allergen_count[allergen] = allergen_count.get(allergen,0)+1
            
            
    return [
    {
        "allergen": allergen,
        "count": count
    }
    for allergen, count in allergen_count.items()
]
                
@router.get("/test-allergens")
def test_allergens(db : Session = Depends(get_db),current_user : User = Depends(get_current_user)):
    scans = db.query(ScanHistory).filter(ScanHistory.user_id == current_user.id).all()
    
    return scans

    


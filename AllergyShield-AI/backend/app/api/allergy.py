from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.allergy import AllergyRequest
from app.models.allergy import Allergy

router = APIRouter()

@router.post("/my-allergies")
def save_allergies(
    request: AllergyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    current_user.allergies.clear()
    for allergy_name in request.allergies:

        allergy = db.query(Allergy).filter(
            func.lower(Allergy.name) == allergy_name.strip().lower()
        ).first()

        if allergy:
            current_user.allergies.append(allergy)

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Allergies saved successfully",
        "allergies": [a.name for a in current_user.allergies]
    }

@router.get("/my-allergies")
def get_allergies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "allergies": [a.name for a in current_user.allergies]
    }

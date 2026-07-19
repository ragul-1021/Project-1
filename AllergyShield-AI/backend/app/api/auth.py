from fastapi import APIRouter,HTTPException,Depends,status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordBearer

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import (
    EmailCheckRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.utils.hashing import hash_password,verify_password
from app.utils.security import create_access_token
from app.utils.security import verify_access_token
from app.services.email_service import EmailService
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
email_service = EmailService(
    sender_email=os.getenv("SMTP_EMAIL", "noreply@allergyshield.com"),
    password=os.getenv("SMTP_PASSWORD", ""),
    smtp_server=os.getenv("SMTP_SERVER", "smtp.gmail.com"),
    smtp_port=int(os.getenv("SMTP_PORT", "587"))
)

@router.post("/register",response_model=UserResponse,status_code=status.HTTP_201_CREATED)
def register(user : UserRegister, db: Session = Depends(get_db)):
    
    existing_user = db.query(User).filter(User.email == user.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
            
        )
    hashed_password = hash_password(user.password)  
    
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
        
    )  
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login")
def login(form_data : OAuth2PasswordRequestForm = Depends(),db : Session = Depends(get_db)):
    
    db_user = db.query(User).filter(User.email == form_data.username).first()
    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not verify_password(form_data.password,db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    access_token = create_access_token(
        data={"sub": db_user.email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer" 
    }

def get_current_user(token : str = Depends(oauth2_scheme),db : Session =  Depends(get_db)):
    
    payload = verify_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    email = payload.get("sub")
    
    user = db.query(User).filter(User.email == email).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
        
    return user

@router.get("/profile", response_model=UserResponse)
def profile(current_user : Session = Depends(get_current_user)):
    return current_user

@router.post("/email-exists")
def email_exists(request: EmailCheckRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    return {"exists": user is not None}

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request password reset link"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="No account found with this email")
    
    reset_token = email_service.generate_reset_token(db, request.email)
    frontend_url = os.getenv("FRONTEND_URL", "http://127.0.0.1:5174")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    
    if email_service.send_reset_email(request.email, reset_link):
        response = {"message": "Reset email sent"}
        if not os.getenv("SMTP_PASSWORD", ""):
            response["reset_link"] = reset_link
        return response
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password with token"""
    user = email_service.verify_reset_token(db, request.token)
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    user.password = hash_password(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    
    db.commit()
    return {"message": "Password reset successful"}

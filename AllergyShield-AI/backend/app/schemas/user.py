from pydantic import BaseModel,EmailStr,ConfigDict

class UserRegister(BaseModel):
    name : str
    email : EmailStr
    password : str
    
class UserLogin(BaseModel):
    email : EmailStr
    password : str

class EmailCheckRequest(BaseModel):
    email : EmailStr

class ForgotPasswordRequest(BaseModel):
    email : EmailStr

class ResetPasswordRequest(BaseModel):
    token : str
    new_password : str
    
class UserResponse(BaseModel):
    id : int
    name : str    
    email : EmailStr
    
    model_config = ConfigDict(from_attributes=True)

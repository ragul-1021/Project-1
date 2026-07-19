from passlib.context import CryptContext

pwdcontext = CryptContext(
            schemes=["bcrypt"],
            deprecated="auto"
)

def hash_password(password : str):
    return pwdcontext.hash(password)

def verify_password(plain,hashed):
    return pwdcontext.verify(plain,hashed)
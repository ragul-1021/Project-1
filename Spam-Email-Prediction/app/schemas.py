from pydantic import BaseModel

class EmailRequest(BaseModel):
    message :  str
    
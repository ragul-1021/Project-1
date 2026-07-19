from pydantic import BaseModel

class AllergyRequest(BaseModel):
    allergies : list[str]
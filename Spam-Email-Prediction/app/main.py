from fastapi import FastAPI
from app.schemas import EmailRequest
from app.predictor import predict

app = FastAPI(title="Spam Email Detection API")

@app.get("/")
def home():
    return "Spam detection API backend is running"

@app.post("/predict")
def prediction(email : EmailRequest):
    res = predict(email.message)
    return {
        "message":email.message,
        "Result" : res
    }
    
    
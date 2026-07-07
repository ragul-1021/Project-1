from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

model = joblib.load("models/iris_model.pkl")

class Flowers(BaseModel):
    petal_length : float
    petal_width : float
    sepal_length : float
    sepal_width : float
    
species = [
    "setosa",
    "versicolor",
    "virginica"
]    

@app.get("/")
def greet():
    return "Iris Classification API"

@app.post("/predict")
def predict(flower : Flowers):
    prediction = model.predict([[
        flower.petal_length,
        flower.petal_width,
        flower.sepal_length,
        flower.sepal_width
        ]])
    return {"prediction :",species[prediction[0]] }

import os

from fastapi import FastAPI, Depends
from models import Product
from database import session, engine
import database_models
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

database_models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def greet():
    return "Hello, world!"

products = [
    Product(id=1, name="Mobile", description="Motorola sleek mobile", price=250, quantity=4),
    Product(id=2, name="Laptop", description="Dell Inspiron laptop", price=800, quantity=2),
    Product(id=3, name="Tablet", description="Apple iPad tablet", price=600, quantity=3),
    Product(id=4, name="Smartwatch", description="Samsung Galaxy smartwatch", price=200, quantity=5),
]

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

def init_db():
    db = session()
    count = db.query(database_models.Product).count()
    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump()))
        db.commit()
    db.close()

init_db()

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).all()
    return db_products

@app.get("/product/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    db_product = db.get(database_models.Product, id)
    if db_product:
        return db_product
    return "No product found with given Id"

@app.post("/product")
def add_product(product: Product, db: Session = Depends(get_db)):
    db.add(database_models.Product(**product.model_dump()))
    db.commit()
    return product

@app.put("/product/{id}")
def update_product(id: int, product: Product, db: Session = Depends(get_db)):
    db_product = db.get(database_models.Product, id)
    if db_product:
        db_product.name = product.name
        db_product.description = product.description
        db_product.price = product.price
        db_product.quantity = product.quantity
        db.commit()
        return {"result": "Product updated successfully."}
    else:
        return {"result": "Product not found with given ID."}

@app.delete("/product/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.get(database_models.Product, id)
    if db_product:
        db.delete(db_product)
        db.commit()
        return {"result": "Product deleted successfully."}
    else:
        return {"result": "Product not found with given ID."}

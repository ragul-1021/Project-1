from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.barcode_service import read_barcode
from app.services.barcode_service import get_product_details
router = APIRouter()

@router.post("/barcode-scan")
def barcode_scan(file: UploadFile = File(...)):

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    barcode = read_barcode(file_path)
    print("Barcode:", barcode)

    if barcode is None:
        return {
            "message": "No barcode detected."
        }

    product = get_product_details(barcode)
    print("Product:", product)

    if product is None:
        return {
            "message": "Product not found in OpenFoodFacts.",
            "barcode": barcode
        }

    return {
        "barcode": barcode,
        "product_name": product.get("product_name"),
        "brand": product.get("brands"),
        "ingredients": product.get("ingredients_text")
    }
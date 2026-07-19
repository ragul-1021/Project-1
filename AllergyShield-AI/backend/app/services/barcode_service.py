from pyzbar.pyzbar import decode
from PIL import Image
import requests
def read_barcode(image_path: str):

    image = Image.open(image_path)

    barcodes = decode(image)

    if not barcodes:
        return None

    barcode_number = barcodes[0].data.decode("utf-8")

    return barcode_number

def get_product_details(barcode: str):

    barcode = barcode.strip()

    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"

    print("URL:", url)

    response = requests.get(
        url,
        headers={"User-Agent": "AllergyShieldAI/1.0"}
    )

    print("Status Code:", response.status_code)
    print("Content-Type:", response.headers.get("Content-Type"))
    print("Response Text:")
    print(response.text[:500])   

    try:
        data = response.json()
    except Exception as e:
        print("JSON Error:", e)
        return None

    print("Data:", data)

    if data.get("status") != 1:
        return None

    return data.get("product")
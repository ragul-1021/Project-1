import easyocr

reader = easyocr.Reader(["en"])

def extract_txt(image_path : str):
    
    result = reader.readtext(image_path)
    
    extracted_txt = ""
    for destination in result:
        extracted_txt+=destination[1] + " "
        
    return extracted_txt.strip()
        
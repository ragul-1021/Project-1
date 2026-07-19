import re

def clean_text(text : str):
    
    text = text.lower()
    
    text=text.replace("-"," ")
    
    text=re.sub(r"[^a-z\s]","",text)
    
    text=re.sub(r"\s+"," ",text)
    
    return text.strip()

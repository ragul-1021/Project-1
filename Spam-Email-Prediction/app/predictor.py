import joblib

model = joblib.load("models/spam_models.pkl")
tfidf = joblib.load("models/spam_tfidf.pkl")
import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z ]", "", text)
    return text


def predict(message : str):
    message = clean_text(message)
    vector = tfidf.transform([message])
    res = model.predict(vector)[0]
    print(res)
    
    return "ITS A Spam!!!" if res=="spam" else "NOT spam!"
    
    
    
    
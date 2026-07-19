import pandas as pd
import re

df = pd.read_csv("datasets/unique_ingredients.csv")

df = df.dropna()

df["Ingredients"] = df["Ingredients"].str.lower().str.strip()

original_df = df.copy()

INDIAN_WORDS = {
    "atta",
    "maida",
    "suji",
    "rava",
    "besan",
    "paneer",
    "ghee",
    "dahi",
    "lassi",
    "poha",
    "murmura",
    "ragi",
    "jowar",
    "bajra",
    "rajma",
    "moong",
    "urad",
    "toor",
    "chana",
    "hing",
    "jeera",
    "ajwain",
    "elaichi",
    "haldi",
    "imli",
    "sabudana"
}

def keep_ingredient(text):
    
    text = str(text).strip().lower()
    
    if text in INDIAN_WORDS:
        return True
    
    return bool(re.fullmatch(r"[a-z0-9\s,'()%/\-]+",text))

df=df[df["Ingredients"].apply(keep_ingredient)]

english_df = original_df[
    original_df["Ingredients"].apply(keep_ingredient)
]

others_df = original_df[
    ~original_df["Ingredients"].apply(keep_ingredient)
]
REMOVE = {
    "",
    "contains",
    "may contain",
    "ingredient",
    "ingredients",
    "and",
    "or",
    "with",
    "without"
}


for word in REMOVE:
    english_df = english_df[
        ~english_df["Ingredients"].str.contains(word, na=False)
    ]

english_df = df[df["Ingredients"].apply(keep_ingredient)]

others_df = df[~df["Ingredients"].apply(keep_ingredient)]

english_df.to_csv(
    "datasets/final_ingredients.csv",
    index=False
)

others_df.to_csv(
    "datasets/other_languages.csv",
    index=False
)

print("English + Indian:", len(english_df))
print("Other Languages :", len(others_df))


import pandas as pd

master = pd.read_csv("datasets/allergens_master.csv")
master = pd.read_csv("datasets/allergens_master.csv")

master["ingredient"] = master["ingredient"].fillna("").str.lower().str.strip()
master["allergen"] = master["allergen"].fillna("None")
master["category"] = master["category"].fillna("Unknown")
master["severity"] = master["severity"].fillna("Safe")

master["ingredient"] = (
    master["ingredient"]
    .str.lower()
    .str.strip()
)

def detect_allergens(extracted_text: str):

    extracted_text = extracted_text.lower()

    detected = []

    for _, row in master.iterrows():

        if row["ingredient"] in extracted_text:
            allergen = str(row["allergen"]).strip()

            if allergen.lower() in [None,"none", "nan", ""]:
                continue

            detected.append({
                "ingredient": row["ingredient"],
                "allergen": row["allergen"],
                "category": row["category"],
                "severity": row["severity"],
                "description": row["description"]
            })

    return detected

def find_unknown_ingredients(extracted_text: str):

    extracted_text = extracted_text.lower()

    ingredients = extracted_text.split()

    matched = set()

    for _, row in master.iterrows():

        if row["ingredient"] in extracted_text:
            matched.add(row["ingredient"])

    unknown = []

    for ingredient in ingredients:

        if ingredient not in matched:
            unknown.append(ingredient)

    return unknown
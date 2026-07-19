import pandas as pd
df = pd.read_csv("datasets/ingredients_clean.csv",low_memory=False)
ingredient = df["ingredients_text"].dropna()

ingredient_text=[]
for text in ingredient:
    
    parts = text.split(",")
    
    for part in parts:
        ingredient_text.append(part.strip().lower())

ingredient_text = list(set(ingredient_text))
result = pd.DataFrame({
    "Ingredients" : ingredient_text
})
result.to_csv("datasets/unique_ingredients.csv",index=False)

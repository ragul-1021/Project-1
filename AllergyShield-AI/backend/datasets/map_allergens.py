import pandas as pd
ingredients = pd.read_csv("datasets/final_ingredients.csv")
master = pd.read_csv("datasets/allergens_master.csv")

result = ingredients.merge(master,on="ingredient",how="left")

result["allergen"] = result["allergen"].fillna("None")
result["category"] = result["category"].fillna("Unknown")
result["severity"] = result["severity"].fillna("Safe")

result.to_csv("datasets/ingredients_knowledge_base.csv",index=False)

print("Knowledge Base Created!!")
print(ingredients["ingredient"].head(10))
print(master["ingredient"].head(10))
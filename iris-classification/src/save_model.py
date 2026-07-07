from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import joblib

iris = load_iris()

x = iris.data
y = iris.target

X_train,X_test,y_train,y_test = train_test_split(x ,y ,random_state=42 ,test_size=0.2)

model = DecisionTreeClassifier()

model.fit(X_train,y_train)

joblib.dump(model,"models/iris_model.pkl")
print("Model Added Successfully!")
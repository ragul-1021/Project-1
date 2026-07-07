from sklearn.datasets import load_iris

from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

iris = load_iris()

x=iris.data
y=iris.target

X_train,X_test,y_train,y_test = train_test_split(x,y,test_size=0.2,random_state=42)


knn = KNeighborsClassifier()
knn.fit(X_train,y_train)
predict = knn.predict(X_test)
acc = accuracy_score(predict,y_test)
print(predict)
print(acc*100)

dec = DecisionTreeClassifier()
dec.fit(X_train,y_train)
predict = dec.predict(X_test)
print(predict)
acc=accuracy_score(predict,y_test)
print(acc*100)

sv = SVC()
sv.fit(X_train,y_train)
predict = sv.predict(X_test)
print(predict)
acc = accuracy_score(predict,y_test)
print(acc*100)

models = {
    "KNN" : KNeighborsClassifier(),
    "DecisionTreeClasssifier" : DecisionTreeClassifier(),
    "SVC" : SVC()
}
for name,model in models.items():
    model.fit(X_train,y_train)
    prediction = model.predict(X_test)
    accu = accuracy_score(prediction,y_test)
    print(name,acc*100)
    

samples = [
    [5.1, 3.5, 1.4, 0.2],
    [6.5, 3.0, 5.2, 2.0],
    [7.0, 2.0, 4.0, 3.0]
]

prediction = knn.predict(samples)
print(iris.target_names[prediction[2]])

def sample_data(sepal_length,sepal_width,petal_length,petal_width):
    sample = [[sepal_length,sepal_width,petal_length,petal_width]]
    predictions = knn.predict(sample)
    res = iris.target_names[predictions[0]]
    return res

flower = sample_data(5.1, 3.5, 1.4, 0.2)
print(flower)

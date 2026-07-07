from sklearn.datasets import load_iris

from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

iris = load_iris()

x = iris.data
y = iris.target

X_train,X_test,y_train,y_test = train_test_split(x,y,test_size=0.2,random_state=60)

knn = KNeighborsClassifier(n_neighbors=3)
tree = DecisionTreeClassifier(random_state=42)
svm = SVC()

knn.fit(X_train, y_train)
tree.fit(X_train, y_train)
svm.fit(X_train, y_train)
knn_pred = knn.predict(X_test)
tree_pred = tree.predict(X_test)
svm_pred = svm.predict(X_test)

print("KNN Accuracy:", accuracy_score(y_test, knn_pred))
print("Decision Tree Accuracy:", accuracy_score(y_test, tree_pred))
print("SVM Accuracy:", accuracy_score(y_test, svm_pred))
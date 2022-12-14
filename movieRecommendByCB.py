import pickle
from sklearn.decomposition import TruncatedSVD
from pymongo import MongoClient
import pandas as pd 
import numpy as np 
from sklearn.linear_model import Ridge
from sklearn import linear_model

with open('vectorizer.pk', 'rb') as fin:
    vectorizer = pickle.load(fin)
    matrix_tfidf = pickle.load(fin)
    df = pickle.load(fin)

client = MongoClient('mongodb://localhost:27017/')
db = client['movie-web']
userratings = db['userratings']
cursor = userratings.find()
list_cur = []
for i in cursor:
    list_cur.append(i)
ratings = pd.DataFrame(list_cur)
ratings = ratings.drop(['_id', '__v', 'createdAt', 'updatedAt'], axis=1)

def get_items_rated_by_user(user_id):
    y = ratings.iloc[:,1].astype('string')
    ids = np.where(y == user_id)[0]
    item_ids = ratings.iloc[ids, 0].astype('string')
    scores = ratings.iloc[ids, 2]
    return (item_ids, scores)

svd = TruncatedSVD(n_components=10)
svd.fit(matrix_tfidf)
svd_tfidf_vector = svd.transform(matrix_tfidf)
d = svd_tfidf_vector.shape[1] 
users = ratings['user'].astype('string').unique()
W = np.zeros((d, users.size))
b = np.zeros((1, users.size))
# df = pd.DataFrame(df)
for idx, n in enumerate(users):    
    ids, scores = get_items_rated_by_user(n)
    clf = Ridge(alpha = 7, fit_intercept  = True)
    ids_items = df[df.astype('string').isin(ids)].index.tolist()
    Xhat = svd_tfidf_vector[ids_items, :]
    clf.fit(Xhat, scores) 
    W[:, idx] = clf.coef_
    b[0, idx] = clf.intercept_

Yhat = svd_tfidf_vector.dot(W) + b

items = ratings['movie'].astype('string').unique()
def recommend(user_id, top):
    item = {'userId': None, 'movieId': None, 'score': None}
    list_items = []
    def take_score(elem):
        return elem['score']
    items_rated_by_user, score = get_items_rated_by_user(user_id)
    for idx, n in enumerate(df.astype('string')): 
        if n not in items_rated_by_user.tolist():
            item['userId'] = user_id
            item['movieId'] = n
            item['score'] = Yhat[idx, np.where(users == user_id)[0][0]]
            list_items.append(item.copy())  
    sorted_items = sorted(list_items, key=take_score, reverse=True)
    sorted_items = sorted_items[:top]
    return sorted_items
df2 = pd.DataFrame(columns=['userId', 'movieId', 'score'])
for u in users:
    df2 = pd.concat([df2, pd.DataFrame(recommend(u, 10))])
df2.to_csv(r'C:\Users\english\Documents\FinalProject\api\recommendCB.csv', index=False)
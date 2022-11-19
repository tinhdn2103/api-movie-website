import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['movie-web']
collection = db['userratings']
cursor = collection.find()
list_cur = []
for i in cursor:
    list_cur.append(i)
ratings = pd.DataFrame(list_cur)
ratings = ratings.drop(['_id', '__v', 'createdAt', 'updatedAt'], axis=1)

userRatings = ratings.pivot_table(index=['movie'],columns=['user'],values='rating')
userRatings.head()

def standardize(col):
    new_col = (col - col.mean())
    return new_col

df_std = userRatings.apply(standardize, axis = 0)
df_std.fillna(0, inplace=True)

sparse_df = sparse.csr_matrix(df_std.values)
corrMatrix = pd.DataFrame(cosine_similarity(sparse_df.T),index=userRatings.columns,columns=userRatings.columns)
corrMatrixIi = pd.DataFrame(cosine_similarity(sparse_df),index=userRatings.index,columns=userRatings.index)
corrMatrixIi.to_csv(r'C:\Users\english\Documents\FinalProject\api\movieToMovie.csv', index = True)

def pred(u, i):
    ids = np.where(ratings.iloc[:, 0] == i)[0]
    users_rated_i = (ratings.iloc[ids, 1])
    sim = corrMatrix.loc[u, users_rated_i]
    a = sim.sort_values().iloc[-2:]
    idx = a.index
    r = sparse_df[df_std.index.get_loc(i), df_std.columns.get_indexer(idx)]
    return (r * a)[0] / (np.abs(a).sum() + 1e-8)
def recommend_top(u, top_x):
    ids = np.where(ratings.iloc[:, 1] == u)[0]
    items_rated_by_u = ratings.iloc[ids, 0].tolist()
    items = df_std.index.tolist()
    item = {'userId': None, 'movieId': None, 'similar': None}
    list_items = []
    def take_similar(elem):
            return elem['similar']
    for i in items:
        if i not in items_rated_by_u:
            rating = pred(u, i)
            item['userId'] = u
            item['movieId'] = i
            item['similar'] = rating
            list_items.append(item.copy())  
    sorted_items = sorted(list_items, key=take_similar, reverse=True)
    sorted_items = sorted_items[:top_x]
    return sorted_items
df = pd.DataFrame(columns=['userId', 'movieId', 'similar'])
users = df_std.columns.tolist()
for u in users:
    df = pd.concat([df, pd.DataFrame(recommend_top(u, 10))])
df.to_csv(r'C:\Users\english\Documents\FinalProject\api\recommend.csv', index=False)
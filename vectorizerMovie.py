import pandas as pd 
import numpy as np 
from sklearn.feature_extraction.text import TfidfVectorizer
from pymongo import MongoClient
import pickle

client = MongoClient('mongodb://localhost:27017/')
db = client['movie-web']
col_movies = db['movies']
cur_movies = col_movies.find()
col_actormovies = db['actormovies']
cur_actormovies = col_actormovies.find()
col_actors = db['actors']
cur_actors = col_actors.find()
list_movies = []
list_actormovies = []
list_actors = []
for i in cur_movies:
    list_movies.append(i)
for i in cur_actormovies:
    list_actormovies.append(i)
for i in cur_actors:
    list_actors.append(i)
movies = pd.DataFrame(list_movies)
actormovies = pd.DataFrame(list_actormovies)
actors = pd.DataFrame(list_actors)
movies = movies.drop(['img', 'imgTitle', 'createdAt', 'updatedAt', 'trailer', 'year', 'limit', 'isSeries', '__v', 'numRate', 'rate', 'duration', 'countView', 'epNum'], axis=1)

df = pd.merge(actormovies[['movie', 'actor', 'character']],actors[['_id','name']],left_on='actor', right_on='_id', how='left').drop(columns = ['_id'])
df2 = pd.merge(movies, df, left_on='_id', right_on='movie', how='left').drop(columns = ['movie', 'actor'])
df2 = df2.fillna('')
df2 = df2.groupby('_id').agg({'title':'first', 
                              'desc':'first',
                              'genre':'first',
                             'character': ' '.join, 
                             'name': ' '.join,  }).reset_index()

df2['tags'] = df2['title'] + ' ' + df2['desc'] + ' ' + df2['genre'] + ' ' + df2['character'] + ' ' + df2['name']

tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df2['tags'])

with open('vectorizer.pk', 'wb') as fin:
    pickle.dump(tfidf, fin)
    pickle.dump(tfidf_matrix, fin)
    pickle.dump(df2['_id'], fin)
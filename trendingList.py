import pandas as pd
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['movie-web']
collection = db['movieStat']
cursor = collection.find()
list_cur = []
for i in cursor:
    list_cur.append(i)
movies = pd.DataFrame(list_cur)
movies.fillna(0, inplace=True)

movies['rates'] = movies['numRate']*movies['rating']
df = movies[['views','comments', 'rates']].apply(lambda x:(x.astype(float) - min(x))/(max(x)-min(x)), axis = 0)

movies['score'] = df['views'].pow(2) + df['comments'].pow(2) +  df['rates'].pow(2)
df2 = movies.sort_values(by = 'score', ascending=False).head(10)
df2 = df2.drop(df2.columns[[1, 2, 3, 4, 5]], axis=1)
df2 = df2.rename({'_id': 'movie'}, axis=1)
import datetime as dt
df2['timestamp'] = dt.datetime.now(dt.timezone.utc)
my_dict = df2.to_dict('records')

# my_col = db['trending']
# ids = my_col.insert_many(my_dict)

df2.to_csv(r'C:\Users\english\Documents\FinalProject\api\trending.csv', index=False)
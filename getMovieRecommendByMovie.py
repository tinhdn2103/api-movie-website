import sys
import pandas as pd
similarity_scores = pd.read_csv('movieToMovie.csv', index_col=0)

def recommend(book):
    items = similarity_scores.index.tolist()
    idx = []
    if book in items:
        scrs = similarity_scores.loc[book]
        a = scrs.sort_values(ascending = False)[1:10]
        idx = a.index.tolist()
    return idx

sys.stdout.write(str(recommend(sys.argv[1])))
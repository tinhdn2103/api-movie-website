from sklearn.metrics.pairwise import linear_kernel
import pickle
from sklearn.decomposition import TruncatedSVD
from scipy import sparse
import numpy as np 
import sys


with open('vectorizer.pk', 'rb') as fin:
    vectorizer = pickle.load(fin)
    matrix_tfidf = pickle.load(fin)
    df = pickle.load(fin)

def get_recommendations(title):
    m_new = sparse.vstack((matrix_tfidf, vectorizer.transform([title])))
    svd = TruncatedSVD(n_components=10)
    svd.fit(m_new)
    svd_tfidf_vector = svd.transform(m_new)
    svd_query = np.reshape(svd_tfidf_vector[-1],(1,svd_tfidf_vector[-1].size))
    cosine_sim = linear_kernel(svd_query, svd_tfidf_vector)
    sim_scores = list(enumerate(cosine_sim[0]))
    sim_scores = sim_scores[:-1]
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[0:10]
    movie_indices = [i[0] for i in sim_scores]
    return df.iloc[movie_indices].astype('string')
sys.stdout.write(str(list(get_recommendations(sys.argv[1]))))
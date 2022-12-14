import sys
import numpy as np
import pandas as pd

recommend = pd.read_csv('recommendCB.csv')
ids = np.where(recommend.iloc[:, 0] == sys.argv[1])[0]
movies = recommend.iloc[ids, 1].tolist()
sys.stdout.write(str(movies))
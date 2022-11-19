import sys
import pandas as pd
trending_list = pd.read_csv('trending.csv')
result = trending_list['movie'].tolist()
sys.stdout.write(str(result))
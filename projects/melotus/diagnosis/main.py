import sqlite3
import requests
import django
django.setup()
from social_django.models import UserSocialAuth
from projects.settings import BASE_DIR


def get_status(json):
    
    # db操作
    con = sqlite3.connect(f'{BASE_DIR}/db/db.sqlite3')
    cur = con.cursor()
    not_in_db = []
    ret = {}

    placeholders = ', '.join('?' for _ in json["uris"]) # その数だけ ?入れるみたいな感じ
    cur.execute(f'SELECT * FROM melotus_music_status WHERE music_id IN ({placeholders})', json["uris"])

    rows = cur.fetchall()
    not_in_db = list(set(json["uris"]) - set([row[0] for row in rows]))
    for row in rows:
        if row is not None:
            ret[row[0]] = {
                'acousticness': row[1],
                'danceability': row[2],
                'energy': row[3],
                'instrumentalness': row[4],
                'liveness': row[5],
                'loudness': row[6],
                'mode': row[7],
                'speechness': row[8],
                'tempo': row[9],
                'valence': row[11],
                'country': row[10],
            }
        
    con.close()


    # APIから取得
    # print(not_in_db)

    if len(not_in_db) == 0:
        return ret

    token = UserSocialAuth.objects.get(user_id=1).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }
    ids = ','.join(not_in_db)
    END_POINT = f'https://api.spotify.com/v1/audio-features?ids={ids}'

    res = requests.get(END_POINT, headers=header_params)

    data = res.json()   
    # print(data)



    return ret

json = {
   "uris": [
       "7IQiZVGgfW927fImwKJDOq",
       "0MyTMrPTh0GgtuyhYRdl3P",
       "1Sy41HCCozDBL73orZpW5Y",
       "2ChSAhdQmJpHgos2DQP6cI"
       ] 
}

get_status(json)


data = {
    '0MyTMrPTh0GgtuyhYRdl3P': {
        'acousticness': 1.0, 
        'danceability': 2.0, 
        'energy': 3.0, 
        'instrumentalness': 4.0, 
        'liveness': 5.0, 
        'loudness': 6.0, 
        'mode': 7.0, 
        'speechness': 8.0, 
        'tempo': 0.01, 
        'valence': -0.1, 
        'country': 'JP'
        }, 
        
    '1Sy41HCCozDBL73orZpW5Y': {
        'acousticness': 1.2, 
        'danceability': 2.3, 
        'energy': 3.4, 
        'instrumentalness': 4.5, 
        'liveness': 6.7, 
        'loudness': 7.8, 
        'mode': 9.0, 
        'speechness': 0.2, 
        'tempo': 0.1, 
        'valence': 0.4, 
        'country': 'JP'
        }
    }
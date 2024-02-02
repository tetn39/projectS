import sqlite3
import requests
import django
django.setup()
from social_django.models import UserSocialAuth
from melotus.models import music_status, history, spotify_data, melotus_data
from projects.settings import BASE_DIR
import os
from dotenv import load_dotenv
from base64 import b64encode
from datetime import datetime
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


# get_statusとadd_dbは曲のステータスをdbから取得し、なければAPIから取得し、dbに追加する。
# add_dbはget_statusから呼び出されるので、classにして結合してもよい
def get_status(json):
    
    # db操作
    con = sqlite3.connect(f'{BASE_DIR}/db/db.sqlite3')
    cur = con.cursor()
    not_in_db = []
    not_in_db_data = {}
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
                'speechiness': row[8],
                'tempo': row[9],
                'valence': row[10],
                'country': row[11],
            }
        
    con.close()


    # APIから取得

    if len(not_in_db) == 0:
        return ret

    token_check(1)


    # たりないデータを取得
    token = UserSocialAuth.objects.get(user_id=1).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }
    ids = ','.join(not_in_db)
    END_POINT = f'https://api.spotify.com/v1/audio-features?ids={ids}'

    res = requests.get(END_POINT, headers=header_params)

    data = res.json()   

    for d in data['audio_features']:
        if d is not None:
            not_in_db_data[d['id']] = {
                # 小数点以下4桁に丸める
                'acousticness': float(f'{d["acousticness"]:.4f}'),
                'danceability': float(f'{d["danceability"]:.4f}'),
                'energy': float(f'{d["energy"]:.4f}'),
                'instrumentalness': float(f'{d["instrumentalness"]:.4f}'),
                'liveness': float(f'{d["liveness"]:.4f}'),
                'loudness': float(f'{d["loudness"]:.4f}'),
                'mode': float(f'{d["mode"]:.4f}'),
                'speechiness': float(f'{d["speechiness"]:.4f}'),
                'tempo': float(f'{d["tempo"]:.4f}'),
                'valence': float(f'{d["valence"]:.4f}'),
                'country': 'JP',
            }

    # DBに追加
    add_db(not_in_db_data)

    
    ret |= not_in_db_data

  
    return ret

def add_db(content):
    music_status_list = [
        music_status(
            music_id = key,
            acousticness = content[key]['acousticness'],
            danceability = content[key]['danceability'],
            energy = content[key]['energy'],
            instrumentalness = content[key]['instrumentalness'],
            liveness = content[key]['liveness'],
            loudness = content[key]['loudness'],
            mode = content[key]['mode'],
            speechiness = content[key]['speechiness'],
            tempo = content[key]['tempo'],
            valence = content[key]['valence'],
            country = content[key]['country'],
        )
        for key in content
    ]
    music_status.objects.bulk_create(music_status_list)

# ユーザーが選んだ曲のステータスからその人の好みのステータスを出す weightもつけるといいかも
def user_music_status(content):
    average_status = {
        'acousticness': 0,
        'danceability': 0,
        'energy': 0,
        'instrumentalness': 0,
        'liveness': 0,
        'loudness': 0,
        'mode': 0,
        'speechiness': 0,
        'tempo': 0,
        'valence': 0,
    }
    for key in content:
        for status in content[key]:
            if status != 'country':
                average_status[status] += content[key][status]
    for status in average_status:
        average_status[status] /= len(content)
        average_status[status] = float(f'{average_status[status]:.4f}')
    

    return average_status

# spotifyからdbに曲のステータスを追加する。 db保有量を増やすためのdev用
def add_db_from_spotify():
    load_dotenv(os.path.join(BASE_DIR, 'auth/.env'))
    client_id = os.environ.get('SPOTIFY_KEY')
    client_secret = os.environ.get('SPOTIFY_SECRET')

    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    playlist_id = "37i9dQZEVXbKXQ4mDTEBXq" # top50 japan　ここをいつもいい感じに変えられるといいかも。
    playlist_tracks = sp.playlist_tracks(playlist_id)

    # トラックごとにステータスを取得
    add_db_data = {}
    for track in playlist_tracks['items']:
        track_id = track['track']['id']

        # トラックの特徴量を取得
        audio_features = sp.audio_features(track_id)[0]

        add_db_data |= {
            track_id: {
                'acousticness': float(f'{audio_features["acousticness"]:.4f}'),
                'danceability': float(f'{audio_features["danceability"]:.4f}'),
                'energy': float(f'{audio_features["energy"]:.4f}'),
                'instrumentalness': float(f'{audio_features["instrumentalness"]:.4f}'),
                'liveness': float(f'{audio_features["liveness"]:.4f}'),
                'loudness': float(f'{audio_features["loudness"]:.4f}'),
                'mode': float(f'{audio_features["mode"]:.4f}'),
                'speechiness': float(f'{audio_features["speechiness"]:.4f}'),
                'tempo': float(f'{audio_features["tempo"]:.4f}'),
                'valence': float(f'{audio_features["valence"]:.4f}'),
                'country': 'JP',
            }
        }

    # DBに追加
    ret = []
    for key in add_db_data:
        obj, created = music_status.objects.get_or_create(music_id=key, defaults=add_db_data[key])
        ret.append([obj, created])
    
    return ret

# ユーザーのステータスにあった曲をdbから探す。
def choose_music(content):
    pass

# tokenが有効かどうかを調べる
def token_check(user_data):
    # unixタイムを取得して、1時間経過していればrefreshする
    now_unix = int(datetime.now().timestamp())
    auth_time = UserSocialAuth.objects.get(user_id=user_data).extra_data['auth_time']

    # 1時間経過していたらrefreshする
    if now_unix - auth_time > 3500:
        # refresh token する
        load_dotenv(os.path.join(BASE_DIR, 'auth/.env'))
        refresh_token = UserSocialAuth.objects.get(user_id=user_data).extra_data['refresh_token']
        refresh_data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }

        token_url = "https://accounts.spotify.com/api/token"
        client_id = os.environ.get('SPOTIFY_KEY')
        client_secret = os.environ.get('SPOTIFY_SECRET')
        auth_header = b64encode(f"{client_id}:{client_secret}".encode("utf-8")).decode("utf-8")
        refresh_response = requests.post(token_url, data=refresh_data, headers={"Authorization": f"Basic {auth_header}"})
        refresh_json = refresh_response.json()
        
        refreshed_access_token = refresh_json["access_token"]

        unix = datetime.now()
        extra_data = {
            'auth_time': int(unix.timestamp()),
            'refresh_token': refresh_token,
            'access_token': refreshed_access_token,
            'token_type': 'Bearer',
        }

        UserSocialAuth.objects.filter(user_id=user_data).update(extra_data=extra_data)

# チャート用にデータを調整する
def for_chart_weight(user_status):
    for status in user_status:
            if status != 'tempo' and status != 'loudness':
                user_status[status] *= 100
                user_status[status] += 20
            
            if status == 'loudness':
                user_status[status] += 80.0
            
            if status == 'tempo':
                user_status[status] /= 2.0
            
            user_status[status] = float(f'{user_status[status]:.4f}')
    
    return user_status

# プレイリストからステータスを取得する
def get_playlist_status(content):
    token = UserSocialAuth.objects.get(user_id=1).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }
    END_POINT = f'https://api.spotify.com/v1/playlists/{content["playlist_id"]}/tracks?limit=50'

    res = requests.get(END_POINT, headers=header_params)

    data = res.json()
    
    music_ids = []
    for d in data['items']:
        music_ids.append(d['track']['id'])
    
    ret = {
            'uris': music_ids,
        }

    return get_status(ret)

# 履歴をdbに追加する
def add_db_history(content):
    history_instance = history.objects.create(
    acousticness = content['acousticness'],
            danceability = content['danceability'],
            energy = content['energy'],
            instrumentalness = content['instrumentalness'],
            liveness = content['liveness'],
            loudness = content['loudness'],
            mode = content['mode'],
            speechiness = content['speechiness'],
            tempo = content['tempo'],
            valence = content['valence'],
        )

    new_history_id = history_instance.history_id
    return new_history_id

# spotifyデータをdbに追加する
def add_db_spotify_data(user_uid):

    if spotify_data.objects.filter(user_name=user_uid).exists():
        return
    else:
        token = UserSocialAuth.objects.get(uid=user_uid).extra_data['access_token']
        header_params = {
            'Authorization': 'Bearer ' + token,
        }

        END_POINT = 'https://api.spotify.com/v1/me'
        res = requests.get(END_POINT, headers=header_params)
        data = res.json()
        if data['images'][0]['url'] is None:
            get_image_url = "{% static 'images/logos/favicon.png' %}"
        else:
            get_image_url = data['images'][0]['url']

        spotify_data_list = [
            spotify_data(
                user_name = user_uid,
                image_url = get_image_url,
                country = 'JP',
            )
        ]

        spotify_data.objects.bulk_create(spotify_data_list)


# melotus_dataを追加する
def add_db_melotus_data(user_uid, new_history_id):
    spotify_data_instance = spotify_data.objects.get(user_name=user_uid)

    test = melotus_data.objects.create(
        spotify_id = spotify_data_instance,
        history_id = history.objects.get(history_id=new_history_id),
    )

    print(test.date)
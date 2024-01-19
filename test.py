import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv

def add_db_from_spotify():
    load_dotenv(os.path.join('./projects/auth/.env'))
    client_id = os.environ.get('SPOTIFY_KEY')
    client_secret = os.environ.get('SPOTIFY_SECRET')

    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    playlist_id = "37i9dQZEVXbKXQ4mDTEBXq" # top50 japan
    playlist_tracks = sp.playlist_tracks(playlist_id)

    # トラックごとにステータスを取得
    for track in playlist_tracks['items']:
        track_id = track['track']['id']
        track_name = track['track']['name']

        # トラックの特徴量を取得
        audio_features = sp.audio_features(track_id)[0]

        # 特徴量を表示または保存
        #　参考
        """
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
            """
        print(audio_features)
        print(f"Track ID: {track_id}")
        print(f"Track: {track_name}")
        print(f"Acousticness: {audio_features['acousticness']:.4f}")
        print(f"Danceability: {audio_features['danceability']:.4f}")
        print(f"Energy: {audio_features['energy']:.4f}")
        print(f"Instrumentalness: {audio_features['instrumentalness']:.4f}")
        print(f"Liveness: {audio_features['liveness']:.4f}")
        print(f"Loudness: {audio_features['loudness']:.4f}")
        print(f"Mode: {audio_features['mode']:.4f}")
        print(f"Speechiness: {audio_features['speechiness']:.4f}")
        print(f"Tempo: {audio_features['tempo']:.4f}")
        print(f"Valence: {audio_features['valence']:.4f}")
        
        

        print("\n")

add_db_from_spotify()
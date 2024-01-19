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
        print(f"Track: {track_name}")
        print(f"Acousticness: {audio_features['acousticness']:.4f}")
        print(f"Danceability: {audio_features['danceability']:.4f}")
        print(f"Energy: {audio_features['energy']:.4f}")
        # 他の特徴量も同様に表示または保存

        print("\n")

add_db_from_spotify()
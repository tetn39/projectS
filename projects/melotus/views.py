from django.shortcuts import render, redirect
from django.http import HttpResponse
import json
from social_django.models import UserSocialAuth
from .models import spotify_data
import requests
from .diagnosis.main import get_status, add_db_from_spotify, user_music_status, token_check, for_chart_weight, get_playlist_status, add_db_history, add_db_spotify_data, add_db_melotus_data, user_music_status_median, choose_music
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth import logout


def index(request):
    return render(request, 'index.html')


def search(request):
    return render(request, 'search.html')


# ログインしたときだけ実行
def login(request):
    print('Testtt')
    user_name = request.user
    add_db_spotify_data(user_name)
    return redirect('/songs/')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index')) 


def songs(request):
    context = {}
    
    if request.user.is_authenticated:
        requested_user_id = request.user.id
        token_check(requested_user_id)
        
        user_data = spotify_data.objects.get(user_name=request.user)
        context = {
            'user_image': user_data.image_url,
        }
    else:
        context = {}

    song_name = request.POST.get('song_name')
    if song_name is None:
        song_name = ''
    context['song_name'] = song_name
    
    return render(request, 'songs.html', context)


def status(request):
    context = {}

    if request.user.is_authenticated:
        requested_user_id = request.user.id
        token_check(requested_user_id)
        
        user_data = spotify_data.objects.get(user_name=request.user)
        context = {
            'user_image': user_data.image_url,
        }
    else:
        context = {}
    
    context |= {
        'song_img': "",
        'song_name': "test",
    }

    return render(request, 'status.html', context)


def help(request):
    context = {}

    if request.user.is_authenticated:
        requested_user_id = request.user.id
        token_check(requested_user_id)
        
        user_data = spotify_data.objects.get(user_name=request.user)
        context = {
            'user_image': user_data.image_url,
        }
    else:
        context = {}

    return render(request, 'help.html', context)

def howto(request):
    context = {}

    if request.user.is_authenticated:
        requested_user_id = request.user.id
        token_check(requested_user_id)
        
        user_data = spotify_data.objects.get(user_name=request.user)
        context = {
            'user_image': user_data.image_url,
        }
    else:
        context = {}

    return render(request, 'howto.html', context)


def playlist(request):
    if request.user.is_authenticated:
        requested_user_id = request.user.id
        token_check(requested_user_id)
        
        user_data = spotify_data.objects.get(user_name=request.user)
        context = {
            'user_image': user_data.image_url,
        }

        END_POINT = 'https://api.spotify.com/v1/me/playlists?limit=5&offset=0'
        token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
        header_params = {
            'Authorization': 'Bearer ' + token,
        }
        res = requests.get(END_POINT, headers=header_params)
        data = res.json()
        context['playlist_data'] = []
        
        for playlist in data['items']:
            playlist_name = playlist['name']
            playlist_url = playlist['external_urls']['spotify']
            largest_image_url = playlist['images'][0]['url'] if playlist['images'] else "/static/images/icons/no-icon.png"
            playlist_id = playlist['id']
            
            playlist_data = {
                'playlist_name': playlist_name,
                'playlist_url': playlist_url,
                'playlist_image_url': largest_image_url,
                'playlist_id': playlist_id,
            }
            context['playlist_data'].append(playlist_data)
        
    else:
        # ログインしていない状態
        token_check(1)

        context = {}

    
    
    return render(request, 'playlist.html', context)


def jikken(request):

    json_text = {
        "uris": [
            "7IQiZVGgfW927fImwKJDOq",
            "0MyTMrPTh0GgtuyhYRdl3P",
            "1Sy41HCCozDBL73orZpW5Y",
            "2ChSAhdQmJpHgos2DQP6cI"
            ] 
    }
    get_status(json_text)

    context = {
        'songs': "test",
    }


    return render(request, 'old/jikken.html', context)


@ensure_csrf_cookie
def js_py(request):
    if request.method == 'POST':
        # POSTリクエストの場合、CSRFトークンを確認
        csrf_token = request.headers.get("X-CSRFToken")
        if not request.COOKIES.get("csrftoken") == csrf_token:
            return JsonResponse({'status': 'error', 'message': 'CSRF Token Validation Failed'})
        
        data = json.loads(request.body.decode('utf-8'))
        selected_uris = {"uris": data.get('selectedUris', [])}
        
        # 曲のステータスのリスト
        selected_music_data = get_status(selected_uris)
        
        # ユーザーとしてのステータス
        # user_status = user_music_status(selected_music_data)
        user_status = user_music_status_median(selected_music_data)

        if request.user.is_authenticated:
            # historyに追加してhistory_id取得
            new_history_id = add_db_history(user_status)

            # melotus_dataに追加
            add_db_melotus_data(request.user, new_history_id)

        # おすすめの曲を選ぶ
        recommended_music = choose_music(user_status)
        
        # チャートに書くためのステータス
        weighted_user_status = for_chart_weight(user_status)
        
        json_text = {
            "uris": selected_uris,
            "user_status": weighted_user_status,
            "recommended_music": recommended_music,
        }
        return JsonResponse(json_text)

    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@ensure_csrf_cookie
def js_py_playlist(request):
    try:
        if request.method == 'POST':
            # POSTリクエストの場合、CSRFトークンを確認
            csrf_token = request.headers.get("X-CSRFToken")
            if not request.COOKIES.get("csrftoken") == csrf_token:
                return JsonResponse({'status': 'error', 'message': 'CSRF Token Validation Failed'})

            data = json.loads(request.body.decode('utf-8'))
            selected_playlist = {"playlist_id": data.get('selectedPlaylist', [])} #selectedPlaylist として名前つけてほしい
            token_check(1)
            # playlistからすべて?の曲のIDを取得し、get_statusに渡す。
            # その後、get_statusの返り値をuser_music_statusに渡す。
            # その後、user_music_statusの返り値をfor_chart_weightに渡す。
            # その後、for_chart_weightの返り値をjsonにして返す。


            selected_music_data = get_playlist_status(selected_playlist)
            # user_status = user_music_status(selected_music_data)
            user_status = user_music_status_median(selected_music_data)
            
            recommended_music = choose_music(user_status)   

            weighted_user_status = for_chart_weight(user_status)

            # ここで配列を使用した処理を行う
            
            json_text = {
                "uris": selected_playlist,
                "user_status": weighted_user_status,
                "recommended_music": recommended_music,
            }
            return JsonResponse(json_text)

        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

    
@ensure_csrf_cookie
def get_token(request):
    token_check(1)
    token = UserSocialAuth.objects.get(user_id=1).extra_data['access_token']
    return JsonResponse({'access_token': token})


def add_db(request):
    ret = add_db_from_spotify()
    
    content = {
        'ret': ret,
    }
    return render(request, 'add_db.html', content)


def test(request):
    choose_music({'acousticness': 0.0142, 'danceability': 0.584, 'energy': 0.822, 'instrumentalness': 0.0, 'liveness': 0.105, 'loudness': -3.397, 'mode': 1.0, 'speechiness': 0.0468, 'tempo': 142.514, 'valence': 0.677})
    return HttpResponse('test')
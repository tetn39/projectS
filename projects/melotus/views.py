from django.shortcuts import render, redirect
from django.http import HttpResponse
import json
from social_django.models import UserSocialAuth
import requests
from django.conf import settings
from .diagnosis.main import get_status, add_db_from_spotify, user_music_status, token_check
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth import logout



def index(request):
    return render(request, 'index.html')

def search(request):
    return render(request, 'search.html')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('index')) 

def songs(request):
    context = {}
    
    if request.user.is_authenticated:
        print('ログイン済み')
        requested_user_id = request.user.id
        token_check(requested_user_id)
        token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
        header_params = {
            'Authorization': 'Bearer ' + token,
        }

        END_POINT = 'https://api.spotify.com/v1/me'
        res = requests.get(END_POINT, headers=header_params)
        data = res.json()
        
        context = {
            'user_name': data['display_name'],
            'user_url': data['external_urls']['spotify'],
            'user_image': data['images'][0]['url'],
        }
    else:
        print('ログインしていない')

    song_name = request.POST.get('song_name')
    if song_name is None:
        song_name = ''
    context['song_name'] = song_name
    
    return render(request, 'songs.html', context)

def status(request):
    context = {}

    if request.user.is_authenticated:
        print('ログイン済み')
    
        requested_user_id = request.user.id
        token_check(requested_user_id)
        token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
        header_params = {
            'Authorization': 'Bearer ' + token,
        }

        END_POINT = 'https://api.spotify.com/v1/me'

        res = requests.get(END_POINT, headers=header_params)
        data = res.json()
        context = {
            'user_name': data['display_name'],
            'user_url': data['external_urls']['spotify'],
            'user_image': data['images'][0]['url'],
        }
    else:
        print('ログインしていない')

    return render(request, 'status.html', context)


def help(request):
    context = {}

    if request.user.is_authenticated:
        print('ログイン済み')

        requested_user_id = request.user.id
        token_check(requested_user_id)
        token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
        header_params = {
            'Authorization': 'Bearer ' + token,
        }

        END_POINT = 'https://api.spotify.com/v1/me'

        res = requests.get(END_POINT, headers=header_params)
        data = res.json()
        context = {
            'user_name': data['display_name'],
            'user_url': data['external_urls']['spotify'],
            'user_image': data['images'][0]['url'],
        }

    else:
        print('ログインしていない')

    return render(request, 'help.html', context)



def playlist(request):
    if request.user.is_authenticated:

        requested_user_id = request.user.id
        token_check(requested_user_id)
        token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
        header_params = {
            'Authorization': 'Bearer ' + token,
        }

        END_POINT = 'https://api.spotify.com/v1/me'

        res = requests.get(END_POINT, headers=header_params)
        data = res.json()
        context = {
            'user_name': data['display_name'],
            'user_url': data['external_urls']['spotify'],
            'user_image': data['images'][0]['url'],
        }

        END_POINT = 'https://api.spotify.com/v1/me/playlists?limit=5&offset=0'

        res = requests.get(END_POINT, headers=header_params)
        data = res.json()
        context['playlist_data'] = []
        print(context)
        for playlist in data['items']:
            playlist_name = playlist['name']
            playlist_url = playlist['external_urls']['spotify']
            largest_image_url = playlist['images'][0]['url'] if playlist['images'] else 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'
            playlist_data = {
                'playlist_name': playlist_name,
                'playlist_url': playlist_url,
                'playlist_image_url': largest_image_url,
            }
            context['playlist_data'].append(playlist_data)
        print(context)
    else:
        print('ログインしていない')
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
        
        selected_music_data = get_status(selected_uris)
        user_status = user_music_status(selected_music_data)
        
        for status in user_status:

            if status != 'tempo' and status != 'loudness':
                user_status[status] *= 100
                user_status[status] += 20
            
            if status == 'loudness':
                user_status[status] += 80.0
            
            if status == 'tempo':
                user_status[status] /= 2.0
            
            user_status[status] = float(f'{user_status[status]:.4f}')
        print(user_status)

        # ここで配列を使用した処理を行う
        print('成功')
        
        json_text = {
            "uris": selected_uris,
            "user_status": user_status,
        }
        return JsonResponse(json_text)

    else:
        print('失敗')
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


def add_db(request):
    ret = add_db_from_spotify()
    
    content = {
        'ret': ret,
    }
    return render(request, 'add_db.html', content)


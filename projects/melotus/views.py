from django.shortcuts import render, redirect
from django.http import HttpResponse
import json
from social_django.models import UserSocialAuth
import requests
from django.conf import settings
from .diagnosis.main import get_status
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie



def index(request):
    return render(request, 'index.html')

def search(request):
    return render(request, 'search.html')

def songs(request):
    context = {}
    
    if request.user.is_authenticated:
        print('ログイン済み')
        requested_user_id = request.user.id
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
    requested_user_id = request.user.id
    token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }

    # ここで検索のを試す
    # END_POINT = 'https://api.spotify.com/v1/me/albums?limit=3' 
    END_POINT = 'https://api.spotify.com/v1/search?q=BTS&type=album&market=JP&limit=3'
    # https://developer.spotify.com/documentation/web-api/reference/search 参考サイト

    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    context = {
        'songs': [],
    }

    for i in range(3):
        context['songs'].append({
            'album_name': data['albums']['items'][i]['name'],
            'album_img': data['albums']['items'][i]['images'][0]['url'],
            'album_url': data['albums']['items'][i]['external_urls']['spotify'],
            'artist_name': data['albums']['items'][i]['artists'][0]['name'],
            'artist_url': data['albums']['items'][i]['artists'][0]['external_urls']['spotify'],
        })
    
    
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


    return render(request, 'old/playlist.html', context)

@ensure_csrf_cookie
def js_py(request):
    if request.method == 'POST':
        # POSTリクエストの場合、CSRFトークンを確認
        csrf_token = request.headers.get("X-CSRFToken")
        if not request.COOKIES.get("csrftoken") == csrf_token:
            return JsonResponse({'status': 'error', 'message': 'CSRF Token Validation Failed'})

        data = json.loads(request.body.decode('utf-8'))
        myArray = data.get('myArray', [])
        # ここで配列を使用した処理を行う
        print('成功')
        print(myArray)
        json_text = {
            "uris": [
                "7IQiZVGgfW927fImwKJDOq",
                "0MyTMrPTh0GgtuyhYRdl3P",
                "1Sy41HCCozDBL73orZpW5Y",
                "2ChSAhdQmJpHgos2DQP6cI"
            ]
        }
        return JsonResponse(json_text)

    else:
        print('失敗')
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

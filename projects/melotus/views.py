from django.shortcuts import render, redirect
from django.http import HttpResponse
import json
from social_django.models import UserSocialAuth
import requests
from .forms import PostForm
from django.conf import settings


def home_view(request):
    context = {}

    context['form'] = PostForm()

    return render(request, 'home.html', context)


def create_view(request):
    form = PostForm(request.POST)
    if not form.is_valid():
        raise ValueError('invalid form', status=500)
    
    post = form.save()

    return HttpResponse(f'{post.name}', status=200)


def index(request):
    return render(request, 'index.html')

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
    END_POINT = 'https://api.spotify.com/v1/search?q=BTS&type=album&market=JP&limit=3'  # 中のやつが違うため、どうにかする
    # https://developer.spotify.com/documentation/web-api/reference/search 参考サイト

    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    context = {
        'all_data': data['items'][0]['album'],
        'album_name': data['items'][0]['album']['name'],
        'album_img': data['items'][0]['album']['images'][0]['url'],
        'album_url': data['items'][0]['album']['external_urls']['spotify'],
        'artist_name': data['items'][0]['album']['artists'][0]['name'],
        'artist_url': data['items'][0]['album']['artists'][0]['external_urls']['spotify'],
        
    }
    return render(request, 'old/playlist.html', context)
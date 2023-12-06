from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import render, redirect
import json
from social_django.models import UserSocialAuth

import requests
from django.conf import settings


def test(request):
    return HttpResponse('testだよ')

def index(request):
    return render(request, 'index.html')

def songs(request):
    print('-------------------')
    print(request.user.id)
    print('-------------------')
    requested_user_id = request.user.id
    print(UserSocialAuth.objects.all())
    token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }

    END_POINT = 'https://api.spotify.com/v1/me'

    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    # print(data)
    context = {
        'user_name': data['display_name'],
        'user_url': data['external_urls']['spotify'],
        'user_image': data['images'][0]['url'],
    }
    # debug contect
    # context = {
    #     'user_name': 'test',
    #     'user_url': 'test',
    #     'user_image': 'test',
    # }
    return render(request, 'songs.html', context)

def status(request):
    print('-------------------')
    print(request.user.id)
    print('-------------------')
    requested_user_id = request.user.id
    print(UserSocialAuth.objects.all())
    token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }

    END_POINT = 'https://api.spotify.com/v1/me'

    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    # print(data)
    context = {
        'user_name': data['display_name'],
        'user_url': data['external_urls']['spotify'],
        'user_image': data['images'][0]['url'],
    }
    # debug contect
    # context = {
    #     'user_name': 'test',
    #     'user_url': 'test',
    #     'user_image': 'test',
    # }
    return render(request, 'status.html', context)


def help(request):
    print('-------------------')
    print(request.user.id)
    print('-------------------')
    requested_user_id = request.user.id
    print(UserSocialAuth.objects.all())
    token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }

    END_POINT = 'https://api.spotify.com/v1/me'

    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    # print(data)
    context = {
        'user_name': data['display_name'],
        'user_url': data['external_urls']['spotify'],
        'user_image': data['images'][0]['url'],
    }
    # debug contect
    # context = {
    #     'user_name': 'test',
    #     'user_url': 'test',
    #     'user_image': 'test',
    # }
    return render(request, 'help.html', context)



def playlist(request):
    requested_user_id = request.user.id
    token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }

    END_POINT = 'https://api.spotify.com/v1/me/albums?limit=3'
    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    context = {
        'all_data': data['items'][0]['album'],
        'album_name': data['items'][0]['album']['name'],
        'album_img': data['items'][0]['album']['images'][0]['url'],
        
    }
    return render(request, 'old/playlist.html', context)
from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
from django.shortcuts import render
import json
from social_django.models import UserSocialAuth
import requests
from django.conf import settings


# def index(request):
#     with open('projects/static/json/data.json', 'r', encoding='utf-8') as f:
#         data = json.load(f)


#     return render(request, 'index.html', data)



def test(request):
    return HttpResponse('testだよ')

def index(request):
    return render(request, 'index.html')

def login(request):
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
    return render(request, 'login.html', context)



def playlist(request):
    requested_user_id = request.user.id
    token = UserSocialAuth.objects.get(user_id=requested_user_id).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }

    END_POINT = 'https://api.spotify.com/v1/me/albums?limit=1'
    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    context = {
        'all_data': data['items'][0]['album']['external_urls'],
    }
    return render(request, 'playlist.html', context)
    
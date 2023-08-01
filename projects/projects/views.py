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
    print(UserSocialAuth.objects.all())
    token = UserSocialAuth.objects.get(user_id=1).extra_data['access_token']
    header_params = {
        'Authorization': 'Bearer ' + token,
    }
    query_params = {
        # 'q': 'BTS',
        # 'type': 'artist',
        # 'limit': 10
    }
    END_POINT = 'https://api.spotify.com/v1/me'

    res = requests.get(END_POINT, headers=header_params)
    data = res.json()
    print(data)
    context = {
        'user_name': data['display_name'],
        'user_url': data['external_urls']['spotify'],
        'user_image': data['images'][0]['url'],
    }
    return render(request, 'index.html', context)



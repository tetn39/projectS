from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
from django.shortcuts import render
import json


def index(request):
    with open('projects/static/json/data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)


    return render(request, 'index.html', data)



def test(request):
    return HttpResponse('testだよ')


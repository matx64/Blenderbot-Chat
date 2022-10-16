from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

import requests
import time
import json


def index(request):
    return render(request, 'chatbot/index.html')


def message(request):
    if request.session.get('accessToken') is None or request.session.get('expiration', 0) < time.time() or request.session.get('sessionToken') is None:
        url = 'https://api.inbenta.io/v1/auth'
        headers = {'x-inbenta-key': settings.INBENTA_KEY}
        body = {'secret': settings.INBENTA_SECRET}

        r = requests.post(url, headers=headers, data=body).json()

        request.session['accessToken'] = r['accessToken']
        request.session['expiration'] = r['expiration']

        url = 'https://api-gce3.inbenta.io/prod/chatbot/v1/conversation'
        headers = {
            'x-inbenta-key': settings.INBENTA_KEY,
            'Authorization': 'Bearer ' + r['accessToken']
        }

        r = requests.post(url, headers=headers).json()

        request.session['sessionToken'] = r['sessionToken']

        print(request.session.items())

    url = 'https://api-gce3.inbenta.io/prod/chatbot/v1/conversation/message'
    headers = {
        'x-inbenta-key': settings.INBENTA_KEY,
        'Authorization': 'Bearer ' + request.session['accessToken'],
        'x-inbenta-session': 'Bearer ' + request.session['sessionToken']
    }
    body = {
        'message': json.loads(request.body.decode('utf-8'))['userMessage']
    }

    r = requests.post(url, headers=headers, data=body)

    return HttpResponse(r, content_type='application/json')

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from django.conf import settings

import requests
import json

def index(request):
    return render(request, 'chatbot/index.html')


def message(request):
    if request.method == 'GET':
        return HttpResponseNotFound('invalid.')

    body = json.loads(request.body)

    url = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill'
    headers = {'Authorization': 'Bearer ' + settings.INFERENCE_API_TOKEN}
    payload = {
        'inputs': {
            'past_user_inputs': body['past_user_inputs'][:-1],
            'generated_responses': body['generated_responses'],
            'text': body['past_user_inputs'][-1]
        },
    }

    r = requests.post(url, headers=headers, json=payload)

    return HttpResponse(r.json()['generated_text'])

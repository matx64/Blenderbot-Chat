FROM python:3-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir -p /app

WORKDIR /app

COPY requirements.txt /tmp/requirements.txt

RUN set -ex && \
    pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt && \
    rm -rf /root/.cache/

COPY . /app/

EXPOSE 8000

RUN python manage.py migrate && \
    python manage.py collectstatic

CMD gunicorn --bind :8000 --workers 2 blenderbot_chat.wsgi
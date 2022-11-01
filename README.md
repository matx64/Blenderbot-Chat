# 🤖 Blenderbot Chat

👉 Available at https://blenderbot-chat.fly.dev


### 🔨 Tech
- Python 3.10
- Django
- TailwindCSS
- Blenderbot Hugging Face Inference API
- Docker
- Fly.io


### 💻 Installation

```bash
python3 -m venv venv &&
source ./venv/bin/activate &&
pip install --upgrade pip &&
pip install -r requirements.txt
```


### 🏠 Run it locally

```bash
python3 manage.py migrate &&
python3 manage.py runserver
```

```bash
docker build -t blenderbot-chat . &&
docker run -p 8000:8000 --rm --name blenderbot-chat-running blenderbot-chat
```
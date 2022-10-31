# Blenderbot Chat

## Tech
- Django
- TailwindCSS
- Blenderbot Hugging Face Inference API
- Docker
- Fly.io


### Installation

```bash
python3 -m venv venv &&
source ./venv/bin/activate &&
pip install --upgrade pip &&
pip install -r requirements.txt
```


### Run it locally

```bash
python3 manage.py migrate &&
python3 manage.py runserver
```
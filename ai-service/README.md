# PLAQUE AI Service

Python microservice for similarity and AI-writing detection.

## Setup

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `POST /similarity` with `{ "text": "..." }`
- `POST /ai-detection` with `{ "text": "..." }`

## Integration

Set backend env:

```env
AI_SERVICE_URL=http://localhost:8000
```

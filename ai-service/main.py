from fastapi import FastAPI
from pydantic import BaseModel

from ai_detection import detect_ai_score, writing_pattern_consistency
from similarity import similarity_score, source_matches

app = FastAPI(title="PLAQUE AI Service", version="1.0.0")


class TextPayload(BaseModel):
    text: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/similarity")
def similarity(payload: TextPayload):
    score = similarity_score(payload.text)
    matches = source_matches(payload.text)
    return {
        "similarityScore": score,
        "sourceMatches": matches,
    }


@app.post("/ai-detection")
def ai_detection(payload: TextPayload):
    return {
        "aiScore": detect_ai_score(payload.text),
        "writingPatternConsistency": writing_pattern_consistency(payload.text),
    }

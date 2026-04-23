from typing import List

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


CORPUS = [
    (
        "website",
        "Open web archive",
        "Academic integrity requires proper citation and original synthesis of sources.",
    ),
    (
        "journal",
        "Scholarly journal sample",
        "Empirical findings indicate that students benefit from transparent feedback loops.",
    ),
    (
        "student-paper",
        "Institutional submission archive",
        "This submission discusses methodological limitations and future research directions.",
    ),
]


def _fit_vectors(text: str):
    docs = [text] + [entry[2] for entry in CORPUS]
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(docs)
    return matrix


def similarity_score(text: str) -> float:
    matrix = _fit_vectors(text)
    candidate = matrix[0:1]
    sources = matrix[1:]
    sims = cosine_similarity(candidate, sources)[0]
    return float(np.clip(np.max(sims), 0.0, 1.0))


def source_matches(text: str) -> List[dict]:
    matrix = _fit_vectors(text)
    candidate = matrix[0:1]
    sources = matrix[1:]
    sims = cosine_similarity(candidate, sources)[0]

    matches = []
    for idx, sim in enumerate(sims):
        source_type, source_name, source_text = CORPUS[idx]
        matches.append(
            {
                "sourceType": source_type,
                "sourceName": source_name,
                "matchPercentage": int(round(float(np.clip(sim, 0.0, 1.0)) * 100)),
                "matchedText": source_text[:180],
            }
        )
    return matches

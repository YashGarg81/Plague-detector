import re

import numpy as np


def _sentence_lengths(text: str):
    parts = [p.strip() for p in re.split(r"[.!?]+", text) if p.strip()]
    if not parts:
        return [1]
    return [max(1, len(p.split())) for p in parts]


def _lexical_diversity(text: str) -> float:
    tokens = [t.lower() for t in re.split(r"\W+", text) if len(t) > 1]
    if not tokens:
        return 0.0
    return len(set(tokens)) / len(tokens)


def detect_ai_score(text: str) -> float:
    diversity = _lexical_diversity(text)
    sentence_lengths = _sentence_lengths(text)
    variance = float(np.var(sentence_lengths))
    transition_density = len(
        re.findall(r"\btherefore|moreover|furthermore|additionally\b", text, flags=re.I)
    ) / max(1, len(text.split()))

    score = (
        (1 - min(1.0, diversity * 1.8)) * 0.5
        + (1 - min(1.0, variance / 80.0)) * 0.35
        + min(1.0, transition_density * 25) * 0.15
    )
    return float(np.clip(score, 0.0, 1.0))


def writing_pattern_consistency(text: str) -> float:
    sentence_lengths = _sentence_lengths(text)
    variance = float(np.var(sentence_lengths))
    consistency = 1.0 - min(1.0, variance / 120.0)
    return float(np.clip(consistency, 0.0, 1.0))

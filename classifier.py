import streamlit as st
from transformers import pipeline
import torch

CATEGORIES = [
    "AI & Machine Learning",
    "Startups & Business",
    "Gadgets & Hardware",
    "Software & Apps",
    "General Tech",
]

_HYPOTHESIS_LABELS = [
    "artificial intelligence or machine learning",
    "technology startups, funding, or business strategy",
    "consumer electronics, gadgets, chips, or hardware devices",
    "software applications, platforms, or developer tools",
    "general technology news",
]

assert len(CATEGORIES) == len(_HYPOTHESIS_LABELS)

@st.cache_resource(show_spinner=False)
def _load_pipeline():
    """Load facebook/bart-large-mnli once and keep it in memory."""
    device = 0 if torch.cuda.is_available() else -1
    return pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli",
        device=device,
    )

def classify_articles(articles: list[dict]) -> list[dict]:
    """Batch-classify all articles and fill in the 'category' field."""
    clf = _load_pipeline()
    texts = [(a["title"] + ". " + a["content"][:300])[:512] for a in articles]
    results = clf(texts, candidate_labels=_HYPOTHESIS_LABELS, batch_size=8, multi_label=False)

    _hyp_to_display = dict(zip(_HYPOTHESIS_LABELS, CATEGORIES))
    for article, result in zip(articles, results):
        article["category"] = _hyp_to_display[result["labels"][0]]
        article["confidence"] = round(float(result["scores"][0]), 3)
    return articles

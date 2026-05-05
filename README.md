# 📡 Tech News Tracker — SMAI A3 · T9.3

> **Tier 1** · Live RSS tech news, zero-shot classified, LLM-summarized.

A Streamlit web app that fetches the **30 latest tech headlines** from TechCrunch, The Verge, and YourStory, classifies them into subcategories using `facebook/bart-large-mnli`, and generates 3-bullet summaries with **Gemini 1.5 Flash**.

---

## Demo

| Component | Tool |
| --- | --- |
| RSS Parsing | `feedparser` |
| Zero-shot Classification | `facebook/bart-large-mnli` |
| Summarization | Gemini 1.5 Flash API |
| Frontend | Streamlit |
| Caching | `@st.cache_data` (15 min feed TTL, 1 hr summary TTL) |

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd Yoraha_Creations_SMAI_A3
pip install -r requirements.txt
```

### 2. Configure Gemini API key

```bash
cp .env.example .env
# Open .env and paste your key from https://aistudio.google.com/app/apikey
```

### 3. Run

```bash
streamlit run app.py
```

App opens at `http://localhost:8501`.

---

## Architecture

```text
app.py              ← Streamlit UI, caching orchestration
rss_fetcher.py      ← Parses TechCrunch, The Verge, YourStory RSS feeds
classifier.py       ← Batched zero-shot classification (bart-large-mnli)
summarizer.py       ← Gemini 1.5 Flash 3-bullet summaries (cached)
```

### Caching strategy

| Cache | Scope | TTL |
| --- | --- | --- |
| `@st.cache_resource` | bart-large-mnli model | lifetime of app process |
| `@st.cache_data` | fetch + classify pipeline | 15 minutes |
| `@st.cache_data` | per-article Gemini summary | 1 hour |

### Classification categories

- 🤖 AI & Machine Learning
- 💼 Startups & Business
- 📱 Gadgets & Hardware
- 💻 Software & Apps
- 📰 General Tech

---

## Running on Google Colab (T4 GPU)

```python
!pip install -r requirements.txt
!streamlit run app.py &
# Expose via ngrok or use Colab port forwarding
```

GPU is auto-detected — classification batch runs ~10× faster on T4 vs CPU.

---

## Evaluation (India Headlines Dataset)

Offline evaluation filters tech-related headlines from the
[India Headlines News Dataset](https://www.kaggle.com/datasets/therohk/india-headlines-news-dataset)
and measures zero-shot classification accuracy against manual labels.

---

## LLM Disclosure

Code scaffolding assisted by **Claude (Anthropic)**. All evaluation, analysis, and final
integration are our own work. Gemini 1.5 Flash is used at runtime for article summarization.

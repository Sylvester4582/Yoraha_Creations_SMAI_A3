---
title: Tech News Terminal · T9.3
emoji: 📡
colorFrom: green
colorTo: red
sdk: docker
app_port: 8501
pinned: false
license: mit
short_description: Live tech news — zero-shot classified & AI-summarised
---

# 📡 Tech News Terminal — SMAI A3 · T9.3

> **Tier 1** · Live RSS tech news, zero-shot classified, LLM-summarised.

A Bloomberg-terminal-styled Streamlit app that fetches the **30 latest tech headlines** from TechCrunch, The Verge, and YourStory, classifies them into subcategories using `facebook/bart-large-mnli`, and generates 3-bullet summaries with **Llama 3.3 70B via Groq**.

---

## Live Demo

Deploy to [Hugging Face Spaces](https://huggingface.co/spaces) — see deployment section below.

| Component | Tool |
|---|---|
| RSS Parsing | `feedparser` |
| Zero-shot Classification | `facebook/bart-large-mnli` |
| Summarisation | Groq — llama-3.3-70b-versatile |
| Frontend | Streamlit (dark terminal theme) |
| Caching | `@st.cache_data` (15 min feed TTL, 1 hr summary TTL) |

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd Yoraha_Creations_SMAI_A3
pip install -r requirements.txt
```

### 2. Add your Groq API key

```bash
cp .env.example .env   # or create .env manually
```

Open `.env` and add:
```
GROQ_API_KEY=gsk_your_key_here
```

Get a **free** key at https://console.groq.com (no credit card needed).

### 3. Run

```bash
streamlit run app.py
```

App opens at `http://localhost:8501`.

---

## Deploying to Hugging Face Spaces

1. Go to https://huggingface.co/new-space
2. Choose **Streamlit** as the SDK
3. Set the Space name (e.g. `tech-news-terminal`)
4. Connect your GitHub repo **or** upload these files directly:
   - `app.py`
   - `rss_fetcher.py`
   - `classifier.py`
   - `summariser.py`
   - `requirements.txt`
   - `README.md` ← this file (frontmatter tells HF it's a Streamlit Space)
   - `.streamlit/config.toml`
5. In the Space **Settings → Repository secrets**, add:
   - Name: `GROQ_API_KEY`  Value: `gsk_your_key_here`
6. Click **Deploy** — the Space will build and go live automatically

> The first boot takes 2–3 minutes while `facebook/bart-large-mnli` (~1.6 GB) downloads. Subsequent loads use the cached model.

---

## Architecture

```text
app.py              ← Streamlit UI, caching orchestration
rss_fetcher.py      ← Parses TechCrunch, The Verge, YourStory RSS feeds
classifier.py       ← Batched zero-shot classification (bart-large-mnli)
summarizer.py       ← Llama 3.3 70B via Groq (3-bullet summaries, cached 1hr)
.streamlit/
  config.toml       ← Dark Bloomberg terminal theme
```

### Caching strategy

| Cache | Scope | TTL |
|---|---|---|
| `@st.cache_resource` | bart-large-mnli model | lifetime of app process |
| `@st.cache_data` | fetch + classify pipeline | 15 minutes |
| `@st.cache_data` | per-article Groq summary | 1 hour |

### Classification categories

| Short | Full Name |
|---|---|
| AI | AI & Machine Learning |
| BIZ | Startups & Business |
| HW | Gadgets & Hardware |
| SW | Software & Apps |
| TECH | General Tech |

---

## Evaluation (India Headlines Dataset)

Offline evaluation filters tech-related headlines from the
[India Headlines News Dataset](https://www.kaggle.com/datasets/therohk/india-headlines-news-dataset)
and measures zero-shot classification accuracy against manual labels.
See `notebooks/evaluation.ipynb`.

---

## Assignment Info

- **Course:** SMAI (Statistical Methods in AI) · Semester VI · IIIT Hyderabad
- **Assignment:** A3 · Task T9.3 — Tech News Tracker (Tier 1)
- **Creator:** Vidvathama R · Yoraha Creations

## LLM Disclosure

Code scaffolding assisted by **Claude (Anthropic)**. All evaluation, analysis, and final
integration are original work. Groq / Llama 3.3 70B is used at runtime for article summarisation.

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

## Tech News Terminal — SMAI A3 · T9.3

> **Tier 1** · Live RSS tech news, zero-shot classified, LLM-summarised.

A Bloomberg-terminal-styled Streamlit app that fetches the **30 latest tech headlines** from TechCrunch, The Verge, and YourStory, classifies them into subcategories using `facebook/bart-large-mnli`, and generates 3-bullet summaries with **Llama 3.3 70B via Groq**.

**Live demo:** [https://huggingface.co/spaces/SylvesterSsj/tech-news-terminal](https://huggingface.co/spaces/SylvesterSsj/tech-news-terminal)

---

## Stack

| Component | Tool |
|---|---|
| RSS Parsing | `feedparser` |
| Zero-shot Classification | `facebook/bart-large-mnli` |
| Summarisation | Groq — llama-3.3-70b-versatile |
| Frontend | Streamlit (dark terminal theme) |
| Caching | `@st.cache_data` (15 min feed TTL, 1 hr summary TTL) |

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/Sylvester4582/Yoraha_Creations_SMAI_A3
cd Yoraha_Creations_SMAI_A3
pip install -r requirements.txt
```

### 2. Add your Groq API key

Create a `.env` file in the project root:

```
GROQ_API_KEY=gsk_your_key_here
```

Get a free key at [https://console.groq.com](https://console.groq.com) — no credit card needed.

### 3. Run

```bash
streamlit run app.py
```

App opens at `http://localhost:8501`.

---

## Architecture

```
app.py              ← Streamlit UI, caching orchestration
rss_fetcher.py      ← Parses TechCrunch, The Verge, YourStory RSS feeds
classifier.py       ← Batched zero-shot classification (bart-large-mnli)
summarizer.py       ← Llama 3.3 70B via Groq (3-bullet summaries, cached 1 hr)
Dockerfile          ← Docker config for HuggingFace Spaces deployment
.streamlit/
  config.toml       ← Dark terminal theme
notebooks/
  evaluation.ipynb  ← Offline accuracy evaluation
```

### Caching strategy

| Cache | Scope | TTL |
|---|---|---|
| `@st.cache_resource` | bart-large-mnli model | lifetime of app process |
| `@st.cache_data` | fetch + classify pipeline | 15 minutes |
| `@st.cache_data` | per-article Groq summary | 1 hour |

### Classification categories

| Category | Description |
|---|---|
| AI & Machine Learning | AI research, models, tools |
| Startups & Business | Funding, strategy, founders |
| Gadgets & Hardware | Devices, chips, consumer electronics |
| Software & Apps | Platforms, developer tools, apps |
| General Tech | Broader tech news |

---

## Evaluation

Offline evaluation filters tech-related headlines from the [India Headlines News Dataset](https://www.kaggle.com/datasets/therohk/india-headlines-news-dataset) and measures zero-shot classification accuracy against manual labels. See `notebooks/evaluation.ipynb`.

---

## Assignment Info

- **Course:** SMAI (Statistical Methods in AI) · Semester VI · IIIT Hyderabad
- **Assignment:** A3 · Task T9.3 — Tech News Tracker (Tier 1)
- **Creator:** Vidvathama R · Yoraha Creations

## LLM Disclosure

Code scaffolding assisted by **Claude (Anthropic)**. All evaluation, analysis, and final integration are original work. Groq / Llama 3.3 70B is used at runtime for article summarisation.

import streamlit as st
from dotenv import load_dotenv

load_dotenv()

from rss_fetcher import fetch_articles
from classifier import classify_articles, CATEGORIES
from summarizer import summarize

# ── Page config (must be first Streamlit call) ────────────────────────────────
st.set_page_config(
    page_title="Tech News Terminal · TNT",
    page_icon="📡",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Terminal CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
/* Fonts + base */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace !important;
}

/* Hide default Streamlit chrome */
#MainMenu { visibility: hidden; }
footer    { visibility: hidden; }

/* Header bar */
.tnt-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0 16px 0;
    border-bottom: 1px solid #1e1e1e;
    margin-bottom: 20px;
}
.tnt-logo {
    color: #f97316;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.4em;
    border: 1px solid #f97316;
    padding: 4px 12px;
    font-family: monospace;
}
.tnt-title {
    color: #d4d4d4;
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: 0.18em;
}
.tnt-live {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #22c55e;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    font-weight: 600;
}
.tnt-live-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-block;
    animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.8); }
}

/* Source badges */
.badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 2px 7px;
    font-family: monospace;
}
.badge-tc { color: #3fb950; border: 1px solid #3fb95033; }
.badge-vg { color: #f97316; border: 1px solid #f9731633; }
.badge-ys { color: #bc8cff; border: 1px solid #bc8cff33; }

/* Category colors */
.cat-ai   { color: #58a6ff; }
.cat-biz  { color: #3fb950; }
.cat-hw   { color: #e3b341; }
.cat-sw   { color: #bc8cff; }
.cat-tech { color: #6e7681; }

/* Confidence bar container */
.conf-bar-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 2px 0 4px 0;
}
.conf-bar-bg {
    flex: 1;
    height: 3px;
    background: #1e1e1e;
    max-width: 120px;
}
.conf-bar-fill {
    height: 100%;
}
.conf-label {
    font-size: 0.68rem;
    font-family: monospace;
    letter-spacing: 0.05em;
}

/* Article title link */
.art-title a {
    color: #d4d4d4 !important;
    text-decoration: none !important;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    line-height: 1.4;
}
.art-title a:hover { color: #f97316 !important; }

/* Metric boxes */
[data-testid="metric-container"] {
    border: 1px solid #1e1e1e !important;
    background: #111 !important;
    padding: 8px 12px !important;
}
[data-testid="stMetricValue"] {
    font-family: monospace !important;
    font-size: 1.4rem !important;
}

/* Tabs */
[data-baseweb="tab-list"] {
    gap: 4px !important;
    border-bottom: 1px solid #1e1e1e !important;
}
[data-baseweb="tab"] {
    font-family: monospace !important;
    font-size: 0.72rem !important;
    letter-spacing: 0.12em !important;
    padding: 6px 14px !important;
    color: #737373 !important;
}
[aria-selected="true"] {
    color: #f97316 !important;
    border-bottom: 2px solid #f97316 !important;
}

/* Expander */
[data-testid="stExpander"] {
    border: 1px solid #1e1e1e !important;
    background: #0d0d0d !important;
}

/* Containers / cards */
[data-testid="stVerticalBlockBorderWrapper"] {
    border-color: #1e1e1e !important;
    background: #0d0d0d !important;
}

/* Divider */
hr { border-color: #1e1e1e !important; }

/* Status bar */
.status-bar {
    border-top: 1px solid #1e1e1e;
    padding: 6px 0 0 0;
    margin-top: 16px;
    color: #404040;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}
.status-bar span { color: #737373; }
</style>
""", unsafe_allow_html=True)

# ── Constants ──────────────────────────────────────────────────────────────────
CATEGORY_ICONS = {
    "AI & Machine Learning": "AI",
    "Startups & Business":   "BIZ",
    "Gadgets & Hardware":    "HW",
    "Software & Apps":       "SW",
    "General Tech":          "TECH",
}
CATEGORY_COLORS = {
    "AI & Machine Learning": "#58a6ff",
    "Startups & Business":   "#3fb950",
    "Gadgets & Hardware":    "#e3b341",
    "Software & Apps":       "#bc8cff",
    "General Tech":          "#6e7681",
}
SOURCE_BADGE_CLASS = {
    "TechCrunch": "badge-tc",
    "The Verge":  "badge-vg",
    "YourStory":  "badge-ys",
}
CONF_COLOR = lambda c: "#22c55e" if c > 0.8 else "#e3b341" if c > 0.6 else "#6e7681"


# ── Data loading (cached 15 min) ───────────────────────────────────────────────
@st.cache_data(ttl=900, show_spinner=False)
def load_articles() -> list[dict]:
    arts = fetch_articles(max_per_feed=10)
    arts = classify_articles(arts)
    return arts


# ── Terminal header ────────────────────────────────────────────────────────────
st.markdown("""
<div class="tnt-header">
  <span class="tnt-logo">TNT</span>
  <span class="tnt-title">TECH NEWS TERMINAL</span>
  <span class="tnt-live"><span class="tnt-live-dot"></span>LIVE</span>
</div>
""", unsafe_allow_html=True)

st.caption(
    "Live headlines from **TechCrunch · The Verge · YourStory** &nbsp;·&nbsp; "
    "Classified by `facebook/bart-large-mnli` &nbsp;·&nbsp; "
    "Summarised by **Llama 3.3 70B via Groq**"
)

# Refresh button
col_btn, col_space = st.columns([1, 9])
with col_btn:
    if st.button("↺  REFRESH", help="Clear cache and reload the latest articles"):
        st.cache_data.clear()
        st.rerun()

# ── Load data ──────────────────────────────────────────────────────────────────
with st.status("Fetching live RSS feeds and classifying…", expanded=False) as status:
    articles = load_articles()
    status.update(
        label=f"✓  {len(articles)} articles loaded — auto-refreshes every 15 min",
        state="complete",
    )

if not articles:
    st.error("Could not fetch any articles. Check your internet connection.")
    st.stop()

# ── Metrics bar ────────────────────────────────────────────────────────────────
counts = {cat: sum(1 for a in articles if a["category"] == cat) for cat in CATEGORIES}
avg_conf = sum(a.get("confidence", 0) for a in articles) / max(len(articles), 1)

metric_cols = st.columns(len(CATEGORIES) + 1)
for col, (cat, count) in zip(metric_cols, counts.items()):
    short = CATEGORY_ICONS[cat]
    col.metric(short, count)
metric_cols[-1].metric("AVG CONF", f"{avg_conf:.0%}")

st.markdown("<hr/>", unsafe_allow_html=True)

# ── Tabs ───────────────────────────────────────────────────────────────────────
tab_labels = ["ALL  " + str(len(articles))] + [
    f"{CATEGORY_ICONS[c]}  {counts[c]}" for c in CATEGORIES
]
tabs = st.tabs(tab_labels)


def render_tab(tab, article_list: list[dict]) -> None:
    with tab:
        if not article_list:
            st.info("No articles in this category.")
            return

        for art in article_list:
            conf = art.get("confidence", 0.0)
            cat_color = CATEGORY_COLORS.get(art["category"], "#6e7681")
            src_class = SOURCE_BADGE_CLASS.get(art["source"], "badge-tc")
            conf_color = CONF_COLOR(conf)
            conf_pct = int(conf * 100)
            cat_short = CATEGORY_ICONS.get(art["category"], "TECH")

            with st.container(border=True):
                title_col, meta_col = st.columns([8, 2])

                with title_col:
                    st.markdown(
                        f'<p class="art-title"><a href="{art["link"]}" target="_blank">'
                        f'{art["title"]}</a></p>',
                        unsafe_allow_html=True,
                    )

                    # Confidence bar
                    st.markdown(
                        f"""
                        <div class="conf-bar-wrap">
                            <div class="conf-bar-bg">
                                <div class="conf-bar-fill" style="width:{conf_pct}%;background:{conf_color};"></div>
                            </div>
                            <span class="conf-label" style="color:{conf_color};">{conf_pct}%</span>
                            <span class="conf-label" style="color:#404040;">CONFIDENCE</span>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )

                    st.caption(
                        f'<span style="color:{cat_color};font-weight:600;">{cat_short}</span>'
                        f' &nbsp;·&nbsp; {art["published"]}',
                        unsafe_allow_html=True,
                    )

                with meta_col:
                    st.markdown(
                        f'<div style="text-align:right;padding-top:4px;">'
                        f'<span class="badge {src_class}">{art["source"]}</span>'
                        f'</div>',
                        unsafe_allow_html=True,
                    )

                with st.expander("💡 AI Summary  (Llama 3.3 70B · Groq)"):
                    with st.spinner("Generating summary…"):
                        summary_text = summarize(art["title"], art["content"])
                    st.markdown(summary_text)
                    st.markdown(
                        f'<a href="{art["link"]}" target="_blank" '
                        f'style="color:#f97316;font-size:0.8rem;">→ Read full article</a>',
                        unsafe_allow_html=True,
                    )


# Render all tabs
render_tab(tabs[0], articles)
for i, cat in enumerate(CATEGORIES):
    render_tab(tabs[i + 1], [a for a in articles if a["category"] == cat])

# ── Status bar ─────────────────────────────────────────────────────────────────
st.markdown(
    f"""
    <div class="status-bar">
        CLASSIFIER: <span>facebook/bart-large-mnli (zero-shot NLI)</span>
        &nbsp;·&nbsp;
        SUMMARISER: <span>Groq — llama-3.3-70b-versatile</span>
        &nbsp;·&nbsp;
        FEEDS: <span style="color:#3fb950;">TechCrunch</span>
        <span style="color:#f97316;">The Verge</span>
        <span style="color:#bc8cff;">YourStory</span>
        &nbsp;·&nbsp;
        SMAI A3 · T9.3 · <span style="color:#f97316;">Yoraha Creations</span>
    </div>
    """,
    unsafe_allow_html=True,
)

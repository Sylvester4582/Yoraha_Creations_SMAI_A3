import streamlit as st
from dotenv import load_dotenv

load_dotenv()

from rss_fetcher import fetch_articles
from classifier import classify_articles, CATEGORIES
from summarizer import summarize

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Tech News Tracker",
    page_icon="📡",
    layout="wide",
)

# ── Constants ─────────────────────────────────────────────────────────────────
CATEGORY_ICONS = {
    "AI & Machine Learning": "🤖",
    "Startups & Business": "💼",
    "Gadgets & Hardware": "📱",
    "Software & Apps": "💻",
    "General Tech": "📰",
}

SOURCE_COLORS = {
    "TechCrunch": "#00A651",
    "The Verge": "#FF6900",
    "YourStory": "#6366f1",
}

# ── Caching ───────────────────────────────────────────────────────────────────
@st.cache_data(ttl=900, show_spinner=False)
def load_articles() -> list[dict]:
    """Fetch RSS feeds and classify articles. Cached for 15 minutes."""
    arts = fetch_articles(max_per_feed=10)
    arts = classify_articles(arts)
    return arts


# ── Header ────────────────────────────────────────────────────────────────────
st.title("📡 Tech News Tracker")
st.caption(
    "Live headlines from **TechCrunch · The Verge · YourStory** "
    "· Classified by `facebook/bart-large-mnli` "
    "· Summarized by **Llama 3.3 70B via Groq**"
)

col_btn, col_spacer = st.columns([1, 9])
with col_btn:
    if st.button("🔄 Refresh", help="Clear cache and reload the latest articles"):
        st.cache_data.clear()
        st.rerun()

# ── Load data ─────────────────────────────────────────────────────────────────
with st.status("Loading tech news…", expanded=False) as status:
    articles = load_articles()
    status.update(
        label=f"✅ {len(articles)} articles loaded — auto-refreshes every 15 min",
        state="complete",
    )

if not articles:
    st.error("Could not fetch any articles. Check your internet connection and try again.")
    st.stop()

# ── Category distribution bar ─────────────────────────────────────────────────
counts = {cat: sum(1 for a in articles if a["category"] == cat) for cat in CATEGORIES}
cols = st.columns(len(CATEGORIES))
for col, (cat, count) in zip(cols, counts.items()):
    col.metric(f"{CATEGORY_ICONS[cat]} {cat.split(' &')[0]}", count)

st.divider()

# ── Tabs ──────────────────────────────────────────────────────────────────────
tab_labels = ["🌐 All"] + [
    f"{CATEGORY_ICONS[c]} {c}" for c in CATEGORIES
]
tabs = st.tabs(tab_labels)


def render_tab(tab, article_list: list[dict]) -> None:
    with tab:
        if not article_list:
            st.info("No articles in this category yet.")
            return

        for art in article_list:
            with st.container(border=True):
                title_col, source_col = st.columns([7, 1])

                with title_col:
                    st.markdown(f"#### [{art['title']}]({art['link']})")

                with source_col:
                    color = SOURCE_COLORS.get(art["source"], "#888")
                    st.markdown(
                        f'<p style="color:{color};font-size:0.8rem;font-weight:700;'
                        f'text-align:right;margin:0;padding-top:8px">{art["source"]}</p>',
                        unsafe_allow_html=True,
                    )

                icon = CATEGORY_ICONS.get(art["category"], "📰")
                st.caption(f"{icon} {art['category']}  ·  {art['published']}")

                with st.expander("📋 AI Summary (Llama 3.3 70B via Groq)"):
                    with st.spinner("Generating summary…"):
                        summary_text = summarize(art["title"], art["content"])
                    st.markdown(summary_text)
                    st.markdown(
                        f'<a href="{art["link"]}" target="_blank">🔗 Read full article →</a>',
                        unsafe_allow_html=True,
                    )


# Render all tabs
render_tab(tabs[0], articles)
for i, cat in enumerate(CATEGORIES):
    render_tab(tabs[i + 1], [a for a in articles if a["category"] == cat])

# ── Footer ────────────────────────────────────────────────────────────────────
st.divider()
st.caption(
    "SMAI Assignment 3 · **T9.3 Tech News Tracker** · Tier 1 · "
    "Zero-shot classifier: `facebook/bart-large-mnli` · "
    "Summarizer: Llama 3.3 70B via Groq · "
    "Feeds: TechCrunch, The Verge, YourStory"
)

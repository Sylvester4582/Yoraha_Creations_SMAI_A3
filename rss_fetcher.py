import feedparser
import re

FEEDS = {
    "TechCrunch": "https://techcrunch.com/feed/",
    "The Verge": "https://www.theverge.com/rss/index.xml",
    "YourStory": "https://yourstory.com/feed",
}

def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", " ", text).strip()

def _get_content(entry) -> str:
    if hasattr(entry, "content") and entry.content:
        return entry.content[0].get("value", "")
    return getattr(entry, "summary", "") or ""

def fetch_articles(max_per_feed: int = 10) -> list[dict]:
    """Fetch articles from all three RSS feeds, return newest-first, capped at 30."""
    articles = []
    for source, url in FEEDS.items():
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:max_per_feed]:
                raw = _get_content(entry)
                sort_time = (
                    entry.get("published_parsed")
                    or entry.get("updated_parsed")
                    or (0,) * 9
                )
                articles.append({
                    "title": (entry.get("title") or "Untitled").strip(),
                    "link": entry.get("link", "#"),
                    "source": source,
                    "content": _strip_html(raw)[:3000],
                    "published": entry.get("published", entry.get("updated", "Unknown date")),
                    "_sort_time": sort_time,
                    "category": "General Tech",
                })
        except Exception as exc:
            print(f"[RSS] Failed to fetch {source}: {exc}")

    articles.sort(key=lambda a: a["_sort_time"], reverse=True)
    result = articles[:30]
    for a in result:
        del a["_sort_time"]
    return result

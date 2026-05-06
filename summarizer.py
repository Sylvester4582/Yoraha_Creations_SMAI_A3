import os
import time
import streamlit as st

_MODEL = "llama-3.3-70b-versatile"

_PROMPT = (
    "Summarize the following tech news article in exactly 3 concise bullet points "
    "(one sentence each). Be factual and informative.\n\n"
    "Title: {title}\n\n"
    "Content: {content}\n\n"
    "Format your response as markdown list items:\n- Point one\n- Point two\n- Point three"
)

_last_api_call: float = 0.0
_DELAY_SECONDS: float = 2.5

def _get_api_key() -> str:
    key = os.environ.get("GROQ_API_KEY", "")
    if key:
        return key
    try:
        return st.secrets.get("GROQ_API_KEY", "")
    except Exception:
        return ""

@st.cache_data(ttl=3600, show_spinner=False)
def summarize(title: str, content: str) -> str:
    """3-bullet Groq/Llama summary, cached per (title, content) for 1 hour."""
    global _last_api_call

    api_key = _get_api_key()
    if not api_key:
        return "*`GROQ_API_KEY` not configured - add it to `.env`.*"
    if not content or len(content.strip()) < 40:
        return "*Not enough article content to summarize.*"

    elapsed = time.time() - _last_api_call
    wait = _DELAY_SECONDS - elapsed
    if _last_api_call > 0 and wait > 0:
        time.sleep(wait)

    from groq import Groq

    client = Groq(api_key=api_key)
    prompt = _PROMPT.format(title=title, content=content[:3000])

    try:
        _last_api_call = time.time()
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=256,
        )
        text = response.choices[0].message.content.strip()
        text = text.replace("*", "-")
        return text
    except Exception as exc:
        print(f"DEBUG [{_MODEL}]: {exc}")
        err = str(exc)

    if "429" in err or "rate_limit" in err.lower():
        return (
            "*Rate limit hit. Wait a moment then expand again - "
            "cached results won't re-call the API.*"
        )
    if "401" in err or "invalid_api_key" in err.lower():
        return "*Invalid GROQ_API_KEY - check your `.env` file.*"
    return f"*Groq API error: {err}*"

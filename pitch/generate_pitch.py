"""
Run this script to generate the one-slide LinkedIn pitch PNG.
    python pitch/generate_pitch.py
Output: pitch/pitch_slide.png
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import os

# ── Palette ───────────────────────────────────────────────────────────────────
BG       = "#0f172a"   # dark navy
CARD     = "#1e293b"   # card surface
ACCENT   = "#6366f1"   # indigo
ACCENT2  = "#22d3ee"   # cyan
GREEN    = "#4ade80"
WHITE    = "#f1f5f9"
MUTED    = "#94a3b8"

fig = plt.figure(figsize=(16, 9), facecolor=BG)
ax  = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 16)
ax.set_ylim(0, 9)
ax.axis("off")
ax.set_facecolor(BG)


def card(x, y, w, h, color=CARD, radius=0.25, alpha=1.0):
    patch = FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad=0,rounding_size={radius}",
        linewidth=0, facecolor=color, alpha=alpha,
    )
    ax.add_patch(patch)


def hline(x, y, w, color=ACCENT, lw=3):
    ax.plot([x, x + w], [y, y], color=color, linewidth=lw, solid_capstyle="round")


# ── Background accent bar ─────────────────────────────────────────────────────
card(0, 8.4, 16, 0.6, color=ACCENT)
ax.text(8, 8.7, "SMAI Assignment 3 · T9.3 · Tier 1 · IIIT Hyderabad 2025–26",
        ha="center", va="center", fontsize=11, color=WHITE, fontweight="bold")

# ── Title ─────────────────────────────────────────────────────────────────────
ax.text(0.5, 7.9, "📡", fontsize=38, va="center")
ax.text(1.5, 8.05, "Tech News Tracker", fontsize=36, va="center",
        color=WHITE, fontweight="bold", fontfamily="monospace")
ax.text(1.5, 7.65, "Live · Classified · Summarized", fontsize=15,
        va="center", color=ACCENT2)

# ── Divider ───────────────────────────────────────────────────────────────────
hline(0.4, 7.45, 15.2, color=ACCENT, lw=1.5)

# ── LEFT — Problem & Solution ─────────────────────────────────────────────────
card(0.4, 3.8, 5.0, 3.5, color=CARD)

ax.text(0.75, 7.15, "The Problem", fontsize=13, color=ACCENT, fontweight="bold")
ax.text(0.75, 6.75,
        "Keeping up with tech news means\n"
        "juggling dozens of tabs across\n"
        "TechCrunch, The Verge & YourStory\n"
        "— manually, every day.",
        fontsize=11, color=MUTED, va="top", linespacing=1.6)

hline(0.75, 5.25, 4.3, color=ACCENT2, lw=1.2)

ax.text(0.75, 5.1, "The Solution", fontsize=13, color=ACCENT2, fontweight="bold")
bullets = [
    "🔄  One app, 3 feeds, 30 freshest articles on load",
    "🤖  Zero-shot classification into 5 tech subcategories",
    "✨  3-bullet AI summary per article (Llama 3.3 70B via Groq)",
]
for i, b in enumerate(bullets):
    ax.text(0.75, 4.65 - i * 0.45, b, fontsize=11, color=WHITE, va="top")

# ── MIDDLE — Tech Stack ───────────────────────────────────────────────────────
card(6.0, 3.8, 4.2, 3.5, color=CARD)
ax.text(6.3, 7.15, "Tech Stack", fontsize=13, color=ACCENT, fontweight="bold")

stack = [
    ("RSS Parsing",      "feedparser",              WHITE),
    ("Classification",   "bart-large-mnli (zero-shot)", ACCENT2),
    ("Summarization",    "Llama 3.3 70B (Groq)",    GREEN),
    ("Frontend",         "Streamlit",               "#f97316"),
    ("Caching",          "st.cache_data / resource",MUTED),
]
for i, (label, tool, color) in enumerate(stack):
    y_ = 6.75 - i * 0.55
    ax.text(6.3,  y_, f"{label}:", fontsize=10, color=MUTED, va="top")
    ax.text(9.9,  y_, tool,        fontsize=10, color=color, va="top",
            ha="right", fontweight="bold")

# ── RIGHT — Key Stats ─────────────────────────────────────────────────────────
card(10.8, 3.8, 4.8, 3.5, color=CARD)
ax.text(11.1, 7.15, "Key Stats", fontsize=13, color=ACCENT, fontweight="bold")

stats = [
    ("30",  "articles per load"),
    ("3",   "live RSS sources"),
    ("5",   "tech subcategories"),
    ("15m", "cache refresh TTL"),
    ("0",   "labelled examples needed"),
]
for i, (val, desc) in enumerate(stats):
    y_ = 6.7 - i * 0.6
    card(11.0, y_ - 0.08, 1.0, 0.42, color=ACCENT, radius=0.12)
    ax.text(11.5, y_ + 0.13, val,  ha="center", va="center",
            fontsize=16, color=WHITE, fontweight="bold")
    ax.text(12.15, y_ + 0.13, desc, va="center", fontsize=10, color=MUTED)

# ── BOTTOM — Pipeline diagram ─────────────────────────────────────────────────
card(0.4, 0.4, 15.2, 3.2, color=CARD)

ax.text(8, 3.4, "End-to-End Pipeline", fontsize=12, color=MUTED,
        ha="center", fontweight="bold")

steps = [
    ("📡\nRSS Feeds",          0.9,  "#334155"),
    ("🔍\nfeedparser\nparse",   3.0,  "#334155"),
    ("🤖\nbart-large\n-mnli",   5.1,  ACCENT),
    ("✨\nLlama 3.3\n70B Groq", 7.2,  "#065f46"),
    ("🖥️\nStreamlit\nUI",       9.3,  "#334155"),
    ("👤\nUser\nReads",        11.4,  "#334155"),
]
for label, x, color in steps:
    card(x, 0.65, 1.8, 2.1, color=color, radius=0.18)
    ax.text(x + 0.9, 1.73, label, ha="center", va="center",
            fontsize=9.5, color=WHITE, linespacing=1.4)

for x in [2.7, 4.8, 6.9, 9.0, 11.1]:
    ax.annotate("", xy=(x + 0.3, 1.73), xytext=(x, 1.73),
                arrowprops=dict(arrowstyle="->", color=ACCENT2, lw=2))

# ── Footer ────────────────────────────────────────────────────────────────────
ax.text(8, 0.18, "Yoraha Creations  ·  github.com/<your-repo>  ·  Deployed on Streamlit Community Cloud",
        ha="center", va="center", fontsize=9, color=MUTED)

# ── Save ──────────────────────────────────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), "pitch_slide.png")
plt.savefig(out_path, dpi=180, bbox_inches="tight", facecolor=BG)
print(f"Saved → {out_path}")
plt.show()

"""
Run this script to generate the one-slide LinkedIn pitch PNG.
    python pitch/generate_pitch.py
Output: pitch/pitch_slide.png
"""

import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
import os

BG     = "#080808"
CARD   = "#111111"
BORDER = "#1e1e1e"
ORANGE = "#f97316"
GREEN  = "#22c55e"
BLUE   = "#58a6ff"
WHITE  = "#d4d4d4"
MUTED  = "#737373"
DIM    = "#404040"

fig = plt.figure(figsize=(16, 9), facecolor=BG)
ax  = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, 16)
ax.set_ylim(0, 9)
ax.axis("off")
ax.set_facecolor(BG)


def card(x, y, w, h, color=CARD, radius=0.18, edgecolor=BORDER, lw=1.0):
    patch = FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad=0,rounding_size={radius}",
        linewidth=lw, facecolor=color, edgecolor=edgecolor,
    )
    ax.add_patch(patch)


def hline(x, y, w, color=ORANGE, lw=1.5):
    ax.plot([x, x + w], [y, y], color=color, linewidth=lw, solid_capstyle="round")


# ── Top bar ───────────────────────────────────────────────────────────────────
card(0, 8.55, 16, 0.45, color=ORANGE, radius=0, edgecolor=ORANGE)
ax.text(8, 8.77,
        "SMAI Assignment 3  ·  T9.3 Tier 1  ·  IIIT Hyderabad 2025–26  ·  Yoraha Creations",
        ha="center", va="center", fontsize=10, color="#080808", fontweight="bold",
        fontfamily="monospace")

# ── Title block ───────────────────────────────────────────────────────────────
ax.text(0.5, 8.3, "TNT", fontsize=14, va="center", color=ORANGE,
        fontweight="bold", fontfamily="monospace",
        bbox=dict(boxstyle="square,pad=0.3", facecolor=BG, edgecolor=ORANGE, lw=1.5))

ax.text(1.45, 8.35, "TECH NEWS TERMINAL", fontsize=22, va="center",
        color=WHITE, fontweight="bold", fontfamily="monospace")
ax.text(1.45, 8.05, "Live  ·  Zero-Shot Classified  ·  LLM-Summarised", fontsize=11,
        va="center", color=MUTED, fontfamily="monospace")

ax.text(15.6, 8.35, "LIVE", fontsize=9, va="center", ha="right",
        color=GREEN, fontweight="bold", fontfamily="monospace")

hline(0.4, 7.88, 15.2, color=DIM, lw=1)

# ── LEFT — Problem & Solution ─────────────────────────────────────────────────
card(0.4, 3.85, 4.9, 3.85)

ax.text(0.72, 7.55, "THE PROBLEM", fontsize=10, color=ORANGE,
        fontweight="bold", fontfamily="monospace")
ax.text(0.72, 7.2,
        "Keeping up with tech news means\n"
        "juggling dozens of tabs across\n"
        "TechCrunch, The Verge & YourStory\n"
        "— manually, every single day.",
        fontsize=10.5, color=MUTED, va="top", linespacing=1.65)

hline(0.72, 5.6, 4.2, color=DIM, lw=1)

ax.text(0.72, 5.45, "THE SOLUTION", fontsize=10, color=GREEN,
        fontweight="bold", fontfamily="monospace")
bullets = [
    ("↺", "One app — 30 freshest headlines on load"),
    ("◆", "Zero-shot classification, 5 subcategories"),
    ("≡", "3-bullet AI summary per article via Groq"),
]
for i, (sym, text) in enumerate(bullets):
    y_ = 5.05 - i * 0.46
    ax.text(0.72, y_, sym,  fontsize=10, color=ORANGE, va="top", fontfamily="monospace")
    ax.text(1.05, y_, text, fontsize=10, color=WHITE,  va="top")

# ── MIDDLE — Tech Stack ───────────────────────────────────────────────────────
card(5.9, 3.85, 4.3, 3.85)
ax.text(6.2, 7.55, "TECH STACK", fontsize=10, color=ORANGE,
        fontweight="bold", fontfamily="monospace")

stack = [
    ("RSS Parsing",     "feedparser",               WHITE),
    ("Classification",  "bart-large-mnli",          BLUE),
    ("LLM Summary",     "Llama 3.3 70B · Groq",     GREEN),
    ("Frontend",        "Streamlit",                ORANGE),
    ("Deployment",      "HuggingFace Spaces",       "#bc8cff"),
    ("Caching",         "st.cache_data / resource", MUTED),
]
for i, (label, tool, color) in enumerate(stack):
    y_ = 7.08 - i * 0.52
    ax.text(6.2,  y_, label + ":", fontsize=9.5, color=MUTED, va="top")
    ax.text(10.0, y_, tool,        fontsize=9.5, color=color, va="top",
            ha="right", fontweight="bold")

# ── RIGHT — Key Stats ─────────────────────────────────────────────────────────
card(10.8, 3.85, 4.8, 3.85)
ax.text(11.1, 7.55, "KEY STATS", fontsize=10, color=ORANGE,
        fontweight="bold", fontfamily="monospace")

stats = [
    ("30",    "articles per load",         ORANGE),
    ("3",     "live RSS sources",          BLUE),
    ("5",     "tech subcategories",        GREEN),
    ("90.7%", "zero-shot accuracy",        "#e3b341"),
    ("0",     "labelled examples needed",  MUTED),
]
for i, (val, desc, color) in enumerate(stats):
    y_ = 6.95 - i * 0.58
    card(11.0, y_ - 0.06, 1.1, 0.4, color="#1a1a1a", edgecolor=color, lw=1.2)
    ax.text(11.55, y_ + 0.14, val,  ha="center", va="center",
            fontsize=13, color=color, fontweight="bold", fontfamily="monospace")
    ax.text(12.2, y_ + 0.14, desc, va="center", fontsize=9.5, color=MUTED)

# ── BOTTOM — Pipeline ─────────────────────────────────────────────────────────
card(0.4, 0.35, 15.2, 3.3)
ax.text(8, 3.48, "END-TO-END PIPELINE", fontsize=10, color=MUTED,
        ha="center", fontweight="bold", fontfamily="monospace")

steps = [
    ("RSS\nFeeds",          0.85,  DIM,    WHITE),
    ("feedparser\nparse",   3.0,   DIM,    WHITE),
    ("bart-large\n-mnli",   5.15,  "#1a2a1a", GREEN),
    ("Llama 3.3\n70B Groq", 7.3,   "#1a1a2a", BLUE),
    ("Streamlit\nUI",       9.45,  "#1a1510", ORANGE),
    ("Reader",             11.6,   DIM,    WHITE),
]
for label, x, bg, fg in steps:
    card(x, 0.62, 1.9, 2.0, color=bg, edgecolor=BORDER)
    ax.text(x + 0.95, 1.65, label, ha="center", va="center",
            fontsize=9.5, color=fg, linespacing=1.5, fontfamily="monospace")

for x in [2.75, 4.9, 7.05, 9.2, 11.35]:
    ax.annotate("", xy=(x + 0.25, 1.65), xytext=(x, 1.65),
                arrowprops=dict(arrowstyle="->", color=ORANGE, lw=1.8))

# ── Footer ────────────────────────────────────────────────────────────────────
hline(0.4, 0.28, 15.2, color=DIM, lw=1)
ax.text(0.4, 0.14,
        "Vidvathama R (2024122002)  ·  Snehil Sanjog (2023102051)  ·  Sarvesh Takbhate (2023102039)",
        va="center", fontsize=8.5, color=MUTED, fontfamily="monospace")
ax.text(15.6, 0.14,
        "huggingface.co/spaces/SylvesterSsj/tech-news-terminal",
        va="center", ha="right", fontsize=8.5, color=ORANGE, fontfamily="monospace")

# ── Save ──────────────────────────────────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), "pitch_slide.png")
plt.savefig(out_path, dpi=180, bbox_inches="tight", facecolor=BG)
print(f"Saved: {out_path}")
plt.show()

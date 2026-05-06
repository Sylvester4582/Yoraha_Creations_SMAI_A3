# Tech News Terminal — Setup Guide

> Bloomberg-terminal-styled live tech news dashboard · SMAI Assignment 3 · T9.3

---

## Quick Start (3 steps)

```bash
# 1. Go into the web folder
cd web

# 2. Install packages
npm install

# 3. Add your Groq API key (see section below), then run:
npm run dev
```

Open **http://localhost:3000** — you should see the animated home page.

---

## Step-by-Step: Adding Your Groq API Key

The app needs a Groq API key to generate AI summaries. Without it, the app still works — summaries just show an error message.

**1.** Open the file `web/.env.local` in any text editor.

**2.** You'll see this line:
```
GROQ_API_KEY=PASTE_YOUR_GROQ_KEY_HERE
```

**3.** Replace `PASTE_YOUR_GROQ_KEY_HERE` with your actual key, like this:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**4.** Save the file. Restart the dev server (`Ctrl+C`, then `npm run dev`).

**How to get a free Groq key:**
- Go to https://console.groq.com
- Sign up for free (no credit card)
- Click **API Keys** → **Create API Key**
- Copy the key starting with `gsk_`

---

## Full File Structure

```
web/
│
├── .env.local                ← YOUR API KEYS GO HERE (never committed to git)
├── .env.local.example        ← Template showing what keys are needed
├── SETUP.md                  ← This file
│
├── package.json              ← npm dependencies list
├── tsconfig.json             ← TypeScript compiler settings
├── next.config.mjs           ← Next.js configuration
├── tailwind.config.ts        ← Tailwind CSS custom colors, fonts, animations
├── postcss.config.mjs        ← PostCSS (required by Tailwind)
│
├── app/                      ← All pages (Next.js App Router)
│   │
│   ├── globals.css           ← Global styles: JetBrains Mono font, scrollbars,
│   │                            scanline overlay, vignette, terminal glow
│   │
│   ├── layout.tsx            ← Root layout — wraps every page with the font,
│   │                            dark background, scanline, and vignette
│   │
│   ├── page.tsx              ← HOME PAGE  (route: /)
│   │                            Animated hero with matrix rain, typing effect,
│   │                            counting stats, glowing CTA button
│   │
│   ├── terminal/
│   │   └── page.tsx          ← NEWS TERMINAL PAGE  (route: /terminal)
│   │                            3-column Bloomberg terminal layout
│   │                            Left: category + source filter
│   │                            Center: scrollable article table
│   │                            Right: live metrics or AI summary
│   │
│   ├── contact/
│   │   └── page.tsx          ← CONTACT PAGE  (route: /contact)
│   │                            Creator credits (Vidvathama R), tech stack,
│   │                            project info
│   │
│   └── api/
│       ├── articles/
│       │   └── route.ts      ← GET /api/articles
│       │                        Fetches RSS feeds → classifies → returns JSON
│       │                        Cache-Control: 15 minutes
│       │
│       └── summarize/
│           └── route.ts      ← POST /api/summarize
│                                Body: { title, content }
│                                Calls Groq API → returns 3-bullet summary
│
├── components/               ← Reusable UI building blocks
│   │
│   ├── MatrixBackground.tsx  ← Canvas-based matrix rain animation
│   │                            Used on home + contact pages as background
│   │
│   ├── TickerTape.tsx        ← Scrolling headline ticker at top of terminal
│   │                            GSAP infinite horizontal loop
│   │
│   ├── TerminalHeader.tsx    ← Top bar of the terminal
│   │                            Logo + GSAP typing effect, live indicator,
│   │                            clock, refresh button, nav links
│   │
│   ├── CategoryFilter.tsx    ← Left sidebar of the terminal
│   │                            Category + source toggles
│   │                            GSAP bar + counter animations
│   │
│   ├── NewsTable.tsx         ← Center panel — the main article table
│   │                            Column headers, scrollable rows,
│   │                            GSAP stagger animation when rows appear
│   │
│   ├── ArticleRow.tsx        ← Single row in the article table
│   │                            GSAP hover border sweep, confidence bar,
│   │                            selected/unselected states
│   │
│   ├── SummaryPanel.tsx      ← Right panel when an article is selected
│   │                            Fetches Groq summary on demand,
│   │                            GSAP slide-in + staggered bullet animations
│   │
│   ├── MetricsBar.tsx        ← Right panel default view
│   │                            Category + source distribution bars,
│   │                            GSAP counter and bar-fill animations
│   │
│   └── StatusBar.tsx         ← Bottom bar of the terminal
│                                Model info, feed status, last fetch time
│
├── lib/                      ← Business logic (server-side only)
│   │
│   ├── rss.ts                ← RSS feed parser
│   │                            Fetches TechCrunch, The Verge, YourStory
│   │                            Strips HTML, sorts by date, caps at 30
│   │
│   ├── classifier.ts         ← Zero-shot article classifier (keyword-based)
│   │                            Scores title + first 300 chars of content
│   │                            Returns category + confidence 0–1
│   │
│   └── summarizer.ts         ← Groq LLM summarizer
│                                Calls llama-3.3-70b-versatile via Groq API
│                                Returns 3 bullet points
│
└── types/
    └── article.ts            ← TypeScript interfaces + constants
                                 Article, Category, SourceName types
                                 COLOR_MAPS for sources and categories
```

---

## How Data Flows

```
User opens /terminal
        │
        ▼
app/terminal/page.tsx calls GET /api/articles
        │
        ▼
api/articles/route.ts
    ├── lib/rss.ts          fetches 10 articles × 3 feeds = 30 max
    └── lib/classifier.ts   classifies each article by keywords
        │
        ▼
Returns JSON: { articles: [...], fetchedAt: "...", total: 30 }
        │
        ▼
Renders in NewsTable with GSAP stagger animation
        │
User clicks an article row
        │
        ▼
SummaryPanel calls POST /api/summarize
        │
        ▼
api/summarize/route.ts → lib/summarizer.ts → Groq API
        │
        ▼
Returns { summary: "• Point 1\n• Point 2\n• Point 3" }
        │
        ▼
Rendered as animated bullet points in SummaryPanel
```

---

## RSS Feeds

| Source | Feed URL |
|---|---|
| TechCrunch | https://techcrunch.com/feed/ |
| The Verge | https://www.theverge.com/rss/index.xml |
| YourStory | https://yourstory.com/feed |

---

## Classification Categories

| Short | Full Name | Color |
|---|---|---|
| AI | AI & Machine Learning | Blue |
| BIZ | Startups & Business | Green |
| HW | Gadgets & Hardware | Amber |
| SW | Software & Apps | Purple |
| TECH | General Tech | Gray |

---

## Environment Variables

| Variable | Required | What It Does |
|---|---|---|
| `GROQ_API_KEY` | YES | Powers the AI summaries (llama-3.3-70b) |
| `HF_API_KEY` | No | Optional HuggingFace Inference API access |

---

## Deploying to Vercel

1. Push the `web/` folder contents to a GitHub repo
2. Go to https://vercel.com → New Project → import the repo
3. Set **Root Directory** to `web`
4. Add environment variable: `GROQ_API_KEY` = your Groq key
5. Click Deploy

The app auto-deploys on every push to `main`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS properties |
| Animations | GSAP 3.12 + @gsap/react (TextPlugin) |
| RSS Parsing | rss-parser (server-side only) |
| Summarization | Groq API — llama-3.3-70b-versatile |
| Classification | Keyword-based (client-safe, instant) |
| Font | JetBrains Mono (Google Fonts) |
| Deployment | Vercel |

---

## Assignment Info

- **Course:** SMAI (Statistical Methods in AI) · Semester 6
- **Assignment:** A3 · Task T9.3 — Tech News Tracker (Tier 1)
- **Creator:** Vidvathama R · IIIT Hyderabad
- **Team:** Yoraha Creations

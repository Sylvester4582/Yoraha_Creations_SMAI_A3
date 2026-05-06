# project_specs.md — Tech News Terminal

## What the app does
A Bloomberg-terminal-styled live tech-news dashboard. It fetches up to 30 headlines from TechCrunch, The Verge, and YourStory via RSS, zero-shot classifies each into one of five tech categories, and generates 3-bullet LLM summaries on demand. The interface mimics a trading terminal: dense, monospace, dark, data-rich, with tasteful GSAP animations.

## Who uses it
SMAI Assignment reviewers + general public (LinkedIn demo). Non-technical viewers should immediately understand "live tech news, AI-classified".

## Tech stack
| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | GSAP 3 + @gsap/react (TextPlugin) |
| RSS parsing | rss-parser (Node.js API routes only) |
| Classification | Keyword-based classifier (fast) + optional HuggingFace Inference API |
| Summarization | Groq API — llama-3.3-70b-versatile |
| Deployment | Vercel |
| Env vars | GROQ_API_KEY, HF_API_KEY (optional) |

## Pages & user flows
- `/` — Full terminal dashboard (single page, no auth)
  - Ticker tape auto-scrolls on load
  - Boot animation sequence on first render
  - Category filter in left sidebar
  - Sortable article table in center
  - Metrics + summary panel on right
  - Auto-refresh every 15 minutes

## Data models
```typescript
interface Article {
  id: string;
  title: string;
  link: string;
  published: string;       // ISO timestamp
  source: "TechCrunch" | "The Verge" | "YourStory";
  category: Category;
  confidence: number;      // 0–1
  content: string;         // first 3000 chars, HTML stripped
}
type Category = "AI & Machine Learning" | "Startups & Business" | "Gadgets & Hardware" | "Software & Apps" | "General Tech";
```

## API routes
- `GET /api/articles` — fetches + classifies 30 articles (15-min cache via Cache-Control)
- `POST /api/summarize` — body: `{title, content}` → 3-bullet Groq summary

## Design tokens (Bloomberg Terminal aesthetic)
- Background: `#080808`
- Panel: `#0d0d0d`
- Border: `#1a1a1a`
- Text primary: `#d4d4d4`
- Text secondary: `#737373`
- Bloomberg orange (accent): `#f97316`
- Green / Red: `#22c55e` / `#ef4444`
- Font: JetBrains Mono (Google Fonts)

## GSAP animation plan
1. Boot timeline — header types in, panels slide in, rows stagger in
2. Ticker tape — infinite horizontal scroll
3. Metrics counter — numbers count up from 0
4. Category switch — rows fade out then stagger back in
5. Summary panel — slides in from right
6. Live indicator — pulsing orange dot
7. Cursor blink — header blinking cursor
8. Row hover — instant border-left accent color

## Done means
- `npm run build` passes with 0 TypeScript errors
- All 3 RSS feeds load in the browser
- Category filters work
- Clicking a row fetches and displays a Groq summary
- GSAP boot sequence runs on first load
- Ticker tape scrolls continuously
- Metrics count up on load

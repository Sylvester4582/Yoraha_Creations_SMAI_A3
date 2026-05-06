import type { Category } from "@/types/article";

const KEYWORDS: Record<Category, string[]> = {
  "AI & Machine Learning": [
    "ai", "artificial intelligence", "machine learning", "deep learning",
    "neural", "gpt", "llm", "chatgpt", "openai", "anthropic", "gemini",
    "claude", "llama", "model", "training", "inference", "transformer",
    "generative", "chatbot", "diffusion", "robotics", "automation",
    "algorithm", "dataset", "benchmark", "rag", "fine-tun",
  ],
  "Startups & Business": [
    "startup", "funding", "venture", "series a", "series b", "series c",
    "ipo", "acquisition", "merger", "billion", "million", "raised",
    "valuation", "investor", "founder", "ceo", "revenue", "profit",
    "unicorn", "seed", "pre-seed", "layoff", "hire", "employ",
  ],
  "Gadgets & Hardware": [
    "iphone", "android", "phone", "smartphone", "laptop", "tablet",
    "chip", "processor", "gpu", "cpu", "apple", "samsung", "nvidia",
    "intel", "amd", "wearable", "headset", "vr", "ar", "device",
    "hardware", "sensor", "battery", "display", "camera",
  ],
  "Software & Apps": [
    "app", "software", "update", "release", "version", "platform",
    "api", "developer", "open source", "github", "code", "programming",
    "launch", "feature", "browser", "operating system", "windows",
    "macos", "linux", "android", "ios", "plugin", "extension",
  ],
  "General Tech": [],
};

function score(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((n, kw) => n + (lower.includes(kw) ? 1 : 0), 0);
}

export function classifyText(title: string, content: string): { category: Category; confidence: number } {
  const combined = `${title} ${content.slice(0, 300)}`.toLowerCase();

  const scores = (Object.entries(KEYWORDS) as [Category, string[]][]).map(
    ([cat, kws]) => ({ cat, n: score(combined, kws) })
  );

  scores.sort((a, b) => b.n - a.n);
  const best = scores[0];
  const second = scores[1];

  if (best.n === 0) return { category: "General Tech", confidence: 0.5 };

  const total = scores.reduce((s, x) => s + x.n, 0);
  const raw = best.n / total;
  const conf = Math.min(0.5 + raw * 0.5, 0.99);
  const category = best.n > 0 && best.n >= second.n ? best.cat : "General Tech";

  return { category, confidence: parseFloat(conf.toFixed(2)) };
}

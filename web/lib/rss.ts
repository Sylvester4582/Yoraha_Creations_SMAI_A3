import Parser from "rss-parser";
import type { SourceName } from "@/types/article";

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "TechNewsTerminal/1.0" },
});

const FEEDS: Record<SourceName, string> = {
  TechCrunch: "https://techcrunch.com/feed/",
  "The Verge": "https://www.theverge.com/rss/index.xml",
  YourStory: "https://yourstory.com/feed",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getContent(item: Parser.Item): string {
  const raw =
    (item as Record<string, unknown>)["content:encoded"] as string ||
    item.content ||
    item.contentSnippet ||
    item.summary ||
    "";
  return stripHtml(raw).slice(0, 3000);
}

export interface RawArticle {
  title: string;
  link: string;
  source: SourceName;
  content: string;
  published: string;
  sortTime: number;
}

export async function fetchAllFeeds(maxPerFeed = 10): Promise<RawArticle[]> {
  const results = await Promise.allSettled(
    (Object.entries(FEEDS) as [SourceName, string][]).map(
      async ([source, url]) => {
        const feed = await parser.parseURL(url);
        return feed.items.slice(0, maxPerFeed).map((item) => ({
          title: (item.title ?? "Untitled").trim(),
          link: item.link ?? "#",
          source,
          content: getContent(item),
          published: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
          sortTime: item.pubDate
            ? new Date(item.pubDate).getTime()
            : item.isoDate
            ? new Date(item.isoDate).getTime()
            : 0,
        }));
      }
    )
  );

  const articles: RawArticle[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") articles.push(...r.value);
    else console.error("[RSS] feed error:", r.reason);
  }

  return articles.sort((a, b) => b.sortTime - a.sortTime).slice(0, 30);
}

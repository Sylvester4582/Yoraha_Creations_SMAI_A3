import { NextResponse } from "next/server";
import { fetchAllFeeds } from "@/lib/rss";
import { classifyText } from "@/lib/classifier";
import type { Article } from "@/types/article";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

console.log("[/api/articles] route loaded");

export async function GET() {
  console.log("[/api/articles] GET request received");

  try {
    const raw = await fetchAllFeeds(10);

    const articles: Article[] = raw.map((r) => {
      const { category, confidence } = classifyText(r.title, r.content);
      return {
        id: randomUUID(),
        title: r.title,
        link: r.link,
        published: r.published,
        source: r.source,
        category,
        confidence,
        content: r.content,
      };
    });

    console.log(`[/api/articles] returning ${articles.length} articles`);

    return NextResponse.json(
      { articles, fetchedAt: new Date().toISOString(), total: articles.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error("[/api/articles] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch articles", articles: [], total: 0 },
      { status: 500 }
    );
  }
}

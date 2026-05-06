import { NextRequest, NextResponse } from "next/server";
import { summarizeArticle } from "@/lib/summarizer";

console.log("[/api/summarize] route loaded");

export async function POST(req: NextRequest) {
  console.log("[/api/summarize] POST request received");

  try {
    const { title, content } = (await req.json()) as {
      title: string;
      content: string;
    };

    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const summary = await summarizeArticle(title, content ?? "");
    console.log("[/api/summarize] summary generated");

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[/api/summarize] error:", err);
    return NextResponse.json({ error: "Summarization failed" }, { status: 500 });
  }
}

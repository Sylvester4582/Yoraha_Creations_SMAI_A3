"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Article } from "@/types/article";
import { SOURCE_COLORS, CAT_COLORS } from "@/types/article";

interface Props {
  article: Article;
  onClose: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC";
  } catch {
    return iso;
  }
}

export default function SummaryPanel({ article, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slide in on mount
  useGSAP(
    () => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }
      );
    },
    { scope: panelRef }
  );

  // Fetch summary when article changes
  useEffect(() => {
    let cancelled = false;
    setSummary(null);
    setError(null);
    setLoading(true);

    fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: article.title, content: article.content }),
    })
      .then((r) => r.json())
      .then((d: { summary?: string; error?: string }) => {
        if (cancelled) return;
        if (d.summary) setSummary(d.summary);
        else setError(d.error ?? "Unknown error");
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [article.id]);

  const srcColor = SOURCE_COLORS[article.source];
  const catColor = CAT_COLORS[article.category];

  const bullets = summary
    ? summary
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("•"))
    : [];

  return (
    <div
      ref={panelRef}
      className="h-full flex flex-col border-l border-border bg-bg-secondary overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border flex-shrink-0">
        <span className="text-[9px] text-text-muted tracking-[0.2em] uppercase">
          AI Summary
        </span>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors text-xs px-1"
        >
          ✕
        </button>
      </div>

      {/* Meta */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[9px] font-bold tracking-widest px-1 py-0.5 border"
            style={{ color: srcColor, borderColor: srcColor + "44" }}
          >
            {article.source}
          </span>
          <span
            className="text-[9px] font-semibold tracking-wide"
            style={{ color: catColor }}
          >
            {article.category}
          </span>
        </div>
        <h3 className="text-[11px] text-text-primary leading-snug tracking-wide mb-1">
          {article.title}
        </h3>
        <p className="text-[9px] text-text-muted">{formatDate(article.published)}</p>
      </div>

      <div className="border-t border-border mx-3" />

      {/* Summary body */}
      <div className="px-3 py-3 flex-1">
        <div className="text-[9px] text-text-muted tracking-[0.2em] uppercase mb-3">
          Llama 3.3 70B · Groq
        </div>

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2 animate-pulse">
                <span className="text-accent-orange mt-0.5 text-xs flex-shrink-0">•</span>
                <div
                  className="h-2 bg-bg-hover rounded flex-1"
                  style={{ width: `${60 + i * 10}%` }}
                />
              </div>
            ))}
            <p className="text-[9px] text-text-muted mt-3 tracking-widest">
              GENERATING...
            </p>
          </div>
        )}

        {!loading && error && (
          <p className="text-[10px] text-accent-red leading-relaxed">{error}</p>
        )}

        {!loading && bullets.length > 0 && (
          <div className="space-y-3">
            {bullets.map((b, i) => (
              <BulletLine key={i} text={b.replace(/^•\s*/, "")} index={i} />
            ))}
          </div>
        )}

        {!loading && !error && bullets.length === 0 && summary && (
          <p className="text-[11px] text-text-secondary leading-relaxed">{summary}</p>
        )}
      </div>

      {/* Link */}
      <div className="px-3 pb-4 flex-shrink-0 border-t border-border pt-3">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[10px] text-accent-orange border border-accent-orange px-3 py-1.5 hover:bg-accent-orange hover:text-bg-primary transition-colors duration-150 tracking-widest w-full text-center"
        >
          READ FULL ARTICLE
        </a>
      </div>
    </div>
  );
}

function BulletLine({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, x: -8 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          ease: "power2.out",
          delay: index * 0.12,
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="flex items-start gap-2">
      <span className="text-accent-orange mt-0.5 text-xs flex-shrink-0">•</span>
      <p className="text-[11px] text-text-primary leading-relaxed">{text}</p>
    </div>
  );
}

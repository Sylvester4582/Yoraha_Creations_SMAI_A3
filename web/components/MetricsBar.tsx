"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Article } from "@/types/article";
import {
  CATEGORIES,
  SOURCES,
  CAT_COLORS,
  CAT_SHORT,
  SOURCE_COLORS,
  SOURCE_SHORT,
} from "@/types/article";

interface Props {
  articles: Article[];
}

export default function MetricsBar({ articles }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  const total = articles.length;
  const catCounts = CATEGORIES.map((cat) => ({
    cat,
    count: articles.filter((a) => a.category === cat).length,
    color: CAT_COLORS[cat],
    short: CAT_SHORT[cat],
  }));
  const srcCounts = SOURCES.map((src) => ({
    src,
    count: articles.filter((a) => a.source === src).length,
    color: SOURCE_COLORS[src],
    short: SOURCE_SHORT[src],
  }));

  const avgConf =
    total > 0
      ? Math.round(
          (articles.reduce((s, a) => s + a.confidence, 0) / total) * 100
        )
      : 0;

  useGSAP(
    () => {
      if (!total) return;
      gsap.from(".metric-value", {
        textContent: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.05,
        snap: { textContent: 1 },
        roundProps: "textContent",
      });
      gsap.from(".metric-bar-fill", {
        scaleX: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        transformOrigin: "left center",
      });
    },
    { scope: panelRef, dependencies: [total] }
  );

  return (
    <div
      ref={panelRef}
      className="h-full flex flex-col text-[11px] overflow-y-auto"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-border flex-shrink-0">
        <span className="text-[9px] text-text-muted tracking-[0.2em] uppercase">
          Live Metrics
        </span>
      </div>

      {/* Total */}
      <div className="px-3 pt-3 pb-2 border-b border-border">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-text-muted tracking-widest text-[9px] uppercase">Total</span>
          <span className="metric-value text-accent-orange font-bold text-xl tabular-nums">
            {total}
          </span>
        </div>
        <div className="flex justify-between text-[9px] text-text-muted">
          <span>ARTICLES</span>
          <span>
            AVG CONF{" "}
            <span
              className="font-semibold"
              style={{
                color:
                  avgConf > 80
                    ? "#22c55e"
                    : avgConf > 60
                    ? "#e3b341"
                    : "#737373",
              }}
            >
              {avgConf}%
            </span>
          </span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="px-3 py-3 border-b border-border">
        <div className="text-[9px] text-text-muted tracking-[0.2em] uppercase mb-3">
          By Category
        </div>
        {catCounts.map(({ cat, count, color, short }) => {
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={cat} className="mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <span style={{ color }} className="text-[10px] font-semibold tracking-wide">
                  {short}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-[9px]">{pct}%</span>
                  <span className="metric-value text-text-primary tabular-nums w-4 text-right text-[10px]">
                    {count}
                  </span>
                </div>
              </div>
              <div className="h-0.5 bg-bg-hover overflow-hidden">
                <div
                  className="metric-bar-fill h-full"
                  style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.8 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Source breakdown */}
      <div className="px-3 py-3 border-b border-border">
        <div className="text-[9px] text-text-muted tracking-[0.2em] uppercase mb-3">
          By Source
        </div>
        {srcCounts.map(({ src, count, color, short }) => {
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={src} className="mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <span style={{ color }} className="text-[10px] font-semibold tracking-wide">
                  {short}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-[9px]">{pct}%</span>
                  <span className="metric-value text-text-primary tabular-nums w-4 text-right text-[10px]">
                    {count}
                  </span>
                </div>
              </div>
              <div className="h-0.5 bg-bg-hover overflow-hidden">
                <div
                  className="metric-bar-fill h-full"
                  style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.8 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="px-3 py-3 mt-auto">
        <div className="text-[9px] text-text-muted leading-5">
          <div className="flex justify-between">
            <span>CLASSIFIER</span>
            <span className="text-text-secondary">KEYWORD</span>
          </div>
          <div className="flex justify-between">
            <span>SUMMARIZER</span>
            <span className="text-text-secondary">GROQ</span>
          </div>
          <div className="flex justify-between">
            <span>MODEL</span>
            <span className="text-text-secondary">L3.3-70B</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>REFRESH</span>
            <span className="text-accent-green">15 MIN</span>
          </div>
        </div>
      </div>
    </div>
  );
}

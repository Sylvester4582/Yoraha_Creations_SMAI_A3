"use client";

import { useRef } from "react";
import gsap from "gsap";
import type { Article } from "@/types/article";
import { SOURCE_COLORS, SOURCE_SHORT, CAT_COLORS, CAT_SHORT } from "@/types/article";

interface Props {
  article: Article;
  index: number;
  isSelected: boolean;
  onSelect: (a: Article) => void;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--";
  }
}

export default function ArticleRow({ article, index, isSelected, onSelect }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const srcColor = SOURCE_COLORS[article.source];
  const catColor = CAT_COLORS[article.category];
  const confPct = Math.round(article.confidence * 100);
  const confColor =
    article.confidence > 0.8 ? "#22c55e" : article.confidence > 0.6 ? "#e3b341" : "#737373";

  const handleEnter = () => {
    if (isSelected || !rowRef.current) return;
    gsap.to(rowRef.current, {
      borderLeftColor: catColor,
      backgroundColor: "#181818",
      duration: 0.12,
    });
  };

  const handleLeave = () => {
    if (isSelected || !rowRef.current) return;
    gsap.to(rowRef.current, {
      borderLeftColor: "transparent",
      backgroundColor: "transparent",
      duration: 0.12,
    });
  };

  return (
    <div
      ref={rowRef}
      className={`article-row flex items-center gap-0 border-b border-border cursor-pointer border-l-2 select-none ${
        isSelected ? "bg-bg-selected" : ""
      }`}
      style={{ borderLeftColor: isSelected ? "#f97316" : "transparent" }}
      onClick={() => onSelect(article)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Row number */}
      <div className="w-8 flex-shrink-0 text-[10px] text-text-muted text-right pr-2 py-2 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Time */}
      <div className="w-12 flex-shrink-0 text-[10px] text-text-muted tabular-nums py-2 pr-2">
        {formatTime(article.published)}
      </div>

      {/* Source */}
      <div className="w-8 flex-shrink-0 py-2 pr-3">
        <span className="text-[9px] font-bold tracking-wide" style={{ color: srcColor }}>
          {SOURCE_SHORT[article.source]}
        </span>
      </div>

      {/* Category */}
      <div className="w-10 flex-shrink-0 py-2 pr-3">
        <span className="text-[9px] font-semibold tracking-wide" style={{ color: catColor }}>
          {CAT_SHORT[article.category]}
        </span>
      </div>

      {/* Headline */}
      <div className="flex-1 py-2 pr-3 min-w-0">
        <span
          className={`text-[11px] leading-snug line-clamp-1 tracking-wide ${
            isSelected ? "text-accent-orange" : "text-text-primary"
          }`}
        >
          {article.title}
        </span>
      </div>

      {/* Confidence bar + number */}
      <div className="w-16 flex-shrink-0 py-2 pr-3 flex items-center justify-end gap-1.5">
        <div className="w-8 h-0.5 bg-bg-hover overflow-hidden hidden sm:block">
          <div
            className="h-full"
            style={{ width: `${confPct}%`, backgroundColor: confColor }}
          />
        </div>
        <span
          className="text-[10px] tabular-nums w-6 text-right"
          style={{ color: confColor }}
        >
          {confPct}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { Article } from "@/types/article";
import ArticleRow from "./ArticleRow";

interface Props {
  articles: Article[];
  loading: boolean;
  selectedArticle: Article | null;
  onArticleSelect: (a: Article | null) => void;
}

const COLS = [
  { label: "#", className: "w-8 text-right pr-2" },
  { label: "TIME", className: "w-12 pr-2" },
  { label: "SRC", className: "w-8 pr-3" },
  { label: "CAT", className: "w-10 pr-3" },
  { label: "HEADLINE", className: "flex-1 pr-3" },
  { label: "CONF", className: "w-16 text-right pr-3" },
];

export default function NewsTable({ articles, loading, selectedArticle, onArticleSelect }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const prevLength = useRef(0);

  // Stagger rows in whenever articles change
  useEffect(() => {
    if (!bodyRef.current || articles.length === 0) return;
    if (articles.length === prevLength.current) return;
    prevLength.current = articles.length;

    gsap.fromTo(
      bodyRef.current.querySelectorAll(".article-row"),
      { opacity: 0, x: -16 },
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: "power2.out",
        clearProps: "transform",
      }
    );
  }, [articles]);

  return (
    <div className="main-table flex flex-col h-full overflow-hidden">
      {/* Table header */}
      <div className="flex items-center border-b border-border-bright bg-bg-secondary px-0 flex-shrink-0">
        {COLS.map((col) => (
          <div
            key={col.label}
            className={`${col.className} py-1.5 text-[9px] text-text-muted tracking-[0.2em] uppercase`}
          >
            {col.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto">
        {loading && articles.length === 0 ? (
          <LoadingSkeleton />
        ) : articles.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-text-muted text-xs tracking-widest">
            NO ARTICLES MATCH FILTER
          </div>
        ) : (
          articles.map((a, i) => (
            <ArticleRow
              key={a.id}
              article={a}
              index={i}
              isSelected={selectedArticle?.id === a.id}
              onSelect={(art) =>
                onArticleSelect(selectedArticle?.id === art.id ? null : art)
              }
            />
          ))
        )}
      </div>

      {/* Row count footer */}
      {!loading && articles.length > 0 && (
        <div className="flex-shrink-0 border-t border-border py-1 px-3 text-[9px] text-text-muted tracking-widest flex justify-between">
          <span>{articles.length} RESULTS</span>
          {selectedArticle && (
            <span className="text-accent-orange">
              SELECTED: {selectedArticle.title.slice(0, 40)}
              {selectedArticle.title.length > 40 ? "…" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-0 border-b border-border py-2 px-0 animate-pulse"
          style={{ opacity: 1 - i * 0.06 }}
        >
          <div className="w-8 h-2 bg-bg-hover rounded mx-2" />
          <div className="w-10 h-2 bg-bg-hover rounded mr-2" />
          <div className="w-8 h-2 bg-bg-hover rounded mr-3" />
          <div className="w-10 h-2 bg-bg-hover rounded mr-3" />
          <div
            className="h-2 bg-bg-hover rounded mr-3 flex-1"
            style={{ maxWidth: `${50 + Math.random() * 40}%` }}
          />
          <div className="w-8 h-2 bg-bg-hover rounded mr-3" />
        </div>
      ))}
    </>
  );
}

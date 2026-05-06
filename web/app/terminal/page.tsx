"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import TickerTape from "@/components/TickerTape";
import TerminalHeader from "@/components/TerminalHeader";
import CategoryFilter from "@/components/CategoryFilter";
import NewsTable from "@/components/NewsTable";
import SummaryPanel from "@/components/SummaryPanel";
import MetricsBar from "@/components/MetricsBar";
import StatusBar from "@/components/StatusBar";

import type { Article, Category, ArticlesResponse } from "@/types/article";
import { SOURCES } from "@/types/article";

gsap.registerPlugin(TextPlugin);

export default function TerminalPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");
  const [activeSources, setActiveSources] = useState<Set<string>>(new Set(SOURCES));
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      gsap.to(".toast-bar", {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => setToast(null),
      });
    }, 3000);
  }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/articles", { cache: "no-store" });
      const data: ArticlesResponse = await res.json();
      setArticles(data.articles ?? []);
      setFetchedAt(data.fetchedAt ?? "");
    } catch (e) {
      console.error("[terminal] fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
    const id = setInterval(fetchArticles, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchArticles]);

  // Show toast + scan line when articles first arrive
  useEffect(() => {
    if (loading || !articles.length || booted.current) return;

    // Scan line sweeps down the table
    if (scanRef.current) {
      gsap.fromTo(
        scanRef.current,
        { top: "0%", opacity: 0.6 },
        { top: "100%", opacity: 0, duration: 0.9, ease: "power2.in" }
      );
    }

    showToast(`${articles.length} ARTICLES LOADED`);
  }, [loading, articles.length, showToast]);

  // Boot animation — once after first data load
  useGSAP(
    () => {
      if (loading || booted.current) return;
      booted.current = true;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".ticker-wrap", { opacity: 0, y: -10, duration: 0.4 })
        .from(".terminal-header", { opacity: 0, y: -12, duration: 0.5 }, "-=0.2")
        .from(".sidebar", { opacity: 0, x: -20, duration: 0.5 }, "-=0.25")
        .from(".metrics-panel", { opacity: 0, x: 20, duration: 0.5 }, "<")
        .from(".main-table", { opacity: 0, y: 10, duration: 0.5 }, "<");
    },
    { scope: containerRef, dependencies: [loading] }
  );

  // Animate rows when filter changes
  const prevFilter = useRef("");
  useEffect(() => {
    const key = `${activeCategory}-${Array.from(activeSources).sort().join(",")}`;
    if (key === prevFilter.current) return;
    prevFilter.current = key;

    const rows = document.querySelectorAll(".article-row");
    if (!rows.length) return;
    gsap.fromTo(
      rows,
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.28, stagger: 0.025, ease: "power2.out" }
    );
  }, [activeCategory, activeSources]);

  const handleSourceToggle = useCallback((src: string) => {
    setActiveSources((prev) => {
      const next = new Set(prev);
      next.has(src) ? next.delete(src) : next.add(src);
      return next;
    });
  }, []);

  const filteredArticles = articles.filter((a) => {
    const catOk = activeCategory === "ALL" || a.category === activeCategory;
    const srcOk = activeSources.has(a.source);
    return catOk && srcOk;
  });

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-screen overflow-hidden bg-bg-primary"
    >
      {/* Toast notification */}
      {toast && (
        <div className="toast-bar fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-bg-panel border border-accent-green text-accent-green text-[10px] px-5 py-2 tracking-widest pointer-events-none">
          ✓ {toast}
        </div>
      )}

      <TickerTape articles={articles} />

      <TerminalHeader
        articleCount={articles.length}
        fetchedAt={fetchedAt}
        onRefresh={fetchArticles}
        loading={loading}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Scan line overlay — animates on load */}
        <div
          ref={scanRef}
          className="absolute left-0 right-0 h-0.5 pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)",
            opacity: 0,
          }}
        />

        {/* Left sidebar */}
        <div className="sidebar w-44 flex-shrink-0 border-r border-border overflow-y-auto bg-bg-secondary">
          <CategoryFilter
            articles={articles}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            activeSources={activeSources}
            onSourceToggle={handleSourceToggle}
          />
        </div>

        {/* Center */}
        <div className="flex-1 overflow-hidden relative">
          <NewsTable
            articles={filteredArticles}
            loading={loading}
            selectedArticle={selectedArticle}
            onArticleSelect={setSelectedArticle}
          />
        </div>

        {/* Right panel */}
        <div className="metrics-panel w-60 flex-shrink-0 border-l border-border overflow-hidden">
          {selectedArticle ? (
            <SummaryPanel
              article={selectedArticle}
              onClose={() => setSelectedArticle(null)}
            />
          ) : (
            <MetricsBar articles={articles} />
          )}
        </div>
      </div>

      <StatusBar loading={loading} fetchedAt={fetchedAt} />
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Article, Category } from "@/types/article";
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
  activeCategory: Category | "ALL";
  onCategoryChange: (c: Category | "ALL") => void;
  activeSources: Set<string>;
  onSourceToggle: (src: string) => void;
}

export default function CategoryFilter({
  articles,
  activeCategory,
  onCategoryChange,
  activeSources,
  onSourceToggle,
}: Props) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const catCounts = CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat]: articles.filter((a) => a.category === cat).length }),
    {} as Record<Category, number>
  );
  const srcCounts = SOURCES.reduce(
    (acc, src) => ({ ...acc, [src]: articles.filter((a) => a.source === src).length }),
    {} as Record<string, number>
  );
  const total = articles.length;
  const maxCat = Math.max(...Object.values(catCounts), 1);

  // Animate bars when articles change
  useGSAP(
    () => {
      gsap.from(".cat-bar", {
        scaleX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.06,
        transformOrigin: "left center",
      });
      gsap.from(".cat-count", {
        textContent: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.06,
        snap: { textContent: 1 },
        roundProps: "textContent",
      });
    },
    { scope: sidebarRef, dependencies: [articles.length] }
  );

  return (
    <div ref={sidebarRef} className="p-3 space-y-4 text-[11px] font-mono">
      {/* Categories */}
      <div>
        <div className="text-text-muted tracking-[0.2em] uppercase mb-2 text-[9px]">
          Categories
        </div>

        {/* ALL */}
        <button
          onClick={() => onCategoryChange("ALL")}
          className={`w-full flex items-center justify-between py-1 px-2 mb-0.5 transition-colors duration-100 ${
            activeCategory === "ALL"
              ? "bg-bg-selected text-accent-orange"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
          }`}
        >
          <span className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  activeCategory === "ALL" ? "#f97316" : "#3d3d3d",
              }}
            />
            <span className="tracking-widest">ALL</span>
          </span>
          <span className="text-text-muted">{total}</span>
        </button>

        {CATEGORIES.map((cat) => {
          const color = CAT_COLORS[cat];
          const isActive = activeCategory === cat;
          const count = catCounts[cat] ?? 0;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`w-full flex items-center justify-between py-1 px-2 mb-0.5 transition-colors duration-100 ${
                isActive
                  ? "bg-bg-selected"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors"
                  style={{ backgroundColor: isActive ? color : "#3d3d3d" }}
                />
                <span
                  className="tracking-widest"
                  style={{ color: isActive ? color : undefined }}
                >
                  {CAT_SHORT[cat]}
                </span>
              </span>
              <span className="cat-count text-text-muted">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border" />

      {/* Sources */}
      <div>
        <div className="text-text-muted tracking-[0.2em] uppercase mb-2 text-[9px]">
          Sources
        </div>
        {SOURCES.map((src) => {
          const color = SOURCE_COLORS[src];
          const active = activeSources.has(src);
          return (
            <button
              key={src}
              onClick={() => onSourceToggle(src)}
              className="w-full flex items-center justify-between py-1 px-2 mb-0.5 hover:bg-bg-hover transition-colors duration-100"
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-sm flex-shrink-0 transition-colors"
                  style={{ backgroundColor: active ? color : "#3d3d3d" }}
                />
                <span
                  className="tracking-wide"
                  style={{ color: active ? color : "#737373" }}
                >
                  {SOURCE_SHORT[src]}
                </span>
              </span>
              <span className="text-text-muted">{srcCounts[src] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border" />

      {/* Distribution bars */}
      <div>
        <div className="text-text-muted tracking-[0.2em] uppercase mb-2 text-[9px]">
          Distribution
        </div>
        {CATEGORIES.map((cat) => {
          const count = catCounts[cat] ?? 0;
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={cat} className="mb-2">
              <div className="flex justify-between text-[9px] mb-0.5">
                <span style={{ color: CAT_COLORS[cat] }}>{CAT_SHORT[cat]}</span>
                <span className="text-text-muted">{pct}%</span>
              </div>
              <div className="h-0.5 bg-bg-hover w-full overflow-hidden">
                <div
                  className="cat-bar h-full"
                  style={{
                    width: `${(count / maxCat) * 100}%`,
                    backgroundColor: CAT_COLORS[cat],
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

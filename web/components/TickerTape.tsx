"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { Article } from "@/types/article";
import { SOURCE_COLORS, SOURCE_SHORT } from "@/types/article";

interface Props {
  articles: Article[];
}

export default function TickerTape({ articles }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!articles.length || !trackRef.current) return;

    // Kill any existing tween
    tweenRef.current?.kill();

    const el = trackRef.current;
    gsap.set(el, { x: 0 });

    tweenRef.current = gsap.to(el, {
      x: "-50%",
      duration: articles.length * 4,
      ease: "linear",
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [articles]);

  if (!articles.length) {
    return (
      <div className="h-8 bg-bg-secondary border-b border-border flex items-center px-4">
        <span className="text-text-muted text-xs tracking-widest uppercase">
          Loading ticker...
        </span>
      </div>
    );
  }

  // Duplicate items for seamless loop
  const items = [...articles, ...articles];

  return (
    <div className="ticker-wrap h-8 bg-bg-secondary border-b border-border overflow-hidden flex items-center">
      <div
        className="text-[10px] whitespace-nowrap"
        style={{ display: "flex", alignItems: "center", willChange: "transform" }}
      >
        <div ref={trackRef} style={{ display: "flex", alignItems: "center" }}>
          {items.map((a, i) => (
            <span key={i} className="inline-flex items-center">
              <span
                className="font-bold mr-1 text-[9px] px-1 py-0.5 rounded-sm"
                style={{
                  color: SOURCE_COLORS[a.source],
                  border: `1px solid ${SOURCE_COLORS[a.source]}33`,
                }}
              >
                {SOURCE_SHORT[a.source]}
              </span>
              <span className="text-text-secondary tracking-wide">
                {a.title}
              </span>
              <span className="mx-4 text-accent-orange opacity-40">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

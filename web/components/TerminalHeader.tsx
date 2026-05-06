"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Link from "next/link";

gsap.registerPlugin(TextPlugin);

interface Props {
  articleCount: number;
  fetchedAt: string;
  onRefresh: () => void;
  loading: boolean;
}

export default function TerminalHeader({
  articleCount,
  fetchedAt,
  onRefresh,
  loading,
}: Props) {
  const [clock, setClock] = useState("");
  const titleRef = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "UTC",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC"
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Typing effect for title
  useGSAP(
    () => {
      if (!titleRef.current) return;
      gsap.to(titleRef.current, {
        text: { value: "TECH NEWS TERMINAL", delimiter: "" },
        duration: 1.4,
        ease: "none",
        delay: 0.3,
      });
    },
    { scope: headerRef }
  );

  const since = fetchedAt
    ? Math.floor((Date.now() - new Date(fetchedAt).getTime()) / 60000)
    : null;

  return (
    <div
      ref={headerRef}
      className="terminal-header h-12 bg-bg-secondary border-b border-border flex items-center px-4 gap-4 flex-shrink-0"
    >
      {/* Logo + typing title */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href="/">
          <span className="text-accent-orange font-bold text-sm tracking-widest border border-accent-orange px-2 py-0.5 hover:bg-accent-orange hover:text-bg-primary transition-colors duration-150 cursor-pointer">
            TNT
          </span>
        </Link>
        <span
          ref={titleRef}
          className="text-text-primary font-bold text-sm tracking-[0.2em] hidden md:block"
        />
        <span className="animate-blink text-accent-orange text-sm hidden md:block">_</span>
      </div>

      <div className="flex-1" />

      {/* Status + Nav */}
      <div className="flex items-center gap-4 text-[11px] text-text-secondary">
        {/* Live indicator */}
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse_dot" />
          <span className="text-accent-green font-semibold tracking-widest">LIVE</span>
        </span>

        {/* Article count */}
        {articleCount > 0 && (
          <span className="text-text-secondary tracking-widest hidden sm:block">
            <span className="text-text-primary font-semibold">{articleCount}</span>
            &nbsp;ARTICLES
          </span>
        )}

        {/* Last fetched */}
        {since !== null && (
          <span className="text-text-muted hidden lg:block tracking-wide">
            {since === 0 ? "JUST NOW" : `${since}M AGO`}
          </span>
        )}

        {/* Clock */}
        <span className="text-text-secondary font-mono tracking-wider hidden xl:block">
          {clock}
        </span>

        {/* Nav links */}
        <Link
          href="/"
          className="text-text-muted hover:text-accent-orange transition-colors duration-150 tracking-widest text-[10px] hidden sm:block"
        >
          HOME
        </Link>
        <Link
          href="/contact"
          className="text-text-muted hover:text-accent-orange transition-colors duration-150 tracking-widest text-[10px] hidden sm:block"
        >
          CONTACT
        </Link>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-2 py-1 border border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-colors duration-150 tracking-widest text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "LOADING" : "REFRESH"}
        </button>
      </div>
    </div>
  );
}

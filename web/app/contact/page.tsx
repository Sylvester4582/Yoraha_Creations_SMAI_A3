"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import MatrixBackground from "@/components/MatrixBackground";

const TECH_STACK = [
  { key: "FRAMEWORK", value: "Next.js 14 — App Router", color: "#d4d4d4" },
  { key: "LANGUAGE", value: "TypeScript", color: "#3b82f6" },
  { key: "ANIMATIONS", value: "GSAP 3 + @gsap/react", color: "#22c55e" },
  { key: "STYLING", value: "Tailwind CSS", color: "#06b6d4" },
  { key: "CLASSIFIER", value: "facebook/bart-large-mnli", color: "#58a6ff" },
  { key: "SUMMARIZER", value: "Groq — Llama 3.3 70B", color: "#f97316" },
  { key: "FEEDS", value: "TechCrunch · The Verge · YourStory", color: "#3fb950" },
  { key: "DEPLOYMENT", value: "Vercel", color: "#d4d4d4" },
];

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".page-header", { opacity: 0, y: -16, duration: 0.5 })
        .from(".creator-card", { opacity: 0, scale: 0.96, duration: 0.6, ease: "back.out(1.5)" }, "-=0.2")
        .from(".tech-row", { opacity: 0, x: -14, stagger: 0.06, duration: 0.4 }, "-=0.3")
        .from(".footer-line", { opacity: 0, y: 8, duration: 0.4 }, "-=0.1");

      // Subtle orange glow pulse on creator card
      gsap.to(".creator-card", {
        boxShadow: "0 0 30px rgba(249,115,22,0.12), inset 0 0 20px rgba(249,115,22,0.04)",
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
        delay: 1,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-auto bg-bg-primary flex flex-col"
    >
      <MatrixBackground opacity={0.03} color="249, 115, 22" />

      {/* Radial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(249,115,22,0.035) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 py-16 max-w-2xl mx-auto w-full">
        {/* Back link */}
        <div className="page-header w-full flex items-center justify-between mb-12">
          <Link
            href="/terminal"
            className="text-[10px] text-text-muted tracking-[0.2em] hover:text-accent-orange transition-colors flex items-center gap-2"
          >
            ← BACK TO TERMINAL
          </Link>
          <nav className="flex gap-6 text-[10px] tracking-[0.2em] text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-colors">HOME</Link>
            <Link href="/terminal" className="hover:text-text-primary transition-colors">TERMINAL</Link>
            <span className="text-accent-orange font-semibold">CONTACT</span>
          </nav>
        </div>

        {/* Section heading */}
        <div className="w-full mb-10">
          <h1 className="text-2xl font-bold tracking-[0.2em] text-text-primary mb-2">
            CONTACT &amp; CREDITS
          </h1>
          <div className="h-px bg-border w-full" />
        </div>

        {/* Creator card */}
        <div
          className="creator-card w-full border border-accent-orange mb-10 p-8"
          style={{ borderColor: "#f9731644" }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[9px] text-text-muted tracking-[0.25em] uppercase mb-2">
                Creator
              </p>
              <h2 className="text-3xl font-bold tracking-[0.1em] text-text-primary mb-1">
                Vidvathama R
              </h2>
              <p className="text-text-secondary text-xs tracking-[0.15em]">
                IIIT Hyderabad · Semester VI
              </p>
            </div>
            <div
              className="border px-3 py-1.5 text-[9px] tracking-widest"
              style={{ borderColor: "#f97316", color: "#f97316" }}
            >
              SMAI · A3
            </div>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4 text-[11px]">
            <div>
              <p className="text-text-muted text-[9px] tracking-[0.2em] mb-1">COURSE</p>
              <p className="text-text-primary">Statistical Methods in AI</p>
            </div>
            <div>
              <p className="text-text-muted text-[9px] tracking-[0.2em] mb-1">ASSIGNMENT</p>
              <p className="text-text-primary">A3 · Task T9.3 (Tier 1)</p>
            </div>
            <div>
              <p className="text-text-muted text-[9px] tracking-[0.2em] mb-1">TEAM</p>
              <p className="text-accent-orange">Yoraha Creations</p>
            </div>
            <div>
              <p className="text-text-muted text-[9px] tracking-[0.2em] mb-1">INSTITUTION</p>
              <p className="text-text-primary">IIIT Hyderabad</p>
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="w-full mb-10">
          <div className="text-[9px] text-text-muted tracking-[0.25em] uppercase mb-4">
            Powered By
          </div>
          <div className="border border-border">
            {TECH_STACK.map((row, i) => (
              <div
                key={row.key}
                className="tech-row flex items-center justify-between px-4 py-2.5 border-b border-border last:border-b-0 hover:bg-bg-hover transition-colors duration-100"
              >
                <span className="text-text-muted text-[10px] tracking-[0.15em] w-28 flex-shrink-0">
                  {row.key}
                </span>
                <span
                  className="text-[11px] text-right"
                  style={{ color: row.color }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Project info */}
        <div className="footer-line w-full border-t border-border pt-6 flex flex-col gap-3">
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted tracking-widest">PROJECT</span>
            <span className="text-text-secondary">Tech News Tracker · T9.3 · Tier 1</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted tracking-widest">CLASSIFIER</span>
            <span className="text-cat-ai">facebook/bart-large-mnli (zero-shot NLI)</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted tracking-widest">EVAL DATASET</span>
            <span className="text-text-secondary">India Headlines · Kaggle</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-text-muted tracking-widest">LLM DISCLOSURE</span>
            <span className="text-text-secondary">Scaffolding by Claude · Groq at runtime</span>
          </div>
        </div>
      </div>

      {/* Scanline + vignette are applied by globals.css on body */}
    </div>
  );
}

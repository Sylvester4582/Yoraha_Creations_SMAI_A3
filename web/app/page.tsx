"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MatrixBackground from "@/components/MatrixBackground";

gsap.registerPlugin(TextPlugin);

const STATS = [
  { target: 30, label: "ARTICLES", color: "#f97316" },
  { target: 3, label: "SOURCES", color: "#22c55e" },
  { target: 5, label: "CATEGORIES", color: "#3b82f6" },
  { target: 99, label: "ACCURACY%", color: "#a855f7" },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(
    () => {
      // Start title empty and type it in
      gsap.set(".hero-title", { text: "" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".logo-box", {
        scale: 0.5,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(2)",
      })
        .to(
          ".hero-title",
          {
            text: { value: "TECH NEWS TERMINAL", delimiter: "" },
            duration: 1.5,
            ease: "none",
          },
          "-=0.1"
        )
        .from(".hero-subtitle", { opacity: 0, y: 10, duration: 0.6 }, "-=0.6")
        .from(
          ".stat-card",
          { opacity: 0, y: 24, stagger: 0.1, duration: 0.5 },
          "-=0.3"
        )
        .from(
          ".hero-divider",
          { scaleX: 0, duration: 0.9, transformOrigin: "left center" },
          "-=0.3"
        )
        .from(".cta-button", { opacity: 0, scale: 0.88, duration: 0.55, ease: "back.out(2)" }, "-=0.4")
        .from(".source-line", { opacity: 0, y: 8, duration: 0.4 }, "-=0.2")
        .from(".bottom-nav", { opacity: 0, duration: 0.4 }, "-=0.1");

      // Count up stats after their stagger
      const statEls = document.querySelectorAll<HTMLElement>(".stat-value");
      statEls.forEach((el, i) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: STATS[i].target,
          duration: 1.2,
          delay: 1.0 + i * 0.1,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      });

      // Slow pulsing glow on CTA after entrance
      gsap.to(".cta-button", {
        boxShadow: "0 0 28px rgba(249,115,22,0.35), 0 0 8px rgba(249,115,22,0.2)",
        repeat: -1,
        yoyo: true,
        duration: 2.2,
        ease: "sine.inOut",
        delay: 2.5,
      });

      // Cursor blink after title types
      gsap.to(".title-cursor", {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        delay: 1.8,
      });
    },
    { scope: containerRef }
  );

  const handleEnter = () => {
    gsap.to(".hero-content", {
      opacity: 0,
      y: -20,
      duration: 0.38,
      ease: "power2.in",
      onComplete: () => router.push("/terminal"),
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-bg-primary flex flex-col items-center justify-center"
    >
      {/* Matrix rain background */}
      <MatrixBackground opacity={0.04} />

      {/* Radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="hero-content relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full">
        {/* TNT logo */}
        <div className="logo-box inline-flex items-center justify-center border border-accent-orange px-5 py-2 mb-10">
          <span className="text-accent-orange font-bold text-xl tracking-[0.5em]">
            TNT
          </span>
        </div>

        {/* Typing title */}
        <div className="mb-5" style={{ minHeight: "5rem" }}>
          <span className="hero-title text-5xl md:text-6xl font-bold tracking-[0.12em] text-text-primary leading-tight" />
          <span className="title-cursor text-accent-orange text-5xl md:text-6xl font-bold">
            _
          </span>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle text-text-secondary text-xs tracking-[0.3em] uppercase mb-10">
          Live Intelligence&nbsp;&nbsp;·&nbsp;&nbsp;Zero-Shot Classified&nbsp;&nbsp;·&nbsp;&nbsp;AI-Powered Summaries
        </p>

        {/* Stats row */}
        <div className="flex gap-4 mb-10 flex-wrap justify-center">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="stat-card flex flex-col items-center border border-border px-5 py-3 min-w-[72px]"
              style={{ borderColor: s.color + "33" }}
            >
              <span
                className="stat-value text-2xl font-bold tabular-nums"
                style={{ color: s.color }}
              >
                0
              </span>
              <span className="text-text-muted text-[9px] tracking-[0.2em] mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="hero-divider w-full h-px bg-border mb-10" />

        {/* CTA button */}
        <button
          onClick={handleEnter}
          className="cta-button group border border-accent-orange text-accent-orange px-10 py-4 text-sm tracking-[0.35em] uppercase hover:bg-accent-orange hover:text-bg-primary transition-colors duration-200 mb-10 flex items-center gap-4"
        >
          ENTER TERMINAL
          <span className="group-hover:translate-x-2 transition-transform duration-200 text-base">
            →
          </span>
        </button>

        {/* Source names */}
        <p className="source-line text-text-muted text-[10px] tracking-[0.35em] mb-10">
          <span style={{ color: "#3fb950" }}>TechCrunch</span>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <span style={{ color: "#f97316" }}>The Verge</span>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <span style={{ color: "#bc8cff" }}>YourStory</span>
        </p>

        {/* Nav */}
        <nav className="bottom-nav flex gap-8 text-[10px] tracking-[0.25em]">
          <span className="text-accent-orange font-semibold">HOME</span>
          <Link
            href="/terminal"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            TERMINAL
          </Link>
          <Link
            href="/contact"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            CONTACT
          </Link>
        </nav>
      </div>

      {/* Bottom watermark */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center text-[9px] text-text-muted tracking-[0.25em]">
        SMAI A3 · T9.3 · YORAHA CREATIONS · IIIT HYDERABAD
      </div>
    </div>
  );
}

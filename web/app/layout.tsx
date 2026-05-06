import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech News Terminal — SMAI A3 · T9.3",
  description:
    "Live tech headlines from TechCrunch, The Verge & YourStory. Zero-shot classified and LLM-summarised. Bloomberg terminal interface.",
  keywords: ["tech news", "AI", "machine learning", "startups", "terminal"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="scanlines vignette font-mono bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}

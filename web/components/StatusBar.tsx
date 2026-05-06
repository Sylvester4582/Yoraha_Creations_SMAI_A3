"use client";

interface Props {
  loading: boolean;
  fetchedAt: string;
}

function formatFetchedAt(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    }) + " UTC";
  } catch {
    return "—";
  }
}

export default function StatusBar({ loading, fetchedAt }: Props) {
  return (
    <div className="flex-shrink-0 h-7 border-t border-border bg-bg-secondary flex items-center px-4 gap-4 text-[9px] text-text-muted tracking-widest overflow-hidden">
      <span>
        CLASSIFIER:{" "}
        <span className="text-cat-ai">KEYWORD / BART-LARGE-MNLI</span>
      </span>
      <span className="text-text-dim">|</span>
      <span>
        SUMMARIZER:{" "}
        <span className="text-cat-software">GROQ — LLAMA-3.3-70B</span>
      </span>
      <span className="text-text-dim">|</span>
      <span>
        FEEDS:{" "}
        <span className="text-source-tc">TC</span>{" "}
        <span className="text-source-vg">VG</span>{" "}
        <span className="text-source-ys">YS</span>
      </span>
      <span className="text-text-dim">|</span>
      <span>
        AUTO-REFRESH:{" "}
        <span className="text-accent-green">15 MIN</span>
      </span>

      <div className="flex-1" />

      {loading ? (
        <span className="text-accent-amber animate-pulse">FETCHING FEEDS...</span>
      ) : (
        <span>
          LAST FETCH:{" "}
          <span className="text-text-secondary">{formatFetchedAt(fetchedAt)}</span>
        </span>
      )}

      <span className="text-text-dim">|</span>
      <span>
        SMAI A3 · T9.3 ·{" "}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-orange hover:underline"
        >
          YORAHA CREATIONS
        </a>
      </span>
    </div>
  );
}

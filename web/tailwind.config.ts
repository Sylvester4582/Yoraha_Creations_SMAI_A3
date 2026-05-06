import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "Menlo", "Monaco", "Courier New", "monospace"],
      },
      colors: {
        bg: {
          primary: "#080808",
          secondary: "#0d0d0d",
          panel: "#111111",
          hover: "#181818",
          selected: "#1c1c1c",
        },
        border: {
          DEFAULT: "#1a1a1a",
          bright: "#2a2a2a",
        },
        text: {
          primary: "#d4d4d4",
          secondary: "#737373",
          muted: "#404040",
          dim: "#2a2a2a",
        },
        accent: {
          orange: "#f97316",
          green: "#22c55e",
          red: "#ef4444",
          blue: "#3b82f6",
          amber: "#f59e0b",
          purple: "#a855f7",
          cyan: "#06b6d4",
        },
        source: {
          tc: "#3fb950",
          vg: "#f97316",
          ys: "#bc8cff",
        },
        cat: {
          ai: "#58a6ff",
          startup: "#3fb950",
          gadgets: "#e3b341",
          software: "#bc8cff",
          general: "#6e7681",
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        pulse_dot: "pulse_dot 2s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulse_dot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.8)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

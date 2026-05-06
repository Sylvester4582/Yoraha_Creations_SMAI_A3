"use client";

import { useRef, useEffect } from "react";

const CHARS = "01アBCDEF23897645|/-+≡≈∞◆";

interface Props {
  opacity?: number;
  color?: string;
}

export default function MatrixBackground({
  opacity = 0.045,
  color = "249, 115, 22",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 12;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let cols = Math.floor(canvas.width / FONT_SIZE);
    const drops: number[] = Array.from({ length: cols }, () =>
      Math.random() * -(canvas.height / FONT_SIZE)
    );

    let animId: number;

    const draw = () => {
      cols = Math.floor(canvas.width / FONT_SIZE);

      // Fade existing content — creates the trail effect
      ctx.fillStyle = `rgba(8, 8, 8, 0.06)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px JetBrains Mono, monospace`;

      for (let i = 0; i < cols; i++) {
        if (drops[i] === undefined) drops[i] = 0;

        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * FONT_SIZE;

        // Lead character is brighter
        const brightness = Math.random() > 0.95 ? 0.9 : opacity;
        ctx.fillStyle = `rgba(${color}, ${brightness})`;
        ctx.fillText(char, i * FONT_SIZE, y);

        // Reset column when it reaches the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += 0.6;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    // Throttle to ~20 fps for subtlety
    let last = 0;
    const throttled = (ts: number) => {
      if (ts - last > 50) {
        last = ts;
        draw();
      } else {
        animId = requestAnimationFrame(throttled);
      }
    };
    animId = requestAnimationFrame(throttled);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [opacity, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

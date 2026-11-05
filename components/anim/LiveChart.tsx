"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";

/**
 * The analytics widget from the reference: a headline number that counts up,
 * a delta pill, and a line that draws itself when it scrolls into view.
 */
export default function LiveChart({
  label = "Unlocks this week",
  value = 8275,
  delta = "+12%",
  points = [18, 34, 26, 48, 40, 62, 70, 58, 78, 88, 82, 96],
  height = 120,
}: {
  label?: string;
  value?: number;
  delta?: string;
  points?: number[];
  height?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const w = 320;
  const h = height;
  const pad = 6;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const x = (i: number) => pad + (i * (w - pad * 2)) / (points.length - 1);
  const y = (v: number) => h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(points.length - 1)} ${h} L ${x(0)} ${h} Z`;

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs muted">{label}</p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight">
            <CountUp to={value} format="plain" />
          </p>
        </div>
        <span className="badge badge-good">{delta}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="liveArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#liveArea)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 1s ease 0.9s" }} />
        <path
          d={line}
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition: "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        />
      </svg>
    </div>
  );
}

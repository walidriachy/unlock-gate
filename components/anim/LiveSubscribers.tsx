"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "./CountUp";

interface Row {
  id: number;
  email: string;
  ago: string;
}

const SEED: Row[] = [
  { id: 1, email: "j****s@gmail.com", ago: "just now" },
  { id: 2, email: "n****a@proton.me", ago: "1m ago" },
  { id: 3, email: "d****e@gmail.com", ago: "3m ago" },
];

const POOL = [
  "m****o@gmail.com",
  "s****i@icloud.com",
  "r****n@outlook.com",
  "k****a@proton.me",
  "t****x@yahoo.com",
  "a****e@live.com",
  "l****o@gmail.com",
  "p****r@pm.me",
];

/** The email-capture widget: a live subscriber list that keeps filling. */
export default function LiveSubscribers({ total = 2851 }: { total?: number }) {
  const [rows, setRows] = useState<Row[]>(SEED);
  const next = useRef(4);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      const id = next.current++;
      const email = POOL[id % POOL.length];
      setRows((prev) => {
        const aged = prev.map((r) => ({
          ...r,
          ago: r.ago === "just now" ? "1m ago" : r.ago === "1m ago" ? `${1 + Math.round(Math.random() * 3)}m ago` : r.ago,
        }));
        return [{ id, email, ago: "just now" }, ...aged].slice(0, 3);
      });
    }, 3400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-extrabold tracking-tight">
          <CountUp to={total} format="plain" /> <span className="text-sm font-medium muted">subscribers</span>
        </p>
        <span className="badge badge-good">+18 this week</span>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="ec-row flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5">
            <span
              className="h-6 w-6 shrink-0 rounded-full"
              style={{ background: "conic-gradient(from 210deg, #12de7f, #00c76a, #0a3f28, #12de7f)" }}
            />
            <span className="min-w-0 flex-1 truncate text-sm">{r.email}</span>
            <span className="text-xs faint">{r.ago}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

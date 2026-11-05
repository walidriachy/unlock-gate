"use client";

import { useState } from "react";

/** Smooth accordion — the row height animates via the grid-rows trick. */
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="card overflow-hidden">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{f.q}</span>
              <span className={`faq-chevron accent-text ${isOpen ? "open" : ""}`}>＋</span>
            </button>
            <div className={`faq-item ${isOpen ? "open" : ""}`}>
              <div>
                <p className="px-5 pb-5 text-sm muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

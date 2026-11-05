"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal — sections fade up as they enter the viewport
 * (0.7s cubic-bezier(0.16,1,0.3,1), optional stagger).
 *
 * Two safeguards so content is never stuck invisible:
 *  - if the element is already in view on mount it reveals immediately;
 *  - a failsafe timer reveals everything after 2s regardless.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setSeen(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight + 40 && rect.bottom > -40;
    if (inView) {
      setSeen(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    const failsafe = setTimeout(() => setSeen(true), 2000);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  const Comp = Tag as any;
  return (
    <Comp
      ref={ref as any}
      className={`reveal ${seen ? "is-in" : ""} ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}

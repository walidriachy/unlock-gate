/**
 * The hero watermark layer: platform glyphs drifting slowly upward on a loop
 * (50–70s, linear, staggered by negative delays), at ~10% white.
 * Deterministic so server and client markup match.
 */

const GLYPHS = ["▶️", "💬", "✖️", "🟢", "📸", "🎵", "📺", "✈️", "👽", "🐙", "🎧", "🅱️", "🏀", "🎨", "📌", "🎮", "🧱", "📻"];

// Simple LCG so positions are stable between renders.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const ICONS = (() => {
  const r = rng(2026);
  const out: {
    glyph: string;
    left: number;
    dur: number;
    delay: number;
    size: number;
    dx: number;
    rot: number;
    peak: number;
  }[] = [];
  const durs = [50000, 54000, 58000, 64000, 70000];
  for (let i = 0; i < 44; i++) {
    out.push({
      glyph: GLYPHS[Math.floor(r() * GLYPHS.length)],
      left: Math.round(r() * 98),
      dur: durs[Math.floor(r() * durs.length)],
      delay: -Math.round(r() * 70000),
      size: 16 + Math.round(r() * 26),
      dx: Math.round((r() - 0.5) * 120),
      rot: Math.round((r() - 0.5) * 40),
      peak: 0.06 + r() * 0.07,
    });
  }
  return out;
})();

export default function FloatingIcons({ count = 44 }: { count?: number }) {
  return (
    <div className="float-layer pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ICONS.slice(0, count).map((ic, i) => (
        <span
          key={i}
          className="float-icon"
          style={{
            left: `${ic.left}%`,
            bottom: "-14vh",
            fontSize: `${ic.size}px`,
            lineHeight: 1,
            ["--dur" as string]: `${ic.dur}ms`,
            ["--delay" as string]: `${ic.delay}ms`,
            ["--dx" as string]: `${ic.dx}px`,
            ["--rot" as string]: `${ic.rot}deg`,
            ["--peak" as string]: String(ic.peak),
          }}
        >
          {ic.glyph}
        </span>
      ))}
    </div>
  );
}

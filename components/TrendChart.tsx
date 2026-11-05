import type { SeriesPoint } from "@/lib/queries";

export default function TrendChart({
  points,
  height = 180,
  accent = "var(--accent-2)",
}: {
  points: SeriesPoint[];
  height?: number;
  accent?: string;
}) {
  const w = 640;
  const h = height;
  const pad = 24;
  const max = Math.max(1, ...points.map((p) => Math.max(p.views, p.unlocks)));
  const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;

  const x = (i: number) => pad + i * stepX;
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);

  const line = (key: "views" | "unlocks") =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");

  const area = `${line("views")} L ${x(points.length - 1)} ${h - pad} L ${x(0)} ${h - pad} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2)} y2={pad + f * (h - pad * 2)} stroke="rgba(255,255,255,0.06)" />
        ))}
        <path d={area} fill="url(#viewsFill)" />
        <path d={line("views")} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <path d={line("unlocks")} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeDasharray="4 4" strokeLinejoin="round" />
      </svg>
      <div className="flex items-center justify-between px-1 text-[11px] faint">
        <span>{points[0]?.label}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: accent }} /> Views
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-white/45" /> Unlocks
          </span>
        </span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

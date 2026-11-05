export function fmtNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1_000) return `${(n / 1000).toFixed(1)}K`;
  return String(Math.round(n));
}

export function fmtPct(fraction: number): string {
  if (!isFinite(fraction)) return "0%";
  return `${Math.round(fraction * 100)}%`;
}

export function fmtDate(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateShort(ms: number | null | undefined): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function fmtRelative(ms: number | null | undefined): string {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  const mins = Math.round(diff / 60000);
  if (Math.abs(mins) < 1) return "just now";
  if (Math.abs(mins) < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (Math.abs(hours) < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return `${days}d ago`;
  return fmtDate(ms);
}

export function countryName(code: string | null): string {
  if (!code) return "Unknown";
  const map: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    BR: "Brazil",
    IN: "India",
    CA: "Canada",
    NG: "Nigeria",
    AU: "Australia",
    NL: "Netherlands",
    ES: "Spain",
    IT: "Italy",
    SE: "Sweden",
    PL: "Poland",
    MX: "Mexico",
  };
  return map[code] || code;
}

export function flagEmoji(code: string | null): string {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

export function timeAgoFromNow(target: number): { days: number; hours: number; minutes: number; past: boolean } {
  const diff = target - Date.now();
  const past = diff < 0;
  const abs = Math.abs(diff);
  return {
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs % 86_400_000) / 3_600_000),
    minutes: Math.floor((abs % 3_600_000) / 60_000),
    past,
  };
}

/** Accent colour derived from a title, used when no colour is chosen.
 *  Kept inside the brand's green/teal band so the palette stays coherent. */
export function accentFromTitle(title: string): string {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 70;
  const hue = 118 + h; // 118–188: lime → green → teal
  return hslToHex(hue, 70, 58);
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

export function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

/** Rough device + country + referrer from request headers (best-effort, no PII stored). */
export function classifyRequest(req: Request): {
  device: string;
  country: string;
  referrer: string;
} {
  const ua = req.headers.get("user-agent") || "";
  const device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android|iPhone/i.test(ua) ? "mobile" : "desktop";
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null ||
    "US";
  const ref = req.headers.get("referer") || "";
  let referrer = "direct";
  try {
    if (ref) referrer = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    /* ignore */
  }
  return { device, country, referrer };
}

import { logoPath } from "@/lib/logos";
import { providerById } from "@/lib/platforms";

interface Props {
  /** Provider id from lib/platforms (e.g. "youtube"). */
  id: string;
  /** Pixel box for the whole mark. */
  size?: number;
  /** "tile" = app-icon chip, "bare" = glyph only (inherits currentColor). */
  variant?: "tile" | "bare";
  className?: string;
  /** Optional override; defaults to the provider's brand colour. */
  color?: string;
}

/** Perceived brightness, so light brand tiles get a dark glyph. */
function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.66;
}

export default function ProviderLogo({
  id,
  size = 28,
  variant = "tile",
  className = "",
  color,
}: Props) {
  const provider = providerById(id);
  const brand = color ?? provider?.color ?? "#8b8b9a";
  const path = logoPath(id);
  const name = provider?.name ?? id;
  const initial = (name.replace(/^the\s+/i, "")[0] || "?").toUpperCase();

  if (variant === "bare") {
    if (!path) {
      return (
        <span
          className={`grid place-items-center font-bold ${className}`}
          style={{ width: size, height: size, fontSize: size * 0.62, lineHeight: 1 }}
          aria-hidden
        >
          {initial}
        </span>
      );
    }
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        role="img"
        aria-label={name}
      >
        <path d={path} />
      </svg>
    );
  }

  const glyphColor = isLight(brand) ? "#141110" : "#ffffff";

  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-[28%] ${className}`}
      style={{
        width: size,
        height: size,
        background: brand,
        color: glyphColor,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.22), 0 1px 3px rgba(0,0,0,0.35)",
      }}
      title={name}
      aria-hidden
    >
      {path ? (
        <svg
          width={Math.round(size * 0.62)}
          height={Math.round(size * 0.62)}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d={path} />
        </svg>
      ) : (
        <span className="font-bold leading-none" style={{ fontSize: Math.round(size * 0.5) }}>
          {initial}
        </span>
      )}
    </span>
  );
}

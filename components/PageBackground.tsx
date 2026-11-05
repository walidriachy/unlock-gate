export interface PageBackgroundValue {
  kind: string;
  value?: string;
  /** Blur radius in px, 0–30. */
  blur?: number;
}

/**
 * Full-bleed page background. Image/video layers are kept separate from the
 * content so the blur never softens text. A dark wash keeps foreground copy
 * readable over bright artwork.
 */
export default function PageBackground({
  background,
  wash = 0.55,
  contained = false,
}: {
  background?: PageBackgroundValue | null;
  wash?: number;
  /** Absolute instead of fixed — for editor previews. Parent needs `relative`. */
  contained?: boolean;
}) {
  const kind = background?.kind;
  const value = background?.value;
  if (!value || (kind !== "image" && kind !== "video")) return null;

  const blur = Math.min(30, Math.max(0, Number(background?.blur) || 0));
  const layerStyle = {
    filter: blur ? `blur(${blur}px)` : undefined,
    // Scaling stops the blurred edge from showing as a bright fringe.
    transform: blur ? "scale(1.06)" : undefined,
  };

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${contained ? "absolute z-0" : "fixed -z-10"} inset-0 overflow-hidden bg-[var(--color-ink)]`}
    >
      {kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={layerStyle}
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          style={layerStyle}
          src={value}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      <div className="absolute inset-0" style={{ background: `rgba(10,9,8,${wash})` }} />
    </div>
  );
}

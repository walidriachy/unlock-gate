const MARKS = [
  "360K+ actions", "200K members", "530K+ actions", "5.4M+ actions", "350K+ actions",
  "230K+ actions", "2.1M+ actions", "780K+ actions",
];

/** A slow single-row marquee (the "trusted by" strip). */
export default function LogoScroll() {
  const set = [...MARKS, ...MARKS];
  return (
    <div className="overflow-hidden py-2">
      <div className="icon-scroll" aria-hidden>
        {set.map((m, i) => (
          <span key={`${m}-${i}`} className="whitespace-nowrap text-sm font-medium faint">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

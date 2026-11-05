const ROW_A = [
  "YouTube", "Instagram", "Discord", "Spotify", "TikTok", "X", "Twitch", "SoundCloud", "Telegram",
  "Spotify", "Beatport", "Bandcamp", "Deezer", "Tidal", "Kick", "Roblox", "GitHub", "Pinterest",
];
const ROW_B = [
  "Apple Music", "Audiomack", "BandLab", "BeatStars", "Airbit", "Mixcloud", "Facebook", "Threads",
  "Bluesky", "Reddit", "LinkedIn", "Snapchat", "Steam", "Behance", "Dribbble", "DeviantArt",
  "Product Hunt", "Google Play",
];

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const set = [...items, ...items];
  return (
    <div className={`pw-row ${reverse ? "is-reverse" : ""}`} aria-hidden>
      {set.map((label, i) => (
        <span key={`${label}-${i}`} className="whitespace-nowrap text-sm muted">
          {label}
        </span>
      ))}
    </div>
  );
}

/** The "works with" platform wall: two rows drifting in opposite directions. */
export default function PlatformWall() {
  return (
    <div className="space-y-4 overflow-hidden">
      <Row items={ROW_A} />
      <Row items={ROW_B} reverse />
    </div>
  );
}

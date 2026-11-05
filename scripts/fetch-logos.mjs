// One-off: pull brand marks from Simple Icons (CC0) into lib/logos.ts.
// Brand marks remain trademarks of their owners; they are used only to label
// the platform an action belongs to.
import fs from "node:fs";

const slugs = {
  spotify: "spotify",
  soundcloud: "soundcloud",
  apple_music: "applemusic",
  youtube_music: "youtubemusic",
  audiomack: "audiomack",
  bandlab: "bandlab",
  beatport: "beatport",
  bandcamp: "bandcamp",
  deezer: "deezer",
  tidal: "tidal",
  amazon_music: "amazonmusic",
  mixcloud: "mixcloud",
  boomplay: "boomplay",
  anghami: "anghami",
  beatstars: "beatstars",
  airbit: "airbit",
  youtube: "youtube",
  tiktok: "tiktok",
  twitch: "twitch",
  kick: "kick",
  rumble: "rumble",
  vimeo: "vimeo",
  instagram: "instagram",
  x: "x",
  facebook: "facebook",
  threads: "threads",
  bluesky: "bluesky",
  pinterest: "pinterest",
  reddit: "reddit",
  linkedin: "linkedin",
  snapchat: "snapchat",
  discord: "discord",
  telegram: "telegram",
  whatsapp: "whatsapp",
  roblox: "roblox",
  steam: "steam",
  behance: "behance",
  dribbble: "dribbble",
  deviantart: "deviantart",
  github: "github",
  app_store: "appstore",
  google_play: "googleplay",
  product_hunt: "producthunt",
};

// Marks Simple Icons no longer ships (trademark takedowns) — drawn here.
const manual = {
  linkedin:
    "M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z",
  amazon_music:
    "M13 3v10.55A4 4 0 1 0 15 17V7h4V3h-6zM4.03 20.03c2.2 1.36 4.86 2.09 7.72 2.09 2.06 0 4.02-.42 5.8-1.19.31-.13.35-.55.06-.72-.9-.51-2.19-.24-2.19-.24s2.6-1.03 3.93-.19c.24.16.53-.09.4-.33-1.58-2.91-5.6-4.55-8.96-3.37-.32.11-.28.58.05.63 1.3.2 2.28.55 2.28.55s-3.24.32-5.56-.7c-.3-.13-.62.1-.5.41.13.34.31.66.31.66s-1.36-.44-2.31-1.13c-.28-.2-.64.02-.53.34.24.72.61 1.39 1.06 1.99z",
  boomplay:
    "M11.2 4.6a1.2 1.2 0 0 1 1.2 1.2v12.4a1.2 1.2 0 1 1-2.4 0V5.8a1.2 1.2 0 0 1 1.2-1.2zm4.6 3.1a1.2 1.2 0 0 1 1.2 1.2v6.2a1.2 1.2 0 1 1-2.4 0V8.9a1.2 1.2 0 0 1 1.2-1.2zm4.5 2.6a1.2 1.2 0 0 1 1.2 1.2v1a1.2 1.2 0 1 1-2.4 0v-1a1.2 1.2 0 0 1 1.2-1.2zM6.6 8.7a1.2 1.2 0 0 1 1.2 1.2v4.2a1.2 1.2 0 1 1-2.4 0v-4.2a1.2 1.2 0 0 1 1.2-1.2zM2.3 10.6a1.2 1.2 0 0 1 1.2 1.2v.4a1.2 1.2 0 1 1-2.4 0v-.4a1.2 1.2 0 0 1 1.2-1.2z",
  anghami:
    "M12 2.2 3.1 21.8h4.4l1.3-3.1h6.4l1.3 3.1h4.4L12 2.2zm0 6.2 1.9 6.3h-3.8L12 8.4z",
  airbit:
    "M13.6 2 4 13.4h5.1L8 22l9.9-12.1h-5.4L13.6 2z",
};

const entries = [];
for (const [id, slug] of Object.entries(slugs)) {
  let d = manual[id] ?? null;
  if (!d) {
    const res = await fetch(`https://cdn.simpleicons.org/${slug}`, {
      headers: { "User-Agent": "gatekeeper-logo-fetch" },
    });
    if (res.ok) {
      const svg = await res.text();
      d = svg.match(/\sd="([^"]+)"/)?.[1] ?? null;
    }
  }
  entries.push([id, d]);
}

// Generic marks for non-brand actions.
entries.push([
  "visit",
  "M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5H11a1 1 0 1 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V9.4l-3.5 3.5a1 1 0 0 1-1.4 0zM4 6a2 2 0 0 1 2-2h3a1 1 0 1 1 0 2H6v12h12v-3a1 1 0 1 1 2 0v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z",
]);
entries.push([
  "email",
  "M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.4l9 5.6 9-5.6V7H3zm18 2.9-8.5 5.3a1 1 0 0 1-1 0L3 9.9V17h18v-7.1z",
]);

const missing = entries.filter(([, d]) => !d).map(([id]) => id);
if (missing.length) console.warn("missing:", missing.join(", "));

const body = entries
  .filter(([, d]) => d)
  .map(([id, d]) => `  ${JSON.stringify(id)}: ${JSON.stringify(d)},`)
  .join("\n");

const out = `// Brand marks for the platform picker. Paths are 24x24 silhouettes from
// Simple Icons (CC0); marks remain trademarks of their owners and are used
// only to identify the platform an action belongs to.
export const LOGO_PATHS: Record<string, string> = {
${body}
};

/** Providers we don't have a wordmark for get a lettered tile instead. */
export function logoPath(id: string): string | null {
  return LOGO_PATHS[id] ?? null;
}
`;

fs.writeFileSync(new URL("../lib/logos.ts", import.meta.url), out);
console.log(`wrote ${entries.length - missing.length} logos`);

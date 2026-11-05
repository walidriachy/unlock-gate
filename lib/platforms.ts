// The catalog of platforms and actions a link can ask for.
// Mirrors the recon's "80 actions across 40+ platforms" list.
// `glyph` and `color` stand in for each site's real logo (we don't ship their marks).

export type ActionKind =
  | "music"
  | "video"
  | "social"
  | "community"
  | "games"
  | "design"
  | "apps"
  | "email";

export type VerificationMode = "oauth" | "click" | "email";

export interface ProviderAction {
  id: string;
  label: string;
  type: string;
  needsTarget: boolean;
  targetHint?: string;
  verification: VerificationMode;
}

export interface Provider {
  id: string;
  name: string;
  kind: ActionKind;
  color: string;
  glyph: string;
  actions: ProviderAction[];
}

export const KIND_LABELS: Record<ActionKind, string> = {
  music: "Music",
  video: "Video & streaming",
  social: "Social",
  community: "Communities & messaging",
  games: "Games",
  design: "Design & art",
  apps: "Apps, code & the rest",
  email: "Email",
};

const ytVer = "click" as const;

export const PROVIDERS: Provider[] = [
  // ---------------- Music ----------------
  {
    id: "spotify",
    name: "Spotify",
    kind: "music",
    color: "#1db954",
    glyph: "🟢",
    actions: [
      { id: "spotify_follow_artist", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist or profile URL", verification: "click" },
      { id: "spotify_like_song", label: "Like song", type: "like", needsTarget: true, targetHint: "track URL", verification: "click" },
      { id: "spotify_follow_playlist", label: "Follow playlist", type: "follow", needsTarget: true, targetHint: "playlist URL", verification: "click" },
    ],
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    kind: "music",
    color: "#ff5500",
    glyph: "🟠",
    actions: [
      { id: "soundcloud_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" },
      { id: "soundcloud_like", label: "Like track", type: "like", needsTarget: true, targetHint: "track URL", verification: "click" },
      { id: "soundcloud_repost", label: "Repost track", type: "repost", needsTarget: true, targetHint: "track URL", verification: "click" },
      { id: "soundcloud_comment", label: "Comment on track", type: "comment", needsTarget: true, targetHint: "track URL", verification: "click" },
    ],
  },
  {
    id: "apple_music",
    name: "Apple Music",
    kind: "music",
    color: "#fa243c",
    glyph: "🍎",
    actions: [{ id: "apple_music_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" }],
  },
  {
    id: "youtube_music",
    name: "YouTube Music",
    kind: "music",
    color: "#ff0000",
    glyph: "🎵",
    actions: [{ id: "youtube_music_subscribe", label: "Subscribe to channel", type: "subscribe", needsTarget: true, targetHint: "channel URL", verification: "click" }],
  },
  {
    id: "audiomack",
    name: "Audiomack",
    kind: "music",
    color: "#ffa200",
    glyph: "🎧",
    actions: [
      { id: "audiomack_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" },
      { id: "audiomack_like", label: "Like song", type: "like", needsTarget: true, targetHint: "song URL", verification: "click" },
    ],
  },
  {
    id: "bandlab",
    name: "BandLab",
    kind: "music",
    color: "#17c3b2",
    glyph: "🎛️",
    actions: [{ id: "bandlab_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" }],
  },
  {
    id: "beatport",
    name: "Beatport",
    kind: "music",
    color: "#01ff95",
    glyph: "🥁",
    actions: [{ id: "beatport_follow", label: "Follow artist or label", type: "follow", needsTarget: true, targetHint: "artist/label URL", verification: "click" }],
  },
  {
    id: "bandcamp",
    name: "Bandcamp",
    kind: "music",
    color: "#629aa9",
    glyph: "🎼",
    actions: [{ id: "bandcamp_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" }],
  },
  {
    id: "deezer",
    name: "Deezer",
    kind: "music",
    color: "#a238ff",
    glyph: "🟣",
    actions: [{ id: "deezer_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" }],
  },
  {
    id: "tidal",
    name: "Tidal",
    kind: "music",
    color: "#00ffff",
    glyph: "🌊",
    actions: [{ id: "tidal_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" }],
  },
  {
    id: "amazon_music",
    name: "Amazon Music",
    kind: "music",
    color: "#25d1da",
    glyph: "🎶",
    actions: [{ id: "amazon_music_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" }],
  },
  {
    id: "mixcloud",
    name: "Mixcloud",
    kind: "music",
    color: "#5000ff",
    glyph: "📻",
    actions: [{ id: "mixcloud_follow", label: "Follow creator", type: "follow", needsTarget: true, targetHint: "creator URL", verification: "click" }],
  },
  {
    id: "boomplay",
    name: "Boomplay",
    kind: "music",
    color: "#f60",
    glyph: "🔊",
    actions: [{ id: "boomplay_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" }],
  },
  {
    id: "anghami",
    name: "Anghami",
    kind: "music",
    color: "#8f00ff",
    glyph: "🎙️",
    actions: [{ id: "anghami_follow", label: "Follow artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" }],
  },
  {
    id: "beatstars",
    name: "BeatStars",
    kind: "music",
    color: "#ff5a5f",
    glyph: "🎹",
    actions: [{ id: "beatstars_follow", label: "Follow producer", type: "follow", needsTarget: true, targetHint: "producer URL", verification: "click" }],
  },
  {
    id: "airbit",
    name: "Airbit",
    kind: "music",
    color: "#ff7a00",
    glyph: "🎚️",
    actions: [{ id: "airbit_follow", label: "Follow producer", type: "follow", needsTarget: true, targetHint: "producer URL", verification: "click" }],
  },

  // ---------------- Video & streaming ----------------
  {
    id: "youtube",
    name: "YouTube",
    kind: "video",
    color: "#ff0033",
    glyph: "▶️",
    actions: [
      { id: "youtube_subscribe", label: "Subscribe", type: "subscribe", needsTarget: true, targetHint: "channel URL", verification: ytVer },
      { id: "youtube_subscribe_bell", label: "Subscribe with notifications", type: "subscribe", needsTarget: true, targetHint: "channel URL", verification: ytVer },
      { id: "youtube_like", label: "Like video", type: "like", needsTarget: true, targetHint: "video URL", verification: ytVer },
      { id: "youtube_comment", label: "Comment", type: "comment", needsTarget: true, targetHint: "video URL", verification: ytVer },
      { id: "youtube_like_comment", label: "Like and comment", type: "like_comment", needsTarget: true, targetHint: "video URL", verification: ytVer },
      { id: "youtube_watch", label: "Watch video", type: "watch", needsTarget: true, targetHint: "video URL", verification: ytVer },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    kind: "video",
    color: "#ff0050",
    glyph: "🎵",
    actions: [
      { id: "tiktok_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" },
      { id: "tiktok_like", label: "Like post", type: "like", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "tiktok_comment", label: "Comment", type: "comment", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "tiktok_use_sound", label: "Use this sound", type: "create", needsTarget: false, verification: "click" },
    ],
  },
  {
    id: "twitch",
    name: "Twitch",
    kind: "video",
    color: "#9146ff",
    glyph: "📺",
    actions: [{ id: "twitch_follow", label: "Follow streamer", type: "follow", needsTarget: true, targetHint: "channel URL", verification: "click" }],
  },
  {
    id: "kick",
    name: "Kick",
    kind: "video",
    color: "#53fc18",
    glyph: "🟩",
    actions: [{ id: "kick_follow", label: "Follow streamer", type: "follow", needsTarget: true, targetHint: "channel URL", verification: "click" }],
  },
  {
    id: "rumble",
    name: "Rumble",
    kind: "video",
    color: "#85c742",
    glyph: "🟢",
    actions: [
      { id: "rumble_subscribe", label: "Subscribe", type: "subscribe", needsTarget: true, targetHint: "channel URL", verification: "click" },
      { id: "rumble_like", label: "Like video", type: "like", needsTarget: true, targetHint: "video URL", verification: "click" },
    ],
  },
  {
    id: "vimeo",
    name: "Vimeo",
    kind: "video",
    color: "#1ab7ea",
    glyph: "🎬",
    actions: [{ id: "vimeo_follow", label: "Follow creator", type: "follow", needsTarget: true, targetHint: "creator URL", verification: "click" }],
  },

  // ---------------- Social ----------------
  {
    id: "instagram",
    name: "Instagram",
    kind: "social",
    color: "#e1306c",
    glyph: "📸",
    actions: [
      { id: "instagram_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" },
      { id: "instagram_like", label: "Like post", type: "like", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "instagram_comment", label: "Comment", type: "comment", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "instagram_use_audio", label: "Use this audio", type: "create", needsTarget: false, verification: "click" },
    ],
  },
  {
    id: "x",
    name: "X",
    kind: "social",
    color: "#e7e9ea",
    glyph: "✖️",
    actions: [
      { id: "x_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "profile URL or @handle", verification: "click" },
      { id: "x_like", label: "Like post", type: "like", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "x_reply", label: "Reply", type: "comment", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "x_repost", label: "Repost", type: "repost", needsTarget: true, targetHint: "post URL", verification: "click" },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    kind: "social",
    color: "#1877f2",
    glyph: "📘",
    actions: [
      { id: "facebook_like_page", label: "Like page", type: "follow", needsTarget: true, targetHint: "page URL", verification: "click" },
      { id: "facebook_like_post", label: "Like post", type: "like", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "facebook_comment", label: "Comment", type: "comment", needsTarget: true, targetHint: "post URL", verification: "click" },
      { id: "facebook_share", label: "Share post", type: "repost", needsTarget: true, targetHint: "post URL", verification: "click" },
    ],
  },
  {
    id: "threads",
    name: "Threads",
    kind: "social",
    color: "#e7e9ea",
    glyph: "🧵",
    actions: [{ id: "threads_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" }],
  },
  {
    id: "bluesky",
    name: "Bluesky",
    kind: "social",
    color: "#0085ff",
    glyph: "🦋",
    actions: [{ id: "bluesky_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" }],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    kind: "social",
    color: "#e60023",
    glyph: "📌",
    actions: [{ id: "pinterest_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" }],
  },
  {
    id: "reddit",
    name: "Reddit",
    kind: "social",
    color: "#ff4500",
    glyph: "👽",
    actions: [
      { id: "reddit_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "subreddit or user URL", verification: "click" },
      { id: "reddit_upvote", label: "Upvote post", type: "like", needsTarget: true, targetHint: "post URL", verification: "click" },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    kind: "social",
    color: "#0a66c2",
    glyph: "💼",
    actions: [
      { id: "linkedin_connect", label: "Connect", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" },
      { id: "linkedin_follow_company", label: "Follow company", type: "follow", needsTarget: true, targetHint: "company URL", verification: "click" },
    ],
  },
  {
    id: "snapchat",
    name: "Snapchat",
    kind: "social",
    color: "#fffc00",
    glyph: "👻",
    actions: [{ id: "snapchat_add", label: "Add", type: "follow", needsTarget: true, targetHint: "username", verification: "click" }],
  },

  // ---------------- Communities & messaging ----------------
  {
    id: "discord",
    name: "Discord",
    kind: "community",
    color: "#5865f2",
    glyph: "💬",
    actions: [
      { id: "discord_join", label: "Join server", type: "join", needsTarget: true, targetHint: "invite URL", verification: "oauth" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    kind: "community",
    color: "#2aabee",
    glyph: "✈️",
    actions: [{ id: "telegram_join", label: "Join channel", type: "join", needsTarget: true, targetHint: "channel or invite URL", verification: "click" }],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    kind: "community",
    color: "#25d366",
    glyph: "🟢",
    actions: [{ id: "whatsapp_join", label: "Join group", type: "join", needsTarget: true, targetHint: "group invite URL", verification: "click" }],
  },

  // ---------------- Games ----------------
  {
    id: "roblox",
    name: "Roblox",
    kind: "games",
    color: "#e2231a",
    glyph: "🧱",
    actions: [
      { id: "roblox_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "user URL", verification: "click" },
      { id: "roblox_join_group", label: "Join group", type: "join", needsTarget: true, targetHint: "group URL", verification: "click" },
      { id: "roblox_favorite_game", label: "Favorite game", type: "like", needsTarget: true, targetHint: "game URL", verification: "click" },
      { id: "roblox_like_game", label: "Like game", type: "like", needsTarget: true, targetHint: "game URL", verification: "click" },
    ],
  },
  {
    id: "steam",
    name: "Steam",
    kind: "games",
    color: "#66c0f4",
    glyph: "🎮",
    actions: [
      { id: "steam_follow_curator", label: "Follow curator", type: "follow", needsTarget: true, targetHint: "curator URL", verification: "click" },
      { id: "steam_comment_profile", label: "Comment on profile", type: "comment", needsTarget: true, targetHint: "profile URL", verification: "click" },
      { id: "steam_join_group", label: "Join group", type: "join", needsTarget: true, targetHint: "group URL", verification: "click" },
    ],
  },

  // ---------------- Design & art ----------------
  {
    id: "behance",
    name: "Behance",
    kind: "design",
    color: "#1769ff",
    glyph: "🅱️",
    actions: [{ id: "behance_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" }],
  },
  {
    id: "dribbble",
    name: "Dribbble",
    kind: "design",
    color: "#ea4c89",
    glyph: "🏀",
    actions: [
      { id: "dribbble_follow", label: "Follow designer", type: "follow", needsTarget: true, targetHint: "profile URL", verification: "click" },
      { id: "dribbble_like", label: "Like shot", type: "like", needsTarget: true, targetHint: "shot URL", verification: "click" },
    ],
  },
  {
    id: "deviantart",
    name: "DeviantArt",
    kind: "design",
    color: "#05cc47",
    glyph: "🎨",
    actions: [
      { id: "deviantart_watch", label: "Watch artist", type: "follow", needsTarget: true, targetHint: "artist URL", verification: "click" },
      { id: "deviantart_favorite", label: "Favorite artwork", type: "like", needsTarget: true, targetHint: "artwork URL", verification: "click" },
    ],
  },

  // ---------------- Apps, code & the rest ----------------
  {
    id: "github",
    name: "GitHub",
    kind: "apps",
    color: "#e7e9ea",
    glyph: "🐙",
    actions: [
      { id: "github_follow", label: "Follow", type: "follow", needsTarget: true, targetHint: "user or org URL", verification: "oauth" },
      { id: "github_star", label: "Star repository", type: "like", needsTarget: true, targetHint: "repo URL", verification: "oauth" },
    ],
  },
  {
    id: "app_store",
    name: "App Store",
    kind: "apps",
    color: "#0a84ff",
    glyph: "📱",
    actions: [{ id: "app_store_install", label: "Install app", type: "install", needsTarget: true, targetHint: "store URL", verification: "click" }],
  },
  {
    id: "google_play",
    name: "Google Play",
    kind: "apps",
    color: "#34a853",
    glyph: "▶️",
    actions: [{ id: "google_play_install", label: "Install app", type: "install", needsTarget: true, targetHint: "store URL", verification: "click" }],
  },
  {
    id: "product_hunt",
    name: "Product Hunt",
    kind: "apps",
    color: "#da552f",
    glyph: "🐱",
    actions: [
      { id: "product_hunt_upvote", label: "Upvote product", type: "like", needsTarget: true, targetHint: "product URL", verification: "click" },
      { id: "product_hunt_follow", label: "Follow maker", type: "follow", needsTarget: true, targetHint: "maker URL", verification: "click" },
    ],
  },
  {
    id: "visit",
    name: "Any website",
    kind: "apps",
    color: "#9a9ab8",
    glyph: "🔗",
    actions: [{ id: "visit_page", label: "Visit a page", type: "visit", needsTarget: true, targetHint: "page URL", verification: "click" }],
  },
  {
    id: "email",
    name: "Email",
    kind: "email",
    color: "#7c5cff",
    glyph: "✉️",
    actions: [{ id: "email_join", label: "Join your email list", type: "email", needsTarget: false, verification: "email" }],
  },
];

export const ALL_ACTIONS: { provider: Provider; action: ProviderAction }[] = PROVIDERS.flatMap(
  (provider) => provider.actions.map((action) => ({ provider, action }))
);

export function findAction(actionId: string) {
  return ALL_ACTIONS.find((a) => a.action.id === actionId);
}

export function providerById(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

/** Build a sensible public URL to send a visitor to for a given action target. */
export function targetUrl(providerId: string, target: string | null): string {
  const t = (target || "").trim();
  if (!t) return "#";
  if (/^https?:\/\//i.test(t)) return t;
  const handle = t.replace(/^@/, "");
  const map: Record<string, string> = {
    youtube: `https://youtube.com/@${handle}`,
    youtube_music: `https://music.youtube.com/@${handle}`,
    tiktok: `https://tiktok.com/@${handle}`,
    instagram: `https://instagram.com/${handle}`,
    x: `https://x.com/${handle}`,
    twitch: `https://twitch.tv/${handle}`,
    kick: `https://kick.com/${handle}`,
    spotify: `https://open.spotify.com/${handle}`,
    soundcloud: `https://soundcloud.com/${handle}`,
    discord: `https://discord.gg/${handle}`,
    telegram: `https://t.me/${handle}`,
    github: `https://github.com/${handle}`,
    threads: `https://threads.net/@${handle}`,
    bluesky: `https://bsky.app/profile/${handle}`,
    snapchat: `https://snapchat.com/add/${handle}`,
  };
  return map[providerId] ? map[providerId] : `https://${t}`;
}

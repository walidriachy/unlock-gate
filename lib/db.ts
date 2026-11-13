import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// ---------------------------------------------------------------------------
// A tiny file-backed store. Everything the app owns lives here.
// Swap this module for Postgres before real scale — see replica/schema.sql.
// Access rule: every mutating helper returns data already filtered by owner,
// and every caller checks ownership before writing.
// ---------------------------------------------------------------------------

export type Tier = "free" | "pro" | "lifetime";
export type DestinationKind = "url" | "file" | "text";
export type LinkStatus = "draft" | "published" | "paused" | "removed";
export type EventType = "view" | "step" | "unlock" | "destination";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  provider: "email" | "google" | "discord";
  role: "user" | "admin" | "support";
  username: string | null;
  displayName: string;
  avatarUrl: string;
  bio: string;
  socials: Record<string, string>;
  emailVerifiedAt: number | null;
  /** Incremented on password reset; invalidates every old session cookie. */
  sessionVersion?: number;
  /** Account suspended by an admin. */
  suspended?: boolean;
  createdAt: number;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: Tier;
  status: "active" | "past_due" | "canceled";
  currentPeriodEnd: number | null;
  stripeCustomerId: string | null;
  startedAt: number;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
}

export interface Action {
  id: string;
  linkId: string;
  position: number;
  provider: string;
  actionType: string;
  actionId: string;
  label: string;
  target: string | null;
  iconKey: string;
  verificationMode: "oauth" | "click" | "email";
}

export interface Link {
  id: string;
  userId: string | null; // null = unclaimed (created without an account)
  slug: string;
  customSlug: string | null;
  title: string;
  accentColor: string | null;
  coverUrl: string | null;
  background: { kind: string; value?: string };
  widget?: { kind: "none" | "video" | "track"; value?: string; title?: string } | null;
  destinationType: DestinationKind;
  destinationUrl: string | null;
  fileId: string | null;
  textSnippet: string | null;
  status: LinkStatus;
  scheduledAt: number | null;
  expiresAt: number | null;
  collectionId: string | null;
  views: number;
  unlocks: number;
  createdAt: number;
  updatedAt: number;
}

export interface LinkEvent {
  id: string;
  linkId: string;
  releaseId?: string | null;
  type: EventType;
  stepIndex: number | null;
  country: string | null;
  device: string | null;
  referrer: string | null;
  visitorToken: string | null;
  occurredAt: number;
}

export interface Unlock {
  id: string;
  linkId: string;
  userId: string | null;
  visitorToken: string;
  stepsCompleted: number[];
  country: string | null;
  device: string | null;
  referrer: string | null;
  completedAt: number;
  /** Server time each step's platform was opened (via the "check" intent). */
  openedAt?: Record<number, number>;
  /** Server time this visitor submitted an email for this link. */
  emailAt?: number;
}

export interface EmailList {
  id: string;
  userId: string;
  name: string;
  createdAt: number;
}

export interface Subscriber {
  id: string;
  listId: string;
  email: string;
  sourceLinkId: string | null;
  joinedAt: number;
  unsubscribedAt: number | null;
}

export interface BioPage {
  id: string;
  userId: string;
  username: string;
  theme: string;
  font: string;
  accent: string;
  buttonStyle: string;
  corners: string;
  background: { kind: string; value?: string };
  emailListId: string | null;
  publishedAt: number | null;
  views: number;
  createdAt: number;
  updatedAt: number;
}

export interface BioButton {
  id: string;
  bioPageId: string;
  position: number;
  kind: "link" | "unlock" | "header" | "social";
  label: string;
  url: string | null;
  iconKey: string;
  linkId: string | null;
  style: string | null;
  highlight: "none" | "pulse" | "shine" | "wobble";
  startsAt: number | null;
  endsAt: number | null;
  clicks: number;
}

export interface ShortLink {
  id: string;
  userId: string;
  slug: string;
  destinationUrl: string;
  title: string;
  collectionId: string | null;
  clicks: number;
  createdAt: number;
  updatedAt: number;
}

export interface Release {
  id: string;
  userId: string;
  slug: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  releaseDate: number | null;
  notifyEnabled: boolean;
  notifyListId: string | null;
  bonus: { actionId: string; label: string } | null;
  bonusLinkId: string | null;
  views: number;
  createdAt: number;
  updatedAt: number;
}

export interface ReleaseService {
  id: string;
  releaseId: string;
  service: string;
  url: string;
  position: number;
  plays: number;
}

export interface NotifySignup {
  id: string;
  releaseId: string;
  email: string;
  createdAt: number;
}

export interface FileRecord {
  id: string;
  userId: string | null;
  name: string;
  size: number;
  mime: string;
  storedName: string;
  createdAt: number;
}

export interface SavedUnlock {
  id: string;
  userId: string;
  linkId: string;
  completedAt: number;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  detail: string | null;
  createdAt: number;
}

export interface CryptoPayment {
  id: string;
  userId: string;
  tier: "pro" | "lifetime";
  memo: string;
  amount: string;
  mint: string | null;
  wallet: string;
  status: "pending" | "paid";
  createdAt: number;
  paidAt: number | null;
  /** On-chain signature that paid this order; each one is used once. */
  signature?: string;
}

export interface IgAccount {
  id: string;
  userId: string;
  igUserId: string;
  username: string;
  accessToken: string;
  tokenExpiresAt: number | null;
  createdAt: number;
}

export interface AutomationCampaign {
  id: string;
  userId: string;
  igAccountId: string;
  name: string;
  keywords: string[];
  matchMode: "exact" | "contains";
  linkId: string | null;
  dmMessage: string;
  publicReply: string | null;
  followGate: boolean;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DB {
  users: User[];
  subscriptions: Subscription[];
  collections: Collection[];
  links: Link[];
  actions: Action[];
  linkEvents: LinkEvent[];
  unlocks: Unlock[];
  emailLists: EmailList[];
  subscribers: Subscriber[];
  bioPages: BioPage[];
  bioButtons: BioButton[];
  shortLinks: ShortLink[];
  releases: Release[];
  releaseServices: ReleaseService[];
  notifySignups: NotifySignup[];
  files: FileRecord[];
  savedUnlocks: SavedUnlock[];
  auditLog: AuditEntry[];
  settings: Record<string, boolean>;
  config: Record<string, string>;
  cryptoPayments: CryptoPayment[];
  igAccounts: IgAccount[];
  automations: AutomationCampaign[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");
export const UPLOAD_DIR = path.join(DB_DIR, "uploads");

export function uid(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

export function randomToken(bytes = 16): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function shortSlug(len = 6): string {
  const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  const bytes = crypto.randomBytes(len);
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function emptyDB(): DB {
  return {
    users: [],
    subscriptions: [],
    collections: [],
    links: [],
    actions: [],
    linkEvents: [],
    unlocks: [],
    emailLists: [],
    subscribers: [],
    bioPages: [],
    bioButtons: [],
    shortLinks: [],
    releases: [],
    releaseServices: [],
    notifySignups: [],
    files: [],
    savedUnlocks: [],
    auditLog: [],
    settings: {},
    config: {},
    cryptoPayments: [],
    igAccounts: [],
    automations: [],
  };
}

const KEYS = Object.keys(emptyDB()) as (keyof DB)[];

export function readDB(): DB {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    const base = emptyDB();
    for (const key of KEYS) {
      // @ts-expect-error dynamic assignment across a homogeneous record of arrays
      base[key] = Array.isArray(parsed[key]) ? parsed[key] : [];
    }
    // Backfill role on users created before roles existed.
    for (const u of base.users) {
      if (!u.role) (u as any).role = "user";
    }
    return base;
  } catch (err) {
    // Only a missing file means "first run". Any other error (a corrupt or
    // half-written file, a permissions problem) must not be answered by
    // overwriting every user's data with an empty database.
    if ((err as NodeJS.ErrnoException)?.code !== "ENOENT") throw err;
    const db = emptyDB();
    writeDB(db);
    return db;
  }
}

export function writeDB(db: DB): void {
  fs.mkdirSync(DB_DIR, { recursive: true });
  // Write to a temp file and rename, so a crash mid-write can't leave a
  // truncated db.json behind.
  const tmp = `${DB_PATH}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
}

export function availableSlug(db: DB, base: string, taken: (s: string) => boolean): string {
  const slug = slugify(base) || shortSlug();
  if (!taken(slug)) return slug;
  for (let i = 0; i < 40; i++) {
    const candidate = `${slug}-${shortSlug(3)}`;
    if (!taken(candidate)) return candidate;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

/** The oldest list a user owns, or a fresh "My list". */
export function ensureDefaultList(db: DB, userId: string): EmailList {
  const existing = db.emailLists
    .filter((l) => l.userId === userId)
    .sort((a, b) => a.createdAt - b.createdAt)[0];
  if (existing) return existing;
  const list: EmailList = { id: uid("el"), userId, name: "My list", createdAt: Date.now() };
  db.emailLists.push(list);
  return list;
}

// ---------------------------------------------------------------------------
// Seed — a demo creator so the dashboard is alive on first run.
// ---------------------------------------------------------------------------

/**
 * Development: seed the demo creator and a demo admin (admin@gatekeeper.app /
 * admin1234) so the app is explorable.
 *
 * Production: never seed demo data or a known password. The first admin comes
 * from ADMIN_EMAIL + ADMIN_PASSWORD (12+ characters) when no admin exists;
 * remove ADMIN_PASSWORD from the environment once the account is created.
 * SEED_DEMO=1 forces the demo seed (e.g. for a public demo deployment).
 */
export function ensureSeed(): void {
  const production = process.env.NODE_ENV === "production";
  const db = readDB();
  if (db.users.length === 0 && (!production || process.env.SEED_DEMO === "1")) {
    seedDemo(db);
  }
  if (!db.users.some((u) => u.role === "admin")) {
    let email = "admin@gatekeeper.app";
    let password = "admin1234";
    if (production) {
      const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const envPassword = process.env.ADMIN_PASSWORD;
      if (!envEmail || !envPassword || envPassword.length < 12) {
        console.warn("[gatekeeper] No admin account. Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) to create one.");
        return;
      }
      if (db.users.some((u) => u.email === envEmail)) {
        console.warn(`[gatekeeper] ${envEmail} already exists; promote it to admin instead of seeding.`);
        return;
      }
      email = envEmail;
      password = envPassword;
    }
    const now = Date.now();
    const admin: User = {
      id: uid("u"),
      email,
      passwordHash: hashPassword(password),
      provider: "email",
      role: "admin",
      username: "admin",
      displayName: "Gatekeeper Admin",
      avatarUrl: "",
      bio: "",
      socials: {},
      emailVerifiedAt: now,
      createdAt: now,
    };
    db.users.push(admin);
    const sub: Subscription = {
      id: uid("sub"),
      userId: admin.id,
      tier: "lifetime",
      status: "active",
      currentPeriodEnd: null,
      stripeCustomerId: null,
      startedAt: now,
    };
    db.subscriptions.push(sub);
    writeDB(db);
  }
}

function seedDemo(db: DB): void {
  const now = Date.now();
  const day = 86_400_000;

  const userId = uid("u");
  const user: User = {
    id: userId,
    email: "demo@gatekeeper.app",
    passwordHash: hashPassword("demo1234"),
    provider: "email",
    username: "nova.beats",
    displayName: "nova.beats",
    avatarUrl: "",
    bio: "Producer & sound designer. Free packs every Friday.",
    socials: {
      youtube: "@novabeats",
      discord: "novabeats",
      x: "@novabeats",
      spotify: "artist/novabeats",
    },
    emailVerifiedAt: now - 40 * day,
    role: "user",
    createdAt: now - 60 * day,
  };
  db.users.push(user);
  db.subscriptions.push({
    id: uid("sub"),
    userId,
    tier: "pro",
    status: "active",
    currentPeriodEnd: now + 20 * day,
    stripeCustomerId: null,
    startedAt: now - 30 * day,
  });

  const list: EmailList = { id: uid("el"), userId, name: "Free Sample Pack list", createdAt: now - 30 * day };
  db.emailLists.push(list);

  const cx = crypto.randomBytes(0); // touch to keep crypto import used in all paths
  void cx;

  const linkDefs: {
    title: string;
    slug: string;
    type: DestinationKind;
    url?: string;
    text?: string;
    actions: { provider: string; actionId: string; label: string; target: string; verification: "oauth" | "click" | "email"; icon: string }[];
  }[] = [
    {
      title: "Free Sample Pack Vol. 3",
      slug: "free-sample-pack-vol-3",
      type: "url",
      url: "https://example.com/drop/sample-pack-vol-3.zip",
      actions: [
        { provider: "youtube", actionId: "youtube_subscribe", label: "Subscribe to @nova.beats", target: "https://youtube.com/@novabeats", verification: "click", icon: "▶️" },
        { provider: "discord", actionId: "discord_join", label: "Join server", target: "https://discord.gg/novabeats", verification: "oauth", icon: "💬" },
        { provider: "x", actionId: "x_follow", label: "Follow @nova.beats", target: "https://x.com/novabeats", verification: "click", icon: "✖️" },
      ],
    },
    {
      title: "Cinematic LUT Pack",
      slug: "cinematic-lut-pack",
      type: "file",
      actions: [
        { provider: "youtube", actionId: "youtube_subscribe", label: "Subscribe to channel", target: "https://youtube.com/@novabeats", verification: "click", icon: "▶️" },
        { provider: "email", actionId: "email_join", label: "Join email list", target: "", verification: "email", icon: "✉️" },
      ],
    },
    {
      title: "808 Starter Kit — unlock code",
      slug: "808-starter-kit",
      type: "text",
      text: "CODE-808-UNLOCK-2026",
      actions: [
        { provider: "instagram", actionId: "instagram_follow", label: "Follow @nova.beats", target: "https://instagram.com/novabeats", verification: "click", icon: "📸" },
        { provider: "spotify", actionId: "spotify_follow_artist", label: "Follow on Spotify", target: "https://open.spotify.com/artist/novabeats", verification: "click", icon: "🟢" },
      ],
    },
    {
      title: "Stream Overlay Pack",
      slug: "stream-overlay-pack",
      type: "url",
      url: "https://example.com/drop/overlays.zip",
      actions: [
        { provider: "twitch", actionId: "twitch_follow", label: "Follow on Twitch", target: "https://twitch.tv/novabeats", verification: "click", icon: "📺" },
        { provider: "discord", actionId: "discord_join", label: "Join server", target: "https://discord.gg/novabeats", verification: "oauth", icon: "💬" },
      ],
    },
  ];

  // A demo file for the file-destination link.
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const storedName = "demo-lut-pack.txt";
  fs.writeFileSync(
    path.join(UPLOAD_DIR, storedName),
    "Thanks for subscribing! Drop this file into your LUT folder.\n(demo file — replace with your real pack)\n"
  );
  const fileId = uid("file");
  db.files.push({
    id: fileId,
    userId,
    name: "cinematic-lut-pack.zip",
    size: fs.statSync(path.join(UPLOAD_DIR, storedName)).size,
    mime: "application/zip",
    storedName,
    createdAt: now - 20 * day,
  });

  const linkIds: string[] = [];
  linkDefs.forEach((def, i) => {
    const linkId = uid("link");
    linkIds.push(linkId);
    const isFile = def.type === "file";
    const link: Link = {
      id: linkId,
      userId,
      slug: def.slug,
      customSlug: def.slug,
      title: def.title,
      accentColor: null,
      coverUrl: null,
      background: { kind: "gradient" },
      destinationType: def.type,
      destinationUrl: def.url ?? null,
      fileId: isFile ? fileId : null,
      textSnippet: def.text ?? null,
      status: "published",
      scheduledAt: null,
      expiresAt: null,
      collectionId: null,
      views: 0,
      unlocks: 0,
      createdAt: now - (30 - i * 5) * day,
      updatedAt: now - i * day,
    };

    // views + unlocks over the last 30 days
    const baseViews = [4200, 2600, 1500, 900][i] ?? 600;
    const conv = [0.42, 0.55, 0.31, 0.38][i] ?? 0.4;
    let views = 0;
    let unlocks = 0;
    for (let d = 29; d >= 0; d--) {
      const trend = 1 + (29 - d) / 60;
      const dayViews = Math.round((baseViews / 30) * trend * (0.6 + Math.random() * 0.9));
      const dayUnlocks = Math.round(dayViews * conv * (0.7 + Math.random() * 0.6));
      views += dayViews;
      unlocks += dayUnlocks;
      const at = now - d * day + Math.floor(Math.random() * day);
      db.linkEvents.push({
        id: uid("ev"),
        linkId,
        type: "view",
        stepIndex: null,
        country: pick(["US", "GB", "DE", "BR", "IN", "FR", "CA", "NG"]),
        device: pick(["mobile", "mobile", "mobile", "desktop", "tablet"]),
        referrer: pick(["youtube.com", "tiktok.com", "instagram.com", "discord.com", "direct", "google.com"]),
        visitorToken: null,
        occurredAt: at,
      });
      for (let u = 0; u < Math.min(dayUnlocks, 4); u++) {
        db.linkEvents.push({
          id: uid("ev"),
          linkId,
          type: "unlock",
          stepIndex: null,
          country: pick(["US", "GB", "DE", "BR", "IN"]),
          device: "mobile",
          referrer: pick(["youtube.com", "tiktok.com", "direct"]),
          visitorToken: null,
          occurredAt: at + u,
        });
      }
      if (i === 0 && d < 12) {
        // a few step funnel events on the main link
        db.linkEvents.push({ id: uid("ev"), linkId, type: "step", stepIndex: 0, country: "US", device: "mobile", referrer: "youtube.com", visitorToken: null, occurredAt: at + 10 });
        db.linkEvents.push({ id: uid("ev"), linkId, type: "step", stepIndex: 1, country: "US", device: "mobile", referrer: "youtube.com", visitorToken: null, occurredAt: at + 20 });
        db.linkEvents.push({ id: uid("ev"), linkId, type: "destination", stepIndex: null, country: "US", device: "mobile", referrer: "youtube.com", visitorToken: null, occurredAt: at + 30 });
      }
    }
    link.views = views;
    link.unlocks = unlocks;
    db.links.push(link);

    def.actions.forEach((a, idx) => {
      db.actions.push({
        id: uid("act"),
        linkId,
        position: idx,
        provider: a.provider,
        actionType: a.actionId.split("_").slice(1).join("_") || "action",
        actionId: a.actionId,
        label: a.label,
        target: a.target || null,
        iconKey: a.icon,
        verificationMode: a.verification,
      });
    });
  });

  // email subscribers
  const emails = [
    "jane@fanmail.com", "marcus@beats.net", "priya@studio.io", "tom@lofi.fm", "aisha@waves.co",
    "leo@producer.dev", "mika@synth.cc", "ronin@808s.io", "dara@mixdown.fm", "suki@loops.io",
    "omar@drums.dev", "lina@studio.fm", "kai@beats.io", "zoe@vox.co", "noah@midi.dev",
  ];
  emails.forEach((email, i) => {
    db.subscribers.push({
      id: uid("s"),
      listId: list.id,
      email,
      sourceLinkId: linkIds[1],
      joinedAt: now - Math.floor(Math.random() * 25) * day,
      unsubscribedAt: null,
    });
  });

  // collections
  const coll: Collection = { id: uid("col"), userId, name: "Friday drops", createdAt: now - 20 * day };
  db.collections.push(coll);
  db.links[0].collectionId = coll.id;
  db.links[2].collectionId = coll.id;

  // bio page
  const bio: BioPage = {
    id: uid("bio"),
    userId,
    username: "nova.beats",
    theme: "aurora",
    font: "sans",
    accent: "#7c5cff",
    buttonStyle: "glass",
    corners: "rounded",
    background: { kind: "theme" },
    emailListId: list.id,
    publishedAt: now - 18 * day,
    views: 2480,
    createdAt: now - 20 * day,
    updatedAt: now - 2 * day,
  };
  db.bioPages.push(bio);
  const bioBtnDefs: { kind: BioButton["kind"]; label: string; url?: string; icon: string; linkId?: string; highlight?: BioButton["highlight"] }[] = [
    { kind: "header", label: "New music", icon: "" },
    { kind: "link", label: "Watch the studio tour", url: "https://youtube.com/@novabeats", icon: "▶️" },
    { kind: "unlock", label: "Free Sample Pack Vol. 3", linkId: linkIds[0], icon: "🔒", highlight: "shine" },
    { kind: "link", label: "Listen on Spotify", url: "https://open.spotify.com/artist/novabeats", icon: "🟢" },
    { kind: "header", label: "Free downloads", icon: "" },
    { kind: "unlock", label: "Cinematic LUT Pack", linkId: linkIds[1], icon: "🔒" },
    { kind: "link", label: "Join my Discord", url: "https://discord.gg/novabeats", icon: "💬" },
  ];
  bioBtnDefs.forEach((b, idx) => {
    db.bioButtons.push({
      id: uid("bb"),
      bioPageId: bio.id,
      position: idx,
      kind: b.kind,
      label: b.label,
      url: b.url ?? null,
      iconKey: b.icon,
      linkId: b.linkId ?? null,
      style: null,
      highlight: b.highlight ?? "none",
      startsAt: null,
      endsAt: null,
      clicks: b.kind === "link" || b.kind === "unlock" ? Math.floor(Math.random() * 800) : 0,
    });
  });

  // short links
  db.shortLinks.push(
    {
      id: uid("sl"),
      userId,
      slug: "overlays",
      destinationUrl: "https://twitch.tv/novabeats",
      title: "Stream overlays",
      collectionId: null,
      clicks: 3120,
      createdAt: now - 25 * day,
      updatedAt: now - 3 * day,
    },
    {
      id: uid("sl"),
      userId,
      slug: "store",
      destinationUrl: "https://example.com/store",
      title: "Merch store",
      collectionId: null,
      clicks: 1420,
      createdAt: now - 15 * day,
      updatedAt: now - 15 * day,
    }
  );

  // release
  const releaseId = uid("rel");
  db.releases.push({
    id: releaseId,
    userId,
    slug: "midnight-drive",
    title: "Midnight Drive",
    artist: "nova.beats",
    coverUrl: null,
    releaseDate: now + 6 * day,
    notifyEnabled: true,
    notifyListId: list.id,
    bonus: { actionId: "spotify_follow_artist", label: "Stems for a Spotify follow" },
    bonusLinkId: null,
    views: 0,
    createdAt: now - 5 * day,
    updatedAt: now - day,
  });
  ["spotify", "apple_music", "youtube_music", "deezer", "tidal", "soundcloud"].forEach((service, idx) => {
    db.releaseServices.push({
      id: uid("rs"),
      releaseId,
      service,
      url: `https://example.com/${service}/midnight-drive`,
      position: idx,
      plays: service === "spotify" || service === "apple_music" ? Math.floor(Math.random() * 4000) : Math.floor(Math.random() * 500),
    });
  });
  ["early@fan.com", "first@list.co", "eager@beats.io"].forEach((email) => {
    db.notifySignups.push({ id: uid("ns"), releaseId, email, createdAt: now - Math.floor(Math.random() * 4) * day });
  });

  writeDB(db);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const TIER_LABEL: Record<Tier, string> = {
  free: "Free",
  pro: "Pro",
  lifetime: "Lifetime",
};

export const MILESTONES = [
  { at: 500, label: "Your own image backgrounds", detail: "Upload any image for your link and bio backgrounds." },
  { at: 1000, label: "Widgets and highlighted buttons", detail: "Embed a video or track, and highlight one button." },
  { at: 5000, label: "Video backgrounds and Aurora buttons", detail: "Video page backgrounds plus Aurora and Holo button styles." },
  { at: 10000, label: "Expiring links and avatar effects", detail: "Time-limited links and effects around your avatar." },
  { at: 50000, label: "Headliner badge and Gold buttons", detail: "A Headliner badge and Gold and Chrome buttons. 2 GB extra storage." },
  { at: 100000, label: "Icon badge and 4 GB extra", detail: "An icon badge and 4 GB extra storage." },
];

import type { DB, Link, Action, BioButton, BioPage, LinkEvent } from "./db";
import { accentFromTitle } from "./format";

export const DAY = 86_400_000;

export function linksForUser(db: DB, userId: string): Link[] {
  return db.links
    .filter((l) => l.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function actionsForLink(db: DB, linkId: string): Action[] {
  return db.actions.filter((a) => a.linkId === linkId).sort((a, b) => a.position - b.position);
}

export function eventsForLink(db: DB, linkId: string, since: number): LinkEvent[] {
  return db.linkEvents.filter((e) => e.linkId === linkId && e.occurredAt >= since);
}

export function accentOf(link: Pick<Link, "accentColor" | "title">): string {
  return link.accentColor || accentFromTitle(link.title);
}

export interface SeriesPoint {
  date: string;
  label: string;
  views: number;
  unlocks: number;
}

export function dailySeries(events: LinkEvent[], days: number): SeriesPoint[] {
  const buckets = new Map<string, SeriesPoint>();
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, {
      date: key,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      views: 0,
      unlocks: 0,
    });
  }
  for (const e of events) {
    const key = new Date(e.occurredAt).toISOString().slice(0, 10);
    const b = buckets.get(key);
    if (!b) continue;
    if (e.type === "view") b.views += 1;
    if (e.type === "unlock") b.unlocks += 1;
  }
  return [...buckets.values()];
}

export function countType(events: LinkEvent[], type: LinkEvent["type"]): number {
  return events.filter((e) => e.type === type).length;
}

export interface Breakdown {
  label: string;
  count: number;
  share: number;
}

export function breakdown(events: LinkEvent[], field: "country" | "device" | "referrer"): Breakdown[] {
  const views = events.filter((e) => e.type === "view");
  const map = new Map<string, number>();
  for (const e of views) {
    const key = (e[field] as string | null) || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  }
  const total = views.length || 1;
  return [...map.entries()]
    .map(([label, count]) => ({ label, count, share: count / total }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function stepFunnel(db: DB, link: Link): { index: number; action: Action; count: number; share: number }[] {
  const acts = actionsForLink(db, link.id);
  const events = db.linkEvents.filter((e) => e.linkId === link.id && e.type === "step");
  const base = link.views || 1;
  return acts.map((action, index) => {
    const count = events.filter((e) => e.stepIndex === index).length;
    return { index, action, count, share: count / base };
  });
}

export interface UserTotals {
  views: number;
  unlocks: number;
  conversion: number;
  links: number;
  subscribers: number;
  clicks: number;
}

export function userTotals(db: DB, userId: string): UserTotals {
  const links = linksForUser(db, userId);
  const views = links.reduce((n, l) => n + l.views, 0);
  const unlocks = links.reduce((n, l) => n + l.unlocks, 0);
  const listIds = new Set(db.emailLists.filter((e) => e.userId === userId).map((e) => e.id));
  const subscribers = db.subscribers.filter((s) => listIds.has(s.listId)).length;
  const clicks = db.shortLinks.filter((s) => s.userId === userId).reduce((n, s) => n + s.clicks, 0);
  return { views, unlocks, conversion: views ? unlocks / views : 0, links: links.length, subscribers, clicks };
}

export function totalUnlocksForUser(db: DB, userId: string): number {
  return db.links.filter((l) => l.userId === userId).reduce((n, l) => n + l.unlocks, 0);
}

export function listForUser(db: DB, userId: string) {
  return db.emailLists.filter((e) => e.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

export function subscribersForList(db: DB, listId: string) {
  return db.subscribers
    .filter((s) => s.listId === listId && !s.unsubscribedAt)
    .sort((a, b) => b.joinedAt - a.joinedAt);
}

export function bioPageForUser(db: DB, userId: string): BioPage | undefined {
  return db.bioPages.find((b) => b.userId === userId);
}

export function findBioByUsername(db: DB, username: string): { page: BioPage; user: DB["users"][number] } | null {
  const page = db.bioPages.find((b) => b.username.toLowerCase() === username.toLowerCase());
  if (!page) return null;
  const user = db.users.find((u) => u.id === page.userId);
  if (!user) return null;
  return { page, user };
}

/** Visible bio buttons: honour the scheduled window (a not-yet-started button isn't sent to the client at all). */
export function visibleBioButtons(db: DB, pageId: string): BioButton[] {
  const now = Date.now();
  return db.bioButtons
    .filter((b) => b.bioPageId === pageId)
    .filter((b) => (b.startsAt ? b.startsAt <= now : true))
    .filter((b) => (b.endsAt ? b.endsAt >= now : true))
    .sort((a, b) => a.position - b.position);
}

export function findLinkBySlug(db: DB, slug: string): Link | null {
  return db.links.find((l) => l.slug === slug) || null;
}

export function findLinkByCustomUrl(db: DB, username: string, slug: string): Link | null {
  const user = db.users.find((u) => u.username?.toLowerCase() === username.toLowerCase());
  if (!user) return null;
  return (
    db.links.find((l) => l.userId === user.id && l.customSlug === slug) ||
    db.links.find((l) => l.userId === user.id && l.slug === slug) ||
    null
  );
}

export function findUserByUsername(db: DB, username: string) {
  return db.users.find((u) => u.username?.toLowerCase() === username.toLowerCase()) || null;
}

export function linkStatus(link: Link): { label: string; tone: "good" | "muted" | "warn"; live: boolean } {
  const now = Date.now();
  if (link.status === "paused") return { label: "Paused", tone: "muted", live: false };
  if (link.status === "draft") return { label: "Draft", tone: "muted", live: false };
  if (link.scheduledAt && link.scheduledAt > now) return { label: "Scheduled", tone: "warn", live: false };
  if (link.expiresAt && link.expiresAt < now) return { label: "Expired", tone: "muted", live: false };
  return { label: "Live", tone: "good", live: true };
}

export function rangeToDays(range: string): number {
  switch (range) {
    case "24h":
      return 1;
    case "30d":
      return 30;
    case "6m":
      return 182;
    case "1y":
      return 365;
    case "7d":
    default:
      return 7;
  }
}

export function topLinks(db: DB, userId: string, n = 5): Link[] {
  return linksForUser(db, userId)
    .slice()
    .sort((a, b) => b.unlocks - a.unlocks)
    .slice(0, n);
}

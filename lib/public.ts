import type { DB, Link } from "./db";
import { actionsForLink, accentOf } from "./queries";
import { effectiveMode } from "./verify";
import { targetUrl, providerById } from "./platforms";
import type { PublicAction, UnlockCardLink, UnlockCreator } from "@/components/UnlockCard";

export function publicActions(db: DB, linkId: string): PublicAction[] {
  return actionsForLink(db, linkId).map((a, index) => {
    const provider = providerById(a.provider);
    return {
      id: a.id,
      index,
      provider: a.provider,
      providerName: provider?.name ?? a.provider,
      glyph: a.iconKey || provider?.glyph || "🔗",
      color: provider?.color ?? "#7c5cff",
      label: a.label,
      actionType: a.actionType,
      targetUrl: targetUrl(a.provider, a.target),
      verification: effectiveMode(a),
      isEmail: a.provider === "email" || effectiveMode(a) === "email",
    };
  });
}

export function publicLink(link: Link): UnlockCardLink {
  return {
    id: link.id,
    title: link.title,
    accent: accentOf(link),
    coverUrl: link.coverUrl,
    background: link.background,
    widget: link.widget ?? null,
    destinationType: link.destinationType,
  };
}

export function publicCreator(db: DB, link: Link): UnlockCreator {
  const user = link.userId ? db.users.find((u) => u.id === link.userId) : null;
  const unlocks = user ? db.links.filter((l) => l.userId === user.id).reduce((n, l) => n + l.unlocks, 0) : 0;
  return {
    name: user?.displayName || user?.username || "creator",
    verified: Boolean(user?.emailVerifiedAt),
    og: Boolean(user && user.createdAt < Date.now() - 45 * 86_400_000),
    since: user && user.createdAt < Date.now() - 45 * 86_400_000 ? "Here since the early days" : undefined,
    // `unlocks` is available if a page wants it; kept out of the chip by default
    ...(unlocks ? {} : {}),
  };
}

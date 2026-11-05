import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { linksForUser, bioPageForUser, breakdown, rangeToDays } from "@/lib/queries";
import { countryName, flagEmoji, fmtNumber, fmtPct } from "@/lib/format";
import StatCard from "@/components/StatCard";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Audience" };

function Bars({ items, formatter }: { items: { label: string; count: number; share: number }[]; formatter?: (s: string) => string }) {
  if (items.length === 0) return <p className="text-sm muted">No data yet.</p>;
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.label} className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <span>{formatter ? formatter(it.label) : it.label}</span>
            <span className="faint">{fmtNumber(it.count)} · {fmtPct(it.share)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.max(3, it.share * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function AudiencePage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const pro = me.subscription.tier !== "free";
  const days = rangeToDays(pro ? "30d" : "7d");
  const since = Date.now() - days * 86_400_000;

  const links = linksForUser(db, me.user.id);
  const linkIds = new Set(links.map((l) => l.id));
  const events = db.linkEvents.filter((e) => linkIds.has(e.linkId) && e.occurredAt >= since);

  const bio = bioPageForUser(db, me.user.id);
  const bioViews = bio?.views ?? 0;
  const bioClicks = bio ? db.bioButtons.filter((b) => b.bioPageId === bio.id).reduce((n, b) => n + b.clicks, 0) : 0;
  const listIds = new Set(db.emailLists.filter((e) => e.userId === me.user.id).map((e) => e.id));
  const subscribers = db.subscribers.filter((s) => listIds.has(s.listId) && !s.unsubscribedAt).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Audience</h1>
          <p className="mt-1 text-sm muted">Where visitors come from across links, bio pages and your profile.</p>
        </div>
        {!pro && <Link href="/dashboard/settings" className="btn btn-secondary btn-sm">🔒 Full insights are Pro</Link>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Link views" value={fmtNumber(events.filter((e) => e.type === "view").length)} />
        <StatCard label="Bio page views" value={fmtNumber(bioViews)} />
        <StatCard label="Bio clicks" value={fmtNumber(bioClicks)} />
        <StatCard label="Email subscribers" value={fmtNumber(subscribers)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Countries</h2>
          <Bars items={breakdown(events, "country")} formatter={(c) => `${flagEmoji(c)} ${countryName(c)}`} />
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Sources</h2>
          <Bars items={breakdown(events, "referrer")} />
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Devices</h2>
          <Bars items={breakdown(events, "device")} />
        </div>
      </div>

      <div className="card p-4">
        <h2 className="mb-1 font-bold">What you don't see</h2>
        <p className="text-sm muted">You see totals, not individual people. Visitors don't need an account, and emails are only collected when you add an email step.</p>
      </div>
    </div>
  );
}

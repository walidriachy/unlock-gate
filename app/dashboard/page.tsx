import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { linksForUser, userTotals, dailySeries, topLinks, accentOf } from "@/lib/queries";
import { fmtNumber, fmtPct, fmtRelative, accentFromTitle } from "@/lib/format";
import StatCard from "@/components/StatCard";
import TrendChart from "@/components/TrendChart";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const EVENT_LABEL: Record<string, string> = {
  view: "viewed",
  step: "completed a step on",
  unlock: "unlocked",
  destination: "opened the content from",
};

export default async function DashboardHome() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const userId = me.user.id;
  const links = linksForUser(db, userId);
  const totals = userTotals(db, userId);
  const since = Date.now() - 7 * 86_400_000;
  const events = db.linkEvents
    .filter((e) => links.some((l) => l.id === e.linkId))
    .sort((a, b) => b.occurredAt - a.occurredAt);
  const series = dailySeries(events.filter((e) => e.occurredAt >= since), 7);
  const best = topLinks(db, userId, 5);

  const recent = events.slice(0, 8);
  const linkById = new Map(links.map((l) => [l.id, l]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm muted">
            {me.user.displayName || me.user.username}, here's how your links are growing.
          </p>
        </div>
        <Link href="/dashboard/links/create" className="btn btn-primary">
          + Create link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="text-lg font-bold">Make your first link</h2>
          <p className="mx-auto mt-2 max-w-md text-sm muted">
            Put a download, a video or a code behind a subscribe, a follow or a Discord join, then
            share the link. Every unlock grows your audience.
          </p>
          <Link href="/dashboard/links/create" className="btn btn-primary mt-4">
            Create a link
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Views" value={fmtNumber(totals.views)} sub="Last 30 days" />
            <StatCard label="Unlocks" value={fmtNumber(totals.unlocks)} sub="Completed all steps" />
            <StatCard label="Conversion" value={fmtPct(totals.conversion)} sub="Unlocks ÷ views" />
            <StatCard label="Email subscribers" value={fmtNumber(totals.subscribers)} href="/dashboard/email" />
          </div>

          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">Last 7 days</h2>
              <Link href="/dashboard/links/activity" className="btn btn-ghost btn-sm">
                Full activity →
              </Link>
            </div>
            <TrendChart points={series} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-4">
              <h2 className="mb-3 font-bold">Your best links</h2>
              <ul className="space-y-2">
                {best.map((l) => (
                  <li key={l.id}>
                    <Link href={`/dashboard/links/${l.id}`} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[var(--color-surface-2)]">
                      <span className="h-8 w-1.5 rounded-full" style={{ background: accentOf(l) }} />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{l.title}</span>
                      <span className="text-sm muted">{fmtNumber(l.unlocks)} unlocks</span>
                      <span className="badge">{fmtPct(l.views ? l.unlocks / l.views : 0)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-4">
              <h2 className="mb-3 font-bold">Recent activity</h2>
              <ul className="space-y-3">
                {recent.length === 0 && <li className="text-sm muted">No activity yet. Share a link to get started.</li>}
                {recent.map((e) => {
                  const link = linkById.get(e.linkId);
                  if (!link) return null;
                  return (
                    <li key={e.id} className="flex items-center gap-3 text-sm">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-surface-3)] text-xs">
                        {e.type === "unlock" ? "🔓" : e.type === "step" ? "✓" : e.type === "destination" ? "→" : "👁"}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        Someone {EVENT_LABEL[e.type] || e.type}{" "}
                        <span className="font-semibold">{link.title}</span>
                      </span>
                      <span className="text-xs faint">{fmtRelative(e.occurredAt)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { linksForUser, dailySeries, rangeToDays, accentOf, countType } from "@/lib/queries";
import { fmtNumber, fmtPct } from "@/lib/format";
import TrendChart from "@/components/TrendChart";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Activity" };

const RANGES = ["24h", "7d", "30d", "6m", "1y"];

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) return null;
  const { range = "7d" } = await searchParams;
  const pro = me.subscription.tier !== "free";
  const allowed = pro ? RANGES : ["24h", "7d"];
  const active = allowed.includes(range) ? range : "7d";
  const days = rangeToDays(active);

  const db = readDB();
  const links = linksForUser(db, me.user.id);
  const linkIds = new Set(links.map((l) => l.id));
  const since = Date.now() - days * 86_400_000;
  const events = db.linkEvents.filter((e) => linkIds.has(e.linkId) && e.occurredAt >= since);
  const series = dailySeries(events, Math.min(days, 30) || 1);
  const views = countType(events, "view");
  const unlocks = countType(events, "unlock");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Activity</h1>
          <p className="mt-1 text-sm muted">Views, unlocks and conversion across every link.</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((r) => {
            const enabled = allowed.includes(r);
            return enabled ? (
              <Link key={r} href={`/dashboard/links/activity?range=${r}`} className={`chip ${active === r ? "chip-active" : ""}`}>
                {r}
              </Link>
            ) : (
              <Link key={r} href="/dashboard/settings" className="chip opacity-50" title="Upgrade for longer history">
                🔒 {r}
              </Link>
            );
          })}
        </div>
      </div>

      {!pro && (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-[var(--accent)] p-4">
          <p className="text-sm muted">Free accounts see 24 hours and 7 days. Pro adds 30 days, 6 months and a year, plus full audience insights.</p>
          <Link href="/dashboard/settings" className="btn btn-primary btn-sm">
            See plans
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Views" value={fmtNumber(views)} sub={`Last ${active}`} />
        <StatCard label="Unlocks" value={fmtNumber(unlocks)} sub={`Last ${active}`} />
        <StatCard label="Conversion" value={fmtPct(views ? unlocks / views : 0)} sub="Unlocks ÷ views" />
      </div>

      <div className="card p-4">
        <h2 className="mb-3 font-bold">Trend</h2>
        <TrendChart points={series} />
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-x">
          <table className="table min-w-[640px]">
            <thead>
              <tr>
                <th>Link</th>
                <th>Views</th>
                <th>Unlocks</th>
                <th>Conv.</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => {
                const lEvents = db.linkEvents.filter((e) => e.linkId === l.id && e.occurredAt >= since);
                const lViews = countType(lEvents, "view");
                const lUnlocks = countType(lEvents, "unlock");
                return (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/dashboard/links/${l.id}`} className="flex items-center gap-2">
                        <span className="h-6 w-1.5 rounded-full" style={{ background: accentOf(l) }} />
                        <span className="font-semibold hover:underline">{l.title}</span>
                      </Link>
                    </td>
                    <td>{fmtNumber(lViews)}</td>
                    <td>{fmtNumber(lUnlocks)}</td>
                    <td>{fmtPct(lViews ? lUnlocks / lViews : 0)}</td>
                  </tr>
                );
              })}
              {links.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm muted">
                    No links yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import {
  actionsForLink,
  accentOf,
  breakdown,
  dailySeries,
  eventsForLink,
  linkStatus,
  stepFunnel,
} from "@/lib/queries";
import { fmtNumber, fmtPct, fmtRelative, countryName, flagEmoji } from "@/lib/format";
import { getBaseUrl } from "@/lib/url";
import SharePanel from "@/components/SharePanel";
import TrendChart from "@/components/TrendChart";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";

function Bars({ items, labelFormatter }: { items: { label: string; count: number; share: number }[]; labelFormatter?: (s: string) => string }) {
  if (items.length === 0) return <p className="text-sm muted">No data yet.</p>;
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.label} className="text-sm">
          <div className="mb-1 flex items-center justify-between">
            <span>{labelFormatter ? labelFormatter(it.label) : it.label}</span>
            <span className="faint">
              {fmtNumber(it.count)} · {fmtPct(it.share)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.max(3, it.share * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const link = db.links.find((l) => l.id === id && l.userId === me.user.id);
  if (!link) notFound();

  const baseUrl = await getBaseUrl();
  const status = linkStatus(link);
  const accent = accentOf(link);
  const since = Date.now() - 30 * 86_400_000;
  const events = eventsForLink(db, link.id, since);
  const series = dailySeries(events, 30);
  const step = stepFunnel(db, link);
  const actions = actionsForLink(db, link.id);
  const publicPath =
    me.user.username && link.customSlug ? `/${me.user.username}/${link.customSlug}` : `/l/${link.slug}`;
  const recentUnlocks = db.unlocks
    .filter((u) => u.linkId === link.id && u.completedAt > 0)
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/links" className="text-sm muted hover:text-[var(--color-fg)]">
          ← Links
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight">{link.title}</h1>
          <span className={`badge ${status.tone === "good" ? "badge-good" : status.tone === "warn" ? "badge-accent" : ""}`}>{status.label}</span>
        </div>
        <p className="mt-1 text-sm muted">
          {actions.length} action{actions.length === 1 ? "" : "s"} · created {new Date(link.createdAt).toLocaleDateString()}
        </p>
      </div>

      <SharePanel url={`${baseUrl}${publicPath}`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Views" value={fmtNumber(link.views)} sub="Last 30 days" />
        <StatCard label="Unlocks" value={fmtNumber(link.unlocks)} sub="Completed every step" />
        <StatCard label="Conversion" value={fmtPct(link.views ? link.unlocks / link.views : 0)} sub="Unlocks ÷ views" />
        <StatCard label="Steps" value={String(actions.length)} sub="Per visitor" />
      </div>

      <div className="card p-4" style={{ ["--accent" as string]: accent }}>
        <h2 className="mb-3 font-bold">Last 30 days</h2>
        <TrendChart points={series} accent={accent} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Top sources</h2>
          <Bars items={breakdown(events, "referrer")} />
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Countries</h2>
          <Bars items={breakdown(events, "country")} labelFormatter={(c) => `${flagEmoji(c)} ${countryName(c)}`} />
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Devices</h2>
          <Bars items={breakdown(events, "device")} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Step funnel</h2>
          <ul className="space-y-3">
            {step.map((s) => (
              <li key={s.index}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>
                    {s.index + 1}. {s.action.label}
                  </span>
                  <span className="faint">{fmtNumber(s.count)} steps</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                  <div className="h-full rounded-full bg-[#34d399]" style={{ width: `${Math.max(3, Math.min(100, s.share * 100))}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="mb-3 font-bold">Recent unlocks</h2>
          <ul className="space-y-3">
            {recentUnlocks.length === 0 && <li className="text-sm muted">No unlocks recorded yet.</li>}
            {recentUnlocks.map((u) => (
              <li key={u.id} className="flex items-center gap-3 text-sm">
                <span className="text-lg">{flagEmoji(u.country)}</span>
                <span className="flex-1">
                  {countryName(u.country)} · {u.device || "unknown"}
                </span>
                <span className="text-xs faint">{fmtRelative(u.completedAt)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs faint">You see totals, not individual visitors.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href={`/dashboard/links/${link.id}/edit`} className="btn btn-primary">
          Edit link
        </Link>
        <a href={`${baseUrl}${publicPath}`} target="_blank" rel="noreferrer" className="btn btn-secondary">
          Open public page ↗
        </a>
      </div>
    </div>
  );
}

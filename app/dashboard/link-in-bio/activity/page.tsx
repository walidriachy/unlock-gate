import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { bioPageForUser, visibleBioButtons } from "@/lib/queries";
import { fmtNumber, fmtPct } from "@/lib/format";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Link in bio activity" };

export default async function BioActivityPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const page = bioPageForUser(db, me.user.id);
  const buttons = page ? visibleBioButtons(db, page.id) : [];
  const views = page?.views ?? 0;
  const clicks = buttons.reduce((n, b) => n + b.clicks, 0);
  const max = Math.max(1, ...buttons.map((b) => b.clicks));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Link in bio activity</h1>
        <p className="mt-1 text-sm muted">Views, clicks per button and where visitors come from.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Page views" value={fmtNumber(views)} />
        <StatCard label="Button clicks" value={fmtNumber(clicks)} />
        <StatCard label="Click rate" value={fmtPct(views ? clicks / views : 0)} sub="Clicks ÷ views" />
      </div>

      <div className="card p-4">
        <h2 className="mb-3 font-bold">Clicks per button</h2>
        {buttons.length === 0 && <p className="text-sm muted">No buttons yet.</p>}
        <ul className="space-y-3">
          {buttons.map((b) => (
            <li key={b.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>
                  {b.kind === "header" ? "— " : `${b.iconKey || "🔗"} `}
                  {b.label}
                </span>
                <span className="faint">{fmtNumber(b.clicks)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.max(2, (b.clicks / max) * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs faint">The top two buttons get most of the taps. Move your best performer up.</p>
      </div>
    </div>
  );
}

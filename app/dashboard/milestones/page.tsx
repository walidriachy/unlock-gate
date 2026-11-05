import { getCurrentUser } from "@/lib/auth";
import { readDB, MILESTONES } from "@/lib/db";
import { totalUnlocksForUser } from "@/lib/queries";
import { fmtNumber } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Milestones" };

export default async function MilestonesPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const total = totalUnlocksForUser(db, me.user.id);
  const pro = me.subscription.tier !== "free";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Milestones</h1>
        <p className="mt-1 text-sm muted">Every unlock on your links counts. Reach a milestone and the feature switches on for good.</p>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-extrabold">{fmtNumber(total)}</div>
            <div className="text-sm muted">total unlocks{pro ? " · Pro (all features on)" : ""}</div>
          </div>
        </div>
      </div>

      <ol className="space-y-3">
        {MILESTONES.map((m) => {
          const reached = pro || total >= m.at;
          const pct = Math.min(100, Math.round((total / m.at) * 100));
          return (
            <li key={m.at} className={`card p-4 ${reached ? "border-[var(--accent)]" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{m.label}</div>
                <span className={`badge ${reached ? "badge-good" : ""}`}>{reached ? "Unlocked" : `at ${fmtNumber(m.at)}`}</span>
              </div>
              <p className="mt-1 text-sm muted">{m.detail}</p>
              {!reached && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
                  <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

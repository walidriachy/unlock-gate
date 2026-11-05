import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBillingPage() {
  const db = readDB();
  const paid = db.subscriptions.filter((s) => s.tier !== "free");
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Billing</h1>
      <p className="text-sm muted">Paid subscriptions. Plan overrides happen on the Users page.</p>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] text-left text-xs uppercase faint">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Tier</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Started</th>
            </tr>
          </thead>
          <tbody>
            {paid.map((s) => {
              const u = db.users.find((x) => x.id === s.userId);
              return (
                <tr key={s.id} className="border-t border-[var(--color-line)]">
                  <td className="px-4 py-2">{u?.email ?? s.userId}</td>
                  <td className="px-4 py-2">{s.tier}</td>
                  <td className="px-4 py-2">{s.status}</td>
                  <td className="px-4 py-2 faint">{new Date(s.startedAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {paid.length === 0 && <p className="text-sm muted">No paid subscriptions yet.</p>}
    </div>
  );
}

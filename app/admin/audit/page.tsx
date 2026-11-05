import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const db = readDB();
  const entries = db.auditLog.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 200);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Audit log</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] text-left text-xs uppercase faint">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Actor</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Target</th>
              <th className="px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const actor = db.users.find((u) => u.id === e.actorId);
              return (
                <tr key={e.id} className="border-t border-[var(--color-line)]">
                  <td className="px-4 py-2 faint">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{actor?.email ?? e.actorId}</td>
                  <td className="px-4 py-2">{e.action}</td>
                  <td className="px-4 py-2 faint">{e.targetType}:{e.targetId.slice(0, 8)}</td>
                  <td className="px-4 py-2">{e.detail ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs faint">Showing {entries.length} of {db.auditLog.length}.</p>
    </div>
  );
}

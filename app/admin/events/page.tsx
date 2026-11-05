import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const db = readDB();
  const events = db.linkEvents.slice().sort((a, b) => b.occurredAt - a.occurredAt).slice(0, 200);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Events</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] text-left text-xs uppercase faint">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Device</th>
              <th className="px-4 py-2">Release</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const link = e.linkId ? db.links.find((l) => l.id === e.linkId) : null;
              const release = e.releaseId ? db.releases.find((r) => r.id === e.releaseId) : null;
              return (
                <tr key={e.id} className="border-t border-[var(--color-line)]">
                  <td className="px-4 py-2 faint">{new Date(e.occurredAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{e.type}</td>
                  <td className="px-4 py-2">{link?.title ?? "—"}</td>
                  <td className="px-4 py-2">{e.country ?? "—"}</td>
                  <td className="px-4 py-2">{e.device ?? "—"}</td>
                  <td className="px-4 py-2 faint">{release?.title ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs faint">Showing {events.length} of {db.linkEvents.length}.</p>
    </div>
  );
}

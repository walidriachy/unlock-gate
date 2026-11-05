import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminEmailPage() {
  const db = readDB();
  const lists = db.emailLists.slice().sort((a, b) => b.createdAt - a.createdAt);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight">Email lists & subscribers</h1>
      <div className="space-y-3">
        {lists.map((l) => {
          const owner = db.users.find((u) => u.id === l.userId);
          const subs = db.subscribers.filter((s) => s.listId === l.id);
          return (
            <div key={l.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{l.name}</p>
                  <p className="text-xs faint">
                    {owner?.email ?? l.userId} · {subs.length} subscribers · created {new Date(l.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/api/email/export?listId=${l.id}`}
                  className="btn btn-secondary btn-sm"
                >
                  Export CSV
                </a>
              </div>
              {subs.length > 0 && (
                <ul className="mt-3 max-h-40 overflow-auto text-xs">
                  {subs.slice(0, 20).map((s) => (
                    <li key={s.id} className="flex justify-between gap-2 border-t border-[var(--color-line)] py-1">
                      <span>{s.email}</span>
                      <span className="faint">{new Date(s.joinedAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        {lists.length === 0 && <p className="text-sm muted">No email lists yet.</p>}
      </div>
    </div>
  );
}

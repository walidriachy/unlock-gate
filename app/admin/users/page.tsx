import { readDB } from "@/lib/db";
import AdminUserActions from "@/components/AdminUserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const db = readDB();
  const needle = (q || "").toLowerCase();
  const users = db.users
    .filter((u) => !needle || u.email.toLowerCase().includes(needle) || (u.username || "").toLowerCase().includes(needle))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Users</h1>
        <form className="flex gap-2" action="/admin/users" method="get">
          <input name="q" defaultValue={q || ""} placeholder="Search email or username" className="input w-64" />
          <button className="btn btn-secondary">Search</button>
        </form>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] text-left text-xs uppercase faint">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Verified</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-[var(--color-line)]">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 faint">{u.username ?? "—"}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.emailVerifiedAt ? "✓" : "—"}</td>
                <td className="px-4 py-2 faint">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <AdminUserActions
                    userId={u.id}
                    role={u.role}
                    tier={db.subscriptions.find((s) => s.userId === u.id)?.tier ?? "free"}
                    verified={Boolean(u.emailVerifiedAt)}
                    suspended={Boolean(u.suspended)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs faint">Showing {users.length} of {db.users.length}.</p>
    </div>
  );
}

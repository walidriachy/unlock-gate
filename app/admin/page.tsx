import { readDB } from "@/lib/db";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const db = readDB();
  const users = db.users.length;
  const admins = db.users.filter((u) => u.role === "admin" || u.role === "support").length;
  const links = db.links.length;
  const published = db.links.filter((l) => l.status === "published").length;
  const unlocks = db.links.reduce((n, l) => n + (l.unlocks || 0), 0);
  const views = db.links.reduce((n, l) => n + (l.views || 0), 0);
  const subscribers = db.subscribers.length;
  const revenue = db.subscriptions.filter((s) => s.tier !== "free").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Users" value={String(users)} />
        <StatCard label="Admins / support" value={String(admins)} />
        <StatCard label="Links" value={String(links)} />
        <StatCard label="Published" value={String(published)} />
        <StatCard label="Views" value={String(views)} />
        <StatCard label="Unlocks" value={String(unlocks)} />
        <StatCard label="Subscribers" value={String(subscribers)} />
        <StatCard label="Paid subs" value={String(revenue)} />
      </div>
      <div className="card p-4">
        <h2 className="mb-2 font-bold">Recent users</h2>
        <ul className="divide-y divide-[var(--color-line)]">
          {db.users
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 8)
            .map((u) => (
              <li key={u.id} className="flex items-center justify-between py-2 text-sm">
                <span>{u.email}</span>
                <span className="faint">{u.role} · {u.username ?? "—"}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

import { readDB } from "@/lib/db";
import AdminLinkActions from "@/components/AdminLinkActions";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const db = readDB();
  const needle = (q || "").toLowerCase();
  const links = db.links
    .filter((l) => !needle || l.title.toLowerCase().includes(needle) || l.slug.toLowerCase().includes(needle))
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Links</h1>
        <form className="flex gap-2" action="/admin/links" method="get">
          <input name="q" defaultValue={q || ""} placeholder="Search title or slug" className="input w-64" />
          <button className="btn btn-secondary">Search</button>
        </form>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface-2)] text-left text-xs uppercase faint">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Views</th>
              <th className="px-4 py-2">Unlocks</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((l) => {
              const owner = l.userId ? db.users.find((u) => u.id === l.userId) : null;
              return (
                <tr key={l.id} className="border-t border-[var(--color-line)]">
                  <td className="px-4 py-2">{l.title}</td>
                  <td className="px-4 py-2 faint">{l.slug}</td>
                  <td className="px-4 py-2">{l.status}</td>
                  <td className="px-4 py-2">{l.views}</td>
                  <td className="px-4 py-2">{l.unlocks}</td>
                  <td className="px-4 py-2 faint">{owner?.email ?? "unclaimed"}</td>
                  <td className="px-4 py-2">
                    <AdminLinkActions linkId={l.id} status={l.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs faint">Showing {links.length} of {db.links.length}.</p>
    </div>
  );
}

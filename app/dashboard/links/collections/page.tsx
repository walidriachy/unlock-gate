import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import CollectionsClient, { type CollectionRow } from "@/components/CollectionsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const rows: CollectionRow[] = db.collections
    .filter((c) => c.userId === me.user.id)
    .map((c) => ({
      id: c.id,
      name: c.name,
      links: db.links.filter((l) => l.collectionId === c.id).length,
      shorts: db.shortLinks.filter((s) => s.collectionId === c.id).length,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Collections</h1>
        <p className="mt-1 text-sm muted">Group links per campaign, platform or client. Assign one from a link's editor.</p>
      </div>
      <CollectionsClient rows={rows} />
    </div>
  );
}

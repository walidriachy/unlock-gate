import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { getBaseUrl, shortDomain } from "@/lib/url";
import ShortLinksClient, { type ShortRow } from "@/components/ShortLinksClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Short links" };

export default async function ShortLinksPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const baseUrl = await getBaseUrl();
  const rows: ShortRow[] = db.shortLinks
    .filter((s) => s.userId === me.user.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      destinationUrl: s.destinationUrl,
      title: s.title,
      clicks: s.clicks,
      collectionId: s.collectionId,
    }));
  const collections = db.collections.filter((c) => c.userId === me.user.id).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Short links</h1>
        <p className="mt-1 text-sm muted">Clean {shortDomain()} addresses with click counts. Point them somewhere new anytime.</p>
      </div>
      <ShortLinksClient rows={rows} collections={collections} shortDomain={shortDomain()} baseUrl={baseUrl} />
    </div>
  );
}

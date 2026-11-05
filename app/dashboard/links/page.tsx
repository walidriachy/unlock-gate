import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { linksForUser, actionsForLink, accentOf, linkStatus } from "@/lib/queries";
import { getBaseUrl } from "@/lib/url";
import LinksTable, { type LinkRow } from "@/components/LinksTable";

export const dynamic = "force-dynamic";
export const metadata = { title: "Links" };

export default async function LinksPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const baseUrl = await getBaseUrl();
  const links = linksForUser(db, me.user.id);
  const collections = new Map(db.collections.map((c) => [c.id, c.name]));

  const rows: LinkRow[] = links.map((l) => {
    const status = linkStatus(l);
    const custom = l.userId && l.customSlug && me.user.username;
    return {
      id: l.id,
      title: l.title,
      publicPath: custom ? `/${me.user.username}/${l.customSlug}` : `/l/${l.slug}`,
      accent: accentOf(l),
      views: l.views,
      unlocks: l.unlocks,
      conversion: l.views ? l.unlocks / l.views : 0,
      status: status.label,
      tone: status.tone,
      actions: actionsForLink(db, l.id).length,
      collection: l.collectionId ? collections.get(l.collectionId) ?? null : null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Links</h1>
          <p className="mt-1 text-sm muted">{links.length} link{links.length === 1 ? "" : "s"} · views, unlocks and conversion for each.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/links/short" className="btn btn-secondary">
            Short links
          </Link>
          <Link href="/dashboard/links/create" className="btn btn-primary">
            + Create link
          </Link>
        </div>
      </div>
      <LinksTable rows={rows} baseUrl={baseUrl} />
    </div>
  );
}

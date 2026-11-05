import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { actionsForLink } from "@/lib/queries";
import { getBaseUrl } from "@/lib/url";
import LinkEditor from "@/components/LinkEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit link" };

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const link = db.links.find((l) => l.id === id && l.userId === me.user.id);
  if (!link) notFound();
  const baseUrl = await getBaseUrl();
  const actions = actionsForLink(db, link.id).map((a) => ({ actionId: a.actionId, target: a.target ?? "", label: a.label }));
  const collections = db.collections.filter((c) => c.userId === me.user.id).map((c) => ({ id: c.id, name: c.name }));
  const file = link.fileId ? db.files.find((f) => f.id === link.fileId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href={`/dashboard/links/${link.id}`} className="text-sm muted hover:text-[var(--color-fg)]">
            ← {link.title}
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Edit link</h1>
        </div>
      </div>
      <LinkEditor
        mode="edit"
        owned
        baseUrl={baseUrl}
        username={me.user.username}
        collections={collections}
        initial={{
          id: link.id,
          slug: link.slug,
          title: link.title,
          destinationType: link.destinationType,
          destinationUrl: link.destinationUrl ?? "",
          fileId: link.fileId,
          fileName: file?.name,
          textSnippet: link.textSnippet ?? "",
          accentColor: link.accentColor,
          coverUrl: link.coverUrl,
          background: link.background,
          actions,
          scheduledAt: link.scheduledAt,
          expiresAt: link.expiresAt,
          customSlug: link.customSlug,
          collectionId: link.collectionId,
        }}
      />
    </div>
  );
}

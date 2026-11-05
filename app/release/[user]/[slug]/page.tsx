import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { findUserByUsername } from "@/lib/queries";
import { publicActions, publicLink, publicCreator } from "@/lib/public";
import ReleasePublic from "@/components/ReleasePublic";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function PublicReleasePage({
  params,
}: {
  params: Promise<{ user: string; slug: string }>;
}) {
  const { user, slug } = await params;
  const db = readDB();
  const owner = findUserByUsername(db, user);
  if (!owner) notFound();
  const release = db.releases.find((r) => r.userId === owner.id && r.slug === slug);
  if (!release) notFound();
  const services = db.releaseServices
    .filter((s) => s.releaseId === release.id)
    .sort((a, b) => a.position - b.position)
    .map((s) => ({ id: s.id, service: s.service, url: s.url }));

  const bonusLinkRow = release.bonusLinkId ? db.links.find((l) => l.id === release.bonusLinkId) : null;
  const bonusLink = bonusLinkRow
    ? {
        link: publicLink(bonusLinkRow),
        actions: publicActions(db, bonusLinkRow.id),
        creator: publicCreator(db, bonusLinkRow),
      }
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="mb-6">
        <Logo small href="/" />
      </div>
      <ReleasePublic
        releaseId={release.id}
        title={release.title}
        artist={release.artist}
        coverUrl={release.coverUrl}
        releaseDate={release.releaseDate}
        notifyEnabled={release.notifyEnabled}
        services={services}
        bonusLabel={release.bonus?.label ?? null}
        bonusLink={bonusLink}
      />
    </main>
  );
}

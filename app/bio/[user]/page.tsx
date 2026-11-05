import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { findBioByUsername, visibleBioButtons, accentOf, linkStatus } from "@/lib/queries";
import { publicActions } from "@/lib/public";
import BioPageView, { type BioButtonView } from "@/components/BioPageView";
import { bioDomain } from "@/lib/url";

export const dynamic = "force-dynamic";

export default async function BioPage({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;
  const db = readDB();
  const found = findBioByUsername(db, user);
  if (!found) notFound();
  const { page, user: owner } = found;

  if (!page.publishedAt) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-xl font-bold">This page isn't published yet</h1>
          <p className="mt-2 text-sm muted">@{page.username} hasn't made their link in bio public.</p>
        </div>
      </main>
    );
  }

  const buttons: BioButtonView[] = visibleBioButtons(db, page.id).map((b) => {
    let unlock: BioButtonView["unlock"] = null;
    if (b.kind === "unlock" && b.linkId) {
      const link = db.links.find((l) => l.id === b.linkId);
      if (link && linkStatus(link).live) {
        unlock = {
          link: {
            id: link.id,
            title: link.title,
            accent: accentOf(link),
            coverUrl: link.coverUrl,
            background: link.background,
            destinationType: link.destinationType,
          },
          actions: publicActions(db, link.id),
          creator: { name: owner.displayName || page.username, verified: Boolean(owner.emailVerifiedAt), og: false },
        };
      }
    }
    return {
      id: b.id,
      kind: b.kind,
      label: b.label,
      url: b.url,
      iconKey: b.iconKey,
      highlight: b.highlight,
      clicks: b.clicks,
      unlock,
    };
  });

  return (
    <main className="min-h-screen">
      <BioPageView
        username={page.username}
        name={owner.displayName || page.username}
        avatarUrl={owner.avatarUrl}
        bio={owner.bio}
        socials={owner.socials}
        theme={page.theme}
        font={page.font}
        accent={page.accent}
        buttonStyle={page.buttonStyle}
        corners={page.corners}
        background={page.background}
        buttons={buttons}
        emailSignup={page.emailListId ? { listId: page.emailListId } : null}
      />
      <span className="sr-only">{bioDomain()} / {page.username}</span>
    </main>
  );
}

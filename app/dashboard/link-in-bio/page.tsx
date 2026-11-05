import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { publicActions } from "@/lib/public";
import { visibleBioButtons, bioPageForUser, accentOf } from "@/lib/queries";
import { bioDomain } from "@/lib/url";
import { slugify } from "@/lib/db";
import BioEditor, { type EditorButton } from "@/components/BioEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Link in bio" };

export default async function LinkInBioPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const user = me.user;
  const page = bioPageForUser(db, user.id);
  const username = page?.username ?? user.username ?? slugify(user.displayName || user.email.split("@")[0]);
  const pro = me.subscription.tier !== "free";

  const buttons: EditorButton[] = page
    ? visibleBioButtons(db, page.id).map((b) => ({
        kind: b.kind,
        label: b.label,
        url: b.url ?? "",
        iconKey: b.iconKey,
        linkId: b.linkId ?? "",
        highlight: b.highlight,
      }))
    : [];

  const links = db.links.filter((l) => l.userId === user.id);
  const linkOptions = links.map((l) => ({
    id: l.id,
    title: l.title,
    publicPath: l.customSlug && user.username ? `/${user.username}/${l.customSlug}` : `/l/${l.slug}`,
    accent: accentOf(l),
    actions: publicActions(db, l.id),
    destinationType: l.destinationType,
    coverUrl: l.coverUrl,
    live: l.status === "published",
  }));

  const lists = db.emailLists.filter((e) => e.userId === user.id).map((e) => ({ id: e.id, name: e.name }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Link in bio</h1>
        <p className="mt-1 text-sm muted">
          One page for everything you make, at {bioDomain()}/{username}.
        </p>
      </div>
      <BioEditor
        username={username}
        name={user.displayName || username}
        avatarUrl={user.avatarUrl}
        bio={user.bio}
        socials={user.socials}
        pro={pro}
        bioDomain={bioDomain()}
        lists={lists}
        linkOptions={linkOptions}
        initial={{
          theme: page?.theme ?? "aurora",
          font: page?.font ?? "sans",
          accent: page?.accent ?? "#7c5cff",
          buttonStyle: page?.buttonStyle ?? "glass",
          corners: page?.corners ?? "rounded",
          background: page?.background ?? { kind: "theme" },
          emailListId: page?.emailListId ?? null,
          publishedAt: page?.publishedAt ?? null,
          buttons,
        }}
      />
    </div>
  );
}

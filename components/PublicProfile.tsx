import Link from "next/link";
import { notFound } from "next/navigation";
import type { DB } from "@/lib/db";
import { findUserByUsername, linksForUser, accentOf, linkStatus, bioPageForUser } from "@/lib/queries";
import { fmtNumber } from "@/lib/format";
import Logo from "./Logo";

const SOCIAL_GLYPH: Record<string, string> = {
  youtube: "▶️",
  x: "✖️",
  instagram: "📸",
  tiktok: "🎵",
  discord: "💬",
  spotify: "🟢",
  twitch: "📺",
  soundcloud: "🟠",
};

export default function PublicProfile({ db, username }: { db: DB; username: string }) {
  const user = findUserByUsername(db, username);
  if (!user) notFound();
  const links = linksForUser(db, user.id).filter((l) => linkStatus(l).live);
  const bio = bioPageForUser(db, user.id);
  const single = links[0];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-2xl px-5 py-12">
        <div className="mb-6 flex justify-center">
          <Logo small href="/" />
        </div>

        <div className="flex flex-col items-center text-center">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.displayName} className="h-24 w-24 rounded-full object-cover" />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full bg-[var(--color-surface-3)] text-3xl font-bold">
              {(user.displayName || username).slice(0, 1).toUpperCase()}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-extrabold">{user.displayName || username}</h1>
          <p className="text-sm faint">@{username}</p>
          {user.emailVerifiedAt && <span className="badge badge-accent mt-2">Verified creator</span>}
          {user.bio && <p className="mt-3 max-w-md text-sm muted">{user.bio}</p>}

          {Object.keys(user.socials).length > 0 && (
            <div className="mt-4 flex gap-3 text-xl">
              {Object.entries(user.socials).map(([key, value]) => (
                <a key={key} href={value.startsWith("http") ? value : `https://${key}.com/${value.replace(/^@/, "")}`} target="_blank" rel="noreferrer" title={key}>
                  {SOCIAL_GLYPH[key] || "🔗"}
                </a>
              ))}
            </div>
          )}

          {bio?.publishedAt && (
            <Link href={`/bio/${bio.username}`} className="btn btn-secondary mt-4">
              🎨 Visit the link in bio
            </Link>
          )}
        </div>

        <div className="mt-8 space-y-2">
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.customSlug ? `/${username}/${l.customSlug}` : `/l/${l.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 transition hover:border-[var(--accent)]"
            >
              <span className="h-8 w-1.5 rounded-full" style={{ background: accentOf(l) }} />
              <span className="flex-1 font-semibold">{l.title}</span>
              <span className="text-xs faint">{fmtNumber(l.unlocks)} unlocks</span>
              <span className="faint">🔒</span>
            </Link>
          ))}
          {links.length === 0 && <p className="text-center text-sm muted">No public links yet.</p>}
        </div>

        {single && !bio?.publishedAt && (
          <p className="mt-8 text-center text-xs faint">
            A creator on Gatekeeper.{" "}
            <Link href="/create" className="accent-text link-underline">
              Make your own link
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

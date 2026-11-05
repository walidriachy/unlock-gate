import Link from "next/link";
import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { publicActions, publicLink, publicCreator } from "@/lib/public";
import { linkStatus, findLinkByCustomUrl } from "@/lib/queries";
import UnlockCard from "@/components/UnlockCard";
import Logo from "@/components/Logo";
import PageBackground from "@/components/PageBackground";

export const dynamic = "force-dynamic";

export default async function CustomUnlockPage({
  params,
}: {
  params: Promise<{ user: string; link: string }>;
}) {
  const { user, link: linkSlug } = await params;
  const db = readDB();
  const link = findLinkByCustomUrl(db, user, linkSlug);
  if (!link) notFound();
  const state = linkStatus(link);
  const actions = publicActions(db, link.id);

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <PageBackground background={link.background} />
      <Logo small href="/" />
      {state.live ? (
        <UnlockCard link={publicLink(link)} actions={actions} creator={publicCreator(db, link)} />
      ) : (
        <div className="glass mx-auto w-full max-w-md p-6 text-center">
          <div className="badge mx-auto mb-3">{state.label}</div>
          <h2 className="text-lg font-bold">{link.title}</h2>
          <p className="mt-2 text-sm muted">
            {state.label === "Scheduled"
              ? "This link isn't live yet. Come back when the drop opens."
              : "This link is no longer available."}
          </p>
        </div>
      )}
      <p className="text-center text-xs faint">
        Powered by Gatekeeper ·{" "}
        <Link href="/create" className="link-underline accent-text">
          Make your own link
        </Link>
      </p>
    </main>
  );
}

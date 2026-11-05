import Link from "next/link";
import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { publicActions, publicLink, publicCreator } from "@/lib/public";
import { linkStatus } from "@/lib/queries";
import UnlockCard from "@/components/UnlockCard";
import Logo from "@/components/Logo";
import PageBackground from "@/components/PageBackground";

export const dynamic = "force-dynamic";

function NotLive({ label, title }: { label: string; title: string }) {
  return (
    <div className="glass mx-auto w-full max-w-md p-6 text-center">
      <div className="badge mx-auto mb-3">{label}</div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm muted">
        {label === "Scheduled"
          ? "This link isn't live yet. Come back when the drop opens."
          : "This link is no longer available."}
      </p>
    </div>
  );
}

export default async function PublicUnlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = readDB();
  const link = db.links.find((l) => l.slug === slug);
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
        <NotLive label={state.label} title={link.title} />
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

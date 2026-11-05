import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import ReleaseEditor from "@/components/ReleaseEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "New release" };

export default async function NewReleasePage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const base = me.user.username ?? "you";
  const db = readDB();
  const links = db.links.filter((l) => l.userId === me.user.id).map((l) => ({ id: l.id, title: l.title, slug: l.slug }));
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/releases" className="text-sm muted hover:text-[var(--color-fg)]">
          ← Releases
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">New release link</h1>
      </div>
      <ReleaseEditor mode="create" releasesBase={`gatekeeper.com/${base}/your-release`} links={links} />
    </div>
  );
}

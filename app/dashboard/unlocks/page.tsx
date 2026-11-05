import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { fmtRelative } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "My unlocks" };

export default async function MyUnlocksPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const saved = db.savedUnlocks
    .filter((s) => s.userId === me.user.id)
    .sort((a, b) => b.completedAt - a.completedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">My unlocks</h1>
        <p className="mt-1 text-sm muted">Links you unlocked while signed in, so you can find them again.</p>
      </div>

      {saved.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="text-lg font-bold">Nothing here yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm muted">
            When you unlock a link while signed in, it shows up here. Visitors don't need an account —
            this just remembers them for you.
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-[var(--color-line)]">
          {saved.map((s) => {
            const link = db.links.find((l) => l.id === s.linkId);
            if (!link) return null;
            return (
              <div key={s.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{link.title}</div>
                  <div className="text-xs faint">Unlocked {fmtRelative(s.completedAt)}</div>
                </div>
                <Link href={`/l/${link.slug}`} className="btn btn-secondary btn-sm">
                  Open
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

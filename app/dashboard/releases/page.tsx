import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { fmtDate, fmtNumber } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Releases" };

export default async function ReleasesPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const releases = db.releases.filter((r) => r.userId === me.user.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Release links</h1>
          <p className="mt-1 text-sm muted">One page for your song or album, with every place to listen.</p>
        </div>
        <Link href="/dashboard/releases/new" className="btn btn-primary">
          + New release
        </Link>
      </div>

      {releases.length === 0 ? (
        <div className="card p-10 text-center">
          <h2 className="text-lg font-bold">No releases yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm muted">
            Paste a Spotify, Apple Music or Deezer link and get one page with every service, your
            cover and a Play button for each.
          </p>
          <Link href="/dashboard/releases/new" className="btn btn-primary mt-4">
            Create a release link
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((r) => {
            const services = db.releaseServices.filter((s) => s.releaseId === r.id);
            const signups = db.notifySignups.filter((n) => n.releaseId === r.id).length;
            const plays = services.reduce((n, s) => n + s.plays, 0);
            const upcoming = r.releaseDate && r.releaseDate > Date.now();
            return (
              <Link key={r.id} href={`/dashboard/releases/${r.id}`} className="card overflow-hidden transition hover:border-[var(--accent)]">
                <div className="h-32 w-full" style={{ background: r.coverUrl ? `center/cover url(${r.coverUrl})` : "linear-gradient(140deg,#7c5cff,#06060d)" }} />
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-bold">{r.title}</h3>
                    {upcoming && <span className="badge badge-accent">Pre-release</span>}
                  </div>
                  <p className="text-sm muted">{r.artist || "—"}</p>
                  <p className="mt-1 text-xs faint">Release {fmtDate(r.releaseDate)}</p>
                  <div className="mt-2 flex gap-4 text-xs muted">
                    <span>{services.length} services</span>
                    <span>{fmtNumber(plays)} plays</span>
                    <span>{signups} notify</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

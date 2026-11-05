import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { fmtDate, fmtNumber } from "@/lib/format";
import { breakdown } from "@/lib/queries";
import { getBaseUrl } from "@/lib/url";
import ReleaseEditor from "@/components/ReleaseEditor";
import ReleaseActions from "@/components/ReleaseActions";
import StatCard from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default async function ReleaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const release = db.releases.find((r) => r.id === id && r.userId === me.user.id);
  if (!release) notFound();
  const services = db.releaseServices.filter((s) => s.releaseId === release.id).sort((a, b) => a.position - b.position);
  const signups = db.notifySignups.filter((n) => n.releaseId === release.id);
  const plays = services.reduce((n, s) => n + s.plays, 0);
  const baseUrl = await getBaseUrl();
  const publicUrl = `${baseUrl}/release/${me.user.username ?? "you"}/${release.slug}`;
  const links = db.links.filter((l) => l.userId === me.user.id).map((l) => ({ id: l.id, title: l.title, slug: l.slug }));
  const releaseEvents = db.linkEvents.filter((e) => e.releaseId === release.id);
  const countries = breakdown(releaseEvents, "country").slice(0, 5);
  const devices = breakdown(releaseEvents, "device");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/dashboard/releases" className="text-sm muted hover:text-[var(--color-fg)]">
            ← Releases
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{release.title}</h1>
          <p className="text-sm muted">
            {release.artist || "—"} · {publicUrl}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Plays clicked" value={fmtNumber(plays)} />
        <StatCard label="Views" value={fmtNumber(release.views ?? 0)} />
        <StatCard label="Notify signups" value={fmtNumber(signups.length)} />
        <StatCard label="Services" value={String(services.length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Plays per service</h2>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className="capitalize">{s.service.replace(/_/g, " ")}</span>
                <span className="faint">{fmtNumber(s.plays)}</span>
              </li>
            ))}
            {services.length === 0 && <li className="text-sm muted">No services yet.</li>}
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Notify list</h2>
          <ul className="space-y-2">
            {signups.slice(0, 8).map((n) => (
              <li key={n.id} className="flex items-center justify-between text-sm">
                <span>{n.email}</span>
                <span className="text-xs faint">{fmtDate(n.createdAt)}</span>
              </li>
            ))}
            {signups.length === 0 && <li className="text-sm muted">No one has pressed “Notify me” yet.</li>}
          </ul>
          {signups.length > 0 && <p className="mt-3 text-xs faint">All {signups.length} land in your email list. We never email them.</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Views by country</h2>
          <ul className="space-y-2">
            {countries.length === 0 && <li className="text-sm muted">No views yet.</li>}
            {countries.map((c) => (
              <li key={c.label} className="flex items-center justify-between text-sm">
                <span>{c.label}</span>
                <span className="faint">{fmtNumber(c.count)} ({Math.round(c.share * 100)}%)</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-bold">Views by device</h2>
          <ul className="space-y-2">
            {devices.length === 0 && <li className="text-sm muted">No views yet.</li>}
            {devices.map((d) => (
              <li key={d.label} className="flex items-center justify-between text-sm">
                <span className="capitalize">{d.label}</span>
                <span className="faint">{fmtNumber(d.count)} ({Math.round(d.share * 100)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ReleaseActions releaseId={release.id} baseUrl={publicUrl} />

      <div className="hr" />
      <h2 className="text-lg font-bold">Edit</h2>
      <ReleaseEditor
        mode="edit"
        releasesBase={publicUrl}
        initial={{
          id: release.id,
          title: release.title,
          artist: release.artist,
          coverUrl: release.coverUrl,
          releaseDate: release.releaseDate,
          notifyEnabled: release.notifyEnabled,
          bonus: release.bonus,
          bonusLinkId: (release as any).bonusLinkId ?? null,
          services: services.map((s) => ({ service: s.service, url: s.url })),
        }}
        links={links}
      />
    </div>
  );
}

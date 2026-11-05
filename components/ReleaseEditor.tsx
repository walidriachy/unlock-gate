"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ReleaseServiceRow {
  service: string;
  url: string;
}

const SERVICES: { id: string; label: string }[] = [
  { id: "spotify", label: "Spotify" },
  { id: "apple_music", label: "Apple Music" },
  { id: "youtube_music", label: "YouTube Music" },
  { id: "soundcloud", label: "SoundCloud" },
  { id: "deezer", label: "Deezer" },
  { id: "tidal", label: "Tidal" },
  { id: "amazon_music", label: "Amazon Music" },
  { id: "audiomack", label: "Audiomack" },
  { id: "bandcamp", label: "Bandcamp" },
  { id: "beatport", label: "Beatport" },
  { id: "bandlab", label: "BandLab" },
  { id: "anghami", label: "Anghami" },
];

function detectService(url: string): string | null {
  const u = url.toLowerCase();
  if (u.includes("spotify")) return "spotify";
  if (u.includes("music.apple")) return "apple_music";
  if (u.includes("music.youtube")) return "youtube_music";
  if (u.includes("soundcloud")) return "soundcloud";
  if (u.includes("deezer")) return "deezer";
  if (u.includes("tidal")) return "tidal";
  if (u.includes("amazon")) return "amazon_music";
  return null;
}

export default function ReleaseEditor({
  mode,
  initial,
  releasesBase,
  links = [],
}: {
  mode: "create" | "edit";
  initial?: {
    id?: string;
    title?: string;
    artist?: string;
    coverUrl?: string | null;
    releaseDate?: number | null;
    notifyEnabled?: boolean;
    bonus?: { actionId: string; label: string } | null;
    bonusLinkId?: string | null;
    services?: ReleaseServiceRow[];
  };
  releasesBase: string;
  links?: { id: string; title: string; slug: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [releaseDate, setReleaseDate] = useState(
    initial?.releaseDate ? new Date(initial.releaseDate).toISOString().slice(0, 16) : ""
  );
  const [notifyEnabled, setNotifyEnabled] = useState(initial?.notifyEnabled ?? false);
  const [bonusLabel, setBonusLabel] = useState(initial?.bonus?.label ?? "");
  const [bonusLinkId, setBonusLinkId] = useState(initial?.bonusLinkId ?? "");
  const [services, setServices] = useState<ReleaseServiceRow[]>(initial?.services ?? []);
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function parsePaste(url: string) {
    setPaste(url);
    const service = detectService(url);
    if (!service) return;
    let guess = "";
    try {
      const path = new URL(url).pathname.split("/").filter(Boolean);
      guess = decodeURIComponent(path[path.length - 1]).replace(/[-_]+/g, " ").replace(/\?.*/, "");
    } catch {
      /* ignore */
    }
    if (!title && guess) setTitle(guess.replace(/\b\w/g, (c) => c.toUpperCase()));
    setServices((s) => (s.some((x) => x.service === service) ? s : [...s, { service, url }]));

    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.ok && data.meta) {
        if (data.meta.title && !title) setTitle(data.meta.title);
        if (data.meta.artist && !artist) setArtist(data.meta.artist);
        if (data.meta.coverUrl && !coverUrl) setCoverUrl(data.meta.coverUrl);
      }
    } catch {
      /* ignore */
    }
  }

  function setServiceUrl(service: string, url: string) {
    setServices((s) => {
      const exists = s.find((x) => x.service === service);
      if (exists) return s.map((x) => (x.service === service ? { ...x, url } : x));
      return [...s, { service, url }];
    });
  }

  async function save() {
    setError("");
    if (!title.trim()) return setError("Give the release a title");
    setBusy(true);
    const payload: any = {
      action: mode === "create" ? "create" : "update",
      id: initial?.id,
      title,
      artist,
      coverUrl,
      releaseDate: releaseDate ? new Date(releaseDate).getTime() : null,
      notifyEnabled,
      bonus: bonusLabel ? { actionId: "spotify_follow_artist", label: bonusLabel } : null,
      bonusLinkId: bonusLinkId || null,
      services: services.filter((s) => s.url.trim()),
    };
    const res = await fetch("/api/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return setError(data.error || "Could not save");
    setSaved(true);
    if (mode === "create") router.push(`/dashboard/releases/${data.release.id}`);
    else router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <section className="card p-4">
          <h2 className="mb-3 font-bold">Paste one link</h2>
          <input
            className="input"
            placeholder="Paste a Spotify, Apple Music or Deezer link…"
            value={paste}
            onChange={(e) => parsePaste(e.target.value)}
          />
          <p className="mt-2 text-xs faint">We fill in the cover and the other services by themselves (stubbed in this clone — add services below).</p>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 font-bold">Release</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="label">Artist</label>
              <input className="input" value={artist} onChange={(e) => setArtist(e.target.value)} />
            </div>
            <div>
              <label className="label">Cover image URL</label>
              <input className="input" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
            </div>
            <div>
              <label className="label">Release date</label>
              <input className="input" type="datetime-local" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={notifyEnabled} onChange={(e) => setNotifyEnabled(e.target.checked)} />
            Countdown and “Notify me” before release day
          </label>
          <div className="mt-3">
            <label className="label">Bonus under the buttons (optional)</label>
            <input className="input" placeholder="e.g. Stems for a Spotify follow" value={bonusLabel} onChange={(e) => setBonusLabel(e.target.value)} />
          </div>
          {links.length > 0 && (
            <div>
              <label className="label">Bonus unlock link (optional)</label>
              <select className="select" value={bonusLinkId} onChange={(e) => setBonusLinkId(e.target.value)}>
                <option value="">None — label only</option>
                {links.map((l) => (
                  <option key={l.id} value={l.id}>{l.title} ({l.slug})</option>
                ))}
              </select>
              <p className="mt-1 text-xs faint">
                Uses the real unlock flow: visitors complete its actions to claim the bonus.
              </p>
            </div>
          )}
        </section>

        <section className="card p-4">
          <h2 className="mb-3 font-bold">Places to listen</h2>
          <div className="space-y-2">
            {SERVICES.map((s) => {
              const row = services.find((x) => x.service === s.id);
              return (
                <div key={s.id} className="grid grid-cols-[120px_1fr] items-center gap-2">
                  <span className="text-sm">{s.label}</span>
                  <input
                    className="input"
                    placeholder="https://…"
                    value={row?.url ?? ""}
                    onChange={(e) => setServiceUrl(s.id, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {error && <p className="text-sm text-[var(--color-bad)]">{error}</p>}
        <div className="flex gap-2">
          <button className="btn btn-primary btn-lg" onClick={save} disabled={busy}>
            {busy ? "Saving…" : mode === "create" ? "Create release link" : "Save changes"}
          </button>
          {saved && mode === "edit" && <span className="badge badge-good self-center">Saved</span>}
        </div>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-center text-xs uppercase faint">Preview</p>
        <div className="card overflow-hidden">
          <div className="h-40 w-full" style={{ background: coverUrl ? `center/cover url(${coverUrl})` : "linear-gradient(140deg,#18b06a,#07130d)" }} />
          <div className="p-4">
            <h3 className="text-lg font-bold">{title || "Your release"}</h3>
            <p className="text-sm muted">{artist || "artist"}</p>
            {notifyEnabled && releaseDate && new Date(releaseDate).getTime() > Date.now() ? (
              <div className="mt-3 rounded-xl bg-[var(--color-surface-2)] p-3 text-center">
                <p className="text-xs faint">Drops in</p>
                <p className="text-lg font-extrabold">{Math.max(0, Math.ceil((new Date(releaseDate).getTime() - Date.now()) / 86_400_000))} days</p>
                <button className="btn btn-secondary btn-sm mt-2">Notify me</button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {services.filter((s) => s.url).length === 0 && <p className="text-sm faint">Add a service link…</p>}
                {services
                  .filter((s) => s.url)
                  .map((s) => (
                    <button key={s.service} className="btn btn-secondary btn-block justify-start">
                      ▶ Play on {SERVICES.find((x) => x.id === s.service)?.label ?? s.service}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs faint">{releasesBase}</p>
      </div>
    </div>
  );
}

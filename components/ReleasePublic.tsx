"use client";

import { useEffect, useState } from "react";
import UnlockCard, { type PublicAction } from "./UnlockCard";
import { type UnlockCardLink, type UnlockCreator } from "./UnlockCard";

const SERVICE_LABEL: Record<string, string> = {
  spotify: "Spotify",
  apple_music: "Apple Music",
  youtube_music: "YouTube Music",
  soundcloud: "SoundCloud",
  deezer: "Deezer",
  tidal: "Tidal",
  amazon_music: "Amazon Music",
  audiomack: "Audiomack",
  bandcamp: "Bandcamp",
  beatport: "Beatport",
  bandlab: "BandLab",
  anghami: "Anghami",
};

export interface ReleaseServiceView {
  id: string;
  service: string;
  url: string;
}

export default function ReleasePublic({
  releaseId,
  title,
  artist,
  coverUrl,
  releaseDate,
  notifyEnabled,
  services,
  bonusLabel,
  bonusLink,
}: {
  releaseId: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  releaseDate: number | null;
  notifyEnabled: boolean;
  services: ReleaseServiceView[];
  bonusLabel: string | null;
  bonusLink: { link: UnlockCardLink; actions: PublicAction[]; creator: UnlockCreator } | null;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch("/api/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view", releaseId }),
      keepalive: true,
    }).catch(() => {});
  }, [releaseId]);

  const upcoming = notifyEnabled && releaseDate != null && releaseDate > now;
  const diff = releaseDate ? Math.max(0, releaseDate - now) : 0;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  async function notify(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    await fetch("/api/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "notify", releaseId, email }),
    });
    setDone(true);
  }

  function play(id: string) {
    fetch("/api/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "play", serviceId: id }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        className="mx-auto h-56 w-56 rounded-2xl shadow-2xl"
        style={{ background: coverUrl ? `center/cover url(${coverUrl})` : "linear-gradient(140deg,#18b06a,#07130d)" }}
      />
      <div className="mt-5 text-center">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="text-sm muted">{artist}</p>
      </div>

      {upcoming ? (
        <div className="mt-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-center">
          <p className="text-xs uppercase faint">Drops in</p>
          <p className="mt-1 font-mono text-2xl font-extrabold">
            {days}d {String(hours).padStart(2, "0")}:{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
          {done ? (
            <p className="mt-3 text-sm accent-text">You're on the list — we'll tell you the moment it's out.</p>
          ) : (
            <form onSubmit={notify} className="mt-3 flex gap-2">
              <input className="input" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn btn-primary">Notify me</button>
            </form>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {services.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-block justify-between"
              onClick={() => play(s.id)}
            >
              <span>▶ Play on {SERVICE_LABEL[s.service] ?? s.service}</span>
              <span className="faint">↗</span>
            </a>
          ))}
          {services.length === 0 && <p className="text-center text-sm muted">No listening links yet.</p>}
        </div>
      )}

      {bonusLink ? (
        <div className="mt-4">
          <p className="mb-2 text-center text-xs uppercase faint">🎁 Bonus — unlock to claim</p>
          <UnlockCard link={bonusLink.link} actions={bonusLink.actions} creator={bonusLink.creator} />
        </div>
      ) : bonusLabel ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-4 text-center text-sm">
          <p className="font-semibold">🎁 Bonus</p>
          <p className="muted">{bonusLabel}</p>
        </div>
      ) : null}

      <p className="mt-8 text-center text-[11px] faint">Made with Gatekeeper</p>
    </div>
  );
}

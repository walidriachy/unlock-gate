"use client";

import { useEffect, useState } from "react";
import UnlockCard, { type PublicAction } from "./UnlockCard";
import ProviderLogo from "./ProviderLogo";
import PageBackground from "./PageBackground";

export interface BioButtonView {
  id: string;
  kind: "link" | "unlock" | "header" | "social";
  label: string;
  url: string | null;
  iconKey: string;
  highlight: "none" | "pulse" | "shine" | "wobble";
  clicks: number;
  unlock?: {
    link: { id: string; title: string; accent: string; coverUrl: string | null; background: { kind: string; value?: string; blur?: number }; destinationType: "url" | "file" | "text" };
    actions: PublicAction[];
    creator: { name: string; verified: boolean; og: boolean };
  } | null;
}

export interface BioPageViewProps {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  socials: Record<string, string>;
  theme: string;
  font: string;
  accent: string;
  buttonStyle: string;
  corners: string;
  background: { kind: string; value?: string; blur?: number };
  buttons: BioButtonView[];
  emailSignup: { listId: string } | null;
  preview?: boolean;
}

const FONTS: Record<string, string> = {
  sans: "var(--font-sans)",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "'SF Mono', ui-monospace, Menlo, monospace",
  rounded: "'Avenir Next Rounded', 'Nunito', system-ui, sans-serif",
  display: "'Impact', 'Haettenschweiler', system-ui, sans-serif",
  handwritten: "'Bradley Hand', 'Segoe Script', cursive",
  condensed: "'Arial Narrow', 'Roboto Condensed', system-ui, sans-serif",
};

export default function BioPageView(props: BioPageViewProps) {
  const { theme, font, accent, buttonStyle, corners, buttons, username, preview } = props;
  const [openUnlock, setOpenUnlock] = useState<BioButtonView["unlock"] | null>(null);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setPageUrl(window.location.href.split("#")[0]);
  }, []);

  useEffect(() => {
    if (preview) return;
    fetch("/api/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view", username }),
      keepalive: true,
    }).catch(() => {});
  }, [preview, username]);

  function track(buttonId: string) {
    if (preview) return;
    fetch("/api/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "click", buttonId, username }),
      keepalive: true,
    }).catch(() => {});
  }

  async function joinEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (!preview) {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bioUsername: username, email }),
      });
    }
    setEmailDone(true);
  }

  return (
    <div
      className={`bio-theme-${theme} relative isolate min-h-full overflow-hidden px-5 py-10`}
      style={{ ["--accent" as string]: accent, fontFamily: FONTS[font] || FONTS.sans }}
    >
      <PageBackground background={props.background} contained={preview} wash={0.45} />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          {props.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={props.avatarUrl} alt={props.name} className="h-20 w-20 rounded-full object-cover ring-2" style={{ boxShadow: `0 0 0 4px color-mix(in srgb, ${accent} 35%, transparent)` }} />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full text-2xl font-bold" style={{ background: `color-mix(in srgb, ${accent} 35%, transparent)` }}>
              {props.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <h1 className="mt-3 text-xl font-extrabold">{props.name}</h1>
          <p className="text-sm opacity-70">@{username}</p>
          {props.bio && <p className="mt-2 max-w-xs text-sm opacity-85">{props.bio}</p>}

          {Object.keys(props.socials).length > 0 && (
            <div className="mt-3 flex gap-3 text-lg">
              {Object.entries(props.socials).map(([key, value]) => (
                <a
                  key={key}
                  href={value.startsWith("http") ? value : `https://${key}.com/${value.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  title={key}
                  className="opacity-80 transition-opacity hover:opacity-100"
                  onClick={() => track(`social-${key}`)}
                >
                  <ProviderLogo id={key} variant="bare" size={20} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2.5">
          {buttons.map((b) => {
            if (b.kind === "header") {
              return (
                <p key={b.id} className="pt-3 text-xs font-semibold uppercase tracking-wide opacity-60">
                  {b.label}
                </p>
              );
            }
            const cls = `bio-btn bio-corners-${corners} bio-style-${buttonStyle} ${b.highlight !== "none" ? `hl-${b.highlight}` : ""}`;
            if (b.kind === "unlock") {
              return (
                <button
                  key={b.id}
                  className={cls}
                  onClick={() => {
                    track(b.id);
                    if (b.unlock) setOpenUnlock(b.unlock);
                  }}
                >
                  <span>{b.iconKey || "🔒"}</span>
                  <span className="flex-1 text-left">{b.label}</span>
                  <span className="opacity-60">🔒</span>
                </button>
              );
            }
            return (
              <a
                key={b.id}
                href={b.url || "#"}
                target={preview ? undefined : "_blank"}
                rel="noreferrer"
                className={cls}
                onClick={() => track(b.id)}
              >
                <span>{b.iconKey || "🔗"}</span>
                <span className="flex-1 text-left">{b.label}</span>
                <span className="opacity-60">↗</span>
              </a>
            );
          })}
        </div>

        {props.emailSignup && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold">Join my email list</p>
            {emailDone ? (
              <p className="mt-2 text-sm opacity-80">You're in — thanks!</p>
            ) : (
              <form onSubmit={joinEmail} className="mt-2 flex gap-2">
                <input
                  className="input"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn btn-primary">Join</button>
              </form>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-[11px] opacity-50">
          <a href="/" target={preview ? undefined : "_blank"} rel="noreferrer">
            Gatekeeper
          </a>
        </p>
      </div>

      {openUnlock && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={() => setOpenUnlock(null)}>
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex justify-end">
              <button className="btn btn-secondary btn-sm" onClick={() => setOpenUnlock(null)}>
                Close ✕
              </button>
            </div>
            <UnlockCard
              link={openUnlock.link}
              actions={openUnlock.actions}
              creator={openUnlock.creator}
              onEmailSubmit={async (value) => {
                const res = await fetch("/api/email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ linkId: openUnlock.link.id, email: value }),
                });
                return res.ok;
              }}
            />
          </div>
        </div>
      )}
      {showQr && pageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowQr(false)}
        >
          <div
            className="card w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Share this page</h2>
            <p className="mt-1 text-xs muted break-all">{pageUrl}</p>
            <div className="mx-auto mt-4 inline-block rounded-2xl bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/qr?data=${encodeURIComponent(pageUrl)}`}
                alt="QR code for this page"
                width={220}
                height={220}
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`/api/qr?data=${encodeURIComponent(pageUrl)}`}
                download={`gatekeeper-${props.username}.svg`}
                className="btn btn-primary btn-block"
              >
                Download QR (SVG)
              </a>
              <button className="btn btn-secondary btn-block" onClick={() => setShowQr(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {!preview && pageUrl && (
        <button
          type="button"
          onClick={() => setShowQr(true)}
          className="fixed bottom-5 right-5 z-40 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-surface-2)] px-4 py-2 text-xs font-semibold shadow-lg hover:bg-[var(--color-surface-3)]"
          aria-label="Share this page as a QR code"
        >
          Share QR
        </button>
      )}
    </div>
  );
}

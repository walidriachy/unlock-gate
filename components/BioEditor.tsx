"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BioPageView, { type BioButtonView } from "./BioPageView";
import type { PublicAction } from "./UnlockCard";

export interface EditorButton {
  kind: "link" | "unlock" | "header" | "social";
  label: string;
  url: string;
  iconKey: string;
  linkId: string;
  highlight: "none" | "pulse" | "shine" | "wobble";
}

interface LinkOption {
  id: string;
  title: string;
  publicPath: string;
  accent: string;
  actions: PublicAction[];
  destinationType: "url" | "file" | "text";
  coverUrl: string | null;
  live: boolean;
}

const THEMES = ["midnight", "aurora", "neon", "chrome", "gold", "sunset", "forest", "candy", "ocean", "mono", "rose", "paper"];
const BUTTON_STYLES = ["glass", "solid", "outline", "pop"];
const CORNERS = ["square", "rounded", "squircle", "pill"];
const FONTS = ["sans", "serif", "mono", "rounded", "display", "handwritten", "condensed"];
const HIGHLIGHTS: EditorButton["highlight"][] = ["none", "pulse", "shine", "wobble"];

const THEME_SWATCH: Record<string, string> = {
  midnight: "#06060d",
  aurora: "linear-gradient(160deg,#1b1240,#06060d)",
  neon: "linear-gradient(160deg,#12002b,#001b2e)",
  chrome: "linear-gradient(160deg,#20232b,#0b0c10)",
  gold: "linear-gradient(160deg,#2a1e05,#0b0904)",
  sunset: "linear-gradient(160deg,#2a0b1e,#170612)",
  forest: "linear-gradient(160deg,#062017,#04120d)",
  candy: "linear-gradient(160deg,#2a1240,#160a24)",
  ocean: "linear-gradient(160deg,#03202e,#02121a)",
  mono: "#0a0a0a",
  rose: "linear-gradient(160deg,#2c0f1a,#180710)",
  paper: "#f6f2ea",
};

export default function BioEditor({
  username,
  name,
  avatarUrl,
  bio,
  socials,
  initial,
  linkOptions,
  lists,
  bioDomain,
  pro,
}: {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  socials: Record<string, string>;
  initial: {
    theme: string;
    font: string;
    accent: string;
    buttonStyle: string;
    corners: string;
    background: { kind: string; value?: string; blur?: number };
    emailListId: string | null;
    publishedAt: number | null;
    buttons: EditorButton[];
  };
  linkOptions: LinkOption[];
  lists: { id: string; name: string }[];
  bioDomain: string;
  pro: boolean;
}) {
  const router = useRouter();
  const [theme, setTheme] = useState(initial.theme);
  const [font, setFont] = useState(initial.font);
  const [accent, setAccent] = useState(initial.accent);
  const [buttonStyle, setButtonStyle] = useState(initial.buttonStyle);
  const [corners, setCorners] = useState(initial.corners);
  const [backgroundKind, setBackgroundKind] = useState(initial.background.kind);
  const [backgroundValue, setBackgroundValue] = useState(initial.background.value ?? "");
  const [backgroundBlur, setBackgroundBlur] = useState(
    Math.min(30, Math.max(0, initial.background.blur ?? 0))
  );
  const [emailListId, setEmailListId] = useState(initial.emailListId ?? "");
  const [buttons, setButtons] = useState<EditorButton[]>(initial.buttons);
  const [published, setPublished] = useState(Boolean(initial.publishedAt));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"buttons" | "look">("buttons");

  function addButton(kind: EditorButton["kind"]) {
    setButtons((b) => [
      ...b,
      {
        kind,
        label: kind === "header" ? "New section" : kind === "unlock" ? "Free download" : "New link",
        url: "",
        iconKey: kind === "header" ? "" : "🔗",
        linkId: kind === "unlock" ? linkOptions[0]?.id ?? "" : "",
        highlight: "none",
      },
    ]);
  }

  function update(i: number, patch: Partial<EditorButton>) {
    setButtons((b) => b.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  function remove(i: number) {
    setButtons((b) => b.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    setButtons((b) => {
      const next = [...b];
      const t = i + dir;
      if (t < 0 || t >= next.length) return b;
      [next[i], next[t]] = [next[t], next[i]];
      return next;
    });
  }

  async function save(publish?: boolean) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        theme,
        font,
        accent,
        buttonStyle,
        corners,
        background: { kind: backgroundKind, value: backgroundValue, blur: backgroundBlur },
        emailListId: emailListId || null,
        buttons: buttons.map((b) => ({
          kind: b.kind,
          label: b.label,
          url: b.url || null,
          iconKey: b.iconKey,
          linkId: b.linkId || null,
          highlight: b.highlight,
        })),
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      setBusy(false);
      return setError(data.error || "Could not save");
    }
    if (publish) {
      const pub = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const pubData = await pub.json();
      if (!pubData.ok) {
        setBusy(false);
        return setError(pubData.error || "Could not publish");
      }
      setPublished(true);
    }
    setBusy(false);
    router.refresh();
  }

  // Build the preview buttons from the current editor state.
  const previewButtons: BioButtonView[] = buttons.map((b, i) => {
    const opt = linkOptions.find((l) => l.id === b.linkId);
    return {
      id: `preview-${i}`,
      kind: b.kind,
      label: b.label,
      url: b.kind === "unlock" ? null : b.url || "#",
      iconKey: b.iconKey,
      highlight: b.highlight,
      clicks: 0,
      unlock:
        b.kind === "unlock" && opt
          ? {
              link: {
                id: opt.id,
                title: opt.title,
                accent: opt.accent,
                coverUrl: opt.coverUrl,
                background: { kind: "gradient" },
                destinationType: opt.destinationType,
              },
              actions: opt.actions,
              creator: { name, verified: pro, og: false },
            }
          : b.kind === "unlock"
            ? {
                link: { id: "preview", title: b.label, accent, coverUrl: null, background: { kind: "gradient" }, destinationType: "text" },
                actions: [],
                creator: { name, verified: pro, og: false },
              }
            : null,
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        {/* published state */}
        <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`badge ${published ? "badge-good" : ""}`}>{published ? "Published" : "Not published"}</span>
              <span className="truncate text-sm font-semibold">{bioDomain}/{username}</span>
            </div>
            <p className="mt-1 text-xs faint">Claim a name, pick a theme, add your links and an email signup.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={() => save(false)} disabled={busy}>
              Save draft
            </button>
            {published ? (
              <a className="btn btn-secondary" href={`/bio/${username}`} target="_blank" rel="noreferrer">
                View ↗
              </a>
            ) : (
              <button className="btn btn-primary" onClick={() => save(true)} disabled={busy}>
                Publish
              </button>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-[var(--color-bad)]">{error}</p>}

        <div className="flex gap-1">
          <button className={`chip ${tab === "buttons" ? "chip-active" : ""}`} onClick={() => setTab("buttons")}>
            Buttons
          </button>
          <button className={`chip ${tab === "look" ? "chip-active" : ""}`} onClick={() => setTab("look")}>
            Theme & look
          </button>
        </div>

        {tab === "buttons" ? (
          <div className="card p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => addButton("link")}>
                + Link
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => addButton("unlock")} disabled={linkOptions.length === 0}>
                + Unlock link
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => addButton("header")}>
                + Section header
              </button>
            </div>

            <ul className="space-y-2">
              {buttons.map((b, i) => (
                <li key={i} className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3">
                  <div className="flex items-center gap-2">
                    <span className="cursor-grab faint">⠿</span>
                    <span className="badge capitalize">{b.kind}</span>
                    <input className="input" value={b.label} onChange={(e) => update(i, { label: e.target.value })} />
                    <button className="btn btn-ghost btn-sm" onClick={() => move(i, -1)}>↑</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => move(i, 1)}>↓</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => remove(i)}>✕</button>
                  </div>
                  {b.kind !== "header" && (
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_96px_140px]">
                      {b.kind === "unlock" ? (
                        <select className="select" value={b.linkId} onChange={(e) => update(i, { linkId: e.target.value })}>
                          <option value="">Pick an unlock link…</option>
                          {linkOptions.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.title}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input className="input" placeholder="https://…" value={b.url} onChange={(e) => update(i, { url: e.target.value })} />
                      )}
                      <input className="input" placeholder="icon" value={b.iconKey} onChange={(e) => update(i, { iconKey: e.target.value })} />
                      <select className="select" value={b.highlight} onChange={(e) => update(i, { highlight: e.target.value as EditorButton["highlight"] })}>
                        {HIGHLIGHTS.map((h) => (
                          <option key={h} value={h}>
                            {h === "none" ? "No highlight" : `${h} highlight`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </li>
              ))}
              {buttons.length === 0 && <li className="p-4 text-center text-sm muted">Add your first button above.</li>}
            </ul>
          </div>
        ) : (
          <div className="card space-y-5 p-4">
            <div>
              <p className="label">Theme</p>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`h-12 w-12 rounded-lg border-2 ${theme === t ? "border-[var(--accent)]" : "border-transparent"}`}
                    style={{ background: THEME_SWATCH[t] }}
                    title={t}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="label">Button style</p>
                <select className="select" value={buttonStyle} onChange={(e) => setButtonStyle(e.target.value)}>
                  {BUTTON_STYLES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="label">Corners</p>
                <select className="select" value={corners} onChange={(e) => setCorners(e.target.value)}>
                  {CORNERS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="label">Font</p>
                <select className="select" value={font} onChange={(e) => setFont(e.target.value)}>
                  {FONTS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <p className="label">Accent colour</p>
                <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-9 w-16 rounded-md border border-[var(--color-line-strong)] bg-transparent" />
              </div>
              <div>
                <p className="label">Background</p>
                <select className="select" value={backgroundKind} onChange={(e) => setBackgroundKind(e.target.value)}>
                  <option value="theme">From theme</option>
                  <option value="image">My own image</option>
                  <option value="video">Video (Pro)</option>
                </select>
              </div>
              {backgroundKind !== "theme" && (
                <div>
                  <p className="label">Background URL</p>
                  <input className="input" placeholder="https://…" value={backgroundValue} onChange={(e) => setBackgroundValue(e.target.value)} />
                </div>
              )}
              {backgroundKind !== "theme" && (
                <div>
                  <p className="label">
                    Background blur <span className="faint">{backgroundBlur}px</span>
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={backgroundBlur}
                    onChange={(e) => setBackgroundBlur(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                    aria-label="Background blur in pixels"
                  />
                </div>
              )}
            </div>

            <div>
              <p className="label">Email signup</p>
              <select className="select" value={emailListId} onChange={(e) => setEmailListId(e.target.value)}>
                <option value="">Off</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-center text-xs uppercase faint">Preview</p>
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-[var(--color-surface-3)]">
          <BioPageView
            preview
            username={username}
            name={name}
            avatarUrl={avatarUrl}
            bio={bio}
            socials={socials}
            theme={theme}
            font={font}
            accent={accent}
            buttonStyle={buttonStyle}
            corners={corners}
            background={{ kind: backgroundKind, value: backgroundValue, blur: backgroundBlur }}
            buttons={previewButtons}
            emailSignup={emailListId ? { listId: emailListId } : null}
          />
        </div>
      </div>
    </div>
  );
}

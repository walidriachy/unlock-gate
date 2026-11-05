"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionPicker from "./ActionPicker";
import ProviderLogo from "./ProviderLogo";
import UnlockCard, { type PublicAction } from "./UnlockCard";
import { findAction, providerById, targetUrl } from "@/lib/platforms";
import { accentFromTitle } from "@/lib/format";

export interface EditorAction {
  actionId: string;
  target: string;
  label?: string;
}

export interface EditorInitial {
  id?: string;
  title?: string;
  destinationType?: "url" | "file" | "text";
  destinationUrl?: string;
  fileId?: string | null;
  fileName?: string;
  textSnippet?: string;
  accentColor?: string | null;
  coverUrl?: string | null;
  background?: { kind: string; value?: string; blur?: number };
  widget?: { kind: "none" | "video" | "track"; value?: string; title?: string } | null;
  actions?: EditorAction[];
  scheduledAt?: number | null;
  expiresAt?: number | null;
  customSlug?: string | null;
  collectionId?: string | null;
  slug?: string;
}

interface Props {
  mode: "create" | "edit";
  initial?: EditorInitial;
  owned?: boolean;
  username?: string | null;
  baseUrl: string;
  collections?: { id: string; name: string }[];
  onSaved?: (linkId: string) => void;
}

export default function LinkEditor({ mode, initial = {}, owned = false, username, baseUrl, collections = [], onSaved }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? "");
  const [destType, setDestType] = useState<"url" | "file" | "text">(initial.destinationType ?? "url");
  const [destUrl, setDestUrl] = useState(initial.destinationUrl ?? "");
  const [textSnippet, setTextSnippet] = useState(initial.textSnippet ?? "");
  const [fileId, setFileId] = useState<string | null>(initial.fileId ?? null);
  const [fileName, setFileName] = useState(initial.fileName ?? "");
  const [accent, setAccent] = useState<string | null>(initial.accentColor ?? null);
  const [coverUrl, setCoverUrl] = useState(initial.coverUrl ?? "");
  const [bgKind, setBgKind] = useState(initial.background?.kind ?? "gradient");
  const [bgValue, setBgValue] = useState(initial.background?.value ?? "");
  const [bgBlur, setBgBlur] = useState(Math.min(30, Math.max(0, initial.background?.blur ?? 0)));
  const [widgetKind, setWidgetKind] = useState<"none" | "video" | "track">(initial.widget?.kind ?? "none");
  const [widgetUrl, setWidgetUrl] = useState(initial.widget?.value ?? "");
  const [widgetTitle, setWidgetTitle] = useState(initial.widget?.title ?? "");
  const [actions, setActions] = useState<EditorAction[]>(initial.actions ?? []);
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt ? new Date(initial.scheduledAt).toISOString().slice(0, 16) : "");
  const [expiresAt, setExpiresAt] = useState(initial.expiresAt ? new Date(initial.expiresAt).toISOString().slice(0, 16) : "");
  const [customSlug, setCustomSlug] = useState(initial.customSlug ?? "");
  const [collectionId, setCollectionId] = useState(initial.collectionId ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState<{ id: string; slug: string } | null>(
    mode === "edit" && initial.id ? { id: initial.id, slug: initial.slug ?? "" } : null
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const accentValue = accent || accentFromTitle(title || "Untitled");
  const publicActions: PublicAction[] = useMemo(
    () =>
      actions.map((a, index) => {
        const found = findAction(a.actionId);
        const provider = found?.provider ?? providerById("visit")!;
        return {
          id: `${a.actionId}-${index}`,
          index,
          provider: provider.id,
          providerName: provider.name,
          glyph: provider.glyph,
          color: provider.color,
          label: a.label || `${found?.action.label ?? "Action"} ${provider.name}`,
          actionType: found?.action.type ?? "action",
          targetUrl: targetUrl(provider.id, a.target),
          verification: found?.action.verification ?? "click",
          isEmail: provider.id === "email",
        };
      }),
    [actions]
  );

  const shareUrl = published
    ? owned && customSlug && username
      ? `${baseUrl}/${username}/${customSlug}`
      : `${baseUrl}/l/${published.slug}`
    : "";

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Upload failed");
      setFileId(data.file.id);
      setFileName(data.file.name);
    } catch (e) {
      setError(String((e as Error).message || e));
    } finally {
      setUploading(false);
    }
  }

  function addAction(actionId: string) {
    setActions((a) => [...a, { actionId, target: "" }]);
  }

  function updateAction(index: number, target: string) {
    setActions((a) => a.map((row, i) => (i === index ? { ...row, target } : row)));
  }

  function removeAction(index: number) {
    setActions((a) => a.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    setActions((a) => {
      const next = [...a];
      const target = index + dir;
      if (target < 0 || target >= next.length) return a;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function onDrop(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setActions((a) => {
      const next = [...a];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
  }

  async function save() {
    setError("");
    if (!title.trim()) return setError("Give the link a title");
    if (actions.length === 0) return setError("Add at least one action");
    for (const [i, a] of actions.entries()) {
      const found = findAction(a.actionId);
      if (found?.action.needsTarget && !a.target.trim()) {
        return setError(`Action ${i + 1} (${found.action.label}) needs a target`);
      }
    }
    if (destType === "url" && !destUrl.trim()) return setError("Add a destination URL");
    if (destType === "text" && !textSnippet.trim()) return setError("Add the text people unlock");
    if (destType === "file" && !fileId) return setError("Upload a file first");

    setBusy(true);
    try {
      const payload: any = {
        action: mode === "create" ? "create" : "update",
        linkId: initial.id,
        title,
        destinationType: destType,
        destinationUrl: destUrl,
        textSnippet,
        fileId,
        accentColor: accent,
        coverUrl,
        background: { kind: bgKind, value: bgValue, blur: bgBlur },
        widget: widgetKind === "none" ? null : { kind: widgetKind, value: widgetUrl, title: widgetTitle || undefined },
        collectionId: collectionId || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt).getTime() : null,
        expiresAt: expiresAt ? new Date(expiresAt).getTime() : null,
        customSlug: customSlug || null,
        actions: actions.map((a) => ({ actionId: a.actionId, target: a.target, label: a.label })),
      };
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not save");
      setPublished({ id: data.link.id, slug: data.link.slug });
      if (mode === "create") {
        try {
          const stored = JSON.parse(localStorage.getItem("gk_unclaimed") || "[]");
          if (!stored.includes(data.link.id)) localStorage.setItem("gk_unclaimed", JSON.stringify([...stored, data.link.id]));
        } catch {
          /* ignore */
        }
      }
      setBusy(false);
      if (onSaved) onSaved(data.link.id);
      if (owned) router.refresh();
    } catch (e) {
      setError(String((e as Error).message || e));
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* ---------- form ---------- */}
      <div className="space-y-5">
        {/* content */}
        <section className="card p-4">
          <h2 className="mb-3 font-bold">What people get</h2>
          <div className="mb-3 flex gap-2">
            {(["url", "file", "text"] as const).map((t) => (
              <button key={t} className={`chip ${destType === t ? "chip-active" : ""}`} onClick={() => setDestType(t)}>
                {t === "url" ? "A URL" : t === "file" ? "A file" : "A text snippet"}
              </button>
            ))}
          </div>

          <label className="label">Title</label>
          <input className="input mb-3" placeholder="e.g. Free Sample Pack Vol. 3" value={title} onChange={(e) => setTitle(e.target.value)} />

          {destType === "url" && (
            <>
              <label className="label">Destination URL</label>
              <input className="input" placeholder="https://drive.google.com/…" value={destUrl} onChange={(e) => setDestUrl(e.target.value)} />
            </>
          )}
          {destType === "text" && (
            <>
              <label className="label">Text people unlock</label>
              <textarea className="textarea" placeholder="CODE-808-UNLOCK or a short message" value={textSnippet} onChange={(e) => setTextSnippet(e.target.value)} />
            </>
          )}
          {destType === "file" && (
            <div>
              <label className="label">File</label>
              <label className="btn btn-secondary cursor-pointer">
                {uploading ? "Uploading…" : fileName ? `✓ ${fileName}` : "Upload a file"}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFile(f);
                  }}
                />
              </label>
              <p className="mt-2 text-xs faint">Local stub storage (25 MB). Real app: object storage.</p>
            </div>
          )}
        </section>

        {/* actions */}
        <section className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Actions</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => setPickerOpen(true)}>
              + Add action {actions.length}/20
            </button>
          </div>
          <p className="mb-3 text-xs faint">What people do to unlock, in this order. Drag to reorder.</p>

          {actions.length === 0 && (
            <div className="rounded-xl border border-dashed border-[var(--color-line-strong)] p-6 text-center text-sm muted">
              Your actions show up here. Add a subscribe, a follow or an email step.
            </div>
          )}

          <ul className="space-y-2">
            {actions.map((a, index) => {
              const found = findAction(a.actionId);
              const provider = found?.provider;
              return (
                <li
                  key={`${a.actionId}-${index}`}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(index)}
                  className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="cursor-grab faint" title="Drag to reorder">⠿</span>
                    <ProviderLogo id={provider?.id ?? "visit"} size={28} />
                    <span className="flex-1 text-sm font-semibold">
                      {found?.action.label} <span className="muted">· {provider?.name}</span>
                    </span>
                    <button className="btn btn-ghost btn-sm" onClick={() => move(index, -1)} aria-label="Move up">↑</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => move(index, 1)} aria-label="Move down">↓</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeAction(index)} aria-label="Remove">✕</button>
                  </div>
                  {found?.action.needsTarget && (
                    <input
                      className="input mt-2"
                      placeholder={found.action.targetHint || "Target URL or handle"}
                      value={a.target}
                      onChange={(e) => updateAction(index, e.target.value)}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* design */}
        <section className="card p-4">
          <h2 className="mb-3 font-bold">Look</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Accent colour</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentValue}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded-md border border-[var(--color-line-strong)] bg-transparent"
                />
                <button className="btn btn-ghost btn-sm" onClick={() => setAccent(null)}>
                  Auto from title
                </button>
              </div>
            </div>
            <div>
              <label className="label">Cover image URL (optional)</label>
              <input className="input" placeholder="https://…/cover.jpg" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
            </div>
            <div>
              <label className="label">Widget (optional)</label>
              <select className="select" value={widgetKind} onChange={(e) => setWidgetKind(e.target.value as "none" | "video" | "track")}>
                <option value="none">None</option>
                <option value="video">Embedded video</option>
                <option value="track">Track preview (audio)</option>
              </select>
            </div>
            {widgetKind !== "none" && (
              <>
                <div>
                  <label className="label">{widgetKind === "video" ? "Video URL (YouTube, Vimeo or mp4)" : "Audio URL (mp3/ogg)"}</label>
                  <input className="input" placeholder="https://…" value={widgetUrl} onChange={(e) => setWidgetUrl(e.target.value)} />
                </div>
                <div>
                  <label className="label">Widget title (optional)</label>
                  <input className="input" placeholder="Behind the scenes" value={widgetTitle} onChange={(e) => setWidgetTitle(e.target.value)} />
                </div>
              </>
            )}
            <div>
              <label className="label">Page background</label>
              <select className="select" value={bgKind} onChange={(e) => setBgKind(e.target.value)}>
                <option value="gradient">Dark gradient</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            {bgKind !== "gradient" && (
              <div>
                <label className="label">{bgKind === "video" ? "Video URL (mp4/webm)" : "Image URL"}</label>
                <input
                  className="input"
                  placeholder={bgKind === "video" ? "https://…/loop.mp4" : "https://…/background.jpg"}
                  value={bgValue}
                  onChange={(e) => setBgValue(e.target.value)}
                />
              </div>
            )}
            {bgKind !== "gradient" && (
              <div>
                <label className="label">
                  Background blur <span className="faint">{bgBlur}px</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={bgBlur}
                  onChange={(e) => setBgBlur(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                  aria-label="Background blur in pixels"
                />
                <p className="mt-1 text-xs faint">Only the background is blurred — text and buttons stay sharp.</p>
              </div>
            )}
          </div>
        </section>

        {/* advanced (owned) */}
        {owned && (
          <section className="card p-4">
            <h2 className="mb-3 font-bold">Scheduling & URL</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Show from (optional)</label>
                <input className="input" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              </div>
              <div>
                <label className="label">Hide after (optional)</label>
                <input className="input" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              </div>
              <div>
                <label className="label">Custom URL</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs faint">{username ? `/${username}/` : "/…/"}</span>
                  <input className="input" placeholder="presets" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
                </div>
              </div>
              {collections.length > 0 && (
                <div>
                  <label className="label">Collection</label>
                  <select className="select" value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
                    <option value="">None</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>
        )}

        {error && <p className="text-sm text-[var(--color-bad)]">{error}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <button className="btn btn-primary btn-lg" onClick={save} disabled={busy}>
            {busy ? "Saving…" : published && mode === "edit" ? "Save changes" : "Publish link"}
          </button>
          {owned && (
            <Link href="/dashboard/links" className="btn btn-ghost">
              Cancel
            </Link>
          )}
        </div>
      </div>

      {/* ---------- preview ---------- */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-2 text-center text-xs uppercase faint">Preview</p>
        <div className="mx-auto w-full max-w-sm rounded-[2rem] border-4 border-[var(--color-surface-3)] bg-[var(--color-ink)] p-3">
          {title || actions.length > 0 ? (
            <UnlockCard
              demo
              link={{
                id: "preview",
                title: title || "Your link title",
                accent: accentValue,
                coverUrl: coverUrl || null,
                background: { kind: bgKind, value: bgValue, blur: bgBlur },
                widget: widgetKind === "none" ? null : { kind: widgetKind, value: widgetUrl, title: widgetTitle || undefined },
                destinationType: destType,
              }}
              actions={publicActions}
              creator={{ name: username || "you", verified: owned, og: false }}
            />
          ) : (
            <div className="p-8 text-center text-sm faint">
              <div className="mx-auto mb-3 h-24 rounded-xl bg-[var(--color-surface-2)]" />
              Your link title
            </div>
          )}
        </div>

        {published && (
          <div className="card mt-4 p-4 anim-in">
            <h3 className="font-bold">Your link is live 🎉</h3>
            <div className="mt-2 flex gap-2">
              <input className="input" readOnly value={shareUrl} />
              <button className="btn btn-secondary" onClick={() => navigator.clipboard?.writeText(shareUrl)}>
                Copy
              </button>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/qr?data=${encodeURIComponent(shareUrl)}`} alt="QR code" className="h-24 w-24 rounded-lg bg-white p-1" />
              <div className="text-sm">
                <p className="muted">Scan to test it, or open it:</p>
                <a className="accent-text link-underline" href={shareUrl} target="_blank" rel="noreferrer">
                  Open the unlock page ↗
                </a>
              </div>
            </div>
            {!owned && (
              <div className="mt-4 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3 text-sm">
                <p className="font-semibold">Keep it: sign up free</p>
                <p className="mt-1 muted">A link made without an account works, but you can't edit it or see its numbers.</p>
                <Link href={`/register?link=${published.id}`} className="btn btn-primary btn-sm mt-2">
                  Sign up and keep it
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <ActionPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={addAction} usedActionIds={actions.map((a) => a.actionId)} />
    </div>
  );
}

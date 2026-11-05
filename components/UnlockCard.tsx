"use client";

import { useEffect, useRef, useState } from "react";
import ProviderLogo from "./ProviderLogo";

export interface PublicAction {
  id: string;
  index: number;
  provider: string;
  providerName: string;
  glyph: string;
  color: string;
  label: string;
  actionType: string;
  targetUrl: string;
  verification: "click" | "email" | "oauth";
  isEmail: boolean;
}

export interface UnlockCardLink {
  id: string;
  title: string;
  accent: string;
  coverUrl: string | null;
  background: { kind: string; value?: string; blur?: number };
  widget?: { kind: "none" | "video" | "track"; value?: string; title?: string } | null;
  destinationType: "url" | "file" | "text";
}

export interface UnlockCreator {
  name: string;
  verified: boolean;
  og: boolean;
  since?: string;
}

interface Props {
  link: UnlockCardLink;
  actions: PublicAction[];
  creator: UnlockCreator;
  demo?: boolean;
  onEmailSubmit?: (email: string, actionIndex: number) => Promise<boolean>;
  initialSteps?: number[];
  destinationName?: string;
}

type Destination =
  | { kind: "url"; url: string | null; name?: string }
  | { kind: "file"; url: string | null; name?: string }
  | { kind: "text"; text: string };

const PAST: Record<string, string> = {
  subscribe: "Subscribed",
  follow: "Followed",
  join: "Joined",
  like: "Liked",
  comment: "Commented",
  repost: "Reposted",
  like_comment: "Liked & commented",
  email: "Joined",
  visit: "Visited",
  install: "Installed",
  watch: "Watched",
  create: "Opened",
};

function pastTense(a: PublicAction): string {
  return PAST[a.actionType] || "Done";
}

function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function VideoEmbed({ url }: { url: string }) {
  const isFile = /\.(mp4|webm|ogg)(\?|$)/i.test(url);
  if (isFile) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video src={url} controls className="block w-full" />
    );
  }
  return (
    <div className="aspect-video w-full">
      <iframe
        src={toEmbedUrl(url)}
        title="Embedded video"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function TrackPreview({ url, title }: { url: string; title?: string | null }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-surface-3)] text-lg">
        ♪
      </div>
      <div className="min-w-0 flex-1">
        {title && <p className="truncate text-sm font-semibold">{title}</p>}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio src={url} controls className="mt-1 w-full" />
      </div>
    </div>
  );
}

export default function UnlockCard({
  link,
  actions,
  creator,
  demo = false,
  onEmailSubmit,
  initialSteps = [],
  destinationName,
}: Props) {
  const total = actions.length;
  const [done, setDone] = useState<number[]>(initialSteps);
  const [working, setWorking] = useState<number | null>(null);
  const [checking, setChecking] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [bubble, setBubble] = useState<{ index: number; text: string } | null>(null);
  const [glow, setGlow] = useState(false);
  const [emailFor, setEmailFor] = useState<number | null>(null);
  const [emailValue, setEmailValue] = useState("");
  const [error, setError] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [toast, setToast] = useState<{ name: string; phase: "in" | "out" } | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [opened, setOpened] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  useEffect(() => clearTimers, []);

  // Load this visitor's progress, and surface any OAuth result in the URL.
  useEffect(() => {
    if (demo) return;
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const v = params.get("verify");
        if (v === "ok") setStatus("Verified — step completed.");
        else if (v === "not-completed") setStatus("We couldn't confirm that action yet — try again.");
        else if (v && v !== "ok") setStatus("Verification didn't complete. You can try again.");

        await fetch("/api/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ intent: "view", linkId: link.id }),
        });
        const res = await fetch(`/api/unlock?linkId=${encodeURIComponent(link.id)}`);
        const data = await res.json();
        if (data?.ok && Array.isArray(data.stepsCompleted)) {
          setDone(data.stepsCompleted);
          const next = actions.map((a) => a.index).find((i) => !data.stepsCompleted.includes(i));
          setActive(next ?? null);
        }
      } catch {
        /* offline — steps still work locally */
      }
    })();
  }, [demo, link.id, actions]);

  const allDone = total > 0 && done.length >= total;
  const progress = total === 0 ? 0 : Math.round((done.length / total) * 100);

  useEffect(() => {
    if (!allDone) return;
    setGlow(true);
    setActive(null);
    const t = setTimeout(() => setGlow(false), 700);
    return () => clearTimeout(t);
  }, [allDone]);

  function showBubble(index: number, text: string) {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    setBubble({ index, text });
    bubbleTimer.current = setTimeout(() => setBubble(null), 2200);
  }

  /** Highlight and scroll to the next step that still needs doing. */
  function advance(nextDone: number[]) {
    const next = actions.map((a) => a.index).find((i) => !nextDone.includes(i));
    setActive(next ?? null);
    if (next !== null) {
      later(() => {
        const el = rootRef.current?.querySelector(`[data-step="${next}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 240);
    }
  }

  function applyDone(index: number, text?: string, nextDoneArg?: number[]) {
    const nextDone = nextDoneArg ?? (done.includes(index) ? done : [...done, index].sort((a, b) => a - b));
    setDone(nextDone);
    showBubble(index, text || pastTense(actions[index]));
    setConfirming(null);
    setStatus("");
    advance(nextDone);
  }

  /** Record a step on the server (the client never decides on its own). */
  async function recordStep(index: number, text?: string) {
    setWorking(index);
    setError("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "step", linkId: link.id, index }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not verify");
      applyDone(index, text, data.stepsCompleted);
    } catch (e) {
      setError(String((e as Error).message || e));
    } finally {
      setWorking(null);
    }
  }

  /** Demo: one tap plays the whole sequence, never leaving the page. */
  function playDemoSequence() {
    clearTimers();
    const order = actions.map((a) => a.index);
    order.forEach((idx, i) => {
      later(() => {
        setDone((d) => (d.includes(idx) ? d : [...d, idx].sort((a, b) => a - b)));
        showBubble(idx, pastTense(actions[idx]));
      }, i * 300);
    });
    later(() => setGlow(true), order.length * 300 + 40);
    later(() => setDone((d) => (d.length ? [] : d)), 12000);
  }

  async function submitEmail(index: number) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("Enter a valid email");
      return;
    }
    setWorking(index);
    setError("");
    try {
      const save =
        onEmailSubmit ??
        (async (email: string) => {
          const res = await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkId: link.id, email }),
          });
          return res.ok;
        });
      const ok = await save(emailValue, index);
      if (!ok) throw new Error("Could not save that email");
      setEmailFor(null);
      setEmailValue("");
      await recordStep(index, "Joined");
    } catch (e) {
      setError(String((e as Error).message || e));
      setWorking(null);
    }
  }

  /**
   * The flow the product promises:
   *  1. always CHECK the step on the server first;
   *  2. if it is already done → show the done animation and move to the next step;
   *  3. only if it is NOT done → open the platform (or the consent screen);
   *  4. then confirm and advance.
   */
  async function handleStep(index: number) {
    const a = actions[index];
    if (demo) {
      playDemoSequence();
      return;
    }
    if (checking !== null || working !== null) return;

    // 2. Already recorded for this visitor — don't open anything.
    if (done.includes(index)) {
      showBubble(index, `${pastTense(a)} — already done`);
      advance(done);
      return;
    }
    if (a.isEmail) {
      setEmailFor(index);
      setActive(index);
      return;
    }

    // 1. Check server-side first.
    setChecking(index);
    setError("");
    setStatus("Checking…");
    let completed = false;
    let verifyUrl: string | null = null;
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "check", linkId: link.id, index }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Could not check");
      completed = Boolean(data.completed);
      verifyUrl = data.verifyUrl ?? null;
      if (completed) {
        applyDone(index, `${pastTense(a)} — already done`, data.stepsCompleted);
        setStatus("");
        return;
      }
    } catch (e) {
      setError(String((e as Error).message || e));
      setStatus("");
      return;
    } finally {
      setChecking(null);
    }

    // 3. Not done → now we open the platform.
    const url = verifyUrl || a.targetUrl;
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    setConfirming(index);
    setActive(index);
    setStatus(
      verifyUrl
        ? `Waiting for ${a.providerName} to confirm…`
        : `Finish the step on ${a.providerName}, then tap again to confirm.`
    );
  }

  async function confirmOpened(index: number) {
    await recordStep(index);
  }

  function runToast(name: string) {
    setToast({ name, phase: "in" });
    later(() => setToast((t) => (t ? { ...t, phase: "out" } : t)), 3400);
    later(() => setToast(null), 3900);
  }

  async function handleUnlock() {
    if (!allDone) return;
    setError("");
    setUnlocking(true);

    if (demo) {
      runToast(destinationName || `${link.title} · pack.zip`);
      later(() => {
        setDestination({
          kind: "text",
          text: "DEMO-CODE-4821\n\nOn a real link this is the file, URL or code your fans get.",
        });
        setOpened(true);
      }, 1700);
      later(() => {
        setDestination(null);
        setOpened(false);
        setDone([]);
        setToast(null);
      }, 7000);
      later(() => setUnlocking(false), 200);
      return;
    }

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "unlock", linkId: link.id }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Unlock failed");
      const dest: Destination = data.destination;
      runToast(destinationName || (dest.kind === "text" ? `${link.title}.txt` : dest.name || link.title));
      later(() => {
        setDestination(dest);
        if (dest.kind === "url" && dest.url) {
          window.open(dest.url, "_blank", "noopener,noreferrer");
          setOpened(true);
        }
        if (dest.kind === "file" && dest.url) {
          const a = document.createElement("a");
          a.href = dest.url;
          a.download = dest.name || "download";
          document.body.appendChild(a);
          a.click();
          a.remove();
          setOpened(true);
        }
      }, 1500);
    } catch (e) {
      setError(String((e as Error).message || e));
    } finally {
      later(() => setUnlocking(false), 300);
    }
  }

  const topWash = `radial-gradient(120% 90% at 20% 0%, color-mix(in srgb, ${link.accent} 26%, transparent), transparent 70%)`;

  return (
    <div
      ref={rootRef}
      className={`relative mx-auto w-full max-w-md rounded-[24px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.04)] p-5 backdrop-blur-xl ${
        glow || (allDone && !destination) ? "unlock-glow" : ""
      }`}
      style={{ ["--accent" as string]: link.accent }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 rounded-t-[24px]" style={{ background: topWash }} />

      {link.coverUrl && (
        <div
          className="relative mb-4 h-28 w-full overflow-hidden rounded-2xl"
          style={{ background: `center/cover no-repeat url(${link.coverUrl})` }}
        />
      )}

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <h2 className="display text-[22px] leading-tight">{link.title}</h2>
          <button
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--color-line)] bg-white/[0.05] text-sm"
            title="Copy link"
            onClick={() => {
              if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            ⤴
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[13px]">
          <span className="muted">by {creator.name}</span>
          {creator.verified && <span className="badge badge-accent !px-2 !py-0">✓ Verified creator</span>}
          {creator.og && <span className="badge !px-2 !py-0">OG</span>}
        </div>

        {link.widget && link.widget.kind !== "none" && link.widget.value && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-line)] bg-black/30">
            {link.widget.title && (
              <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide muted">
                {link.widget.title}
              </p>
            )}
            {link.widget.kind === "video" ? (
              <VideoEmbed url={link.widget.value} />
            ) : (
              <TrackPreview url={link.widget.value} title={link.widget.title} />
            )}
          </div>
        )}

        {destination ? (
          <div className="mt-5 anim-in">
            <div className="badge badge-good mb-3">✓ Unlocked</div>
            {destination.kind === "text" ? (
              <div>
                <p className="mb-2 text-sm muted">Here is your code:</p>
                <pre className="overflow-x-auto rounded-xl border border-[var(--color-line)] bg-black/40 p-4 text-sm">
                  {destination.text}
                </pre>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-sm muted">
                  {opened ? "We opened it for you. Didn't work?" : "Your content is ready."}
                </p>
                {destination.url && (
                  <a href={destination.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
                    {destination.kind === "file" ? "Download file" : "Open link"}
                  </a>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <ol className="mt-5 space-y-2.5">
              {actions.map((a) => {
                const isDone = done.includes(a.index);
                const isWorking = working === a.index;
                const isChecking = checking === a.index;
                const isConfirming = confirming === a.index;
                const isActive = active === a.index && !isDone;
                return (
                  <li key={a.id} className="relative" data-step={a.index}>
                    <button
                      type="button"
                      onClick={() =>
                        isConfirming ? confirmOpened(a.index) : handleStep(a.index)
                      }
                      disabled={isDone || isWorking || isChecking || (checking !== null && !isChecking)}
                      className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-xl px-6 text-[14px] font-medium transition-[background-color,color,opacity,box-shadow] duration-200 disabled:cursor-default ${
                        isActive ? "next-step" : ""
                      }`}
                      style={
                        isDone
                          ? { background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.3)" }
                          : isWorking || isChecking
                            ? { background: "rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.55)" }
                            : isConfirming
                              ? { background: "rgba(0,199,106,0.18)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,199,106,0.6)" }
                              : { background: `${a.color}`, color: a.provider === "snapchat" ? "#111" : "#fff" }
                      }
                    >
                      {isDone ? (
                        <span className="check-pop">✓</span>
                      ) : isWorking || isChecking ? (
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <ProviderLogo id={a.provider} variant="bare" size={18} />
                      )}
                      <span className="truncate">
                        {isChecking ? "Checking…" : isWorking ? "Confirming…" : isConfirming ? "Tap again to confirm" : a.label}
                      </span>
                    </button>

                    {bubble && bubble.index === a.index && (
                      <span
                        className="us-bubble pointer-events-none absolute right-[-10px] top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 rounded-full bg-white px-3 py-2 text-[13px] font-semibold text-[#111]"
                        style={{ boxShadow: "0 14px 30px -12px rgba(0,0,0,0.7)" }}
                      >
                        <ProviderLogo id={a.provider} variant="bare" size={15} /> {bubble.text}
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--accent)] text-[11px] text-white">
                          ✓
                        </span>
                      </span>
                    )}

                    {a.isEmail && emailFor === a.index && !isDone && (
                      <div className="mt-2 flex gap-2 anim-in">
                        <input
                          className="input"
                          type="email"
                          placeholder="you@email.com"
                          value={emailValue}
                          onChange={(e) => setEmailValue(e.target.value)}
                          autoFocus
                        />
                        <button className="btn btn-primary" disabled={working === a.index} onClick={() => submitEmail(a.index)}>
                          {working === a.index ? "…" : "Join"}
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>

            {status && (
              <p className="mt-3 text-center text-xs accent-text" aria-live="polite">
                {status}
              </p>
            )}

            <p className="mt-3 text-center text-xs muted" aria-live="polite">
              Progress update: {done.length}/{total} done
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
              />
            </div>

            <button
              className={`btn btn-block mt-4 ${allDone ? "btn-primary" : ""}`}
              style={allDone ? undefined : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}
              onClick={handleUnlock}
              disabled={!allDone || unlocking}
            >
              {allDone ? <span>🔓</span> : <span>🔒</span>}
              {unlocking ? "Unlocking…" : link.destinationType === "text" ? "Reveal code" : "Unlock file"}
            </button>
            {!allDone && <p className="mt-2 text-center text-xs faint">Complete all steps above first</p>}
            {error && <p className="mt-2 text-center text-xs text-[var(--color-bad)]">{error}</p>}
          </>
        )}
      </div>

      {toast && (
        <div
          className={`us-file ${toast.phase === "out" ? "us-file-out" : ""} absolute -bottom-3 left-[-14px] z-20 flex w-64 items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3`}
          style={{ boxShadow: "0 20px 40px -18px rgba(0,0,0,0.9)" }}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--accent)]/15 text-base">🗂️</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold">{toast.name}</span>
            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/10">
              <span className="us-bar block h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }} />
            </span>
          </span>
          <span className="us-done grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[11px] text-white" style={{ animationDelay: "1.45s" }}>
            ✓
          </span>
        </div>
      )}
    </div>
  );
}

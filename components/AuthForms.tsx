"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("demo@gatekeeper.app");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) return setError(data.error || "Something went wrong");
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-sm text-[var(--color-bad)]">{error}</p>}
      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Logging in…" : "Log in"}
      </button>
      <div className="flex items-center justify-between text-xs">
        <Link href="/forgot" className="font-semibold muted hover:text-white">
          Forgot password?
        </Link>
        <span className="faint">Demo: demo@gatekeeper.app / demo1234</span>
      </div>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "forgot", email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) return setError(data.error || "Something went wrong");
    setSent(true);
    setDevUrl(data.devUrl || null);
  }

  if (sent) {
    return (
      <div className="space-y-4 text-sm">
        <p className="muted">
          If <span className="text-white">{email}</span> has an account, a reset link is on its way.
        </p>
        {devUrl && (
          <div className="rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-surface-2)] p-3">
            <p className="text-xs faint">No mail provider is configured in this clone, so use the link directly:</p>
            <Link href={devUrl} className="mt-2 block break-all font-semibold accent-text">
              Open reset link →
            </Link>
          </div>
        )}
        <Link href="/login" className="btn btn-secondary btn-block">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      </div>
      {error && <p className="text-sm text-[var(--color-bad)]">{error}</p>}
      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Sending…" : "Send reset link"}
      </button>
      <Link href="/login" className="block text-center text-xs font-semibold muted hover:text-white">
        Back to log in
      </Link>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return setError("Those passwords don't match");
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset", token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) return setError(data.error || "Could not reset that password");
    router.push("/login?reset=1");
    router.refresh();
  }

  if (!token) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-[var(--color-bad)]">This reset link is missing its token.</p>
        <Link href="/forgot" className="btn btn-secondary btn-block">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">New password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required autoFocus />
      </div>
      <div>
        <label className="label">Repeat password</label>
        <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={6} required />
      </div>
      {error && <p className="text-sm text-[var(--color-bad)]">{error}</p>}
      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Saving…" : "Set new password"}
      </button>
      <p className="text-center text-xs faint">Every other device will be signed out.</p>
    </form>
  );
}

export function RegisterForm({ claimLinkId }: { claimLinkId?: string }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState<{ url?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", displayName, email, password, claimLinkId: claimLinkId || null }),
    });
    const data = await res.json();
    if (!data.ok) {
      setLoading(false);
      return setError(data.error || "Something went wrong");
    }
    // Also claim any other links this browser made while signed out.
    try {
      const stored = JSON.parse(localStorage.getItem("gk_unclaimed") || "[]");
      if (stored.length) {
        await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "claim", linkIds: stored }),
        });
        localStorage.removeItem("gk_unclaimed");
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
    setVerify({ url: data.verifyUrl });
  }

  if (verify) {
    return (
      <div className="space-y-4 text-sm">
        <div className="rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-surface-2)] p-4">
          <p className="font-semibold">You're in — one last step.</p>
          <p className="mt-1 muted">
            We sent a confirmation link to <span className="text-white">{email}</span>. Click it to
            get your verified-creator badge and publish a bio page.
          </p>
          {verify.url && (
            <Link href={verify.url} className="mt-3 block break-all font-semibold accent-text">
              No mail provider in this clone — confirm now →
            </Link>
          )}
        </div>
        <button className="btn btn-primary btn-block" onClick={() => router.push("/dashboard")}>
          Continue to dashboard
        </button>
        <p className="text-center text-xs faint">You can resend the link later from your profile.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {claimLinkId && (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3 text-sm">
          Your link will be kept and moved into your new account, views and unlocks included.
        </div>
      )}
      <div>
        <label className="label">Name or handle</label>
        <input className="input" placeholder="nova.beats" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
      </div>
      {error && <p className="text-sm text-[var(--color-bad)]">{error}</p>}
      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Creating…" : "Create my account"}
      </button>
      <p className="text-center text-xs faint">Free forever · No card required</p>
    </form>
  );
}

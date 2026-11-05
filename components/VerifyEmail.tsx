"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmail({ token }: { token: string }) {
  const [state, setState] = useState<"checking" | "ok" | "error">("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("This link is missing its token.");
      return;
    }
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "verify-email", token }),
        });
        const data = await res.json();
        if (!alive) return;
        if (!data.ok) {
          setState("error");
          setMessage(data.error || "That link is invalid or has expired.");
          return;
        }
        setState("ok");
      } catch {
        if (alive) {
          setState("error");
          setMessage("We couldn't reach the server. Try the link again.");
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  if (state === "checking") {
    return (
      <div className="flex items-center gap-3 text-sm muted">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
        Confirming your email…
      </div>
    );
  }

  if (state === "ok") {
    return (
      <div className="space-y-4 text-sm">
        <div className="badge badge-good">✓ Email confirmed</div>
        <p className="muted">
          Your verified-creator badge is on. You can publish a bio page and your profile now shows
          as verified.
        </p>
        <Link href="/dashboard" className="btn btn-primary btn-block">
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm">
      <p className="text-[var(--color-bad)]">{message}</p>
      <p className="muted">Open your profile to send yourself a fresh link.</p>
      <Link href="/dashboard/profile" className="btn btn-secondary btn-block">
        Resend from profile
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserActions({
  userId,
  role,
  tier,
  verified,
  suspended,
}: {
  userId: string;
  role: string;
  tier: string;
  verified: boolean;
  suspended: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function run(action: string, extra: Record<string, any> = {}) {
    setBusy(action);
    setMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId, ...extra }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      if (action === "impersonate") {
        window.location.href = "/dashboard";
        return;
      }
      router.refresh();
    } catch (e) {
      setMsg(String((e as Error).message || e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!verified && (
        <button className="btn btn-ghost btn-sm" disabled={!!busy} onClick={() => run("verify")}>
          Verify
        </button>
      )}
      <select
        className="select text-xs"
        value={role}
        disabled={!!busy}
        onChange={(e) => run("setRole", { role: e.target.value })}
      >
        <option value="user">user</option>
        <option value="support">support</option>
        <option value="admin">admin</option>
      </select>
      <select
        className="select text-xs"
        value={tier}
        disabled={!!busy}
        onChange={(e) => run("setPlan", { tier: e.target.value })}
      >
        <option value="free">free</option>
        <option value="pro">pro</option>
        <option value="lifetime">lifetime</option>
      </select>
      {suspended ? (
        <button className="btn btn-secondary btn-sm" disabled={!!busy} onClick={() => run("unsuspend")}>
          Unsuspend
        </button>
      ) : (
        <button className="btn btn-ghost btn-sm" disabled={!!busy} onClick={() => run("suspend")}>
          Suspend
        </button>
      )}
      <button className="btn btn-ghost btn-sm" disabled={!!busy} onClick={() => run("impersonate")}>
        Impersonate
      </button>
      {busy && <span className="text-xs faint">{busy}…</span>}
      {msg && <span className="text-xs text-[var(--color-bad)]">{msg}</span>}
    </div>
  );
}

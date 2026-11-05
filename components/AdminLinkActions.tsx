"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLinkActions({ linkId, status }: { linkId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function run(action: string) {
    setBusy(action);
    setMsg("");
    try {
      const res = await fetch("/api/admin/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, linkId }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (e) {
      setMsg(String((e as Error).message || e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {status !== "paused" && status !== "removed" && (
        <button className="btn btn-ghost btn-sm" disabled={!!busy} onClick={() => run("unpublish")}>
          Unpublish
        </button>
      )}
      {status !== "removed" && (
        <button className="btn btn-ghost btn-sm" disabled={!!busy} onClick={() => run("takedown")}>
          Takedown
        </button>
      )}
      {(status === "paused" || status === "removed") && (
        <button className="btn btn-secondary btn-sm" disabled={!!busy} onClick={() => run("restore")}>
          Restore
        </button>
      )}
      {busy && <span className="text-xs faint">{busy}…</span>}
      {msg && <span className="text-xs text-[var(--color-bad)]">{msg}</span>}
    </div>
  );
}

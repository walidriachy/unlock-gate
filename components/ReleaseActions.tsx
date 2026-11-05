"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReleaseActions({ releaseId, baseUrl }: { releaseId: string; baseUrl: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function emailFans() {
    setBusy(true);
    const res = await fetch("/api/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "notify-fans", id: releaseId }),
    });
    const data = await res.json();
    setBusy(false);
    setMsg(data.ok ? `${data.queued} fans queued. ${data.note || ""}` : "Could not queue");
  }

  async function remove() {
    if (!confirm("Delete this release link?")) return;
    await fetch("/api/releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: releaseId }),
    });
    router.push("/dashboard/releases");
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <a href={baseUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
          Open public page ↗
        </a>
        <button className="btn btn-primary" onClick={emailFans} disabled={busy}>
          {busy ? "Queueing…" : "Email fans on release day"}
        </button>
        <button className="btn btn-danger" onClick={remove}>
          Delete
        </button>
      </div>
      {msg && <p className="text-xs faint">{msg}</p>}
    </div>
  );
}

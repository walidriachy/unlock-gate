"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmtNumber, fmtDate } from "@/lib/format";

export interface ListRow {
  id: string;
  name: string;
  subscribers: number;
  createdAt: number;
}

export default function EmailListsClient({ rows }: { rows: ListRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    // Reuse the collections-style create on a dedicated list endpoint via the email route's list ensure.
    await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", name }),
    });
    setBusy(false);
    setName("");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card divide-y divide-[var(--color-line)]">
        {rows.length === 0 && <p className="p-6 text-sm muted">No lists yet. One is created the first time someone joins.</p>}
        {rows.map((r) => (
          <Link key={r.id} href={`/dashboard/email/${r.id}`} className="flex items-center gap-3 p-4 hover:bg-[var(--color-surface-2)]">
            <span className="text-lg">✉️</span>
            <div className="flex-1">
              <div className="font-semibold">{r.name}</div>
              <div className="text-xs faint">
                {fmtNumber(r.subscribers)} subscriber{r.subscribers === 1 ? "" : "s"} · created {fmtDate(r.createdAt)}
              </div>
            </div>
            <span className="faint">→</span>
          </Link>
        ))}
      </div>

      <form onSubmit={create} className="card h-fit p-4">
        <h2 className="mb-3 font-bold">New list</h2>
        <input className="input mb-3" placeholder="e.g. Next release" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn btn-primary btn-block" disabled={busy}>
          Create list
        </button>
        <p className="mt-3 text-xs faint">Segment by campaign so each drop goes to the right people.</p>
      </form>
    </div>
  );
}

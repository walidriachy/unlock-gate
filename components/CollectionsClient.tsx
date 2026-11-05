"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CollectionRow {
  id: string;
  name: string;
  links: number;
  shorts: number;
}

export default function CollectionsClient({ rows }: { rows: CollectionRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", name }),
    });
    setBusy(false);
    setName("");
    router.refresh();
  }

  async function rename(id: string) {
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename", id, name: editName }),
    });
    setEditing(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this collection? Links inside stay, they just leave the collection.")) return;
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card divide-y divide-[var(--color-line)]">
        {rows.length === 0 && <p className="p-6 text-sm muted">No collections yet. Group links per campaign, platform or client.</p>}
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 p-4">
            <span className="text-lg">🗂️</span>
            {editing === r.id ? (
              <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
            ) : (
              <div className="flex-1">
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs faint">
                  {r.links} link{r.links === 1 ? "" : "s"} · {r.shorts} short link{r.shorts === 1 ? "" : "s"}
                </div>
              </div>
            )}
            {editing === r.id ? (
              <button className="btn btn-primary btn-sm" onClick={() => rename(r.id)}>
                Save
              </button>
            ) : (
              <>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setEditing(r.id);
                    setEditName(r.name);
                  }}
                >
                  ✎
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => remove(r.id)}>
                  🗑
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={create} className="card h-fit p-4">
        <h2 className="mb-3 font-bold">New collection</h2>
        <input className="input mb-3" placeholder="e.g. Friday drops" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn btn-primary btn-block" disabled={busy}>
          Create
        </button>
        <p className="mt-3 text-xs faint">Unlock links and short links share the same collections.</p>
      </form>
    </div>
  );
}

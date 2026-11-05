"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmtNumber } from "@/lib/format";

export interface ShortRow {
  id: string;
  slug: string;
  destinationUrl: string;
  title: string;
  clicks: number;
  collectionId: string | null;
}

export default function ShortLinksClient({
  rows,
  collections,
  shortDomain,
  baseUrl,
}: {
  rows: ShortRow[];
  collections: { id: string; name: string }[];
  shortDomain: string;
  baseUrl: string;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/short", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", slug, destinationUrl: url, title, collectionId: collectionId || null }),
    });
    const data = await res.json();
    setBusy(false);
    if (!data.ok) return setError(data.error || "Could not create");
    setSlug("");
    setUrl("");
    setTitle("");
    router.refresh();
  }

  async function saveEdit(id: string) {
    await fetch("/api/short", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id, destinationUrl: editUrl }),
    });
    setEditing(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this short link?")) return;
    await fetch("/api/short", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="card overflow-hidden">
        <div className="scroll-x">
          <table className="table min-w-[600px]">
            <thead>
              <tr>
                <th>Short link</th>
                <th>Destination</th>
                <th>Clicks</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm muted">
                    No short links yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="font-semibold">{r.title}</div>
                    <a className="text-xs accent-text link-underline" href={`/s/${r.slug}`} target="_blank" rel="noreferrer">
                      {shortDomain}/{r.slug} ↗
                    </a>
                  </td>
                  <td className="max-w-[240px]">
                    {editing === r.id ? (
                      <div className="flex gap-1">
                        <input className="input" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} />
                        <button className="btn btn-primary btn-sm" onClick={() => saveEdit(r.id)}>
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className="block truncate text-sm muted" title={r.destinationUrl}>
                        {r.destinationUrl}
                      </span>
                    )}
                  </td>
                  <td>{fmtNumber(r.clicks)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          navigator.clipboard?.writeText(`${baseUrl}/s/${r.slug}`);
                        }}
                        title="Copy"
                      >
                        ⧉
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Edit destination"
                        onClick={() => {
                          setEditing(r.id);
                          setEditUrl(r.destinationUrl);
                        }}
                      >
                        ✎
                      </button>
                      <button className="btn btn-ghost btn-sm" title="Delete" onClick={() => remove(r.id)}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={create} className="card h-fit p-4">
        <h2 className="mb-3 font-bold">New short link</h2>
        <label className="label">Destination URL</label>
        <input className="input mb-3" placeholder="https://store.example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <label className="label">Slug (optional)</label>
        <div className="mb-3 flex items-center gap-1">
          <span className="text-xs faint">{shortDomain}/</span>
          <input className="input" placeholder="overlays" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <label className="label">Title (optional)</label>
        <input className="input mb-3" placeholder="Stream overlays" value={title} onChange={(e) => setTitle(e.target.value)} />
        {collections.length > 0 && (
          <>
            <label className="label">Collection</label>
            <select className="select mb-3" value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </>
        )}
        {error && <p className="mb-2 text-sm text-[var(--color-bad)]">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating…" : "Create short link"}
        </button>
        <p className="mt-3 text-xs faint">
          Change where it goes anytime — links in old videos and pinned posts keep working, and keep
          their clicks.
        </p>
      </form>
    </div>
  );
}

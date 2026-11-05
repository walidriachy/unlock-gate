"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fmtNumber, fmtPct } from "@/lib/format";

export interface LinkRow {
  id: string;
  title: string;
  publicPath: string;
  accent: string;
  views: number;
  unlocks: number;
  conversion: number;
  status: string;
  tone: string;
  actions: number;
  collection: string | null;
}

export default function LinksTable({ rows, baseUrl }: { rows: LinkRow[]; baseUrl: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status !== "all" && r.status.toLowerCase() !== status) return false;
      if (query && !r.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [rows, query, status]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function setLinkStatus(id: string, next: string) {
    setBusy(id);
    await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status", linkId: id, status: next }),
    });
    setBusy(null);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this link? Its analytics go too.")) return;
    setBusy(id);
    await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", linkId: id }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input max-w-xs" placeholder="Search links…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex gap-1">
          {["all", "live", "scheduled", "paused", "draft", "expired"].map((s) => (
            <button key={s} className={`chip capitalize ${status === s ? "chip-active" : ""}`} onClick={() => setStatus(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-x">
          <table className="table min-w-[720px]">
            <thead>
              <tr>
                <th>Link</th>
                <th>Views</th>
                <th>Unlocks</th>
                <th>Conv.</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm muted">
                    No links here yet.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: r.accent }} />
                      <div className="min-w-0">
                        <Link href={`/dashboard/links/${r.id}`} className="block truncate font-semibold hover:underline">
                          {r.title}
                        </Link>
                        <span className="block truncate text-xs faint">
                          {r.actions} action{r.actions === 1 ? "" : "s"} · {r.publicPath}
                          {r.collection ? ` · ${r.collection}` : ""}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{fmtNumber(r.views)}</td>
                  <td>{fmtNumber(r.unlocks)}</td>
                  <td>{fmtPct(r.conversion)}</td>
                  <td>
                    <span className={`badge ${r.tone === "good" ? "badge-good" : r.tone === "warn" ? "badge-accent" : ""}`}>{r.status}</span>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Copy link"
                        onClick={() => {
                          navigator.clipboard?.writeText(`${baseUrl}${r.publicPath}`);
                          flash("Link copied");
                        }}
                      >
                        ⧉
                      </button>
                      <a className="btn btn-ghost btn-sm" title="Open" href={`${baseUrl}${r.publicPath}`} target="_blank" rel="noreferrer">
                        ↗
                      </a>
                      <Link className="btn btn-ghost btn-sm" title="Edit" href={`/dashboard/links/${r.id}/edit`}>
                        ✎
                      </Link>
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={busy === r.id}
                        title={r.status === "Paused" ? "Resume" : "Pause"}
                        onClick={() => setLinkStatus(r.id, r.status === "Paused" ? "published" : "paused")}
                      >
                        {r.status === "Paused" ? "▶" : "⏸"}
                      </button>
                      <button className="btn btn-ghost btn-sm" disabled={busy === r.id} title="Delete" onClick={() => remove(r.id)}>
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

      {toast && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--color-surface-3)] px-4 py-2 text-sm">{toast}</div>}
    </div>
  );
}

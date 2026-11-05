"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fmtDate, fmtNumber } from "@/lib/format";

export interface SubRow {
  id: string;
  email: string;
  joinedAt: number;
}

export default function SubscribersClient({
  listId,
  listName,
  rows,
  pro,
}: {
  listId: string;
  listName: string;
  rows: SubRow[];
  pro: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => rows.filter((r) => r.email.toLowerCase().includes(query.toLowerCase())),
    [rows, query]
  );

  async function remove(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove-subscriber", id: listId, subscriberId: id }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input max-w-xs" placeholder="Search emails…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {pro ? (
          <a className="btn btn-secondary" href={`/api/email/export?listId=${listId}`}>
            Export CSV
          </a>
        ) : (
          <Link href="/dashboard/settings" className="btn btn-secondary" title="Export is a Pro feature">
            🔒 Export CSV
          </Link>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-x">
          <table className="table min-w-[480px]">
            <thead>
              <tr>
                <th>Email</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-sm muted">
                    {rows.length === 0 ? "No subscribers yet." : "No matches."}
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium">{r.email}</td>
                  <td className="muted">{fmtDate(r.joinedAt)}</td>
                  <td>
                    <div className="flex justify-end">
                      <button className="btn btn-ghost btn-sm" onClick={() => remove(r.id)}>
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
      <p className="text-xs faint">{fmtNumber(rows.length)} subscriber{rows.length === 1 ? "" : "s"} in {listName}. We never email your list.</p>
    </div>
  );
}

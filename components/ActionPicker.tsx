"use client";

import { useMemo, useState } from "react";
import { PROVIDERS, KIND_LABELS, type ActionKind } from "@/lib/platforms";
import ProviderLogo from "./ProviderLogo";

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (actionId: string) => void;
  usedActionIds?: string[];
}

export default function ActionPicker({ open, onClose, onPick, usedActionIds = [] }: Props) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ActionKind | "all">("all");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROVIDERS.filter((p) => (kind === "all" ? true : p.kind === kind))
      .map((p) => ({
        provider: p,
        actions: p.actions.filter(
          (a) =>
            !q ||
            a.label.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            a.id.includes(q)
        ),
      }))
      .filter((g) => g.actions.length > 0);
  }, [query, kind]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="panel flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[var(--color-line)] p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Choose an action</h3>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              ✕
            </button>
          </div>
          <input
            className="input mt-3"
            placeholder="Search 80 actions — subscribe, follow, join…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="scroll-x mt-3 flex gap-2 pb-1">
            <button className={`chip ${kind === "all" ? "chip-active" : ""}`} onClick={() => setKind("all")}>
              All
            </button>
            {(Object.keys(KIND_LABELS) as ActionKind[]).map((k) => (
              <button key={k} className={`chip whitespace-nowrap ${kind === k ? "chip-active" : ""}`} onClick={() => setKind(k)}>
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {groups.length === 0 && <p className="p-6 text-center text-sm muted">No actions match that.</p>}
          {groups.map((g) => (
            <div key={g.provider.id} className="mb-3">
              <div className="flex items-center gap-2 px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider faint">
                {g.provider.name}
                <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal">
                  {g.actions.length}
                </span>
              </div>
              {g.actions.map((a) => {
                const used = usedActionIds.includes(a.id);
                return (
                  <button
                    key={a.id}
                    disabled={used}
                    onClick={() => {
                      onPick(a.id);
                      onClose();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[var(--color-surface-2)] disabled:cursor-default disabled:opacity-45"
                  >
                    <ProviderLogo id={g.provider.id} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{a.label}</span>
                      <span className="block truncate text-[11px] faint">
                        {a.verification === "oauth" ? "Checked automatically" : a.verification === "email" ? "Email step" : "One tap to complete"}
                      </span>
                    </span>
                    {used ? (
                      <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] faint">added</span>
                    ) : (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.07] text-sm faint">+</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

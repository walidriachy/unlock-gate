"use client";

import { useState } from "react";

export default function SharePanel({ url, compact = false }: { url: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={compact ? "flex items-center gap-2" : "card p-4"}>
      {!compact && <p className="mb-2 text-xs font-semibold uppercase tracking-wide faint">Share</p>}
      <div className="flex flex-1 items-center gap-2">
        <input className="input" readOnly value={url} />
        <button className="btn btn-secondary" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {!compact && (
        <div className="mt-3 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/qr?data=${encodeURIComponent(url)}`} alt="QR code" className="h-24 w-24 rounded-lg bg-white p-1" />
          <div className="text-sm">
            <p className="muted">Scan to test it on your phone, or:</p>
            <a className="accent-text link-underline" href={url} target="_blank" rel="noreferrer">
              Open the unlock page ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

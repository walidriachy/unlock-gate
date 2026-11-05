"use client";

import { useState } from "react";

export default function SolanaPayButton({ tier }: { tier: "pro" | "lifetime" }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [memo, setMemo] = useState("");
  const [status, setStatus] = useState("");
  const [polling, setPolling] = useState(false);

  async function start() {
    setStatus("Creating payment…");
    const res = await fetch("/api/crypto/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier }),
    });
    const data = await res.json();
    if (!data.ok) {
      setStatus(data.error || "Could not start payment");
      return;
    }
    setUrl(data.url);
    setPaymentId(data.paymentId);
    setMemo(data.memo);
    setOpen(true);
    setStatus("Scan with a Solana wallet (Phantom, Solflare…).");
    poll(data.paymentId);
  }

  async function poll(pid: string) {
    setPolling(true);
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const res = await fetch("/api/crypto/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: pid }),
      });
      const data = await res.json();
      if (data.paid) {
        setStatus("Payment confirmed — plan upgraded.");
        setPolling(false);
        setTimeout(() => window.location.reload(), 1500);
        return;
      }
    }
    setPolling(false);
    setStatus("Timed out. You can retry verification.");
  }

  async function verifyNow() {
    const res = await fetch("/api/crypto/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId }),
    });
    const data = await res.json();
    if (data.paid) {
      setStatus("Payment confirmed — plan upgraded.");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setStatus("Not found yet. Make sure the memo was included.");
    }
  }

  if (!open) {
    return (
      <button className="btn btn-secondary btn-block mt-2" onClick={start}>
        Pay with Solana
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-3 text-center text-sm">
      <p className="mb-2 font-semibold">Pay with Solana</p>
      <p className="mb-2 text-xs faint break-all">{memo}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/qr?data=${encodeURIComponent(url)}`}
        alt="Solana Pay QR"
        className="mx-auto rounded-lg bg-white p-2"
        width={200}
        height={200}
      />
      <p className="mt-2 text-xs muted">{status}</p>
      <div className="mt-2 flex gap-2">
        <button className="btn btn-secondary btn-sm flex-1" onClick={verifyNow} disabled={polling}>
          I've paid — verify
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
}

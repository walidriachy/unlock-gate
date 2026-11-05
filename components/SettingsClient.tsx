"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fmtDate, fmtNumber } from "@/lib/format";
import SolanaPayButton from "@/components/SolanaPayButton";

const PLANS = [
  {
    tier: "free",
    name: "Free",
    price: "€0",
    cadence: "free, forever",
    features: [
      "Unlimited unlock links and email capture",
      "Link in bio with themes, fonts and an email signup",
      "Views and clicks, 7 days of history",
      "1 GB file storage",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    price: "€14.99",
    cadence: "per month",
    popular: true,
    features: [
      "No ads for your visitors or you, no branding",
      "A year of analytics, conversions and audience",
      "Custom URLs, short links and email export",
      "Pro button styles, highlights and avatar effects",
      "100 GB file storage",
    ],
  },
  {
    tier: "lifetime",
    name: "Lifetime",
    price: "€149",
    cadence: "one-time payment",
    features: ["Everything in Pro, forever", "Pay once, no subscription", "Every future Pro feature included"],
  },
];

export default function SettingsClient({
  tier,
  status,
  periodEnd,
  totalUnlocks,
  stripeEnabled,
}: {
  tier: string;
  status: string;
  periodEnd: number | null;
  totalUnlocks: number;
  stripeEnabled: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function choose(t: string) {
    setBusy(t);
    setMsg("");
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: t }),
    });
    const data = await res.json();
    setBusy(null);
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    if (!data.ok) return setMsg(data.error || "Could not change plan");
    setMsg(data.demo ? `Switched to ${t} (demo mode — no charge).` : "Plan updated.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm muted">Current plan</p>
          <p className="text-xl font-extrabold capitalize">{tier}</p>
          <p className="text-xs faint">
            {status}
            {periodEnd ? ` · renews ${fmtDate(periodEnd)}` : ""} · {fmtNumber(totalUnlocks)} total unlocks
          </p>
        </div>
        <span className="badge">{stripeEnabled ? "Stripe test mode" : "Demo billing (no Stripe key)"}</span>
      </div>

      {msg && <p className="text-sm accent-text">{msg}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const current = p.tier === tier;
          return (
            <div key={p.tier} className={`card p-5 ${p.popular ? "border-[var(--accent)]" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{p.name}</h3>
                {p.popular && <span className="badge badge-accent">Most popular</span>}
                {current && <span className="badge badge-good">Current</span>}
              </div>
              <p className="mt-2 text-2xl font-extrabold">
                {p.price} <span className="text-sm font-normal faint">/ {p.cadence}</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-sm muted">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                className={`btn btn-block mt-4 ${current ? "btn-secondary" : "btn-primary"}`}
                disabled={current || busy !== null}
                onClick={() => choose(p.tier)}
              >
                {current ? "Your plan" : busy === p.tier ? "…" : `Choose ${p.name}`}
              </button>
              {p.tier === "pro" || p.tier === "lifetime" ? (
                <SolanaPayButton tier={p.tier as "pro" | "lifetime"} />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Payments</h2>
        <p className="mt-1 text-sm muted">
          Payments run through Stripe. In this clone, without a Stripe key the plan changes instantly
          so every feature is explorable. With test keys, checkout opens for real (no charges).
        </p>
      </div>
    </div>
  );
}

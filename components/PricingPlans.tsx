"use client";

import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    monthly: "€0",
    yearly: "€0",
    cadenceMonthly: "Free, forever",
    cadenceYearly: "Free, forever",
    cta: "Join for free",
    href: "/register",
    features: [
      "Unlimited unlock links and email capture",
      "Link in bio with themes, fonts and an email signup",
      "Views and clicks, 7 days of history",
      "1 GB file storage",
    ],
  },
  {
    name: "Pro",
    monthly: "€14.99",
    yearly: "€98.93",
    cadenceMonthly: "per month",
    cadenceYearly: "per year · save 45%",
    cta: "Get Pro",
    href: "/register",
    popular: true,
    features: [
      "No ads for your visitors or for you, no branding",
      "A year of analytics, conversions and audience",
      "Custom URLs, short links and email export",
      "Pro button styles, highlights and avatar effects",
      "100 GB file storage",
    ],
  },
  {
    name: "Lifetime",
    monthly: "€149",
    yearly: "€149",
    cadenceMonthly: "one-time payment",
    cadenceYearly: "one-time payment",
    cta: "Get Lifetime",
    href: "/register",
    features: ["Everything in Pro, forever", "Pay once, no subscription", "Every future Pro feature included"],
  },
  {
    name: "Teams",
    monthly: "Let's talk",
    yearly: "Let's talk",
    cadenceMonthly: "early access",
    cadenceYearly: "early access",
    cta: "Join the waitlist",
    href: "/for/teams",
    features: [
      "Everything in Pro, for every creator",
      "One login for all your creators",
      "Your team as editors, creators as viewers",
      "Roster overview and a monthly report per creator",
    ],
  },
];

export default function PricingPlans() {
  const [yearly, setYearly] = useState(false);

  return (
    <div>
      {/* sliding pill toggle */}
      <div className="flex justify-center">
        <div className="relative flex rounded-full border border-[var(--color-line)] bg-white/[0.04] p-1 text-sm">
          <span
            className="absolute inset-y-1 w-1/2 rounded-full bg-white/10 transition-transform duration-300"
            style={{
              transform: yearly ? "translateX(100%)" : "translateX(0)",
              transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
            }}
            aria-hidden
          />
          <button
            className={`relative z-10 rounded-full px-5 py-2 font-medium ${yearly ? "muted" : ""}`}
            onClick={() => setYearly(false)}
            aria-pressed={!yearly}
          >
            Monthly
          </button>
          <button
            className={`relative z-10 rounded-full px-5 py-2 font-medium ${yearly ? "" : "muted"}`}
            onClick={() => setYearly(true)}
            aria-pressed={yearly}
          >
            Yearly · save 45%
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => (
          <div key={p.name} className={`card card-hover flex flex-col p-6 ${p.popular ? "border-[var(--accent)]" : ""}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {p.popular ? <span className="tier-sheen">{p.name}</span> : p.name}
              </h3>
              {p.popular && <span className="badge badge-accent">Most popular</span>}
            </div>
            <p
              key={`${p.name}-${yearly}`}
              className="anim-in mt-4 text-4xl font-extrabold tracking-tight"
            >
              {yearly ? p.yearly : p.monthly}
            </p>
            <p className="mt-1 text-xs faint">{yearly ? p.cadenceYearly : p.cadenceMonthly}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm muted">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="accent-text">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link href={p.href} className={`btn mt-6 ${p.popular ? "btn-primary" : "btn-secondary"}`}>
              {p.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-sm muted">
        Free or Pro? Start free; every link keeps working if you upgrade later.
      </p>
    </div>
  );
}

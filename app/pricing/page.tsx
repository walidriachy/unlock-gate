import { Fragment } from "react";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import Reveal from "@/components/anim/Reveal";
import PricingPlans from "@/components/PricingPlans";
import { MILESTONES } from "@/lib/db";
import { fmtNumber } from "@/lib/format";

export const metadata = {
  title: "Pricing",
  description: "Start free. Grow with Pro. Unlimited unlock links and a link in bio, free forever.",
};

const COMPARE: { group: string; rows: { feature: string; free: string; pro: string }[] }[] = [
  {
    group: "Unlock links",
    rows: [
      { feature: "Unlock links", free: "Unlimited", pro: "Unlimited" },
      { feature: "Steps per link", free: "Up to 20", pro: "Up to 20" },
      { feature: "Share a URL, file or text", free: "✓", pro: "✓" },
      { feature: "Email capture", free: "✓", pro: "✓" },
      { feature: "Export email lists", free: "—", pro: "✓" },
      { feature: "Custom URLs", free: "—", pro: "gatekeeper.com/you/your-link" },
      { feature: "Expiring links", free: "At 10K unlocks", pro: "✓" },
      { feature: "Short links", free: "Your pages", pro: "Any website" },
    ],
  },
  {
    group: "Link in bio",
    rows: [
      { feature: "Bio pages", free: "2", pro: "Unlimited" },
      { feature: "Themes", free: "8", pro: "All 12" },
      { feature: "Button styles, colours, corners", free: "✓", pro: "✓" },
      { feature: "Fonts, section headers, site icons", free: "✓", pro: "✓" },
      { feature: "Email signup on your page", free: "✓", pro: "✓" },
      { feature: "Unlock links on your page", free: "✓", pro: "✓" },
      { feature: "Scheduled links", free: "✓", pro: "✓" },
    ],
  },
  {
    group: "Release links",
    rows: [
      { feature: "Release links", free: "Up to 200", pro: "Up to 200" },
      { feature: "Fill in from one link", free: "✓", pro: "✓" },
      { feature: "Countdown and Notify me", free: "✓", pro: "✓" },
      { feature: "Email to fans on release day", free: "—", pro: "✓" },
      { feature: "A bonus under the buttons", free: "✓", pro: "✓" },
      { feature: "Plays per service and countries", free: "30 days", pro: "1 year" },
    ],
  },
  {
    group: "Page look",
    rows: [
      { feature: "Cover image and accent colour", free: "✓", pro: "✓" },
      { feature: "Preset backgrounds", free: "✓", pro: "✓" },
      { feature: "Your own image background", free: "At 500 unlocks", pro: "✓" },
      { feature: "Video and YouTube backgrounds", free: "At 5K unlocks", pro: "✓" },
      { feature: "Widgets", free: "At 1K unlocks", pro: "✓" },
      { feature: "Pro button styles", free: "At milestones", pro: "✓" },
      { feature: "Highlight a button", free: "At 1K unlocks", pro: "✓" },
      { feature: "Avatar effects", free: "At 10K unlocks", pro: "✓" },
    ],
  },
  {
    group: "Analytics",
    rows: [
      { feature: "Views and clicks", free: "✓", pro: "✓" },
      { feature: "History", free: "7 days", pro: "1 year" },
      { feature: "Per-link analytics", free: "✓", pro: "✓" },
      { feature: "Conversions", free: "7 days", pro: "1 year" },
      { feature: "Audience: countries, sources, devices", free: "Preview", pro: "Full" },
    ],
  },
  {
    group: "Brand and ads",
    rows: [
      { feature: "Ads on your unlock pages", free: "Shown", pro: "None" },
      { feature: "Sign-up button on your pages", free: "Shown", pro: "Removed" },
      { feature: "Verified badge", free: "—", pro: "✓" },
      { feature: "File storage", free: "1 GB", pro: "100 GB" },
    ],
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Pricing"
        title="Start free. Grow with Pro."
        subtitle="Unlimited unlock links and a link in bio, free forever. Go Pro by the month or year, or pay once and keep it."
      />

      <Section>
        <PricingPlans />
      </Section>

      <Section tinted title="Compare plans" intro="Every feature, plan by plan.">
        <Reveal>
          <div className="card overflow-hidden">
            <div className="scroll-x">
              <table className="table min-w-[640px]">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Free</th>
                    <th className="accent-text">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((g) => (
                    <Fragment key={g.group}>
                      <tr className="bg-white/[0.03]">
                        <td colSpan={3} className="text-xs font-semibold uppercase tracking-wide faint">
                          {g.group}
                        </td>
                      </tr>
                      {g.rows.map((r) => (
                        <tr key={g.group + r.feature}>
                          <td>{r.feature}</td>
                          <td className="muted">{r.free}</td>
                          <td className="accent-text">{r.pro}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section
        title="Grow into more, for free"
        intro="Every unlock on your links counts. Reach a milestone and the feature switches on for good, no upgrade needed."
      >
        <ol className="mx-auto max-w-3xl space-y-3">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.at} delay={i * 60} as="li">
              <div className="card card-hover flex items-center gap-4 p-4">
                <span className="badge badge-accent whitespace-nowrap">{fmtNumber(m.at)} unlocks</span>
                <span className="text-sm">{m.label}</span>
              </div>
            </Reveal>
          ))}
        </ol>
        <p className="mt-4 text-center text-sm muted">
          <a href="/register" className="accent-text link-underline">
            Start free
          </a>{" "}
          and your first unlocks already count.
        </p>
      </Section>

      <Section tinted title="Frequently asked questions">
        <Faq
          items={[
            { q: "Is there a free plan?", a: "Yes. Unlimited unlock links, email capture, a link in bio, and views and clicks, free forever. No card required." },
            { q: "What is the difference between Pro and Lifetime?", a: "They include the same features. Pro is a monthly or yearly subscription; Lifetime is a one-time payment that keeps Pro forever." },
            { q: "Can I unlock Pro features without paying?", a: "Yes, partly. As your links collect unlocks you reach milestones that switch features on for good — for example your own image backgrounds at 500 unlocks." },
            { q: "Can I cancel any time?", a: "Yes. Cancel in your billing settings and your plan stays active until the end of the period you paid for." },
            { q: "What happens to my links if I cancel?", a: "Your links stay online. Only the Pro features stop working." },
            { q: "How much analytics history do I get?", a: "Free accounts see the last 24 hours and 7 days. Pro adds 30 days, 6 months and a year, plus full audience insights." },
          ]}
        />
      </Section>

      <Section>
        <Reveal>
          <div className="text-center">
            <h2 className="display text-3xl md:text-5xl">Get the recognition you deserve</h2>
            <p className="mt-4 muted">Join creators growing their audience across 40+ platforms.</p>
            <a href="/register" className="btn btn-primary btn-lg mt-8">
              Get started for free
            </a>
          </div>
        </Reveal>
      </Section>
    </MarketingShell>
  );
}

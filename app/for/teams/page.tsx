import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "For teams",
  description:
    "One workspace for a roster of creators: shared links, shared analytics and shared drops. Coming soon, with early access opening to a small group.",
};

const DEMO: PublicAction[] = [
  {
    id: "tm1",
    index: 0,
    provider: "discord",
    providerName: "Discord",
    glyph: "💬",
    color: "#5865f2",
    label: "Join the studio server",
    actionType: "join",
    targetUrl: "https://discord.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "tm2",
    index: 1,
    provider: "youtube",
    providerName: "YouTube",
    glyph: "▶️",
    color: "#ff0033",
    label: "Subscribe to the studio channel",
    actionType: "subscribe",
    targetUrl: "https://youtube.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "One workspace for the whole roster",
    body: "Every creator on the team gets their own links and numbers, with one place to see how the whole roster is growing.",
  },
  {
    title: "Shared drops and brand assets",
    body: "Upload a pack once and hand the same gated link to every member, so nobody rebuilds the same campaign from scratch.",
  },
  {
    title: "Roles that keep it tidy",
    body: "Invite editors, managers and talent with the access they need, and keep billing and ownership with the people who should have it.",
  },
  {
    title: "Numbers you can report on",
    body: "Roll up views, unlocks and email growth across every creator, then export a clean report for a client or a label.",
  },
];

export default function TeamsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Coming soon · For teams"
        title="One workspace for your whole roster"
        subtitle="Shared links, shared analytics and shared drops for a team of creators. It is not open yet, but early access is opening to a small group soon."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/create" className="btn btn-primary btn-lg">
            Create a free link
          </Link>
          <Link href="/pricing" className="btn btn-secondary btn-lg">
            See pricing
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
          <div>
            <div className="text-xl font-extrabold">Unlimited</div>
            <div className="faint">creators per team</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">Shared</div>
            <div className="faint">links and analytics</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">Coming soon</div>
            <div className="faint">early access</div>
          </div>
        </div>
      </PageHero>

      <Section>
        <div className="flex justify-center">
          <UnlockCard
            demo
            link={{ id: "demo-team", title: "Studio Brand Vault", accent: "#38bdf8", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "northlight.studio", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="Built for a team, not a lone uploader"
        intro="The same unlock links you already use, with room for everyone who makes them."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card p-6">
              <h3 className="text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm muted">{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="card mx-auto max-w-2xl p-6 text-center md:p-8">
          <span className="badge badge-accent">Early access</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Be first when Teams opens</h2>
          <p className="mx-auto mt-2 max-w-md text-sm muted">
            Leave a work email and we will let you know the moment the shared workspace is ready
            for a small group.
          </p>
          <form className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@studio.com"
              aria-label="Work email"
            />
            <button type="button" className="btn btn-primary">
              Request access
            </button>
          </form>
          <p className="mt-3 text-xs faint">Demo only. Nothing is submitted and no email is stored.</p>
        </div>
      </Section>

      <Section tinted title="Teams questions">
        <Faq
          items={[
            {
              q: "When does Teams launch?",
              a: "We are still building it and have not set a public date. Early access will open to a small group first, starting with the people on the waitlist.",
            },
            {
              q: "What will a team plan include?",
              a: "A shared workspace with multiple creators, roles and permissions, shared link templates and rolled-up analytics across the roster.",
            },
            {
              q: "Can I use the current product with my team today?",
              a: "Yes. Every creator can use a normal account now. Teams is the layer that ties those accounts together, and it is not required to start.",
            },
            {
              q: "Will my existing links move over?",
              a: "The plan is to attach existing accounts to a team without breaking any live links, so nothing you have already shared stops working.",
            },
          ]}
        />
      </Section>

      <Section tinted={false}>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Bring your roster along when we launch</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Start on a free personal account now, and add the team the day it is ready.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/create" className="btn btn-primary btn-lg">
              Create a free link
            </Link>
            <Link href="/register" className="btn btn-secondary btn-lg">
              Create an account
            </Link>
          </div>
        </div>
      </Section>
    </MarketingShell>
  );
}

import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "For game creators",
  description:
    "Share scripts, mods and tools behind a Discord join, with bypass protection. Grow your server from every download and keep your files out of the wrong hands.",
};

const DEMO: PublicAction[] = [
  {
    id: "gc1",
    index: 0,
    provider: "discord",
    providerName: "Discord",
    glyph: "💬",
    color: "#5865f2",
    label: "Join the modding server",
    actionType: "join",
    targetUrl: "https://discord.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "gc2",
    index: 1,
    provider: "youtube",
    providerName: "YouTube",
    glyph: "▶️",
    color: "#ff0033",
    label: "Subscribe for update videos",
    actionType: "subscribe",
    targetUrl: "https://youtube.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "gc3",
    index: 2,
    provider: "x",
    providerName: "X",
    glyph: "✖️",
    color: "#e7e9ea",
    label: "Follow for patch notes",
    actionType: "follow",
    targetUrl: "https://x.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "Scripts behind a Discord join",
    body: "Your server is where support and updates live. Put the download behind a join and every new user lands where you can actually help them.",
  },
  {
    title: "Bypass protection that holds",
    body: "The file is only released by our server after every step is recorded. Leaked tools and client-side scripts get a dead link, not your work.",
  },
  {
    title: "Sell or gift with the same link",
    body: "Gate a free tool for a join, or put a step in front of a paid pack. The unlock flow stays the same as your project grows.",
  },
  {
    title: "Ship updates without reposting",
    body: "Replace the file behind a live link and everyone who unlocks gets the current version. No broken threads with old mirrors.",
  },
];

export default function GameCreatorsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="For game creators"
        title="Share scripts and mods behind a Discord join"
        subtitle="Grow your server from every download and keep your files out of scrape lists. Bypass protection means the people who unlock it are the people who actually join."
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
            <div className="text-xl font-extrabold">103K+</div>
            <div className="faint">creators</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">670M+</div>
            <div className="faint">joins and actions</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">Free</div>
            <div className="faint">to start</div>
          </div>
        </div>
      </PageHero>

      <Section>
        <div className="flex justify-center">
          <UnlockCard
            demo
            link={{ id: "demo-game", title: "Movement Script + Mod Menu", accent: "#f59e0b", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "nullbyte.dev", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="Protection that respects your work"
        intro="You spent the time building it. Make sure the download costs a join, not nothing."
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

      <Section title="Questions from other game creators">
        <Faq
          items={[
            {
              q: "Can people bypass the join with a script?",
              a: "No. The file is stored behind the unlock and is only released after our server records every step, so a client-side bypass has nothing to reach.",
            },
            {
              q: "Can I update a mod after release?",
              a: "Yes. Upload the new version behind the same link. Everyone who unlocks it gets the latest file, and old posts keep working.",
            },
            {
              q: "Can I gate a paid tool?",
              a: "Yes. You choose the steps, including a join, a subscribe or a follow, and can point to a paid download just as easily as a free one.",
            },
            {
              q: "Will this work for Roblox, Minecraft or other mods?",
              a: "It works with any file you can upload, whatever the game. The unlock flow does not depend on the platform your users play on.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Grow the server with every file</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Put your next script behind one link and let it recruit for you.
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

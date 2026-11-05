import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "For streamers",
  description:
    "Share overlays, alerts and configs for a follow or a Discord join. Turn your overlay pack into followers without leaving your stream.",
};

const DEMO: PublicAction[] = [
  {
    id: "st1",
    index: 0,
    provider: "twitch",
    providerName: "Twitch",
    glyph: "🟣",
    color: "#a970ff",
    label: "Follow on Twitch",
    actionType: "follow",
    targetUrl: "https://twitch.tv",
    verification: "click",
    isEmail: false,
  },
  {
    id: "st2",
    index: 1,
    provider: "discord",
    providerName: "Discord",
    glyph: "💬",
    color: "#5865f2",
    label: "Join the stream server",
    actionType: "join",
    targetUrl: "https://discord.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "st3",
    index: 2,
    provider: "youtube",
    providerName: "YouTube",
    glyph: "▶️",
    color: "#ff0033",
    label: "Subscribe for VODs",
    actionType: "subscribe",
    targetUrl: "https://youtube.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "Overlays for a follow",
    body: "Your overlay, alert or config pack is exactly what new viewers want. Ask for a follow in return and the trade feels fair both ways.",
  },
  {
    title: "Grow the Discord while you stream",
    body: "Send the same link in chat and let it feed your server. Members join before they download, so the community grows with every drop.",
  },
  {
    title: "The same look for every new follower",
    body: "Keep one link for your current pack and swap the files whenever you refresh the design, without reposting anything.",
  },
  {
    title: "Know what your chat grabs",
    body: "See which overlay bundle pulls the most follows and which one barely moves, then build the next pack around the winner.",
  },
];

export default function StreamersPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="For streamers"
        title="Turn your overlay packs into followers"
        subtitle="Share alerts, overlays and configs for a follow or a Discord join. It is the value your chat already asks for, working for you instead of against you."
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
            <div className="faint">follows and joins</div>
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
            link={{ id: "demo-stream", title: "Stream Overlay + Alert Pack", accent: "#a970ff", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "emberlive", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="Made for live, not just for posts"
        intro="A link you can drop in chat, pin in the panel, or post between games."
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

      <Section title="Questions from other streamers">
        <Faq
          items={[
            {
              q: "Can I run a link mid-stream?",
              a: "Yes. Paste it in chat or add it to a panel. Viewers complete the follow or join on their phone and the file opens, without interrupting the stream.",
            },
            {
              q: "How do I stop people from skipping the follow?",
              a: "The download is only released by our server once every step is recorded, so a client-side extension has nothing to unlock.",
            },
            {
              q: "Can the same link feed my Discord?",
              a: "Yes. Add a Discord join step and every visitor who wants the pack becomes a member of your server first.",
            },
            {
              q: "What packs work best?",
              a: "Overlays, alert sounds, animated stinger transitions, chat commands and full OBS scenes. Anything that makes someone's stream look better than before.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Let your setup grow your channel</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            One link in your panels, and every overlay download brings a new follower with it.
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

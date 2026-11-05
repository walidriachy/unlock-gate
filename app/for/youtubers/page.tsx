import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "For YouTubers",
  description:
    "Turn every video description into subscribers. Put a subscribe step in front of your downloads and grow the channel with content you already post.",
};

const DEMO: PublicAction[] = [
  {
    id: "yt1",
    index: 0,
    provider: "youtube",
    providerName: "YouTube",
    glyph: "▶️",
    color: "#ff0033",
    label: "Subscribe to @pixelforge.tv",
    actionType: "subscribe",
    targetUrl: "https://youtube.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "yt2",
    index: 1,
    provider: "discord",
    providerName: "Discord",
    glyph: "💬",
    color: "#5865f2",
    label: "Join the creator server",
    actionType: "join",
    targetUrl: "https://discord.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "yt3",
    index: 2,
    provider: "tiktok",
    providerName: "TikTok",
    glyph: "🎵",
    color: "#25f4ee",
    label: "Follow the shorts account",
    actionType: "follow",
    targetUrl: "https://tiktok.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "Turn descriptions into subscribers",
    body: "Put your download behind a subscribe step and every viewer who wants it becomes a subscriber on the way. The video you already posted starts converting.",
  },
  {
    title: "Downloads that pull their weight",
    body: "Overlays, presets and project files are a fair trade for a subscribe. Give the value away and still come out ahead.",
  },
  {
    title: "See which video performs best",
    body: "Track views and unlocks per link, so you learn which upload sends you the most subscribers and where to spend your next edit.",
  },
  {
    title: "No account for your viewers",
    body: "They click through to YouTube, subscribe, and the file opens. Nobody has to create an account in between, and nothing gets spammed.",
  },
];

export default function YouTubersPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="For YouTubers"
        title="Turn your video descriptions into subscribers"
        subtitle="You already post the value. Add one step in front of it and every download asks a viewer to subscribe first, without feeling like a wall."
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
            <div className="faint">subscribes and follows</div>
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
            link={{ id: "demo-yt", title: "Editing Overlay Pack", accent: "#ff0033", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "pixelforge.tv", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="Built for the way YouTubers actually work"
        intro="One link in the description. Every view a chance to grow."
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

      <Section title="Questions from other YouTubers">
        <Faq
          items={[
            {
              q: "Will gating a download hurt my views?",
              a: "No. The link lives in the description or a pinned comment, so it only affects viewers who already want the extra file, and it converts them into subscribers.",
            },
            {
              q: "Can I track which video converts best?",
              a: "Yes. Make a separate link per video and compare unlocks and sources in your dashboard at a glance.",
            },
            {
              q: "What should I give away?",
              a: "Anything you already make: overlays, presets, project files, LUTs, templates or a free course. The trade is a subscribe for something you have.",
            },
            {
              q: "Will my viewers need another account?",
              a: "No. They subscribe on YouTube and the file opens. There is no signup with us and no extra password to remember.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Make your next upload work harder</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Add a gated link to the description and let the subscribers build on their own.
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

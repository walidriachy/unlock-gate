import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "Social unlock links",
  description:
    "Put a YouTube subscribe, Discord join or X follow in front of your download. Visitors complete the step on the real platform, and the content unlocks right after.",
};

const DEMO: PublicAction[] = [
  {
    id: "su1",
    index: 0,
    provider: "youtube",
    providerName: "YouTube",
    glyph: "▶️",
    color: "#ff0033",
    label: "Subscribe to @lumen.films",
    actionType: "subscribe",
    targetUrl: "https://youtube.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "su2",
    index: 1,
    provider: "discord",
    providerName: "Discord",
    glyph: "💬",
    color: "#5865f2",
    label: "Join the community server",
    actionType: "join",
    targetUrl: "https://discord.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "su3",
    index: 2,
    provider: "x",
    providerName: "X",
    glyph: "✖️",
    color: "#e7e9ea",
    label: "Follow @lumen.films",
    actionType: "follow",
    targetUrl: "https://x.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "Pick the exact step you want",
    body: "Choose from 80 actions across 40+ platforms. Ask for one action or stack up to three, in whatever order suits the drop.",
  },
  {
    title: "No account for your visitors",
    body: "People never sign up with us. The step happens on the platform they already use, then they land back on your content.",
  },
  {
    title: "Bypass attempts get nothing",
    body: "The file, link or code is only released by our server after every step is recorded, so client-side scripts have nothing to flip.",
  },
  {
    title: "One link, shared everywhere",
    body: "Drop it in a video description, a bio, a Discord post or a story. The same link works on desktop and on a phone.",
  },
];

export default function SocialUnlockPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Social unlock"
        title="Turn a link into a new subscriber"
        subtitle="Put a YouTube subscribe, Discord join or X follow in front of your download. Visitors complete the step on the real platform, and the content opens the moment they are done."
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
            <div className="faint">actions completed</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">40+</div>
            <div className="faint">platforms</div>
          </div>
        </div>
      </PageHero>

      <Section>
        <div className="flex justify-center">
          <UnlockCard
            demo
            link={{ id: "demo-social", title: "Free Preset Pack", accent: "#7c5cff", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "lumen.films", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="Growth that does not get in the way"
        intro="A simple step before the payoff, built so ordinary people actually finish it."
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

      <Section title="Social unlock questions">
        <Faq
          items={[
            {
              q: "Which platforms can I use as the unlock step?",
              a: "YouTube, TikTok, Instagram, X, Discord, Twitch, Spotify, SoundCloud and dozens more, 80 actions across 40+ platforms in total. New ones are added as creators ask for them.",
            },
            {
              q: "Do visitors need an account with you to unlock?",
              a: "No. They click through to the real platform, complete the step, and your content opens. There is no signup in between.",
            },
            {
              q: "Can I ask for more than one action?",
              a: "Yes. Stack up to three steps on a single link, in the order you choose. Progress is shown as they go so nobody is left guessing.",
            },
            {
              q: "What happens if someone skips the step with an extension?",
              a: "Nothing unlocks. The destination is only released once our server has recorded every step, so a client-side script cannot drop the lock.",
            },
            {
              q: "Is it really free?",
              a: "Yes. The Free plan lets you publish and share live links with no card. Pro adds more links, more analytics and a custom look when you need it.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Your next share could grow the channel</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Build a link in under a minute, then let it work in every description you post.
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

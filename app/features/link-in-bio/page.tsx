import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "Link in bio",
  description:
    "One fast profile page for every link, social account and gated drop you share. Set it up once and point every platform at it.",
};

const DEMO: PublicAction[] = [
  {
    id: "lb1",
    index: 0,
    provider: "instagram",
    providerName: "Instagram",
    glyph: "📸",
    color: "#e1306c",
    label: "Follow @merchdrop.co",
    actionType: "follow",
    targetUrl: "https://instagram.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "lb2",
    index: 1,
    provider: "tiktok",
    providerName: "TikTok",
    glyph: "🎵",
    color: "#25f4ee",
    label: "Follow @merchdrop.co",
    actionType: "follow",
    targetUrl: "https://tiktok.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "lb3",
    index: 2,
    provider: "discord",
    providerName: "Discord",
    glyph: "💬",
    color: "#5865f2",
    label: "Join the drop server",
    actionType: "join",
    targetUrl: "https://discord.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "Every link in one place",
    body: "Buttons for your shop, your latest video, your Discord and anything else you want people to find, all on a single page.",
  },
  {
    title: "Themes that fit your brand",
    body: "Pick a background and an accent colour, then choose rounded or square buttons. No design tools and no extra software.",
  },
  {
    title: "Gate a button, not just the page",
    body: "Any button can open a normal link or run through an unlock step first, so your early access drops stay for the people who follow.",
  },
  {
    title: "See what people click",
    body: "Each button counts its own opens, so you learn which link your audience actually cares about and give it more room.",
  },
];

export default function LinkInBioPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Link in bio"
        title="One page for everything you share"
        subtitle="A fast, good-looking profile that holds all your links, socials and gated drops. Set it up once and point every platform at it."
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
            <div className="text-xl font-extrabold">1</div>
            <div className="faint">link for everything</div>
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
            link={{ id: "demo-bio", title: "Merch Drop Early Access", accent: "#f472b6", coverUrl: null, background: { kind: "gradient" }, destinationType: "url" }}
            actions={DEMO}
            creator={{ name: "merchdrop.co", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="A home base for your audience"
        intro="Instead of a bare list of links, give people a page that feels like yours."
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

      <Section title="Link in bio questions">
        <Faq
          items={[
            {
              q: "Where does my bio page live?",
              a: "Every account gets its own address you can share anywhere. You pick the username, and you can change it later without losing your links.",
            },
            {
              q: "Can I hide a button until later?",
              a: "Yes. Save drafts and switch buttons on or off whenever a campaign starts or ends.",
            },
            {
              q: "Can a button ask for a follow first?",
              a: "Yes. Any button can run through the same unlock steps as a normal link, which is perfect for early access and free drops.",
            },
            {
              q: "Does it work on slow connections?",
              a: "The page is built to load light and fast on mobile, where most of your audience will open it.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Give every link a place to live</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Build your page, add your buttons, and share one address everywhere.
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

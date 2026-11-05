import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "Short links",
  description:
    "Turn any long destination into a clean short link with a dashboard behind it. Track clicks, countries and devices, and swap the target whenever you like.",
};

const DEMO: PublicAction[] = [
  {
    id: "sh1",
    index: 0,
    provider: "youtube",
    providerName: "YouTube",
    glyph: "▶️",
    color: "#ff0033",
    label: "Watch the full tutorial",
    actionType: "subscribe",
    targetUrl: "https://youtube.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "sh2",
    index: 1,
    provider: "discord",
    providerName: "Discord",
    glyph: "💬",
    color: "#5865f2",
    label: "Join for project files",
    actionType: "join",
    targetUrl: "https://discord.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "A slug you choose",
    body: "Replace a long, ugly destination with a short address and a word that makes sense to your audience.",
  },
  {
    title: "Clicks tracked for free",
    body: "Every open is counted, along with country, device and referrer, so you know where a link is actually being shared.",
  },
  {
    title: "Change the target later",
    body: "Update where a short link points without breaking anything you already posted. Old posts keep working.",
  },
  {
    title: "A QR code for offline",
    body: "Every short link comes with a downloadable QR code for posters, packaging or a screen at your stall.",
  },
];

export default function ShortLinksPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Short links"
        title="Short links with a dashboard behind them"
        subtitle="Cloak a long destination behind a clean short link, then watch clicks, countries and devices roll in. Brand it with your own slug."
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
            <div className="text-xl font-extrabold">500M+</div>
            <div className="faint">clicks tracked</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">Instant</div>
            <div className="faint">redirects</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">Free</div>
            <div className="faint">to start</div>
          </div>
        </div>
      </PageHero>

      <Section>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <UnlockCard
              demo
              link={{ id: "demo-short", title: "Studio Sample Drop", accent: "#34d399", coverUrl: null, background: { kind: "gradient" }, destinationType: "url" }}
              actions={DEMO}
              creator={{ name: "studio.wav", verified: false, og: true }}
            />
          </div>
        </div>
      </Section>

      <Section
        tinted
        title="Small link, real answers"
        intro="A tidy address is the start. The numbers behind it are the useful part."
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

      <Section title="Short link questions">
        <Faq
          items={[
            {
              q: "Do short links count as gated links?",
              a: "A short link can be a plain redirect or a gated one. Keep it light with a single step, or send people straight through with no steps at all.",
            },
            {
              q: "Can I edit a short link after sharing it?",
              a: "Yes. Change the slug or the destination and every existing post keeps working. That is the point of owning the link.",
            },
            {
              q: "What do I see in the dashboard?",
              a: "Views, clicks, country, device and referrer for each link, plus a running total. Enough to know which channel deserves more of your time.",
            },
            {
              q: "Is there a limit on clicks?",
              a: "No. Clicks are not capped on any plan, and a link never expires just because it is busy.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Make every link do two jobs</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Share something short, track it properly, and grow while you do it.
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

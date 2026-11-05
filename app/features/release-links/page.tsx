import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "Release links",
  description:
    "One landing page per song or drop, with artwork, a countdown to launch and a Notify me button that collects fans before release day.",
};

const DEMO: PublicAction[] = [
  {
    id: "rl1",
    index: 0,
    provider: "spotify",
    providerName: "Spotify",
    glyph: "🟢",
    color: "#1db954",
    label: "Follow on Spotify",
    actionType: "follow",
    targetUrl: "https://open.spotify.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "rl2",
    index: 1,
    provider: "apple",
    providerName: "Apple Music",
    glyph: "🍎",
    color: "#fa2d48",
    label: "Follow on Apple Music",
    actionType: "follow",
    targetUrl: "https://music.apple.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "A countdown that builds tension",
    body: "Point fans at a page with a live timer to the release, so interest peaks exactly when the track goes live.",
  },
  {
    title: "Notify me collects intent early",
    body: "Visitors who arrive before launch can leave a follow or email, and you decide how many steps stand between them and the drop.",
  },
  {
    title: "Artwork, credits and links together",
    body: "Every release gets its own page with the cover, the credits and buttons to every streaming service, not a bare list of URLs.",
  },
  {
    title: "Grow between releases",
    body: "Fans who follow to unlock one track are the same fans who hear about the next one. Each release compounds the last.",
  },
];

export default function ReleaseLinksPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Release links"
        title="Give every release its own landing page"
        subtitle="One page per song or drop, with artwork, a countdown to launch and a Notify me button that collects fans before release day."
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
            <div className="text-xl font-extrabold">2.4M+</div>
            <div className="faint">pre-release signups</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">40+</div>
            <div className="faint">streaming platforms</div>
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
            link={{ id: "demo-release", title: "Midnight Drive", accent: "#8b5cf6", coverUrl: null, background: { kind: "gradient" }, destinationType: "url" }}
            actions={DEMO}
            creator={{ name: "ava.ray", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="Build an audience around the calendar"
        intro="A release page does more than share a link. It gives fans a reason to come back on a date."
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

      <Section title="Release link questions">
        <Faq
          items={[
            {
              q: "What sits on a release page?",
              a: "Cover artwork, the title and credits, every streaming or download button you add, plus a countdown and a Notify me step while the drop is still upcoming.",
            },
            {
              q: "Can I add more than one release link?",
              a: "Yes. Each release gets its own page, and you can reuse the same shape so your fans always know where to look.",
            },
            {
              q: "Can fans pre-save on Spotify and Apple Music?",
              a: "You can put a follow and a pre-save style step in front of the page. In this clone the steps run in a demo confirm mode unless a platform's own app is connected.",
            },
            {
              q: "Does the countdown update itself?",
              a: "Yes. Set the release date and the page takes care of the rest, switching from a countdown to the live links at the right moment.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Make the next drop land louder</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Stand up a release page in minutes and let every track bring new followers with it.
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

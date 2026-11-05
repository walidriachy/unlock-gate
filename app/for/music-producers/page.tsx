import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "For music producers",
  description:
    "Give away drum kits, presets and loops for a Spotify or SoundCloud follow. Grow your artist profile with the sounds you already make.",
};

const DEMO: PublicAction[] = [
  {
    id: "mp1",
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
    id: "mp2",
    index: 1,
    provider: "soundcloud",
    providerName: "SoundCloud",
    glyph: "☁️",
    color: "#ff5500",
    label: "Follow on SoundCloud",
    actionType: "follow",
    targetUrl: "https://soundcloud.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "mp3",
    index: 2,
    provider: "instagram",
    providerName: "Instagram",
    glyph: "📸",
    color: "#e1306c",
    label: "Follow the studio page",
    actionType: "follow",
    targetUrl: "https://instagram.com",
    verification: "click",
    isEmail: false,
  },
];

const BENEFITS = [
  {
    title: "Kits for a follow, not a form",
    body: "Drum kits, one-shots and presets are the easiest giveaway you have. A follow is a small ask that grows a profile people can actually find.",
  },
  {
    title: "Build your streaming numbers",
    body: "Point producers at your Spotify or SoundCloud first, so the sounds you give away bring followers who will hear the next release.",
  },
  {
    title: "Grow while you are not posting",
    body: "A pack shared once keeps collecting follows from anyone who searches for free sounds. The link keeps working while you make music.",
  },
  {
    title: "See which pack lands",
    body: "Track downloads and follows per kit, so you learn whether producers want drums, loops or presets before you spend a weekend on the next one.",
  },
];

export default function MusicProducersPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="For music producers"
        title="Trade your kits and presets for real followers"
        subtitle="Give producers the sounds they came for and ask for a Spotify or SoundCloud follow in return. Your catalogue grows from work you have already done."
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
            <div className="faint">packs downloaded</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">40+</div>
            <div className="faint">platforms</div>
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
            link={{ id: "demo-music", title: "Lo-Fi Drum Kit Vol. 2", accent: "#1db954", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "tape.hiss", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="Let the sounds do the marketing"
        intro="You already make something worth following for. Put a small step in front of it."
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

      <Section title="Questions from other producers">
        <Faq
          items={[
            {
              q: "What can I give away?",
              a: "Drum kits, loops, one-shots, MIDI packs, synth presets, project files or a free track. Anything you can upload once and share for a long time.",
            },
            {
              q: "Should I ask for Spotify or SoundCloud?",
              a: "Either. Many producers ask for both, plus a follow on socials, so one download grows every place an audience can find them.",
            },
            {
              q: "Can I capture emails too?",
              a: "Yes. Add an email step and every producer who takes the pack joins your list, which is the fastest way to tell them about the next release.",
            },
            {
              q: "Will people bypass the follow?",
              a: "The pack only downloads after our server records every step, so a browser extension cannot skip it and grab the file early.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Put your next pack to work</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            One link turns a free giveaway into followers across every platform you release on.
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

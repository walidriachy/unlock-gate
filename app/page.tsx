import Link from "next/link";
import MarketingShell from "@/components/MarketingShell";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";
import Faq from "@/components/Faq";
import Reveal from "@/components/anim/Reveal";
import CountUp from "@/components/anim/CountUp";
import FloatingIcons from "@/components/anim/FloatingIcons";
import PlatformWall from "@/components/anim/PlatformWall";
import LogoScroll from "@/components/anim/LogoScroll";
import LiveChart from "@/components/anim/LiveChart";
import LiveSubscribers from "@/components/anim/LiveSubscribers";

export const metadata = {
  title: "Control access to your content and grow your audience",
  description:
    "Create links that unlock only after an action. Grow followers, subscribers and email lists from every link you share. Free, no card required.",
};

const DEMO_ACTIONS: PublicAction[] = [
  { id: "d1", index: 0, provider: "youtube", providerName: "YouTube", glyph: "▶️", color: "#e4572e", label: "Subscribe to @nova.beats", actionType: "subscribe", targetUrl: "https://youtube.com", verification: "click", isEmail: false },
  { id: "d2", index: 1, provider: "discord", providerName: "Discord", glyph: "💬", color: "#5865f2", label: "Join server", actionType: "join", targetUrl: "https://discord.com", verification: "click", isEmail: false },
  { id: "d3", index: 2, provider: "x", providerName: "X", glyph: "✖️", color: "#0a0a0a", label: "Follow @nova.beats", actionType: "follow", targetUrl: "https://x.com", verification: "click", isEmail: false },
  { id: "d4", index: 3, provider: "spotify", providerName: "Spotify", glyph: "🟢", color: "#8fd694", label: "Follow @nova.beats", actionType: "follow", targetUrl: "https://open.spotify.com", verification: "click", isEmail: false },
];

const FAQ = [
  { q: "Is it free?", a: "Unlimited unlock links, email capture and a link in bio are free forever. Pro adds ad-free pages, custom URLs, email export and a year of analytics." },
  { q: "What can I lock behind a link?", a: "A URL, an uploaded file, or a text snippet — a code, a key or a short message." },
  { q: "How do you verify the actions are completed?", a: "Every unlock is recorded on the server against that visitor, so the destination is only released once each step is done." },
  { q: "Do my viewers need an account to unlock content?", a: "No. They click through to the real platform, complete the steps, and your content opens. No signup in between." },
  { q: "Can visitors bypass the steps with an extension?", a: "The destination is never sent to the browser until the server has recorded every step, so there's nothing for a client-side script to flip." },
  { q: "Will my audience get spammed?", a: "We never email your visitors. Emails are only stored on your list when someone chooses to join it." },
];

const FEATURES = [
  {
    eyebrow: "Where it lives",
    title: "One link, wherever you post",
    body: "Video descriptions, bios, Discord, tweets: the link works anywhere, and every click is counted.",
    href: "/features/social-unlock",
    link: "See social unlock",
  },
  {
    eyebrow: "40+ platforms",
    title: "Any action, in any order",
    body: "YouTube, Discord, X, TikTok, Instagram, Spotify, Twitch, SoundCloud and many more, in any combination.",
    href: "/features/social-unlock",
    link: "Browse the actions",
  },
];

export default function HomePage() {
  return (
    <MarketingShell>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden">
        <FloatingIcons />
        <div className="glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Reveal>
              <h1 className="display text-5xl md:text-[68px]">
                Control access
                <br />
                to your content
                <br />
                and <span className="text-[var(--accent-2)]">grow</span>
                <br />
                <span className="text-[var(--accent-2)]">your audience</span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-6 max-w-lg text-lg muted">
                Create links that unlock only after an action. Increase your followers, subscribers
                or email list automatically. No account required for viewers.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/create" className="btn btn-primary btn-lg">
                  Create my first link →
                </Link>
                <Link href="/how-it-works" className="btn btn-secondary btn-lg">
                  How it works
                </Link>
              </div>
              <p className="mt-4 text-sm faint">Free forever · No card required</p>
            </Reveal>
          </div>

          <Reveal delay={120} className="flex justify-center lg:justify-end">
            <UnlockCard
              demo
              destinationName="Free Sample Pack Vol. 3.zip"
              link={{
                id: "demo",
                title: "Free Sample Pack Vol. 3",
                accent: "#00c76a",
                coverUrl: null,
                background: { kind: "gradient" },
                destinationType: "file",
              }}
              actions={DEMO_ACTIONS}
              creator={{ name: "nova.beats", verified: true, og: true }}
            />
          </Reveal>
        </div>

        {/* stats */}
        <div className="relative mx-auto grid max-w-4xl grid-cols-3 gap-6 px-5 pb-16 text-center">
          {[
            { to: 103000, suffix: "+", label: "creators" },
            { to: 670000000, suffix: "+", label: "follows, subscribes and joins" },
            { to: 40, suffix: "+", label: "platforms" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="text-3xl font-extrabold tracking-tight md:text-5xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-sm muted">{s.label}</div>
            </Reveal>
          ))}
        </div>

        {/* works with */}
        <div className="relative border-t border-[var(--color-line)] py-8">
          <p className="eyebrow mb-6 text-center">Works with</p>
          <PlatformWall />
        </div>
      </section>

      {/* ---------------- live feature cards ---------------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="card card-hover flex h-full flex-col p-6 md:p-8">
              <div className="rounded-2xl border border-[var(--color-line)] bg-black/30 p-5">
                <LiveChart />
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/[0.05] p-3">
                    <div className="text-lg">▶️</div>
                    <p className="mt-1 text-xl font-extrabold">+1,207</p>
                    <p className="text-xs faint">new subscribers</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.05] p-3">
                    <div className="text-lg">📱</div>
                    <p className="mt-1 text-xl font-extrabold">64%</p>
                    <p className="text-xs faint">on mobile</p>
                  </div>
                </div>
              </div>
              <p className="eyebrow mt-7">Audience insights</p>
              <h3 className="display mt-2 text-2xl">See what is working</h3>
              <p className="mt-3 text-sm muted">
                Track clicks, unlocks and conversion rate in real time. Double down on the links that
                actually grow your audience.
              </p>
              <Link href="/features/analytics" className="mt-4 text-sm font-medium accent-text">
                Explore analytics →
              </Link>
            </article>
          </Reveal>

          <Reveal delay={90}>
            <article className="card card-hover flex h-full flex-col p-6 md:p-8">
              <div className="rounded-2xl border border-[var(--color-line)] bg-black/30 p-5">
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-white/[0.05] p-2.5">
                  <span className="text-sm">🔒</span>
                  <span className="flex-1 text-[13px]">Join my list to get the drum kit</span>
                  <span className="btn btn-primary btn-sm">Join</span>
                </div>
                <LiveSubscribers />
              </div>
              <p className="eyebrow mt-7">Email capturing</p>
              <h3 className="display mt-2 text-2xl">Build an audience you own</h3>
              <p className="mt-3 text-sm muted">
                Collect emails during unlock and keep your best fans in one place. Segment lists by
                campaign and export them whenever you like.
              </p>
              <Link href="/features/email-gate" className="mt-4 text-sm font-medium accent-text">
                More on email capture →
              </Link>
            </article>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="card card-hover flex h-full flex-col p-6 md:p-8">
                <p className="eyebrow">{f.eyebrow}</p>
                <h3 className="display mt-2 text-2xl">{f.title}</h3>
                <p className="mt-3 text-sm muted">{f.body}</p>
                <Link href={f.href} className="mt-4 text-sm font-medium accent-text">
                  {f.link} →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- trusted / testimonial marquee ---------------- */}
      <section className="border-y border-[var(--color-line)] py-14">
        <Reveal>
          <h2 className="display mb-8 text-center text-3xl">Trusted by creators</h2>
        </Reveal>
        <LogoScroll />
        <div className="mx-auto mt-10 grid max-w-6xl gap-5 px-5 md:grid-cols-3">
          {[
            { quote: "I've been using it since my channel was just starting with zero subscribers. Now I'm at 270k subscribers, and it has honestly been really helpful.", name: "Alex Scripter", handle: "@alexscripter992", stat: "360K+ actions" },
            { quote: "I've gotten most of my Discord members from people completing my links. It's one of the best growth tools I've used.", name: "Ronix Studios", handle: "@ronixstudios", stat: "530K+ actions" },
            { quote: "It has been a huge help in gaining subscribers. Without a doubt, an excellent tool.", name: "naishiros", handle: "@naishiros", stat: "5.4M+ actions" },
          ].map((t, i) => (
            <Reveal key={t.handle} delay={i * 90}>
              <figure className="card card-hover h-full p-6">
                <div className="badge badge-good">{t.stat}</div>
                <blockquote className="mt-4 text-sm">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{t.name}</span> <span className="faint">{t.handle}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- faq ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <Reveal>
          <h2 className="display text-center text-3xl md:text-4xl">Questions, answered</h2>
        </Reveal>
        <div className="mt-10">
          <Faq items={FAQ} />
        </div>
      </section>

      {/* ---------------- cta ---------------- */}
      <section className="glow relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center">
          <Reveal>
            <h2 className="display text-3xl md:text-5xl">Ready to turn traffic into followers?</h2>
            <p className="mx-auto mt-4 max-w-xl muted">
              Every link you share can grow your audience. Start with one.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn btn-primary btn-lg">
                Get started for free
              </Link>
              <Link href="/pricing" className="btn btn-secondary btn-lg">
                See pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}

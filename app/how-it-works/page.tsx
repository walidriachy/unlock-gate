import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "How it works",
  description: "Every link you share can grow your audience. Put a step in front of anything you share.",
};

const DEMO: PublicAction[] = [
  { id: "1", index: 0, provider: "youtube", providerName: "YouTube", glyph: "▶️", color: "#ff0033", label: "Subscribe to @nova.beats", actionType: "subscribe", targetUrl: "https://youtube.com", verification: "click", isEmail: false },
  { id: "2", index: 1, provider: "discord", providerName: "Discord", glyph: "💬", color: "#5865f2", label: "Join server", actionType: "join", targetUrl: "https://discord.com", verification: "oauth", isEmail: false },
  { id: "3", index: 2, provider: "x", providerName: "X", glyph: "✖️", color: "#e7e9ea", label: "Follow @nova.beats", actionType: "follow", targetUrl: "https://x.com", verification: "click", isEmail: false },
];

const STEPS = [
  { n: "1", t: "Make a link", d: "Add what you want to share: a download, a link or a code. Then pick what people do first, like subscribe on YouTube or join your Discord." },
  { n: "2", t: "Share it", d: "Put it in a video description, your bio or a Discord post. Visitors don't need an account, on a phone or a computer." },
  { n: "3", t: "See who it brought in", d: "Every unlock is a new subscriber, follower or member. Your dashboard shows views, unlocks and where people came from." },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="How it works"
        title="Every link you share can grow your audience"
        subtitle="Put a step in front of anything you share. Visitors subscribe, follow, join or sign up, and your content opens for them right away. No account on their side."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/create" className="btn btn-primary btn-lg">Try it free</a>
          <a href="#steps" className="btn btn-secondary btn-lg">See the steps</a>
        </div>
      </PageHero>

      <Section>
        <div className="flex justify-center">
          <UnlockCard
            demo
            link={{ id: "demo", title: "Kitchen Sounds Drum Kit", accent: "#22d3ee", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "nova.beats", verified: true, og: true }}
          />
        </div>
      </Section>

      <Section id="steps" tinted title="Three steps, one loop" intro="Set it up once, then every post does the work.">
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-surface-3)] text-lg font-extrabold accent-text">{s.n}</div>
              <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm muted">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skipping the steps doesn't work" intro="Bypass extensions and scripts get rejected, because the destination is only released once the server has recorded every step.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-bold">Server-side unlocks</h3>
            <p className="mt-2 text-sm muted">The file, link or code is never sent to the browser until every step is done and confirmed, so there's nothing for a client-side script to flip.</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-bold">Keep in touch after the download</h3>
            <p className="mt-2 text-sm muted">Add an email step and every download adds someone to your list. It's yours to export, and we never email your visitors.</p>
          </div>
        </div>
      </Section>

      <Section tinted title="Common questions">
        <Faq
          items={[
            { q: "Do my viewers need an account to unlock content?", a: "No. They click through to the real platform, complete the steps, and your content opens. No signup in between." },
            { q: "Can visitors bypass the steps with an extension?", a: "The destination is only released by the server after every step is recorded, so a client-side script has nothing to bypass." },
            { q: "How do you verify the actions are completed?", a: "Each step is recorded on the server against that visitor. In this clone, steps run in a demo 'click to confirm' mode unless you connect a platform's own app." },
            { q: "What kinds of content can I gate behind a link?", a: "A URL, an uploaded file, or a text snippet — a code, a key or a short message." },
            { q: "Will my audience get spammed?", a: "No. We never email your visitors. Emails are only stored on your list if a visitor chooses to give one." },
          ]}
        />
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Your next link could grow your audience</h2>
          <p className="mt-3 muted">Free forever. Upgrade only when you need more.</p>
          <a href="/create" className="btn btn-primary btn-lg mt-6">Create a free link</a>
        </div>
      </Section>
    </MarketingShell>
  );
}

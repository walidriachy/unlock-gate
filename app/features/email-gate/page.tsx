import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";
import UnlockCard, { type PublicAction } from "@/components/UnlockCard";

export const metadata = {
  title: "Email capture gates",
  description:
    "Ask for an email before your content unlocks and keep the fans you worked to get. Lists are yours, exportable, and we never email your visitors.",
};

const DEMO: PublicAction[] = [
  {
    id: "eg1",
    index: 0,
    provider: "youtube",
    providerName: "YouTube",
    glyph: "▶️",
    color: "#ff0033",
    label: "Subscribe to @sunset.loops",
    actionType: "subscribe",
    targetUrl: "https://youtube.com",
    verification: "click",
    isEmail: false,
  },
  {
    id: "eg2",
    index: 1,
    provider: "email",
    providerName: "Email",
    glyph: "✉️",
    color: "#22d3ee",
    label: "Send me the weekly pack",
    actionType: "subscribe",
    targetUrl: "",
    verification: "email",
    isEmail: true,
  },
];

const BENEFITS = [
  {
    title: "Capture at the moment of intent",
    body: "The download is right there and the email is the last thing standing in the way. That is the easiest yes your list will ever get.",
  },
  {
    title: "Lists that stay clean",
    body: "Addresses are checked for a valid shape before a step is marked done, so obvious typos never reach your audience.",
  },
  {
    title: "Yours to export",
    body: "Download any list as CSV whenever you like. Nothing is held hostage, and no fan is ever emailed on our behalf.",
  },
  {
    title: "Pair it with a social step",
    body: "Ask for a follow and an email on the same link. Grow the channel and the list from a single share.",
  },
];

export default function EmailGatePage() {
  async function subscribeToDemoList(email: string): Promise<boolean> {
    "use server";
    // Decorative demo: validates the address so the example completes.
    // A real link stores the email against its owner's list.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Email capture"
        title="Grow an email list from every download"
        subtitle="Ask for an email before your content unlocks, and keep the fans you worked to get. Your list is yours, exportable, and we never email your visitors."
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
            <div className="text-xl font-extrabold">90M+</div>
            <div className="faint">emails collected</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">0</div>
            <div className="faint">emails sent by us</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">CSV</div>
            <div className="faint">export, any time</div>
          </div>
        </div>
      </PageHero>

      <Section>
        <div className="flex justify-center">
          <UnlockCard
            demo
            onEmailSubmit={subscribeToDemoList}
            link={{ id: "demo-email", title: "Weekly Beat Pack", accent: "#22d3ee", coverUrl: null, background: { kind: "gradient" }, destinationType: "file" }}
            actions={DEMO}
            creator={{ name: "sunset.loops", verified: true, og: false }}
          />
        </div>
      </Section>

      <Section
        tinted
        title="An audience you can reach again"
        intro="Social platforms change the rules. A list you own does not."
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

      <Section title="Email gate questions">
        <Faq
          items={[
            {
              q: "Do visitors have to confirm their email?",
              a: "They type an address and the step is recorded. In this clone the address is only checked for a valid shape; a connected account would verify and store it against the link owner's list.",
            },
            {
              q: "Will you email my subscribers?",
              a: "No. We store the addresses for you and never message them. Sending is up to you, from whatever tool you like.",
            },
            {
              q: "Can I export the list?",
              a: "Yes, any list exports to CSV in one click, including which link each subscriber came from.",
            },
            {
              q: "Can I ask for an email and a follow together?",
              a: "Yes. Add both steps to one link, and each visitor gets the download only after finishing both.",
            },
            {
              q: "Is collecting emails free?",
              a: "Email capture is available on every plan, including Free. Higher tiers raise the number of links and the history you keep.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Start building a list you own</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            One link turns a casual download into a subscriber you can reach next week.
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

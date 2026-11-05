import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";

export const metadata = {
  title: "Help center",
  description:
    "Guides for setting up unlock links, choosing actions, building a link-in-bio page, reading your analytics and picking the right plan.",
};

const TOPICS = [
  "Getting started",
  "Platforms",
  "Pages & style",
  "Links & analytics",
  "Plans & billing",
] as const;

type Guide = {
  slug: string;
  title: string;
  topic: (typeof TOPICS)[number];
  readTime: string;
  blurb: string;
  startHere?: boolean;
};

const GUIDES: Guide[] = [
  {
    slug: "create-your-first-link",
    title: "Create your first unlock link",
    topic: "Getting started",
    readTime: "4 min read",
    blurb:
      "Go from a blank editor to a shareable link in a few minutes — what to enter, where to put the destination, and how to test it before you post.",
    startHere: true,
  },
  {
    slug: "choose-the-right-actions",
    title: "Choose the right actions",
    topic: "Getting started",
    readTime: "6 min read",
    blurb:
      "One action or three? A follow, a join or an email? How to match the ask to the value of what you're giving away, without burning your audience.",
    startHere: true,
  },
  {
    slug: "platforms-and-actions",
    title: "All platforms and actions",
    topic: "Platforms",
    readTime: "7 min read",
    blurb:
      "The full list: 80 actions across YouTube, Discord, Spotify, TikTok, Steam, Roblox, GitHub and 40+ more, grouped by what you're trying to grow.",
  },
  {
    slug: "set-up-link-in-bio",
    title: "Set up your link-in-bio page",
    topic: "Pages & style",
    readTime: "5 min read",
    blurb:
      "Pick a handle, choose a theme, arrange your links and unlock cards, then share one short address everywhere instead of five separate ones.",
    startHere: true,
  },
  {
    slug: "understand-your-analytics",
    title: "Understand your analytics",
    topic: "Links & analytics",
    readTime: "6 min read",
    blurb:
      "Views, unlocks, conversion rate and where people came from — what each number means and which one tells you to keep going or change the offer.",
  },
  {
    slug: "short-links-and-collections",
    title: "Short links and collections",
    topic: "Links & analytics",
    readTime: "5 min read",
    blurb:
      "Make a tidy short link for sharing and group related links into a collection your audience can browse in one place.",
  },
  {
    slug: "which-plan-do-you-need",
    title: "Which plan do you need?",
    topic: "Plans & billing",
    readTime: "4 min read",
    blurb:
      "Free, Pro and Lifetime compared by what you actually ship. A plain-language walkthrough so you only pay for limits you're hitting.",
  },
];

function chipHref(topic: string) {
  return topic === "All" ? "/guides" : `/guides?topic=${encodeURIComponent(topic)}`;
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const active = topic && TOPICS.includes(topic as (typeof TOPICS)[number]) ? topic : "All";

  const startHere = GUIDES.filter((g) => g.startHere);
  const visible = active === "All" ? GUIDES : GUIDES.filter((g) => g.topic === active);
  const groupedTopics = TOPICS.filter((t) => visible.some((g) => g.topic === t));

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Help center"
        title="Guides to get the most out of Gatekeeper"
        subtitle="Short, practical walkthroughs. Set up your first link, pick actions that convert, build a link-in-bio page and read your numbers without guesswork."
      />

      <Section>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {["All", ...TOPICS].map((t) => (
            <Link
              key={t}
              href={chipHref(t)}
              className={`chip ${active === t ? "chip-active" : ""}`}
            >
              {t}
            </Link>
          ))}
        </div>

        {active === "All" && (
          <div className="mb-14">
            <div className="mb-5 flex items-center gap-3">
              <span className="badge badge-accent">Start here</span>
              <h2 className="text-xl font-bold tracking-tight">New to Gatekeeper?</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {startHere.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="card p-6 transition hover:border-[var(--accent)]"
                >
                  <h3 className="text-lg font-bold">{g.title}</h3>
                  <p className="mt-2 text-sm muted">{g.blurb}</p>
                  <div className="mt-4 flex items-center justify-between text-xs faint">
                    <span>{g.topic}</span>
                    <span>{g.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-12">
          {groupedTopics.map((t) => (
            <div key={t}>
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight">{t}</h2>
                <span className="hr hidden flex-1 md:block" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {visible
                  .filter((g) => g.topic === t)
                  .map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="card flex flex-col p-6 transition hover:border-[var(--accent)]"
                    >
                      <h3 className="text-lg font-bold">{g.title}</h3>
                      <p className="mt-2 flex-1 text-sm muted">{g.blurb}</p>
                      <div className="mt-4 flex items-center justify-between text-xs faint">
                        <span>{t}</span>
                        <span>{g.readTime}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <p className="text-center muted">No guides in this topic yet. Try another filter.</p>
          )}
        </div>
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Still stuck?</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Can't find what you need? Tell us what you're trying to build and we'll point you the
            right way.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg mt-6">
            Contact support
          </Link>
        </div>
      </Section>
    </MarketingShell>
  );
}

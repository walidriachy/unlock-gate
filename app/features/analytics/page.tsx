import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";

export const metadata = {
  title: "Analytics",
  description:
    "Views, unlocks, conversion rate and traffic sources for every link, in real time. See which link actually grew your audience and double down on it.",
};

const STATS = [
  { label: "Views this week", value: "48,210", delta: "+18%" },
  { label: "Actions completed", value: "31,904", delta: "+22%" },
  { label: "Unlock rate", value: "66.2%", delta: "+4.1pts" },
  { label: "New emails", value: "2,148", delta: "+9%" },
];

const ROWS = [
  { link: "Free Preset Pack", views: "12,480", unlocks: "9,102", rate: "72.9%" },
  { link: "Midnight Drive", views: "9,860", unlocks: "6,441", rate: "65.3%" },
  { link: "808 Starter Kit", views: "7,220", unlocks: "5,004", rate: "69.3%" },
  { link: "Merch Early Access", views: "5,410", unlocks: "2,672", rate: "49.4%" },
  { link: "Discord Script Drop", views: "3,975", unlocks: "2,918", rate: "73.4%" },
];

const BENEFITS = [
  {
    title: "See the whole funnel",
    body: "Views, completed steps, unlocks and destination opens are all counted, so you can spot exactly where people drop off.",
  },
  {
    title: "Know where they came from",
    body: "Referrer, country and device are recorded per view. Learn whether YouTube or a Discord post is sending your best fans.",
  },
  {
    title: "Compare step by step",
    body: "For links with more than one action, see which step loses the most people and reorder or remove it.",
  },
  {
    title: "Export what you need",
    body: "Pull a list or a report as CSV whenever it is time to plan the next drop or share numbers with a team.",
  },
];

export default function AnalyticsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Analytics"
        title="Know which link actually grew your audience"
        subtitle="Views, unlocks, conversion rate and where people came from, for every link, updated as the traffic happens."
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
            <div className="text-xl font-extrabold">Real time</div>
            <div className="faint">updates</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">30 days</div>
            <div className="faint">history on Free</div>
          </div>
          <div>
            <div className="text-xl font-extrabold">CSV</div>
            <div className="faint">exports</div>
          </div>
        </div>
      </PageHero>

      <Section>
        <div className="card p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Overview</h2>
              <p className="text-sm faint">Last 7 days across all your links</p>
            </div>
            <span className="badge badge-good">Live</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="card-2 p-4">
                <div className="text-xs uppercase tracking-wide faint">{s.label}</div>
                <div className="mt-1 text-2xl font-extrabold">{s.value}</div>
                <div className="mt-1 text-xs text-[var(--color-good)]">{s.delta} vs last week</div>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Views</th>
                  <th>Unlocks</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.link}>
                    <td className="font-semibold">{r.link}</td>
                    <td className="muted">{r.views}</td>
                    <td className="muted">{r.unlocks}</td>
                    <td>
                      <span className="badge badge-accent">{r.rate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs faint">Sample data shown for this demo.</p>
        </div>
      </Section>

      <Section
        tinted
        title="Numbers you can act on"
        intro="Not vanity metrics. The few things that tell you what to post next."
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

      <Section title="Analytics questions">
        <Faq
          items={[
            {
              q: "How quickly do the numbers update?",
              a: "Within seconds of an action on your link. You do not have to wait for a nightly report to see a spike.",
            },
            {
              q: "How much history do I get?",
              a: "The Free plan keeps 30 days of traffic history. Pro and Lifetime keep a longer window for longer campaigns.",
            },
            {
              q: "Can I see which network sent the most people?",
              a: "Yes. Views record the referrer, country and device, so you can compare a YouTube description against a Discord post or a bio link.",
            },
            {
              q: "Can I filter by a single link?",
              a: "Every link has its own page, with the same funnel and source breakdown as the overview, scoped to that drop alone.",
            },
          ]}
        />
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Stop guessing what works</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Publish a link, watch the numbers, and give more to the things that grow you.
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

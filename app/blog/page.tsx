import Link from "next/link";
import MarketingShell, { PageHero, Section } from "@/components/MarketingShell";

export const metadata = {
  title: "Blog",
  description:
    "Ideas and playbooks for turning the links you already share into subscribers, followers, community members and email lists.",
};

const TOPICS = ["Growth", "Strategy", "Email", "Link in bio"] as const;

type Post = {
  slug: string;
  title: string;
  topic: (typeof TOPICS)[number];
  date: string;
  readTime: string;
  excerpt: string;
  author: string;
};

const POSTS: Post[] = [
  {
    slug: "one-link-for-every-streaming-service",
    title: "One link for every streaming service",
    topic: "Strategy",
    date: "October 24, 2026",
    readTime: "6 min read",
    excerpt:
      "Stop pasting six links for one release. A single smart link can route every fan to their own streaming service — and grow a follower while it does.",
    author: "Marisol Reyes",
  },
  {
    slug: "youtube-subscribe-to-unlock",
    title: "YouTube subscribe to unlock: what actually converts",
    topic: "Growth",
    date: "October 17, 2026",
    readTime: "5 min read",
    excerpt:
      "A subscribe gate is simple, but the details decide whether it works. What to promise, where to place the link, and the one mistake that kills conversion.",
    author: "Deniz Kaya",
  },
  {
    slug: "collect-emails-with-free-downloads",
    title: "Collect emails with free downloads",
    topic: "Email",
    date: "October 9, 2026",
    readTime: "4 min read",
    excerpt:
      "A free download is the oldest list-builder there is. Here's how to set the trade up fairly so people actually hand over an address they'll read.",
    author: "Priya Nandakumar",
  },
  {
    slug: "link-in-bio-ideas-for-musicians",
    title: "Link-in-bio ideas for musicians",
    topic: "Link in bio",
    date: "October 2, 2026",
    readTime: "5 min read",
    excerpt:
      "Your bio link is the one address you control. Ten layouts and content ideas for musicians who want a page that earns taps, not just sits there.",
    author: "Tomás Oliveira",
  },
  {
    slug: "why-unlock-links-beat-a-plain-link",
    title: "Why an unlock link beats a plain link",
    topic: "Growth",
    date: "September 25, 2026",
    readTime: "5 min read",
    excerpt:
      "A plain link sends traffic somewhere and hopes. An unlock link turns the same click into a follow, a join or an email — here's the math behind the swap.",
    author: "Marisol Reyes",
  },
];

function chipHref(topic: string) {
  return topic === "All" ? "/blog" : `/blog?topic=${encodeURIComponent(topic)}`;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const active = topic && TOPICS.includes(topic as (typeof TOPICS)[number]) ? topic : "All";
  const posts = active === "All" ? POSTS : POSTS.filter((p) => p.topic === active);
  const [featured, ...rest] = posts;

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Blog"
        title="Playbooks for growing on your own terms"
        subtitle="No growth-hack theatre. Practical writing about unlock links, email lists, link-in-bio pages and the small decisions that change how many people say yes."
      />

      <Section>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {["All", ...TOPICS].map((t) => (
            <Link key={t} href={chipHref(t)} className={`chip ${active === t ? "chip-active" : ""}`}>
              {t}
            </Link>
          ))}
        </div>

        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="card mb-8 block p-7 transition hover:border-[var(--accent)] md:p-10"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs faint">
              <span className="badge badge-accent">{featured.topic}</span>
              <span>{featured.date}</span>
              <span aria-hidden>·</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 className="mt-4 max-w-2xl text-2xl font-extrabold tracking-tight md:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-2xl muted">{featured.excerpt}</p>
            <p className="mt-4 text-sm faint">By {featured.author}</p>
          </Link>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card flex flex-col p-6 transition hover:border-[var(--accent)]"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs faint">
                <span className="badge">{p.topic}</span>
                <span>{p.date}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm muted">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs faint">
                <span>By {p.author}</span>
                <span>{p.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center muted">No posts in this topic yet. Try another filter.</p>
        )}
      </Section>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Read it, then build it</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Every playbook here starts with a link. Make one and see what your audience actually does.
          </p>
          <Link href="/create" className="btn btn-primary btn-lg mt-6">
            Create a free link
          </Link>
        </div>
      </Section>
    </MarketingShell>
  );
}

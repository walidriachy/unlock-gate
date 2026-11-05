import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell, { Section } from "@/components/MarketingShell";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

type PostSection = { heading?: string; paragraphs: string[]; bullets?: string[] };
type Post = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  topic: string;
  intro: string;
  sections: PostSection[];
  cta: { title: string; body: string; label: string; href: string };
};

const POSTS: Post[] = [
  {
    slug: "one-link-for-every-streaming-service",
    title: "One link for every streaming service",
    date: "October 24, 2026",
    readTime: "6 min read",
    author: "Marisol Reyes",
    topic: "Strategy",
    intro:
      "A new release means six or seven links — Spotify, Apple Music, the rest — and none of them fit in a caption. Fans pick the one they recognise, or give up. A single link that routes everyone to the right service fixes that, and it can grow a follower on the way through.",
    sections: [
      {
        heading: "Why the pile of links fails",
        paragraphs: [
          "Every extra link is a small decision. Research on attention aside, it's just obvious when you watch someone do it: they scan, they find the service they already pay for, they tap it. If it isn't there, they close the tab. The other five links may as well not exist.",
          "The deeper problem is that the pile gives you nothing back. It's a hand-off, not a moment. Once the fan leaves, you have no idea which service they chose, which post sent them, or whether the release reached anyone who wasn't already following.",
        ],
      },
      {
        heading: "What a single smart link does differently",
        paragraphs: [
          "One address holds every destination. The fan lands on a page that lists each service by name, taps the one they use, and arrives where they wanted to go. Nothing about that step is harder for them than the old pile — it's easier, because there's one link to remember and one page to scan.",
          "The difference is what you can put in front of the hand-off. Instead of losing the fan, you can trade the routing for one lightweight action: a follow on the service, a subscribe on YouTube, or an email address for a list you actually own. The fan is already committed enough to tap; asking once, clearly, is a fair exchange for making their life easier.",
        ],
      },
      {
        heading: "How to set it up without over-asking",
        paragraphs: [
          "The temptation is to gate hard because the release matters to you. Resist it. A release link is often cold traffic — someone saw a clip, a story, a share — so keep the ask to a single step and let the music be the reward.",
          "A workable pattern:",
        ],
        bullets: [
          "One unlock page titled after the release, with cover art and a one-line description.",
          "A single action, chosen to match where the traffic is coming from.",
          "Every streaming service listed below the fold, in the order your audience is most likely to use.",
          "A clear, honest line above the action: what they're doing and what they get.",
        ],
      },
      {
        heading: "Measure the choice, not just the click",
        paragraphs: [
          "The payoff of routing through one page is that you learn which services your audience actually uses. If three-quarters of taps go to one platform, that's where your next push belongs. If almost nobody picks a service you've been promoting, that's a signal, not a rounding error.",
          "Watch conversion the same way you would on any link. High views with low unlocks means the step is too heavy or the promise is unclear. Fix the ask before you decide the link itself is the problem.",
        ],
      },
    ],
    cta: {
      title: "Build a release link",
      body: "One address, every service, one honest step. Make it in a few minutes and drop it wherever you announce.",
      label: "Create a release link",
      href: "/create",
    },
  },
  {
    slug: "youtube-subscribe-to-unlock",
    title: "YouTube subscribe to unlock: what actually converts",
    date: "October 17, 2026",
    readTime: "5 min read",
    author: "Deniz Kaya",
    topic: "Growth",
    intro:
      "The subscribe gate is the simplest idea in the toolbox: give something away, ask for a subscribe in return. Simple isn't the same as automatic. The links that convert are built on a handful of unglamorous details.",
    sections: [
      {
        heading: "The promise has to be worth a subscription",
        paragraphs: [
          "People don't resist subscribing; they resist wasting a step on nothing. A generic 'free download' competes with every other free download they've skipped this week. A specific one — 'the exact 808 pack from this video, 40 presets, no watermarks' — tells them in one line what they get and whether it's for them.",
          "Specificity is also honest. If what's behind the gate doesn't match the description, you get a subscribe now and an unsubscribed silence later. The gate only works as a growth tool if the content holds up once it opens.",
        ],
      },
      {
        heading: "Place the link where intent is highest",
        paragraphs: [
          "The description link works because people who watch to the end are the most interested subset you have. Lead with a line in the first two sentences of the description, and repeat it at the natural point in the video where you hand something over — not as a hard sell, just as the obvious next step.",
          "Pinned comments and end screens pull strong too, because they catch the two moments attention peaks: right when someone comments, and right as someone finishes. Use more than one placement; you're not limited to a single mention.",
        ],
      },
      {
        heading: "Keep the step count at one",
        paragraphs: [
          "This is the mistake that quietly kills subscribe gates. A viewer is willing to do exactly one small thing. The moment the page asks them to also follow on X and join a Discord, the perceived cost triples and a big slice of people bail.",
          "If your real goal is a community, run two different links for two different moments rather than stacking steps on one. One link, one ask, one clear reward converts far better than a wall of favours.",
        ],
      },
      {
        heading: "Write the button like a promise",
        paragraphs: [
          "The action line should read as a sentence a person would say out loud: 'Subscribe to @yourchannel to unlock the pack'. Vague labels like 'Continue' or 'Verify' create doubt exactly where you need confidence. Name the account and name the reward.",
          "Then test it. Give the link a day of real traffic and look at the ratio of views to unlocks. If it's low, the usual culprits are an unclear promise, a mismatched account, or a second step you didn't notice you'd added.",
        ],
      },
    ],
    cta: {
      title: "Turn your next video into subscribers",
      body: "Put a subscribe gate in front of a download and let one click do two jobs at once.",
      label: "Create a subscribe link",
      href: "/create",
    },
  },
  {
    slug: "collect-emails-with-free-downloads",
    title: "Collect emails with free downloads",
    date: "October 9, 2026",
    readTime: "4 min read",
    author: "Priya Nandakumar",
    topic: "Email",
    intro:
      "Of all the audiences you can build, the email list is the only one nobody can take away. A free download is the most reliable way to start one — as long as the trade feels fair from the fan's side of the screen.",
    sections: [
      {
        heading: "Why email still earns its place",
        paragraphs: [
          "Followers, subscribers and community members all live on platforms that can change the rules, throttle reach, or disappear. An email list is a direct line. It doesn't guarantee attention, but it guarantees the chance to ask for it, which is more than any algorithm promises.",
          "That's why the download-plus-email trade has persisted for decades. Someone gets something useful immediately; you get permission to keep talking. When it's done honestly, both sides win.",
        ],
      },
      {
        heading: "Make the trade visibly fair",
        paragraphs: [
          "State exactly what they'll receive and exactly what you'll do with the address. 'One email when the next pack drops. Unsubscribe any time. No spam.' People scan for the catch; telling them there isn't one, in plain words, lifts completion.",
          "Keep the form to email alone. Every extra field — name, birthday, how you found us — shaves a little more off the conversion rate. You can learn the rest later through what people reply to.",
        ],
      },
      {
        heading: "Pair the email with one social action, or don't",
        paragraphs: [
          "If you want both a list and a follow, two steps is the ceiling for a warm audience. For cold traffic, choose one. Which one depends on your goal: a release cycle favours a follow, a long-term business favours the email.",
          "A useful default is to let the content decide. Give away a download once and ask for email; give away community access and ask for a join. Match the ask to what you're handing over, and it stops feeling arbitrary.",
        ],
      },
      {
        heading: "Do something with the list immediately",
        paragraphs: [
          "The first email after a signup is where lists are won or lost. Send it the same day: confirm they're in, deliver or re-deliver the download, and tell them what kind of thing you'll send next. One good first email sets the tone for every one after it.",
          "Then treat the list with the respect the trade implies. Send when you have something worth saying, not on a schedule for its own sake. A small list that opens your messages beats a large one that ignores them.",
        ],
      },
    ],
    cta: {
      title: "Start a list with your next download",
      body: "Gate a file behind an email signup and you'll have something you own by the end of the week.",
      label: "Create an email gate",
      href: "/create",
    },
  },
  {
    slug: "link-in-bio-ideas-for-musicians",
    title: "Link-in-bio ideas for musicians",
    date: "October 2, 2026",
    readTime: "5 min read",
    author: "Tomás Oliveira",
    topic: "Link in bio",
    intro:
      "For a musician, the bio link is the one address every profile points at. Most people fill it with a list of links and leave it. A little thought turns it from a directory into the most useful page a fan will visit all week.",
    sections: [
      {
        heading: "Treat it as a setlist, not a directory",
        paragraphs: [
          "A directory lists everything equally. A setlist puts the song you want them to hear first at the top. Your bio page should have an obvious first tap — the newest release, the free pack, the tour dates — and everything else should support it.",
          "That means you'll reorder the page more often than you expect. Whenever something new ships, it moves up; whatever's gone quiet moves down. The page stays current because it's small and quick to change, not because you overhaul it.",
        ],
      },
      {
        heading: "Give the page a voice",
        paragraphs: [
          "A one-line intro does more work than it looks like it does. 'Lo-fi producer. New pack every Friday.' tells a stranger what to expect and when to come back. It also sets the order in which they read the rest of the page.",
          "Match the colours and corners to your artwork. The goal isn't decoration for its own sake — it's that a fan who arrived from a thumbnail recognises where they landed. Continuity across the click is what makes a page feel like yours.",
        ],
      },
      {
        heading: "Turn the page into a mailing list",
        paragraphs: [
          "The strongest move on any musician's bio page is an email signup. Followers are borrowed; an address is owned. Someone who taps your page is already interested, so a clear invitation to hear about the next drop costs you nothing and compounds over time.",
          "A practical structure that works for most musicians:",
        ],
        bullets: [
          "A one-line intro: what you make and how often you share it.",
          "The newest release, first and obvious.",
          "A free download gated behind one action — a follow or an email.",
          "Your streaming and social links, grouped together.",
          "Tour dates or upcoming events, when you have them.",
          "An email signup, near the bottom, for people who want more than a follow.",
        ],
      },
      {
        heading: "Point everything at one address",
        paragraphs: [
          "Put the single address in every bio field, on your channel banner, in the video description, and in the outro of your tracks where you can. The whole point is that there's one link to remember and one place to update.",
          "Then check it the way a fan would: tap through on a phone, complete the gate, confirm the download arrives. A bio page that works is invisible. A bio page with one broken link is the only thing people remember.",
        ],
      },
    ],
    cta: {
      title: "Claim your bio page",
      body: "One address for your releases, your free downloads and your list. Set it up once and keep it current.",
      label: "Build a link-in-bio page",
      href: "/create",
    },
  },
  {
    slug: "why-unlock-links-beat-a-plain-link",
    title: "Why an unlock link beats a plain link",
    date: "September 25, 2026",
    readTime: "5 min read",
    author: "Marisol Reyes",
    topic: "Growth",
    intro:
      "A plain link moves a person from where you posted to where you point. An unlock link does the same thing, but asks for one small action on the way. The difference sounds minor. Over a year of sharing, it's the whole game.",
    sections: [
      {
        heading: "Plain links only spend attention",
        paragraphs: [
          "Every post, story and description is a withdrawal from the attention you've built. A plain link spends that attention on a destination and gets nothing durable in return. The fan arrives, they look, they leave. If they liked it, maybe they'll remember your name.",
          "That's not a failure; it's just the default. Most links are hand-offs. The question is whether the hand-off could also build something you keep, without making the trip worse for the person taking it.",
        ],
      },
      {
        heading: "An unlock link converts the click into a relationship",
        paragraphs: [
          "Put one clear action in front of the destination — a subscribe, a follow, a join, an email — and the same click now grows an audience. The fan still gets what they came for, ideally something worth the step, and you end the interaction with a durable connection instead of a bounce.",
          "The math is simple to see. If a link gets a thousand views a month and converts one in ten, that's a hundred new subscribers or addresses every month from traffic you already had. A plain link on the same traffic yields zero, however good the destination was.",
        ],
      },
      {
        heading: "It only works when the step is honest",
        paragraphs: [
          "The entire model rests on the trade feeling fair. If the gate hides a tiny reward behind a heavy ask, people complete it once and never trust your next link. If the promise is clear and the content delivers, they'll happily do it again next time.",
          "So the rules are simple to state and easy to get wrong: one step for cold traffic, at most a couple for warm; a specific reward, described plainly; the exact account named on the button; and a destination that lives up to the description. Get those right and the gate is a favour, not a toll.",
        ],
      },
      {
        heading: "Start with the link you're already sharing",
        paragraphs: [
          "You don't need a new campaign to try this. Take the download, the invite or the resource you're already linking to, and put a single action in front of it. Give it real traffic for a day and look at the views-to-unlocks ratio.",
          "If it converts, you've found a repeatable way to turn your existing reach into an audience you keep. If it doesn't, the fix is usually smaller than it looks: simplify the ask, sharpen the promise, or move the link to the platform your audience actually uses.",
        ],
      },
    ],
    cta: {
      title: "Swap one plain link today",
      body: "Take something you already share and put a single honest step in front of it. Then watch the numbers.",
      label: "Create your first unlock link",
      href: "/create",
    },
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.intro };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <MarketingShell>
      <section className="glow relative border-b border-[var(--color-line)]">
        <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
          <Link href="/blog" className="text-sm faint link-underline">
            ← Blog
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs faint">
            <span className="badge badge-accent">{post.topic}</span>
            <span>{post.date}</span>
            <span aria-hidden>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm faint">By {post.author}</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-lg leading-relaxed">{post.intro}</p>

        <div className="mt-10 space-y-10">
          {post.sections.map((s) => (
            <section key={s.heading ?? s.paragraphs[0]}>
              {s.heading && (
                <h2 className="text-2xl font-bold tracking-tight">{s.heading}</h2>
              )}
              <div className={`space-y-4 leading-relaxed muted ${s.heading ? "mt-3" : ""}`}>
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {s.bullets && (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 muted">
                      <span className="accent-text" aria-hidden>
                        →
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="card-2 mt-12 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold">{post.cta.title}</h2>
            <p className="mt-1 text-sm muted">{post.cta.body}</p>
          </div>
          <Link href={post.cta.href} className="btn btn-primary">
            {post.cta.label}
          </Link>
        </div>

        <div className="hr my-12" />

        <h2 className="text-sm font-semibold uppercase tracking-wide faint">Keep reading</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {others.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card p-5 transition hover:border-[var(--accent)]"
            >
              <span className="badge">{p.topic}</span>
              <h3 className="mt-3 text-sm font-bold">{p.title}</h3>
              <span className="mt-2 block text-xs faint">{p.readTime}</span>
            </Link>
          ))}
        </div>
      </article>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Put it into practice</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            The best playbook is the one you're running. Build a link in a few minutes and let it work.
          </p>
          <Link href="/create" className="btn btn-primary btn-lg mt-6">
            Get started free
          </Link>
        </div>
      </Section>
    </MarketingShell>
  );
}

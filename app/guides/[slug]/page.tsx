import Link from "next/link";
import { notFound } from "next/navigation";
import MarketingShell, { Section } from "@/components/MarketingShell";
import Faq from "@/components/Faq";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

type Step = { title: string; body: string };
type Group = { kind: string; items: string[] };
type Guide = {
  slug: string;
  title: string;
  topic: string;
  readTime: string;
  updated: string;
  intro: string;
  steps: Step[];
  groups?: Group[];
  faq: { q: string; a: string }[];
};

const PLATFORM_GROUPS: Group[] = [
  {
    kind: "Music",
    items: [
      "Spotify",
      "SoundCloud",
      "Apple Music",
      "YouTube Music",
      "Audiomack",
      "BandLab",
      "Beatport",
      "Bandcamp",
      "Deezer",
      "Tidal",
      "Amazon Music",
      "Mixcloud",
    ],
  },
  {
    kind: "Video & streaming",
    items: ["YouTube", "TikTok", "Twitch", "Kick", "Rumble", "Vimeo"],
  },
  {
    kind: "Social",
    items: [
      "Instagram",
      "X",
      "Facebook",
      "Threads",
      "Bluesky",
      "Pinterest",
      "Reddit",
      "LinkedIn",
      "Snapchat",
    ],
  },
  { kind: "Communities", items: ["Discord", "Telegram", "WhatsApp"] },
  { kind: "Games", items: ["Roblox", "Steam"] },
  { kind: "Design", items: ["Behance", "Dribbble", "DeviantArt"] },
  {
    kind: "Apps",
    items: ["GitHub", "App Store", "Google Play", "Product Hunt", "any website"],
  },
  { kind: "Email", items: ["Email signup"] },
];

const GUIDES: Guide[] = [
  {
    slug: "create-your-first-link",
    title: "Create your first unlock link",
    topic: "Getting started",
    readTime: "4 min read",
    updated: "Updated October 2026",
    intro:
      "An unlock link is just a normal link with a step in front of it. In this guide you'll build one end to end, decide what sits behind it, and test the whole thing before you share it anywhere.",
    steps: [
      {
        title: "Open the editor and name the link",
        body: "From your dashboard, choose Create a link. Give it a title your future self will recognise — something like 'Drum kit sample pack' or 'Discord invite for the podcast' — because this shows up in your list, in analytics and on the unlock page itself. You can rename it later.",
      },
      {
        title: "Choose what you're locking",
        body: "You can gate three kinds of content. A URL sends people to another page when they unlock. An uploaded file lets them download something you stored here, up to your plan's size. A text snippet reveals a code, a key or a short message. Pick the one that matches what you promised.",
      },
      {
        title: "Add the destination",
        body: "Paste the link, upload the file, or type the text. Double-check it now: a broken destination is the one thing visitors can't work around, and it's the most common reason a link 'doesn't work'. If it's a file, wait for the upload to finish before moving on.",
      },
      {
        title: "Add one action to start",
        body: "For your first link, pick a single action — a YouTube subscribe or a Discord join are the usual choices. You can always add more later, but one clear step converts better while you're learning what your audience will do. See the guide on choosing actions for the reasoning.",
      },
      {
        title: "Style the unlock page",
        body: "Give the page a title, a short line of description, and pick an accent colour that matches your brand. A thumbnail or cover image goes a long way. Keep the copy honest — tell people exactly what they get and what the step is, and don't bury the ask.",
      },
      {
        title: "Test it on your phone before you share",
        body: "Open the link on a phone, complete the action, and confirm you reach the destination. This catches the small things: a stale file, a login wall on the target platform, or a step pointing at the wrong account. Only then copy the link into a post or description.",
      },
      {
        title: "Save it and watch the first unlocks",
        body: "Save the link. Every view and unlock is recorded from the moment it goes live, so put it somewhere with traffic and check back in a day. If views are high but unlocks are low, the step or the promise is the problem, not the link.",
      },
    ],
    faq: [
      {
        q: "Do I need an account to create a link?",
        a: "No. You can build and share a link straight away. Signing up afterwards is what lets you keep it, edit it later and see its analytics.",
      },
      {
        q: "Can I edit a link after people have unlocked it?",
        a: "Yes. You can change the title, the styling and the destination. Every unlock is recorded against your account when it happens, so past numbers aren't affected by edits.",
      },
      {
        q: "What if the destination is wrong and someone already shared the link?",
        a: "Fix it in the editor; the same public link keeps working and now points at the corrected destination. Nobody has to re-share anything.",
      },
    ],
  },
  {
    slug: "choose-the-right-actions",
    title: "Choose the right actions",
    topic: "Getting started",
    readTime: "6 min read",
    updated: "Updated October 2026",
    intro:
      "The action you ask for is the whole deal. Ask too little and the link is just a redirect; ask too much and people bounce. This guide is about matching the ask to the value you're giving away, and knowing when one step beats three.",
    steps: [
      {
        title: "Start from the value, not the platform",
        body: "Before picking a platform, write down what the person gets in one sentence: 'a 200MB sample pack', 'a working cheat config', 'the discount code'. The bigger and more specific the payoff, the more you can ask. A tiny freebie supports one lightweight follow; a serious asset can carry two or three steps.",
      },
      {
        title: "Use one action for cold traffic",
        body: "If people are meeting you for the first time from a tweet, a video description or a paid ad, keep it to a single step. Cold audiences have the least patience and the most scepticism. One YouTube subscribe or one Discord join is a fair trade for something genuinely useful.",
      },
      {
        title: "Use two actions for warm traffic",
        body: "People who already follow you, who clicked from your own bio, or who came back for a second download have already made a small commitment. Two steps — say a Spotify follow and an email signup — are reasonable here, especially if one of them grows a channel you actually depend on.",
      },
      {
        title: "Reserve three actions for high value and loyal audiences",
        body: "Three steps is the ceiling, not a goal. It suits a big giveaway to a community that already trusts you, where each step maps to a channel you actively use. If you can't explain why each step earns its place, cut it.",
      },
      {
        title: "Match the action to the platform people are already on",
        body: "Don't send a TikTok audience to LinkedIn. If your traffic comes from a specific network, ask for a follow there first, then use the second step to pull people somewhere new. Leading with the platform they arrived from keeps the first step frictionless.",
      },
      {
        title: "Add an email step when the list is the point",
        body: "Email is the only audience you own outright, and it survives a platform changing its mind. If you're giving away a download, an email step is often worth more than a follower. Pair it with one social follow so you grow both at once.",
      },
      {
        title: "Watch conversion, then adjust the count",
        body: "Give a new combination a day of real traffic. If a single-step link converts well, try adding a second and see how much it drops. If three steps stalls, remove the weakest one. Treat the number of steps as a dial you tune, not a setting you choose once.",
      },
    ],
    faq: [
      {
        q: "Is one action enough to be worth it?",
        a: "Yes. A single subscribe or join still grows a channel with every share, and a link that converts well beats a link that asks for everything and gets nothing.",
      },
      {
        q: "Can I mix a social action with an email signup?",
        a: "That's one of the most common pairs. One social follow builds reach, the email step builds a list you keep, and together they still feel like two quick steps.",
      },
      {
        q: "What's a realistic conversion rate?",
        a: "It varies wildly by traffic source and payoff, so treat your own first week as the benchmark rather than a number from someone else. Low unlocks with high views is a signal to simplify.",
      },
    ],
  },
  {
    slug: "platforms-and-actions",
    title: "All platforms and actions",
    topic: "Platforms",
    readTime: "7 min read",
    updated: "Updated October 2026",
    intro:
      "Gatekeeper supports 80 actions across more than 40 platforms, grouped below by what you're trying to grow. Each platform offers actions like follow, subscribe, join, like, save or signup, and you can combine any of them in a single unlock link.",
    steps: [
      {
        title: "Choose the platform that owns the number you care about",
        body: "Every platform here exposes at least one action, and the action you pick should map to a metric you actually watch. If you're building a mailing list, email wins. If you're building a community, Discord or Telegram. If you're building plays, the music platforms below.",
      },
      {
        title: "Understand the action types",
        body: "Subscribe grows a channel or newsletter. Follow grows a profile. Join grows a community server or group. Like and save nudge an algorithm. Signup adds someone to a list. The wording on the unlock page updates to match what the visitor is being asked to do, so it never feels generic.",
      },
      {
        title: "Combine platforms in one link",
        body: "You can stack actions from different groups — a Spotify follow plus a YouTube subscribe, or a Discord join plus an email signup. The visitor sees a single ordered checklist, and the destination only opens once every step is done.",
      },
      {
        title: "Point actions at the right account",
        body: "For every action, enter the exact handle, channel or server you want grown. It's worth pasting the profile URL and letting the app read the handle back, so you don't accidentally send subscribers to a dormant second account.",
      },
      {
        title: "Retire platforms you don't maintain",
        body: "A follow on a channel you update twice a year is a favour that expires. Keep your links pointed at the platforms you actually post to, and drop the rest so every step means something.",
      },
    ],
    groups: PLATFORM_GROUPS,
    faq: [
      {
        q: "How many platforms can I use in one link?",
        a: "Up to three actions per link, and each can come from a different platform. The groups below are just for browsing; the three-step limit is what keeps conversion healthy.",
      },
      {
        q: "Can I gate content behind an app store review or a GitHub star?",
        a: "Yes. App Store, Google Play, Product Hunt and GitHub are all supported, along with an option to send visitors to any website you name.",
      },
      {
        q: "Do the platforms need to be connected with my login?",
        a: "In this clone, actions run in a demo click-to-confirm mode unless you connect a platform's own app. The flow, layout and analytics are all in place so you can see how it behaves.",
      },
    ],
  },
  {
    slug: "set-up-link-in-bio",
    title: "Set up your link-in-bio page",
    topic: "Pages & style",
    readTime: "5 min read",
    updated: "Updated October 2026",
    intro:
      "A link-in-bio page gives your audience one address that holds everything: your socials, your latest unlock links, your shop, your releases. Instead of swapping links in and out of a profile, you point everywhere at one page and change what's on it whenever you like.",
    steps: [
      {
        title: "Claim your handle",
        body: "Pick the name you'll use in the address. Keep it short, lowercase and easy to say out loud, ideally the same as your main handle. Your page then lives at a single tidy address you can print, paste and say on a stream.",
      },
      {
        title: "Write a one-line intro",
        body: "Under your display name, add a short line that tells a stranger what you do and what to tap first. 'Producer · grab the free sample pack' beats 'just a creator'. It sets the order in which people read the page.",
      },
      {
        title: "Pick a theme that fits your brand",
        body: "Choose a background and accent that match your channel art, and set the corner style to match how rounded your thumbnails are. The page should look like it belongs to you within a second, without any custom code.",
      },
      {
        title: "Order your links by intent",
        body: "Put the single most important link first — usually your newest unlock or your latest release. Group the rest: socials together, shop links together, everything else last. Most people tap the top one or two items and nothing else.",
      },
      {
        title: "Add your unlock links as cards",
        body: "Unlock links can sit on the page just like any other link, and they still gate their content. A visitor lands on your page, taps the card, completes the step and gets the download — all without leaving the flow.",
      },
      {
        title: "Add socials and a way to subscribe",
        body: "List the platforms you actually post to, and add an email signup so people who aren't ready for a follow can still stay in touch. Every icon you add should be a place you'd be happy for a new fan to land.",
      },
      {
        title: "Share the address everywhere",
        body: "Put the one address in every bio field, on your channel banner, at the end of videos and in your email signature. Whenever you add a new link, you update the page once and every profile is current again.",
      },
    ],
    faq: [
      {
        q: "Is the link-in-bio page free?",
        a: "Yes, you can claim a page and use it on the free plan. Pro and Lifetime lift limits on how much you can put on it and how it's customised.",
      },
      {
        q: "Can I use my own domain?",
        a: "In this clone the page lives under the app's address. Custom domains are the kind of thing a paid tier would unlock in a real product, and the plan guide covers how tiers are meant to differ.",
      },
      {
        q: "How many links can I add?",
        a: "The free plan covers the essentials for most people. If you're running a large page with many sections, the paid tiers give you more room and stronger styling options.",
      },
    ],
  },
  {
    slug: "understand-your-analytics",
    title: "Understand your analytics",
    topic: "Links & analytics",
    readTime: "6 min read",
    updated: "Updated October 2026",
    intro:
      "Your analytics answer one question: is this link growing the audience you wanted? Everything else is context. Here's what each number means, how to read them together, and which ones should actually change what you do next.",
    steps: [
      {
        title: "Start with views",
        body: "A view is someone who opened the unlock page. It tells you how much traffic a link is receiving, which is mostly a function of where you shared it. High views are a sign that your promotion worked; they say nothing yet about whether the offer did.",
      },
      {
        title: "Then look at unlocks",
        body: "An unlock is a visitor who completed every step and reached the content. This is the number your audience-building depends on. Two links with the same views and different unlocks are telling you the offer or the ask is the variable.",
      },
      {
        title: "Read conversion rate as the ratio",
        body: "Conversion rate is unlocks divided by views. Watch it as a percentage rather than a raw count, because it's the only figure that's fair to compare across links with different traffic. A small link with strong conversion is often worth copying.",
      },
      {
        title: "Break it down by step",
        body: "When a link has more than one action, look at where people drop off. If most visitors complete the first step and then vanish, the second step is the problem — usually the wrong platform for that audience rather than a technical fault.",
      },
      {
        title: "Check where people came from",
        body: "The source breakdown tells you which post, bio or platform actually drove the unlocks. It's common for one channel to send ten times the traffic of the others. Put your next link where the unlocks came from, not where the views did.",
      },
      {
        title: "Note device and timing",
        body: "If most of your unlocks happen on phones in the evening, design and post accordingly. A step that's awkward on mobile — a long signup form, say — will show up here as a device-shaped dip in conversion.",
      },
      {
        title: "Turn the reading into one change",
        body: "Every review should end with a single tweak: drop a step, swap a platform, rewrite the promise, or move the link to the channel that converts. Change one thing, give it real traffic, and compare the conversion rate before you touch anything else.",
      },
    ],
    faq: [
      {
        q: "Do you track individual visitors?",
        a: "Unlock analytics are stored as totals rather than a profile of each person. You see counts and breakdowns, not a dossier on any one visitor.",
      },
      {
        q: "Why are my views high but unlocks low?",
        a: "Nine times out of ten the ask is too heavy for the payoff, or the destination promised on the page isn't what people find. Simplify the steps or make the reward clearer.",
      },
      {
        q: "How soon do numbers appear?",
        a: "Views and unlocks are recorded as they happen, so a link with live traffic shows movement within minutes of your first share.",
      },
    ],
  },
  {
    slug: "short-links-and-collections",
    title: "Short links and collections",
    topic: "Links & analytics",
    readTime: "5 min read",
    updated: "Updated October 2026",
    intro:
      "Two small features do a lot of quiet work: short links keep your shares tidy and attributable, and collections turn a pile of related links into one page someone can browse. Used together they make a campaign feel organised instead of scattered.",
    steps: [
      {
        title: "Use a short link when you need it clean",
        body: "A short link is a compact address that forwards to wherever you point it. It's easier to read out on a stream, fits in a small graphic, and gives you one tidy URL to change later without updating the places you've already posted it.",
      },
      {
        title: "Name your short links to remember them",
        body: "Pick a slug that says what it points at, not a random string. 'spring-drop' is easier to find in a list of fifty links than 'x7f2k1', and it doubles as a label when you're scanning analytics.",
      },
      {
        title: "Point a short link at a page, not a step",
        body: "Short links work best as the front door to a link-in-bio page or a landing page. Let the destination do the gating; keep the short link as the simple, memorable address people can type.",
      },
      {
        title: "Build a collection for a set of related links",
        body: "A collection groups several links under one titled page — a season of releases, a pack of presets, a set of tutorials. The visitor opens one page and chooses what they want, instead of you sending a different link for each item.",
      },
      {
        title: "Give each collection a clear title and order",
        body: "Title it the way your audience thinks about the set, and order the items by what you most want opened. Anything older than a month or two should probably sit lower or come out entirely.",
      },
      {
        title: "Track collections like any other link",
        body: "Views and unlocks roll up across a collection, so you can see whether the set as a whole is pulling its weight, then open individual items to find the ones people skip. Cut the dead weight and promote the winners.",
      },
      {
        title: "Reuse instead of re-posting",
        body: "When a collection's contents change, update it in place. Anyone holding the old link still lands on the right page with the current items, so you never send people to a stale list again.",
      },
    ],
    faq: [
      {
        q: "What's the difference between a short link and an unlock link?",
        a: "A short link is a tidy forwarder with no step in front of it. An unlock link adds one to three actions before the destination opens. They can point at each other, and often do.",
      },
      {
        q: "Can a collection contain unlock links?",
        a: "Yes — that's a common setup. The collection is the browseable page, and each item on it can gate its own content behind its own steps.",
      },
      {
        q: "Do short links keep working if I change the destination?",
        a: "Yes. The short address is permanent; what it forwards to is editable, so you can repoint it without breaking anything you've already shared.",
      },
    ],
  },
  {
    slug: "which-plan-do-you-need",
    title: "Which plan do you need?",
    topic: "Plans & billing",
    readTime: "4 min read",
    updated: "Updated October 2026",
    intro:
      "Start free and stay there until a limit actually gets in your way. This guide explains what the Free plan covers, when Pro starts to make sense, and the kind of creator who should go straight to Lifetime.",
    steps: [
      {
        title: "Understand what Free is for",
        body: "Free is a complete product, not a trial. You can create unlock links, use the main platforms, run a link-in-bio page and see the core analytics. It's the right plan for testing whether gated links work for your audience at all.",
      },
      {
        title: "Watch for the limits, not the price",
        body: "The moment to consider paying is when you hit a specific limit repeatedly — running out of room for an upload, wanting more customisation on your page, or needing finer analytics. Upgrade to remove a real blocker, not on a whim.",
      },
      {
        title: "Choose Pro when you're shipping every week",
        body: "Pro is for creators running gates as part of a steady rhythm: a new download every week, a growing email list, a link-in-bio page that needs to look sharp. It removes the ceilings you'll hit once this becomes part of your routine.",
      },
      {
        title: "Choose Lifetime when you're building a long-term asset",
        body: "If you know you'll be running links and a bio page for years, Lifetime trades one payment for permanent access. It suits people who've already proven the model works and would rather not think about a monthly bill again.",
      },
      {
        title: "Compare against what you'd spend on ads",
        body: "The honest test is whether a paid tier earns its keep. If gated links bring in subscribers and emails you'd otherwise buy with ad spend, the plan pays for itself quickly. If not yet, stay free until the numbers say otherwise.",
      },
      {
        title: "You can change your mind",
        body: "Plans are there to fit the stage you're at. Start where your usage sits, move up when a limit bites, and don't feel you have to predict the next year on day one.",
      },
    ],
    faq: [
      {
        q: "What does the Free plan cost?",
        a: "Nothing, and no card is required. It stays available as long as you're within its limits, which cover most people getting started.",
      },
      {
        q: "How much is Pro?",
        a: "Pro is €14.99 per month and lifts the limits you hit as you ship regularly. Lifetime is a one-time €149 for permanent access.",
      },
      {
        q: "Is there a free trial on the paid plans?",
        a: "You get the whole product on Free, so you can judge it with real traffic before paying anything. Treat that as your trial.",
      },
    ],
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: "Guide not found" };
  return { title: guide.title, description: guide.intro };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  return (
    <MarketingShell>
      <section className="glow relative border-b border-[var(--color-line)]">
        <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
          <Link href="/guides" className="text-sm faint link-underline">
            ← Help center
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs faint">
            <span className="badge badge-accent">{guide.topic}</span>
            <span>{guide.readTime}</span>
            <span aria-hidden>·</span>
            <span>{guide.updated}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg muted">{guide.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <article>
            <nav className="card p-5" aria-label="On this page">
              <h2 className="text-xs font-semibold uppercase tracking-wide faint">On this page</h2>
              <ol className="mt-3 space-y-2 text-sm">
                {guide.steps.map((s, i) => (
                  <li key={s.title}>
                    <a href={`#step-${i + 1}`} className="muted link-underline hover:text-[var(--color-fg)]">
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
                {guide.groups && (
                  <li>
                    <a href="#platforms" className="muted link-underline hover:text-[var(--color-fg)]">
                      The platform list
                    </a>
                  </li>
                )}
              </ol>
            </nav>

            <div className="mt-10 space-y-8">
              {guide.steps.map((s, i) => (
                <section key={s.title} id={`step-${i + 1}`} className="scroll-mt-24">
                  <div className="flex items-start gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--color-surface-3)] text-sm font-extrabold accent-text">
                      {i + 1}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">{s.title}</h2>
                      <p className="mt-2 leading-relaxed muted">{s.body}</p>
                    </div>
                  </div>
                </section>
              ))}

              {guide.groups && (
                <section id="platforms" className="scroll-mt-24">
                  <h2 className="text-xl font-bold tracking-tight">The platform list</h2>
                  <p className="mt-2 muted">
                    80 actions across 40+ platforms, grouped by kind. Any three can be combined in a
                    single unlock link.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {guide.groups.map((group) => (
                      <div key={group.kind} className="card p-5">
                        <h3 className="text-sm font-bold">{group.kind}</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <span key={item} className="chip">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold tracking-tight">Frequently asked</h2>
              <div className="mx-auto max-w-none">
                <Faq items={guide.faq} />
              </div>
            </div>

            <div className="card-2 mt-12 flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold">Put this to work</h2>
                <p className="mt-1 text-sm muted">
                  You've read the theory. Build the link and let real traffic tell you the rest.
                </p>
              </div>
              <Link href="/create" className="btn btn-primary">
                Create a free link
              </Link>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide faint">More guides</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {GUIDES.filter((g) => g.slug !== guide.slug)
                  .slice(0, 5)
                  .map((g) => (
                    <li key={g.slug}>
                      <Link href={`/guides/${g.slug}`} className="muted link-underline hover:text-[var(--color-fg)]">
                        {g.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide faint">Need a hand?</h3>
              <p className="mt-2 text-sm muted">
                Tell us what you're trying to build and we'll point you the right way.
              </p>
              <Link href="/contact" className="btn btn-secondary btn-sm mt-3">
                Contact support
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Section tinted>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready for the next guide?</h2>
          <p className="mx-auto mt-3 max-w-xl muted">
            Browse the full help center for setup, styling, analytics and plans.
          </p>
          <Link href="/guides" className="btn btn-secondary btn-lg mt-6">
            Back to the help center
          </Link>
        </div>
      </Section>
    </MarketingShell>
  );
}

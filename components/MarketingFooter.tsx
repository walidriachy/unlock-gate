import Link from "next/link";
import Logo from "./Logo";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/create", label: "Create a link" },
    ],
  },
  {
    title: "Features",
    links: [
      { href: "/features/social-unlock", label: "Social unlock" },
      { href: "/features/email-gate", label: "Email capture" },
      { href: "/features/link-in-bio", label: "Link in bio" },
      { href: "/features/release-links", label: "Release links" },
      { href: "/features/short-links", label: "Short links" },
      { href: "/features/analytics", label: "Analytics" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/for/youtubers", label: "For YouTubers" },
      { href: "/for/streamers", label: "For streamers" },
      { href: "/for/music-producers", label: "For producers" },
      { href: "/for/game-creators", label: "For game creators" },
      { href: "/for/teams", label: "For teams" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/guides", label: "Help center" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export default function MarketingFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1.4fr_repeat(5,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm muted">
            Gate any link behind a social action. Grow followers, subscribers and email lists from
            every share.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide faint">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="muted hover:text-[var(--color-fg)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-line)] px-5 py-5 text-center text-xs faint">
        © {new Date().getFullYear()} Gatekeeper. A clean-room clone built for study. Not affiliated
        with Rekonise. Built for creators who want to grow on their own terms.
      </div>
    </footer>
  );
}

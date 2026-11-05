"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

type IconName = "lock" | "mail" | "bio" | "disc" | "link" | "chart";

const ICONS: Record<IconName, React.ReactNode> = {
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 1 1 7 0v2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m3.8 7 7.2 5.2a1.7 1.7 0 0 0 2 0L20.2 7" />
    </>
  ),
  bio: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="3" />
      <circle cx="12" cy="9.3" r="2.4" />
      <path d="M8 16.4c.8-2 2.2-3 4-3s3.2 1 4 3" />
    </>
  ),
  disc: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3.5v3M12 17.5v3" />
    </>
  ),
  link: (
    <>
      <path d="M9.6 14.4 14.4 9.6" />
      <path d="M11.2 6.9 12.7 5.4a3.7 3.7 0 0 1 5.2 5.2l-1.5 1.5" />
      <path d="M12.8 17.1 11.3 18.6a3.7 3.7 0 0 1-5.2-5.2l1.5-1.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19.5h16" />
      <path d="M7 19.5v-5M12 19.5V8M17 19.5v-8" />
    </>
  ),
};

interface Product {
  href: string;
  label: string;
  short: string;
  blurb: string;
  image: string;
  icon: IconName;
}

const PRODUCTS: Product[] = [
  {
    href: "/features/social-unlock",
    label: "Unlock links",
    short: "Lock links behind a follow or subscribe",
    blurb:
      "Fans follow you on YouTube, Discord, X or Spotify, then your download unlocks.",
    image: "/products/unlock-v2.jpg",
    icon: "lock",
  },
  {
    href: "/features/email-gate",
    label: "Email capture",
    short: "Grow a list with every download",
    blurb: "Every download can add a subscriber to your email list.",
    image: "/products/email-v2.jpg",
    icon: "mail",
  },
  {
    href: "/features/link-in-bio",
    label: "Link in bio",
    short: "One page for all your links",
    blurb: "Your links, socials and newest drops on one page.",
    image: "/products/bio-v2.jpg",
    icon: "bio",
  },
  {
    href: "/features/release-links",
    label: "Release links",
    short: "Every place to listen, one link",
    blurb:
      "One page for your song or album, with a countdown before release day.",
    image: "/products/release-v2.jpg",
    icon: "disc",
  },
  {
    href: "/features/short-links",
    label: "Short links",
    short: "Clean links with click counts",
    blurb: "Short, clean links with a click count on each one.",
    image: "/products/short-v2.jpg",
    icon: "link",
  },
  {
    href: "/features/analytics",
    label: "Analytics",
    short: "See which links grow you",
    blurb: "Where your views come from, by country, device and source.",
    image: "/products/analytics-v2.jpg",
    icon: "chart",
  },
];

const SOLUTIONS = [
  { href: "/for/youtubers", label: "YouTubers" },
  { href: "/for/streamers", label: "Streamers" },
  { href: "/for/music-producers", label: "Music producers" },
  { href: "/for/game-creators", label: "Game creators" },
  { href: "/for/teams", label: "Teams" },
];

function ProductIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

export default function MarketingNav() {
  const [open, setOpen] = useState<null | "product" | "solutions" | "resources" | "mobile">(null);
  const [active, setActive] = useState(0);

  function toggle(menu: "product" | "solutions" | "resources") {
    setOpen((o) => (o === menu ? null : menu));
  }

  const product = PRODUCTS[active];
  const dropdownOpen = open === "product" || open === "solutions" || open === "resources";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(20,17,15,0.86)] backdrop-blur-xl">
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(null)} aria-hidden />
      )}
      <div className="relative z-50 mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <Logo />

        <nav className="ml-2 hidden items-center gap-1 text-sm md:flex">
          <div className="relative">
            <button
              className={`btn btn-ghost btn-sm ${open === "product" ? "bg-white/[0.06] text-white" : ""}`}
              onClick={() => toggle("product")}
              aria-expanded={open === "product"}
            >
              Product ▾
            </button>
            {open === "product" && (
              <div className="absolute left-0 top-full mt-2 w-[min(90vw,840px)] panel p-3">
                <div className="grid gap-3 md:grid-cols-[292px_1fr]">
                  <div className="flex flex-col">
                    <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider faint">
                      Products
                    </p>
                    {PRODUCTS.map((p, i) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setOpen(null)}
                        className={`group flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors ${
                          i === active
                            ? "bg-white/[0.07] ring-1 ring-inset ring-white/10"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
                            i === active
                              ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                              : "bg-white/[0.06] text-white/70"
                          }`}
                        >
                          <ProductIcon name={p.icon} size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[14px] font-semibold leading-tight">
                            {p.label}
                          </span>
                          <span className="mt-0.5 block truncate text-[12px] leading-snug faint">
                            {p.short}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)]">
                    <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-[var(--color-line)] bg-black">
                      <Image
                        src={product.image}
                        alt={`${product.label} preview`}
                        width={1200}
                        height={800}
                        sizes="520px"
                        className="h-full w-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-base font-bold">{product.label}</h4>
                      <p className="mt-1 text-[13px] leading-relaxed muted">{product.blurb}</p>
                      <Link
                        href={product.href}
                        onClick={() => setOpen(null)}
                        className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold accent-text"
                      >
                        Explore {product.label.toLowerCase()} <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--color-line)] px-2 pt-2.5 text-[12px]">
                  <span className="faint">Every product is included on Pro</span>
                  <Link href="/pricing" onClick={() => setOpen(null)} className="font-semibold accent-text">
                    Compare plans →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button className="btn btn-ghost btn-sm" onClick={() => toggle("solutions")}>
              Solutions ▾
            </button>
            {open === "solutions" && (
              <div className="absolute left-0 top-full mt-2 w-56 panel p-2">
                <p className="px-2 py-1 text-[11px] uppercase faint">Solutions</p>
                {SOLUTIONS.map((f) => (
                  <Link key={f.href} href={f.href} className="block rounded-lg px-2 py-2 text-sm hover:bg-[var(--color-surface-2)]" onClick={() => setOpen(null)}>
                    {f.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/pricing" className="btn btn-ghost btn-sm" onClick={() => setOpen(null)}>
            Pricing
          </Link>

          <div className="relative">
            <button className="btn btn-ghost btn-sm" onClick={() => toggle("resources")}>
              Resources ▾
            </button>
            {open === "resources" && (
              <div className="absolute left-0 top-full mt-2 w-56 panel p-2">
                {[
                  { href: "/how-it-works", label: "How it works" },
                  { href: "/guides", label: "Help center" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact" },
                ].map((f) => (
                  <Link key={f.href} href={f.href} className="block rounded-lg px-2 py-2 text-sm hover:bg-[var(--color-surface-2)]" onClick={() => setOpen(null)}>
                    {f.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link href="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Sign up free
          </Link>
        </div>

        <button
          className="ml-auto btn btn-ghost btn-sm md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((o) => (o ? null : "mobile"))}
        >
          ☰
        </button>
      </div>

      {open === "mobile" && (
        <div className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-[var(--color-line)] bg-[var(--color-ink)] px-5 py-4 md:hidden">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider faint">Products</p>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCTS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setOpen(null)}
                className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)]"
              >
                <Image
                  src={p.image}
                  alt=""
                  width={1200}
                  height={750}
                  className="h-16 w-full object-cover opacity-80"
                />
                <span className="block px-2.5 py-2 text-[12px] font-semibold leading-tight">{p.label}</span>
              </Link>
            ))}
          </div>

          <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wider faint">Solutions</p>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {[...SOLUTIONS, { href: "/how-it-works", label: "How it works" }, { href: "/guides", label: "Help center" }, { href: "/blog", label: "Blog" }, { href: "/pricing", label: "Pricing" }].map((f) => (
              <Link key={f.href} href={f.href} className="rounded-lg px-3 py-2 hover:bg-[var(--color-surface-2)]" onClick={() => setOpen(null)}>
                {f.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/login" className="btn btn-secondary btn-block" onClick={() => setOpen(null)}>
              Sign in
            </Link>
            <Link href="/register" className="btn btn-primary btn-block" onClick={() => setOpen(null)}>
              Sign up free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

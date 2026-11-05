"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const GROUPS: { title: string; links: { href: string; label: string; icon: string; exact?: boolean }[] }[] = [
  {
    title: "Overview",
    links: [{ href: "/dashboard", label: "Dashboard", icon: "📊", exact: true }],
  },
  {
    title: "Links",
    links: [
      { href: "/dashboard/links", label: "All links", icon: "🔗", exact: true },
      { href: "/dashboard/links/activity", label: "Activity", icon: "📈" },
      { href: "/dashboard/links/short", label: "Short links", icon: "✂️" },
      { href: "/dashboard/links/collections", label: "Collections", icon: "🗂️" },
    ],
  },
  {
    title: "Pages",
    links: [
      { href: "/dashboard/link-in-bio", label: "Link in bio", icon: "🎨" },
      { href: "/dashboard/releases", label: "Releases", icon: "💿" },
      { href: "/dashboard/automations", label: "Automations", icon: "💬" },
      { href: "/dashboard/profile", label: "Profile", icon: "🧑‍🎤" },
    ],
  },
  {
    title: "Audience",
    links: [
      { href: "/dashboard/email", label: "Email lists", icon: "✉️" },
      { href: "/dashboard/analytics", label: "Audience", icon: "🌍" },
      { href: "/dashboard/unlocks", label: "My unlocks", icon: "🔓" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/dashboard/milestones", label: "Milestones", icon: "🏆" },
      { href: "/dashboard/settings", label: "Settings & plan", icon: "⚙️" },
    ],
  },
];

export default function DashboardNav({
  name,
  username,
  tier,
}: {
  name: string;
  username: string | null;
  tier: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  }

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <Logo small href="/dashboard" />
        <button className="btn btn-ghost btn-sm md:hidden" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>
      <div className="px-4 pb-3">
        <Link href="/dashboard/links/create" className="btn btn-primary btn-block btn-sm">
          + Create link
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {GROUPS.map((g) => (
          <div key={g.title} className="mb-3">
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide faint">{g.title}</p>
            {g.links.map((l) => {
              const active = l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? "bg-[var(--color-surface-2)] text-[var(--color-fg)]" : "muted hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
                  }`}
                >
                  <span>{l.icon}</span>
                  {l.label}
                </Link>
              );
            })}
          </div>
        ))}
        {process.env.NEXT_PUBLIC_OPENREPLY_URL && (
          <div className="mb-3">
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide faint">Automations</p>
            <a
              href={process.env.NEXT_PUBLIC_OPENREPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium muted hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
            >
              <span>💬</span>
              Instagram DM automation (OpenReply)
            </a>
          </div>
        )}
      </nav>
      <div className="border-t border-[var(--color-line)] p-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-surface-3)] text-sm font-bold">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{name}</div>
            <div className="flex items-center gap-1 text-[11px] faint">
              <span className={tier === "free" ? "" : "accent-text"}>
                {tier === "free" ? "Free plan" : tier === "pro" ? "Pro" : "Lifetime"}
              </span>
              {username && <span className="truncate">· @{username}</span>}
            </div>
          </div>
        </div>
        <button onClick={logout} disabled={loggingOut} className="btn btn-ghost btn-sm mt-3 w-full justify-start">
          {loggingOut ? "Logging out…" : "Log out →"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 md:hidden">
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)} aria-label="Menu">
          ☰
        </button>
        <Logo small href="/dashboard" />
        <Link href="/dashboard/links/create" className="btn btn-primary btn-sm ml-auto">
          + Link
        </Link>
      </div>

      <aside className="hidden w-64 shrink-0 border-r border-[var(--color-line)] bg-[var(--color-surface)] md:block md:min-h-screen">
        {body}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-[var(--color-line)] bg-[var(--color-surface)]">{body}</div>
        </div>
      )}
    </>
  );
}

import { requireAdmin } from "@/lib/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/links", label: "Links" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/email", label: "Email" },
    { href: "/admin/billing", label: "Billing" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/audit", label: "Audit" },
  ];
  return (
    <div className="min-h-screen bg-[var(--color-ink)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-ink)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold tracking-wide">Gatekeeper Admin</span>
            <span className="text-xs faint">· {user.email}</span>
          </div>
          <Link href="/dashboard" className="text-xs font-semibold muted hover:text-white">
            ← Back to app
          </Link>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 pb-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold muted hover:bg-[var(--color-surface-2)] hover:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}

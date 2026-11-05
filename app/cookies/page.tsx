import Link from "next/link";
import MarketingShell, { PageHero } from "@/components/MarketingShell";

export const metadata = {
  title: "Cookie Policy",
  description:
    "The small number of cookies Gatekeeper uses: a session cookie for accounts, a visitor token for unlocks, and analytics or ads on free pages.",
};

type Cookie = { name: string; what: string; why: string; life: string };

const COOKIES: Cookie[] = [
  {
    name: "Session cookie",
    what: "A signed token that identifies your signed-in account on this device.",
    why: "Keeps you logged in and lets the dashboard, editor and settings work without asking for your password on every page.",
    life: "Until you log out or the session expires.",
  },
  {
    name: "Visitor token",
    what: "A random identifier that belongs to a visitor, not an account.",
    why: "Remembers that this device completed the steps on a link, so the unlock is recognised and the destination can be released. It contains no name and no email.",
    life: "A limited period, refreshed when you open links.",
  },
  {
    name: "Analytics and ads",
    what: "Optional cookies set on free pages to understand page performance and, where enabled, to show advertising.",
    why: "Measures views and unlocks as totals and keeps the free tier running. These are not used to identify you, and they are not set on paid pages.",
    life: "Short, or until cleared from your browser.",
  },
];

export default function CookiesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        subtitle="Short and specific: the few cookies this app uses, what each one does, and how to clear them."
      />

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="space-y-3 leading-relaxed muted">
          <p>
            Cookies are small text files a site asks your browser to keep. They let a site recognise
            the same browser on a later page or visit, which is how a login stays logged in and how an
            unlock is remembered. We keep our use of them to the minimum the product needs.
          </p>
          <p>
            Most browsers let you block or delete cookies in their settings. Blocking the session
            cookie means you cannot stay signed in; blocking the visitor token means a multi-step
            unlock may not be recognised as complete. Everything else on the site keeps working.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {COOKIES.map((c) => (
            <div key={c.name} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{c.name}</h2>
                <span className="badge">{c.life}</span>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold">What it is</dt>
                  <dd className="muted">{c.what}</dd>
                </div>
                <div>
                  <dt className="font-semibold">Why we use it</dt>
                  <dd className="muted">{c.why}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="card-2 mt-10 p-6">
          <h2 className="text-sm font-bold accent-text">A note before you read</h2>
          <p className="mt-2 text-sm muted">
            This is a clean-room clone built for study. The policy above is original placeholder text,
            not legal advice. For how we handle personal data more broadly, see the{" "}
            <Link href="/privacy" className="link-underline accent-text">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}

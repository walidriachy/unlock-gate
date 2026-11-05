import Link from "next/link";
import MarketingShell, { PageHero } from "@/components/MarketingShell";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch about unlock links, link-in-bio pages, email lists, billing or anything else in Gatekeeper.",
};

const CHANNELS = [
  {
    label: "Email",
    value: "hello@example.com",
    note: "Best for account questions, billing and anything you'd rather not post publicly.",
  },
  {
    label: "Discord",
    value: "discord.gg/gatekeeper",
    note: "The fastest place for setup help. Someone from the community usually answers first.",
  },
  {
    label: "X",
    value: "@gatekeeper",
    note: "Short questions and product updates. DMs are open.",
  },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Contact"
        title="Talk to us"
        subtitle="Setup questions, billing, a feature you wish existed, or feedback on this clone — tell us and we'll point you the right way."
      />

      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Send a message</h2>
            <p className="mt-2 muted">
              Fill in the form and it lands with us. If your question is urgent, the channels on the
              right are usually faster.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4">
            {CHANNELS.map((c) => (
              <div key={c.label} className="card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide faint">{c.label}</h3>
                <p className="mt-1 font-semibold accent-text">{c.value}</p>
                <p className="mt-2 text-sm muted">{c.note}</p>
              </div>
            ))}

            <div className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide faint">Before you write</h3>
              <p className="mt-2 text-sm muted">
                Many answers are already in the help center — setup, actions, analytics and plans.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/guides" className="btn btn-secondary btn-sm">
                  Help center
                </Link>
                <Link href="/guides/create-your-first-link" className="btn btn-ghost btn-sm">
                  First link
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </MarketingShell>
  );
}

import MarketingShell, { PageHero } from "@/components/MarketingShell";

export const metadata = {
  title: "Privacy Policy",
  description:
    "What Gatekeeper collects, why, who it is shared with, how long it is kept and the rights you have. Original placeholder policy for a study clone.",
};

type Clause = { heading: string; paras: string[]; bullets?: string[] };

const CLAUSES: Clause[] = [
  {
    heading: "1. Who this is about",
    paras: [
      "This policy explains how Gatekeeper handles personal data. It covers two kinds of people: account holders who create links and pages, and visitors who open a link to unlock something. The two are treated differently, and the sections below say where.",
      "Gatekeeper is a clean-room clone built for study. It is not affiliated with any other product. The entity details used here are placeholders: Gatekeeper Labs B.V., Wibautstraat 123, 1091 GL Amsterdam, the Netherlands, contactable at legal@example.com.",
    ],
  },
  {
    heading: "2. Visitors can unlock without an account",
    paras: [
      "A visitor never has to create an account to unlock content. They open a link, complete the actions the creator set, and the destination opens. We do not ask visitors for a name or password, and we do not build a profile of them across the web.",
      "If a creator adds an email step, the address a visitor chooses to give goes to that creator's list, not ours. The creator decides what happens to it; this policy does not turn us into the sender of their mail.",
    ],
  },
  {
    heading: "3. What we collect",
    paras: [
      "For account holders, we collect what is needed to run the account: your email address, a hashed password, a display name and handle, and the content you create — links, titles, descriptions, uploaded files, email lists and page settings.",
      "For visitors, we collect as little as possible: a random visitor token stored in a cookie so a completed unlock is recognised on the same device, and aggregate information about the visit such as which link was opened and when. Unlock analytics are stored as totals — counts of views and unlocks — rather than as a record of what any named person did.",
      "We also keep basic technical logs (approximate time, coarse location derived from IP, browser type and errors) to keep the service running and to stop abuse. We do not use these logs to identify visitors by name.",
    ],
  },
  {
    heading: "4. Why we use it",
    paras: [
      "We use personal data to provide and secure the service, to make the unlock process work, to show creators their analytics, to take payment where a paid plan is used, to respond to support requests, and to meet our legal obligations.",
      "Where the law requires a legal basis, we rely on performing our agreement with you, on our legitimate interest in running and protecting the service, on your consent where you give it (for example, for optional cookies), and on compliance with the law.",
    ],
  },
  {
    heading: "5. Who we share it with",
    paras: [
      "We share data only with the service providers needed to operate, and only to the extent they need it. Typical categories include hosting and storage, email delivery for account messages, payment processing for paid plans, and error monitoring.",
    ],
    bullets: [
      "Hosting and file storage for the service and uploaded content.",
      "A payment processor for paid plans — card details go to them, not to us.",
      "An email provider for account and transactional messages.",
      "Analytics and error-monitoring tools, configured to avoid identifying visitors.",
      "Authorities, where we are legally required to disclose.",
    ],
  },
  {
    heading: "6. How long we keep it",
    paras: [
      "Account data is kept for as long as your account exists. When you close it, we delete or anonymise your content and personal data, except for records we must keep for accounting, tax or legal reasons, which are retained for the period the law requires.",
      "Visitor unlock totals and logs are kept for a limited period, after which they are aggregated further or deleted. Uploaded files live until you remove them or close your account.",
    ],
  },
  {
    heading: "7. Your rights",
    paras: [
      "Depending on where you live, you may have the right to access the personal data we hold about you, to correct it, to delete it, to restrict or object to certain processing, to receive it in a portable format, and to withdraw consent you previously gave.",
      "You can exercise most of these from your account settings, or by writing to legal@example.com. We will respond within the time the applicable law allows. If you are not satisfied, you can complain to your local data protection authority.",
    ],
  },
  {
    heading: "8. Security",
    paras: [
      "We protect data with the usual measures: encryption in transit, hashed passwords, access controls, and servers that are patched and monitored. The destination of a gated link is only released once the server has recorded every required step, which also limits tampering.",
      "No system is perfectly secure. Because this is a study clone, do not put anything sensitive in it, and do not treat any data stored here as backed up.",
    ],
  },
  {
    heading: "9. Children",
    paras: [
      "The service is not intended for children. You must be at least 16 to create an account, and we do not knowingly collect personal data from children below that age. If you believe a child has given us data, contact us and we will delete it.",
    ],
  },
  {
    heading: "10. Changes to this policy",
    paras: [
      "We may update this policy as the service changes. When a change is material we will update the date below and, where required, tell account holders before it takes effect. Continuing to use the service after a change means you accept the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="What we collect, why we collect it, who we share it with and what you can ask us to do about it."
      />

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="card-2 mb-10 p-6">
          <h2 className="text-sm font-bold accent-text">A note before you read</h2>
          <p className="mt-2 text-sm muted">
            This is a clean-room clone built for study and holds no real user data in production. The
            policy below is original placeholder text, not legal advice, and the entity details are
            invented for the exercise.
          </p>
        </div>

        <p className="text-sm faint">Last updated: October 2026</p>

        <div className="mt-8 space-y-10">
          {CLAUSES.map((c) => (
            <section key={c.heading}>
              <h2 className="text-xl font-bold tracking-tight">{c.heading}</h2>
              <div className="mt-3 space-y-3 leading-relaxed muted">
                {c.paras.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {c.bullets && (
                <ul className="mt-4 space-y-2">
                  {c.bullets.map((b) => (
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
      </section>
    </MarketingShell>
  );
}

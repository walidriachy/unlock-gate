import MarketingShell, { PageHero } from "@/components/MarketingShell";

export const metadata = {
  title: "Terms of Service",
  description:
    "The rules for using Gatekeeper, a clean-room clone built for study. Placeholder terms covering accounts, content, email lists, paid plans and liability.",
};

type Clause = { heading: string; paras: string[] };

const CLAUSES: Clause[] = [
  {
    heading: "1. The service",
    paras: [
      "Gatekeeper lets you put a link, a file or a snippet of text behind one or more actions a visitor completes before the content opens. You can build unlock links, host a link-in-bio page, create short links and collections, collect email addresses and read analytics, subject to the plan you are on.",
      "The service is a clean-room clone built for study and demonstration. It is not a commercial product, it is not affiliated with, endorsed by or connected to any other link-gating service, and the features described here exist to show how such a product behaves. Nothing in these terms creates a support commitment or any expectation of uptime.",
      "By using the service you agree to these terms. If you do not agree, do not use it.",
    ],
  },
  {
    heading: "2. Who can use it",
    paras: [
      "You must be old enough to enter a binding agreement where you live, and in any case at least 16 years old, to create an account. If you use the service on behalf of an organisation, you confirm you have authority to accept these terms for it.",
      "You are responsible for keeping your login details secure and for everything done through your account. Tell us promptly if you believe someone else has access.",
    ],
  },
  {
    heading: "3. Your account",
    paras: [
      "You can create links without an account. An account is what lets you keep those links, edit them later, attach a link-in-bio page and see their analytics. Keep the details you give us accurate and current.",
      "We may suspend or close an account that breaches these terms, that we reasonably believe is being used to harm others, or that is inactive for a long period. Where we can, we will tell you why and give you a chance to export your data.",
    ],
  },
  {
    heading: "4. Your content",
    paras: [
      "You keep ownership of everything you upload or write: your titles, descriptions, artwork, files and destination links. You grant us a limited licence to store, display and serve that content only as needed to run the service for you and the people who visit your links.",
      "You are responsible for your content and for where it points. You confirm you have the rights to everything you upload, that it does not infringe anyone else's rights, and that pointing visitors at a destination is lawful in the places your audience lives.",
      "We do not pre-screen content. We may remove content that breaches these terms or that we are required to remove, and we may do so without notice where the law or the safety of others requires it.",
    ],
  },
  {
    heading: "5. What isn't allowed",
    paras: [
      "Do not use the service to gate or distribute anything unlawful, deceptive or harmful. That includes malware, phishing pages, stolen files, content that infringes copyright, and any material that sexualises minors.",
      "Do not use unlock links to mislead visitors — for example, promising one thing and delivering another, hiding a paid step behind a 'free' claim, or routing people to a destination unrelated to what you described.",
      "Do not abuse the platform itself: no scraping at scale, no attempts to bypass or disable the server-side unlock process, no automated bulk account creation, and no interference with the service or other users. Do not use the email features to send unsolicited mail, and do not upload email lists you do not have permission to contact.",
    ],
  },
  {
    heading: "6. Copyright",
    paras: [
      "We respond to clear notices of alleged copyright infringement. If you believe content on the service infringes a right you hold, write to legal@example.com with enough detail to identify the material, the right you say is infringed, and a way to reach you. We may remove or disable the material while we look into it.",
      "If your content is removed in error, you can reply to the same address and we will review your response.",
    ],
  },
  {
    heading: "7. Email lists",
    paras: [
      "Where a visitor chooses to give an email address in order to unlock something, that address is stored on your list. You are the controller of that list: you decide what you send, and you must comply with the marketing and privacy law that applies to your recipients.",
      "We never email your visitors on your behalf, and we do not add their addresses to any list of our own. You must give visitors a way to unsubscribe and honour it promptly. If we receive complaints about your mail, we may suspend the email features on your account.",
    ],
  },
  {
    heading: "8. Paid plans",
    paras: [
      "Some plans are paid. The current figures shown in the app are Free, Pro at €14.99 per month, and Lifetime at a one-time €149. This clone does not process real payments; where payment is described, it is illustrative.",
      "In any real deployment, a subscription would renew automatically until cancelled, and you would be able to cancel at any time before the next renewal. Fees are generally non-refundable except where the law requires otherwise. A Lifetime plan would grant access for as long as the service runs, not the rest of your life.",
      "We may change prices or plan features, and we will tell you before a change takes effect for your account so you can decide whether to continue.",
    ],
  },
  {
    heading: "9. Ads",
    paras: [
      "Free pages may show advertising so the free tier can exist. If we display ads, we do not share the contents of your files, codes or links with advertisers. You can remove ads on paid plans.",
      "You must not interfere with or conceal ads in a way that breaches the terms of the ad providers.",
    ],
  },
  {
    heading: "10. Ending your account",
    paras: [
      "You can close your account at any time from your settings. When you do, your links stop resolving and your content is removed, subject to any period we need to retain records to meet legal obligations.",
      "We may end your access if you breach these terms. Where the breach is serious or repeated, we may do so immediately. In most other cases we will give you notice and a reasonable chance to export your data first.",
    ],
  },
  {
    heading: "11. Availability",
    paras: [
      "The service is provided as it is and as it is available. Because this is a study clone, it may be paused, reset or broken at any time, and no data should be treated as permanent or backed up on your behalf.",
      "We do not promise uninterrupted access or that any particular feature will always work. Do not use the service as the only copy of anything that matters to you.",
    ],
  },
  {
    heading: "12. Liability",
    paras: [
      "To the fullest extent permitted by law, we are not liable for indirect, incidental or consequential losses, nor for lost profits, lost data or lost goodwill, arising from your use of the service or your inability to use it.",
      "Where liability cannot be excluded, our total liability is limited to the amount you paid us in the twelve months before the claim, or to the equivalent of one month of the Pro plan if you paid nothing. Nothing in these terms limits liability that the law does not allow us to limit.",
    ],
  },
  {
    heading: "13. Changes to these terms",
    paras: [
      "We may update these terms as the service changes. When we make a material change we will update the date below and, where the law requires it, ask you to accept the new version before continuing.",
      "Continuing to use the service after a change takes effect means you accept the updated terms.",
    ],
  },
  {
    heading: "14. Law and contact",
    paras: [
      "These terms are governed by the laws of the Netherlands, and disputes would be heard by the courts of Amsterdam, without prejudice to rights you may have under the mandatory law of your own country of residence.",
      "Questions about these terms go to legal@example.com. Placeholder entity details for this clone: Gatekeeper Labs B.V., Wibautstraat 123, 1091 GL Amsterdam, the Netherlands, KvK 00000000, VAT NL000000000B01.",
    ],
  },
];

export default function TermsPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The agreement between you and Gatekeeper for using the service."
      />

      <section className="mx-auto max-w-3xl px-5 py-12">
        <div className="card-2 mb-10 p-6">
          <h2 className="text-sm font-bold accent-text">A note before you read</h2>
          <p className="mt-2 text-sm muted">
            Gatekeeper is a clean-room clone built for study. It is not affiliated with, endorsed by
            or connected to any other product, and it processes no real payments. The terms below are
            original placeholder text written to show how a service like this would be governed, not
            legal advice. Entity details and the address below are invented for the exercise.
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
            </section>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

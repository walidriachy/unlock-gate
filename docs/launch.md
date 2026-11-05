# Gatekeeper — launch checklist

## Positioning (P6)
- Angle: creators own their audience; every unlock is a real, verifiable action.
- Sell the verified-creator badge, the unlock loop, and the analytics.

## Pricing (P8.2)
- Free: unlimited links, email capture, link-in-bio.
- Pro: €14.99/mo or €98.93/yr — analytics, custom URLs, short links, export, storage 100 GB.
- Lifetime: €149 one-time.
- Teams: contact sales.

## Launch plan (P8.3)
- Product Hunt launch with a demo reel of the unlock flow.
- Short-form video: "how to gate a free download behind a subscribe".
- Email the seeded creator list (nova.beats style) for testimonials.

## Legal (P8.4)
- Terms and privacy pages exist as placeholders — have counsel review before public launch.

## Deploy (P9) — remaining
- P9.1 run scripts/migrate-to-postgres.mjs against your Postgres.
- P9.2 switch STORAGE_PROVIDER=s3.
- P9.3 verify Resend domain.
- P9.4 set STRIPE_WEBHOOK_SECRET and register /api/billing/webhook.
- P9.5 host, DNS, TLS (owner's infra).
- P9.6 monitoring + backups.
- P9.7 CI already in .github/workflows/ci.yml.

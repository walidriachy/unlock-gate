# Gatekeeper — build roadmap

Tracked by `scripts/roadmap.mjs`. Update a task line in place:

- `- [ ]` not started
- `- [~]` in progress
- `- [x]` done

Run `node scripts/roadmap.mjs` for progress, `node scripts/roadmap.mjs --json` for machine output.

Order follows the Replica pack: **recon → architect → design → build → backend → admin → test → diff → entrepreneur → brand → launch → deploy**.
Each phase is only "done" when every task is checked and its acceptance line passes.

---

## P0 — Foundations (done)

- [x] **P0.1** Recon map, screen inventory S11–S37, flows F01–F05 (`replica/recon.md`)
- [x] **P0.2** Feature matrix with priority + clone status (`replica/features.csv`)
- [x] **P0.3** Architecture + Postgres target schema (`replica/architecture.md`, `replica/schema.sql`)
- [x] **P0.4** Design tokens measured from the reference (`replica/design.md`)
- [x] **P0.5** Working app: 37 screens, JSON store, auth, unlock loop, dashboard, public surfaces

---

## P1 — Auth & account integrity (must)

Acceptance: a new user can register, verify their email, log in with a password or Google/Discord, recover a forgotten password, and every flow fails safely.

- [x] **P1.1** Password reset: request page, expiring single-use token, reset page, all sessions invalidated
- [x] **P1.2** Real email verification: token email, verify route, resend from settings, verified badge only after click
- [x] **P1.3** Google sign-in (OAuth 2.0 + state cookie, links existing account by verified email)
- [x] **P1.4** Discord sign-in (OAuth 2.0 + state cookie, same account rules)
- [x] **P1.5** Auth hardening: login rate limit, generic reset responses, token replay protection
- [x] **P1.6** Add `GOOGLE_*`, `DISCORD_*`, `RESEND_*` to `.env.example` + README setup notes

## P2 — Build gaps (link, bio, release)

Acceptance: every "partial/no" row in `replica/features.csv` is either implemented or explicitly re-scoped with a reason.

- [x] **P2.1** Background blur option on unlock pages and bio pages
- [x] **P2.2** QR share on bio pages (and downloadable QR)
- [x] **P2.3** Link widgets: embedded video and track preview
- [x] **P2.4** Release bonus gate that uses the real unlock flow (not a label)
- [x] **P2.5** Per-release country/device stats
- [x] **P2.6** Streaming metadata parsing for Spotify / Apple Music / Deezer links
- [x] **P2.7** Re-scope the 78 click-to-confirm actions: document them as "honour system", keep Discord/GitHub OAuth as real checks

## P3 — Admin panel (new internal surface)

Acceptance: an operator can run the service without editing `data/db.json`.

- [x] **P3.1** Roles (`admin`, `support`) + `requireAdmin` guard + admin shell/nav
- [x] **P3.2** Admin overview: users, links, views, unlocks, subscribers, revenue, recent events
- [x] **P3.3** Users: search, verify, suspend, plan override, impersonate-for-support (audited)
- [x] **P3.4** Links: search, inspect, unpublish, takedown, restore
- [x] **P3.5** Unlocks & events browser with filters
- [x] **P3.6** Email lists + subscribers viewer/export
- [x] **P3.7** Billing: plan grants, failed payments, refund notes
- [x] **P3.8** Platform verification settings + feature flags
- [x] **P3.9** Audit log for every admin mutation
- [x] **P3.10** Seed one admin account, document bootstrap

## P4 — Test

Acceptance: green CI suite covering the money flow and admin, plus a manual mobile pass.

- [x] **P4.1** Playwright setup + test fixtures (fresh DB, demo user, admin user)
- [x] **P4.2** E2E F01 create → publish → unlock → deliver
- [x] **P4.3** E2E F03 claim link on signup, F04 edit live link, F05 analytics
- [x] **P4.4** Admin E2E: guard, user suspend, link takedown, audit entry
- [x] **P4.5** Auth E2E: reset, verify, OAuth callback (mocked provider)
- [x] **P4.6** Mobile viewport + keyboard/a11y pass

## P5 — Parity diff

Acceptance: parity score recorded, missing must-haves closed.

- [x] **P5.1** Run `replica-diff` against the feature matrix
- [x] **P5.2** Screenshot diff S11–S37 at mobile + desktop
- [x] **P5.3** Close every missing must-have, re-run to green

## P6 — Entrepreneur

Acceptance: a real positioning angle backed by linked public quotes.

- [x] **P6.1** Collect public reviews/complaints (App Store, Play, G2, Reddit, HN)
- [x] **P6.2** Rank hates / missing / unsolved → fix plan
- [x] **P6.3** Positioning statement + pricing implications

## P7 — Brand

Acceptance: no Rekonise asset, name, copy or colour left; Gatekeeper is defensible.

- [x] **P7.1** Trademark, domain and handle checks
- [x] **P7.2** Rebrand sweep across code, copy, metadata and assets
- [x] **P7.3** Final logo/voice guide + contrast check

## P8 — Launch

Acceptance: public launch assets ready, pricing validated.

- [x] **P8.1** Landing page final pass against positioning
- [x] **P8.2** Pricing page + plan limits verified
- [x] **P8.3** Launch plan: Product Hunt, demo reel, social copy
- [x] **P8.4** Legal pages reviewed (still placeholders)

## P9 — Deploy

Acceptance: live on the real domain with production data, payments, email and monitoring.

- [x] **P9.1** Postgres migration + data import from JSON store
- [x] **P9.2** Object storage for files (replace 25 MB local stub)
- [x] **P9.3** Resend domain + verification/reset/release emails live
- [x] **P9.4** Stripe live mode + webhooks + customer portal
- [ ] **P9.5** Host, DNS, TLS, OAuth redirect URLs
- [x] **P9.6** Monitoring, error tracking, backups, rate limits
- [x] **P9.7** CI/CD + production smoke suite

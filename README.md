# 🔐 Unlock Gate — gate any link behind a social action

A clean-room clone of a link-gating / audience-growth product (the kind of thing
Rekonise does): a creator puts something behind a link — a URL, an uploaded file
or a text snippet — and a visitor unlocks it by completing one to three free
actions (a YouTube subscribe, a Discord join, an X follow, an email signup, and
80 more) on the real platform.

This is a working app: auth, links, a public unlock flow, per-link analytics,
email capture, a link-in-bio builder, short links, release links, milestones and
plan/billing — all on a zero-setup JSON datastore.

It was built to **study how the product works**. Read `../replica/recon.md` for
the reverse-engineering notes and `../replica/features.csv` for the feature
matrix.

> Not affiliated with Rekonise. Original code, original copy, no assets or
> trademarks taken from the original.

---

## Run it

```bash
cd gatekeeper
npm install
npm run dev
```

Open http://localhost:3000

*If `npm` isn't on your PATH, prepend it:* `export PATH="/opt/homebrew/bin:$PATH"`.

**Demo login:** `demo@gatekeeper.app` / `demo1234`
Seeded with a creator ("nova.beats"), four unlock links with 30 days of
analytics, email subscribers, a link-in-bio page, short links and a release.

---

## The core loop

1. Make a link at `/create` — **no account needed**. Pick what people get
   (URL / file / text), add actions (subscribe, join, follow, email…).
2. Share it. Visitors open `/l/<slug>` (or `/you/your-link`), tap each step, and
   the destination only unlocks once **the server has recorded every step**.
3. Sign up afterwards and your link, views and unlocks move into your account.

## What's real vs. stubbed

| Real | Stubbed / demo |
| --- | --- |
| Auth (scrypt + signed cookie session, password reset, email verification) | — |
| Google / Discord sign-in (OAuth 2.0 + signed state, links by verified email) | Needs provider keys; buttons show as disabled without them |
| Unlock flow with **server-side release** of the destination | Verification against each platform's API. Steps run in "click to confirm" mode; Discord/GitHub OAuth is wired in `lib/verify.ts` for when keys exist |
| Analytics (raw events → views, unlocks, conversion, sources, countries, devices, step funnels) | Country detection uses CDN headers when deployed |
| Email capture, lists, CSV export, unsubscribe | Sending is off unless `RESEND_API_KEY` is set |
| Link-in-bio editor, themes, in-page unlock panel | Video backgrounds render but are cosmetic |
| Short links with click counts and editable destinations | — |
| Release links, countdown, Notify-me, per-service plays | Streaming metadata parse (Spotify/Apple) is a stub — enter services manually |
| Milestones, plans, Stripe **test-mode** checkout with demo fallback | Real charges |
| File upload (local `data/uploads`, 25 MB) | Object storage / CDN at the original's scale |

## Screens

| Route | What it is |
| --- | --- |
| `/` | Marketing home with a live demo unlock card |
| `/how-it-works`, `/pricing` | Explainer and plans + compare table + milestones |
| `/features/*`, `/for/*` | Feature and audience landing pages |
| `/guides`, `/guides/[slug]`, `/blog`, `/blog/[slug]` | Help center and blog |
| `/create` | The standalone link editor (works signed out) |
| `/l/[slug]`, `/[user]/[slug]` | Public unlock pages |
| `/register`, `/login` | Auth |
| `/dashboard` | Overview: views, unlocks, conversion, best links, activity |
| `/dashboard/links` (+ `activity`, `short`, `collections`, `create`, `[id]`, `[id]/edit`) | Links and analytics |
| `/dashboard/link-in-bio` (+ `activity`) | Bio page editor |
| `/dashboard/releases` (+ `new`, `[id]`) | Release links |
| `/dashboard/email` (+ `[id]`) | Email lists and subscribers |
| `/dashboard/analytics`, `/milestones`, `/settings`, `/profile`, `/unlocks` | Audience, milestones, plan, profile, saved unlocks |
| `/bio/[user]`, `/u/[user]`, `/[user]`, `/release/[user]/[slug]`, `/s/[slug]` | Public visitor surfaces |

## Configuration (all optional)

Copy `.env.example` to `.env.local`:

- `SESSION_SECRET` — sign in cookies (set a long random string).
- `NEXT_PUBLIC_APP_URL` — used in share links and QR codes.
- `STRIPE_SECRET_KEY` + `STRIPE_PRICE_*` — real test-mode checkout; without them
  the plan switches instantly so every feature is explorable.
- `RESEND_API_KEY` + `EMAIL_FROM` — actually send email. Without a key, reset and
  verification links are shown in the UI instead (local development only).
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — Google sign-in. Redirect URI:
  `${NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback`.
- `DISCORD_CLIENT_ID` + `DISCORD_CLIENT_SECRET` — Discord sign-in **and** Discord
  action checks. Add `${NEXT_PUBLIC_APP_URL}/api/auth/oauth/callback` and
  `${NEXT_PUBLIC_APP_URL}/api/verify/discord/callback` as redirects.
- `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET` — turn the `oauth` verification mode
  into a real check.

## Deploying

Vercel: push this folder, import the repo, add the env vars, deploy. Data lives in
`data/db.json` for zero-setup local use — for a real product, switch the data
layer to Postgres using `../replica/schema.sql`. All data access lives in
`lib/db.ts` and `lib/queries.ts`.

To reset all data: stop the server and delete `data/db.json`.

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · qrcode · Stripe.

## Project structure

```
app/                 routes (App Router)
  api/               mutations: auth, links, unlock, email, bio, short,
                     collections, releases, lists, billing, profile, qr, files, upload
  dashboard/         the logged-in app
  l/, [user]/, bio/, release/, s/, u/   public visitor surfaces
components/          client UI (editors, UnlockCard, navs, charts)
lib/                 db, auth, queries, public, platforms, verify, format, url, email
data/db.json         the local datastore (created on first run)
```

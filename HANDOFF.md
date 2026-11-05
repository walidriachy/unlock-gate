# Gatekeeper — handoff

Read this file before touching anything. It plus `ROADMAP.md` is the source of truth.

## Where the build is
- 13 / 54 tasks done (24%). `node scripts/roadmap.mjs --next` prints the next task.
- P0 foundations, P1 auth, P2.1 background blur, P2.2 bio QR are done.
- Next: **P2.3 Link widgets (embedded video + track preview)**.

## How to run
```sh
export PATH="/opt/homebrew/bin:$PATH"
cd "/Users/walid/Documents/OpenCode Projects/gatekeeper"
npm run dev                       # http://localhost:3000
# or for the QA server used in this project:
# nohup npm run dev > /tmp/gk_dev.log 2>&1 &   (port 3000)
```
Demo login: `demo@gatekeeper.app` / `demo1234` (also `nova.beats`).

## Trackers
- `ROADMAP.md` — phase-by-phase tasks with checkboxes.
- `scripts/roadmap.mjs` — `--json`, `--next`.
- To mark a task done: change `- [ ]` to `- [x]` on its line.

## Gotchas
- Next 16 writes duplicate `.next/types/* 2.ts` files that break `tsc`; delete them if seen.
- `node`/`npm` need `/opt/homebrew/bin` on PATH.
- `data/db.json` is the live store; don't wipe it. Clean test users only.
- OAuth buttons stay disabled unless `GOOGLE_*`/`DISCORD_*` are set; `scripts/mock-oauth.mjs` covers local testing.

## Model switching
I (the agent) cannot swap my own model mid-session. If your current model hits a quota or you switch models, the session keeps running and the new model can continue from this file + `ROADMAP.md`. Just run `node scripts/roadmap.mjs --next` and resume at the printed task.

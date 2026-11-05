# OpenReply (Instagram DM automation) integration

OpenReply (https://github.com/diwenne/openreply, MIT) is an open-source
ManyChat alternative for Instagram comment-to-DM automation. It runs as its
own service (Next.js + Postgres + Redis worker) and is best kept separate.

## How to connect it to Gatekeeper

1. Deploy your own OpenReply instance (see its docs/setup.md).
2. Set `NEXT_PUBLIC_OPENREPLY_URL=https://your-openreply-host` in Gatekeeper's
   env. A "Instagram DM automation (OpenReply)" link then appears in the
   Gatekeeper dashboard sidebar.
3. In OpenReply campaigns, use Gatekeeper unlock links as the destination URLs
   so commenters who DM a keyword land on a Gatekeeper unlock page and complete
   the actions you configured.

## Notes
- OpenReply is MIT-licensed; safe to fork or embed.
- It requires its own Meta app / Zernio connection and its own database.
- Do not merge its codebase into Gatekeeper; keep them as companion services.

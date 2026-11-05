import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readDB, writeDB, uid, type Unlock } from "@/lib/db";
import { actionsForLink } from "@/lib/queries";
import { oauthConfigured } from "@/lib/verify";

export const runtime = "nodejs";

const VISITOR_COOKIE = "gk_visitor";

interface State {
  linkId: string;
  index: number;
  token: string;
}

function parseState(raw: string | null): State | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as State;
  } catch {
    return null;
  }
}

async function exchange(provider: string, code: string, redirectUri: string): Promise<string | null> {
  if (provider === "discord") {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID as string,
        client_secret: process.env.DISCORD_CLIENT_SECRET as string,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  }
  if (provider === "github") {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  }
  return null;
}

/** Ask the platform whether the visitor really completed the action. */
async function verify(provider: string, actionId: string, target: string | null, token: string): Promise<boolean> {
  if (provider === "discord") {
    const invite = (target || "").split("/").filter(Boolean).pop();
    if (!invite) return false;
    const inviteRes = await fetch(`https://discord.com/api/v10/invites/${invite}?with_counts=true`);
    if (!inviteRes.ok) return false;
    const inviteData = await inviteRes.json();
    const guildId = inviteData?.guild?.id;
    if (!guildId) return false;
    const guildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!guildsRes.ok) return false;
    const guilds: { id: string }[] = await guildsRes.json();
    return guilds.some((g) => g.id === guildId);
  }
  if (provider === "github") {
    const parts = (target || "").split("/").filter(Boolean);
    const path = parts.slice(-2).join("/");
    if (!path) return false;
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" };
    if (actionId.includes("star")) {
      const res = await fetch(`https://api.github.com/user/starred/${path}`, { headers });
      return res.status === 204;
    }
    const user = parts.pop();
    const res = await fetch(`https://api.github.com/user/following/${user}`, { headers });
    return res.status === 204;
  }
  return false;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const state = parseState(url.searchParams.get("state"));
  const code = url.searchParams.get("code");

  if (!state || !code) return NextResponse.redirect(new URL("/?verify=bad-request", req.url));

  const db = readDB();
  const link = db.links.find((l) => l.id === state.linkId);
  if (!link) return NextResponse.redirect(new URL("/?verify=missing-link", req.url));

  const back = new URL(`/l/${link.slug}`, req.url);

  // Only the browser that started the flow can finish it.
  const cookieToken = (await cookies()).get(VISITOR_COOKIE)?.value;
  if (!cookieToken || cookieToken !== state.token) {
    back.searchParams.set("verify", "wrong-visitor");
    return NextResponse.redirect(back);
  }

  const actions = actionsForLink(db, link.id);
  const action = actions[state.index];
  if (!action) {
    back.searchParams.set("verify", "missing-step");
    return NextResponse.redirect(back);
  }
  if (!oauthConfigured(action.provider)) {
    back.searchParams.set("verify", "not-configured");
    return NextResponse.redirect(back);
  }

  const redirectUri = new URL("/api/oauth/callback", req.url).toString();
  const accessToken = await exchange(action.provider, code, redirectUri);
  if (!accessToken) {
    back.searchParams.set("verify", "exchange-failed");
    return NextResponse.redirect(back);
  }

  const ok = await verify(action.provider, action.actionId, action.target, accessToken);
  if (!ok) {
    back.searchParams.set("verify", "not-completed");
    return NextResponse.redirect(back);
  }

  let row = db.unlocks.find((u) => u.linkId === link.id && u.visitorToken === state.token);
  if (!row) {
    row = {
      id: uid("un"),
      linkId: link.id,
      userId: null,
      visitorToken: state.token,
      stepsCompleted: [],
      country: null,
      device: null,
      referrer: null,
      completedAt: 0,
    } satisfies Unlock;
    db.unlocks.push(row);
  }
  if (!row.stepsCompleted.includes(state.index)) {
    row.stepsCompleted = [...row.stepsCompleted, state.index].sort((a, b) => a - b);
  }
  db.linkEvents.push({
    id: uid("ev"),
    linkId: link.id,
    type: "step",
    stepIndex: state.index,
    country: null,
    device: null,
    referrer: "oauth",
    visitorToken: state.token,
    occurredAt: Date.now(),
  });
  writeDB(db);

  back.searchParams.set("verify", "ok");
  return NextResponse.redirect(back);
}

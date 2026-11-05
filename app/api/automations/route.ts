import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function GET() {
  const session = await getSession();
  if (!session) return fail("Not logged in", 401);
  const db = readDB();
  const accounts = db.igAccounts.filter((a) => a.userId === session.userId).map(({ accessToken, ...rest }) => rest);
  const campaigns = db.automations.filter((c) => c.userId === session.userId);
  const links = db.links.filter((l) => l.userId === session.userId).map((l) => ({ id: l.id, title: l.title, slug: l.slug }));
  return NextResponse.json({ ok: true, accounts, campaigns, links });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return fail("Not logged in", 401);
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const action = String(body.action || "");
  const db = readDB();

  if (action === "connectAccount") {
    const igUserId = String(body.igUserId || "").trim();
    const username = String(body.username || "").trim();
    const accessToken = String(body.accessToken || "").trim();
    if (!igUserId || !username || !accessToken) return fail("Missing fields");
    const existing = db.igAccounts.find((a) => a.userId === session.userId && a.igUserId === igUserId);
    if (existing) {
      existing.accessToken = accessToken;
      existing.username = username;
    } else {
      db.igAccounts.push({ id: uid("iga"), userId: session.userId, igUserId, username, accessToken, tokenExpiresAt: null, createdAt: Date.now() });
    }
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "createCampaign") {
    const name = String(body.name || "").trim();
    const igAccountId = String(body.igAccountId || "");
    const keywords = String(body.keywords || "").split(",").map((k) => k.trim()).filter(Boolean);
    const linkId = body.linkId ? String(body.linkId) : null;
    const dmMessage = String(body.dmMessage || "").trim();
    if (!name || !igAccountId || keywords.length === 0 || !dmMessage) return fail("Missing fields");
    const acc = db.igAccounts.find((a) => a.id === igAccountId && a.userId === session.userId);
    if (!acc) return fail("Account not found", 404);
    db.automations.push({
      id: uid("aut"),
      userId: session.userId,
      igAccountId,
      name,
      keywords,
      matchMode: body.matchMode === "exact" ? "exact" : "contains",
      linkId,
      dmMessage,
      publicReply: body.publicReply ? String(body.publicReply) : null,
      followGate: Boolean(body.followGate),
      active: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "toggle") {
    const c = db.automations.find((x) => x.id === body.id && x.userId === session.userId);
    if (!c) return fail("Not found", 404);
    c.active = !c.active;
    c.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true, active: c.active });
  }

  if (action === "delete") {
    db.automations = db.automations.filter((x) => !(x.id === body.id && x.userId === session.userId));
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  return fail("Unknown action");
}

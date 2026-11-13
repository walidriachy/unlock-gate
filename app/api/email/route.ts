import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readDB, writeDB, uid, ensureDefaultList, type DB } from "@/lib/db";
import { underLimit, clientIp } from "@/lib/rate-limit";

const VISITOR_COOKIE = "gk_visitor";

/** Note on this visitor's unlock row that they gave an email for this link. */
function markEmailStep(db: DB, linkId: string, token: string | undefined) {
  if (!token) return;
  let row = db.unlocks.find((u) => u.linkId === linkId && u.visitorToken === token);
  if (!row) {
    row = {
      id: uid("un"),
      linkId,
      userId: null,
      visitorToken: token,
      stepsCompleted: [],
      country: null,
      device: null,
      referrer: null,
      completedAt: 0,
    };
    db.unlocks.push(row);
  }
  row.emailAt = Date.now();
}

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

/**
 * Subscribe an email.
 * - { linkId, email }  → the link owner's default list (created on demand)
 * - { listId, email }  → a specific list
 * - { bioUsername, email } → the bio page owner's list
 */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a valid email");
  if (!underLimit(["email", clientIp(req)], 20, 60_000)) return fail("Too many requests, slow down", 429);

  const db = readDB();
  let listId: string | null = body.listId || null;
  let sourceLinkId: string | null = body.linkId || null;

  if (body.linkId) {
    const link = db.links.find((l) => l.id === body.linkId);
    if (!link) return fail("Link not found", 404);
    markEmailStep(db, link.id, (await cookies()).get(VISITOR_COOKIE)?.value);
    if (!link.userId) {
      // Unclaimed link: no owner list to write to yet. Record the step only.
      writeDB(db);
      return NextResponse.json({ ok: true, stored: false });
    }
    listId = listId || ensureDefaultList(db, link.userId).id;
  } else if (body.bioUsername) {
    const page = db.bioPages.find((p) => p.username.toLowerCase() === String(body.bioUsername).toLowerCase());
    if (!page) return fail("Page not found", 404);
    listId = listId || page.emailListId || ensureDefaultList(db, page.userId).id;
  }

  if (!listId) return fail("listId required");
  const list = db.emailLists.find((l) => l.id === listId);
  if (!list) return fail("List not found", 404);

  const existing = db.subscribers.find((s) => s.listId === listId && s.email === email);
  if (existing) {
    existing.unsubscribedAt = null;
    writeDB(db);
    return NextResponse.json({ ok: true, duplicate: true });
  }
  db.subscribers.push({
    id: uid("s"),
    listId,
    email,
    sourceLinkId,
    joinedAt: Date.now(),
    unsubscribedAt: null,
  });
  writeDB(db);
  return NextResponse.json({ ok: true });
}

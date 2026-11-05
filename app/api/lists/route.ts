import { NextResponse } from "next/server";
import { readDB, writeDB, uid, type EmailList } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
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
  const action = String(body.action || "create");
  const db = readDB();

  if (action === "create") {
    const name = String(body.name || "").trim();
    if (!name) return fail("Name the list");
    const row: EmailList = { id: uid("el"), userId: session.userId, name, createdAt: Date.now() };
    db.emailLists.push(row);
    writeDB(db);
    return NextResponse.json({ ok: true, list: row });
  }

  const row = db.emailLists.find((l) => l.id === body.id && l.userId === session.userId);
  if (!row) return fail("List not found", 404);

  if (action === "rename") {
    if (typeof body.name === "string" && body.name.trim()) row.name = body.name.trim();
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    db.emailLists = db.emailLists.filter((l) => l.id !== row.id);
    db.subscribers = db.subscribers.filter((s) => s.listId !== row.id);
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "remove-subscriber") {
    db.subscribers = db.subscribers.filter((s) => !(s.id === body.subscriberId && s.listId === row.id));
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  return fail("Unknown action");
}

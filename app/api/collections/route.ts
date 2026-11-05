import { NextResponse } from "next/server";
import { readDB, writeDB, uid, type Collection } from "@/lib/db";
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
    if (!name) return fail("Name the collection");
    const row: Collection = { id: uid("col"), userId: session.userId, name, createdAt: Date.now() };
    db.collections.push(row);
    writeDB(db);
    return NextResponse.json({ ok: true, collection: row });
  }

  const row = db.collections.find((c) => c.id === body.id && c.userId === session.userId);
  if (!row) return fail("Collection not found", 404);

  if (action === "rename") {
    const name = String(body.name || "").trim();
    if (!name) return fail("Name the collection");
    row.name = name;
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    db.collections = db.collections.filter((c) => c.id !== row.id);
    db.links.forEach((l) => {
      if (l.collectionId === row.id) l.collectionId = null;
    });
    db.shortLinks.forEach((s) => {
      if (s.collectionId === row.id) s.collectionId = null;
    });
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "assign") {
    const linkId = String(body.linkId || "");
    const link = db.links.find((l) => l.id === linkId && l.userId === session.userId);
    if (link) link.collectionId = row.id;
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  return fail("Unknown action");
}

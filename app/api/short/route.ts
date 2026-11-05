import { NextResponse } from "next/server";
import { readDB, writeDB, uid, slugify, shortSlug, type ShortLink } from "@/lib/db";
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
    const destination = String(body.destinationUrl || "").trim();
    if (!/^https?:\/\//i.test(destination)) return fail("Enter a full URL (https://…)");
    let slug = slugify(body.slug || shortSlug());
    if (!slug) slug = shortSlug();
    if (db.shortLinks.some((s) => s.slug === slug)) slug = `${slug}-${shortSlug(3)}`;
    const row: ShortLink = {
      id: uid("sl"),
      userId: session.userId,
      slug,
      destinationUrl: destination,
      title: String(body.title || "").trim() || slug,
      collectionId: body.collectionId || null,
      clicks: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.shortLinks.push(row);
    writeDB(db);
    return NextResponse.json({ ok: true, shortLink: row });
  }

  const row = db.shortLinks.find((s) => s.id === body.id && s.userId === session.userId);
  if (!row) return fail("Short link not found", 404);

  if (action === "update") {
    if (typeof body.destinationUrl === "string") {
      if (!/^https?:\/\//i.test(body.destinationUrl.trim())) return fail("Enter a full URL");
      row.destinationUrl = body.destinationUrl.trim();
    }
    if (typeof body.title === "string") row.title = body.title.trim() || row.title;
    if ("collectionId" in body) row.collectionId = body.collectionId || null;
    row.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true, shortLink: row });
  }

  if (action === "delete") {
    db.shortLinks = db.shortLinks.filter((s) => s.id !== row.id);
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  return fail("Unknown action");
}

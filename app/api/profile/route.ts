import { NextResponse } from "next/server";
import { readDB, writeDB, slugify } from "@/lib/db";
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
  const db = readDB();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return fail("No user", 401);
  const action = String(body.action || "save");

  if (action === "save") {
    if (typeof body.displayName === "string") user.displayName = body.displayName.trim().slice(0, 60);
    if (typeof body.bio === "string") user.bio = body.bio.slice(0, 300);
    if (typeof body.avatarUrl === "string") user.avatarUrl = body.avatarUrl.trim();
    if (body.socials && typeof body.socials === "object") user.socials = body.socials;
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "username") {
    const wanted = slugify(String(body.username || ""));
    if (!wanted) return fail("Pick a username");
    if (db.users.some((u) => u.id !== user.id && u.username?.toLowerCase() === wanted)) {
      return fail("That username is taken");
    }
    user.username = wanted;
    writeDB(db);
    return NextResponse.json({ ok: true, username: wanted });
  }

  return fail("Unknown action");
}

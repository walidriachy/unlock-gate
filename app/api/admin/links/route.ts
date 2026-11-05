import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { adminFromSession } from "@/lib/admin";
import { underLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  const admin = await adminFromSession();
  if (!admin) return fail("Forbidden", 403);
  const actorId = admin.id;
  if (!underLimit(["admin-mutate", clientIp(req), admin.id], 60, 10 * 60 * 1000)) {
    return fail("Too many admin actions", 429);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }

  const action = String(body.action || "");
  const linkId = String(body.linkId || "");
  const db = readDB();
  const link = db.links.find((l) => l.id === linkId);
  if (!link) return fail("Link not found", 404);

  function audit(detail: string) {
    db.auditLog.push({
      id: uid("au"),
      actorId,
      action,
      targetType: "link",
      targetId: linkId,
      detail,
      createdAt: Date.now(),
    });
  }

  if (action === "unpublish") {
    link.status = "paused";
    audit("unpublished");
    writeDB(db);
    return NextResponse.json({ ok: true });
  }
  if (action === "takedown") {
    link.status = "removed";
    audit("takedown");
    writeDB(db);
    return NextResponse.json({ ok: true });
  }
  if (action === "restore") {
    link.status = "published";
    audit("restored");
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  return fail("Unknown action");
}

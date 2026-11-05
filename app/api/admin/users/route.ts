import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getSession, createToken, SESSION_COOKIE, COOKIE_OPTS } from "@/lib/auth";
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
  const userId = String(body.userId || "");
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return fail("User not found", 404);

  function audit(detail: string) {
    db.auditLog.push({
      id: uid("au"),
      actorId,
      action,
      targetType: "user",
      targetId: userId,
      detail,
      createdAt: Date.now(),
    });
  }

  if (action === "verify") {
    user.emailVerifiedAt = Date.now();
    audit("email verified");
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "suspend") {
    user.suspended = true;
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    audit("suspended");
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "unsuspend") {
    user.suspended = false;
    audit("unsuspended");
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "setRole") {
    const role = String(body.role || "");
    if (!["user", "admin", "support"].includes(role)) return fail("Bad role");
    if (user.id === admin.id && role !== "admin") return fail("Can't demote yourself");
    user.role = role as any;
    audit(`role → ${role}`);
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "setPlan") {
    const tier = String(body.tier || "");
    if (!["free", "pro", "lifetime"].includes(tier)) return fail("Bad tier");
    let sub = db.subscriptions.find((s) => s.userId === user.id);
    if (!sub) {
      sub = {
        id: uid("sub"),
        userId: user.id,
        tier: tier as any,
        status: "active",
        currentPeriodEnd: null,
        stripeCustomerId: null,
        startedAt: Date.now(),
      };
      db.subscriptions.push(sub);
    } else {
      sub.tier = tier as any;
      sub.status = "active";
    }
    audit(`plan → ${tier}`);
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "impersonate") {
    if (user.id === admin.id) return fail("Already you");
    audit("impersonated");
    writeDB(db);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, createToken({ userId: user.id, sv: user.sessionVersion ?? 0 }), COOKIE_OPTS);
    return res;
  }

  return fail("Unknown action");
}

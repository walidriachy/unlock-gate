import { NextResponse } from "next/server";
import {
  readDB,
  writeDB,
  uid,
  hashPassword,
  verifyPassword,
  availableSlug,
  slugify,
  type User,
  type Subscription,
} from "@/lib/db";
import {
  createToken,
  createActionToken,
  verifyActionToken,
  getSession,
  SESSION_COOKIE,
  COOKIE_OPTS,
} from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getBaseUrl } from "@/lib/url";
import { underLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Only expose a dev link when no mail provider is configured and we're local. */
function devLink(url: string, sent: boolean): string | undefined {
  const local = process.env.NODE_ENV !== "production";
  return !sent && local ? url : undefined;
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const action = String(body.action || "");

  if (action === "signup") {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const displayName = String(body.displayName || "").trim();
    const usernameRaw = String(body.username || "").trim();
    const claimLinkId: string | null = body.claimLinkId || null;

    if (!email || !password) return fail("Email and password are required");
    if (password.length < 6) return fail("Password must be at least 6 characters");

    const db = readDB();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return fail("That email is already registered");
    }

    const username = availableSlug(
      db,
      usernameRaw || slugify(displayName || email.split("@")[0]),
      (s) => db.users.some((u) => u.username?.toLowerCase() === s)
    );

    const user: User = {
      id: uid("u"),
      email,
      passwordHash: hashPassword(password),
      provider: "email",
      username,
      displayName: displayName || username,
      avatarUrl: "",
      bio: "",
      socials: {},
      emailVerifiedAt: null,
      sessionVersion: 0,
      role: "user",
      createdAt: Date.now(),
    };
    db.users.push(user);
    const sub: Subscription = {
      id: uid("sub"),
      userId: user.id,
      tier: "free",
      status: "active",
      currentPeriodEnd: null,
      stripeCustomerId: null,
      startedAt: Date.now(),
    };
    db.subscriptions.push(sub);

    // Claim an unclaimed link created before sign-up.
    let claimed = false;
    if (claimLinkId) {
      const link = db.links.find((l) => l.id === claimLinkId && !l.userId);
      if (link) {
        link.userId = user.id;
        link.customSlug = link.customSlug || link.slug;
        claimed = true;
      }
    }

    writeDB(db);

    // Verification email — a real link, not a one-click flag.
    const base = await getBaseUrl();
    const verifyToken = createActionToken(
      { purpose: "verify-email", userId: user.id, sv: 0 },
      24 * 60 * 60 * 1000
    );
    const verifyUrl = `${base}/verify-email?token=${encodeURIComponent(verifyToken)}`;
    const mailed = await sendEmail({
      to: email,
      subject: "Confirm your Gatekeeper email",
      html: `<p>Welcome to Gatekeeper.</p><p><a href="${verifyUrl}">Confirm your email</a> to unlock your verified-creator badge. The link is good for 24 hours.</p>`,
    });

    const res = NextResponse.json({
      ok: true,
      claimed,
      username,
      verificationSent: mailed.sent,
      verifyUrl: devLink(verifyUrl, mailed.sent),
    });
    res.cookies.set(
      SESSION_COOKIE,
      createToken({ userId: user.id, sv: user.sessionVersion ?? 0 }),
      COOKIE_OPTS
    );
    return res;
  }

  if (action === "login") {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!underLimit(["login", clientIp(req), email], 10, 15 * 60 * 1000)) {
      return fail("Too many attempts. Try again in a few minutes.", 429);
    }
    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email);
    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return fail("Wrong email or password", 401);
    }
    if (user.suspended) return fail("This account has been suspended", 403);
    const res = NextResponse.json({
      ok: true,
      verified: Boolean(user.emailVerifiedAt),
    });
    res.cookies.set(
      SESSION_COOKIE,
      createToken({ userId: user.id, sv: user.sessionVersion ?? 0 }),
      COOKIE_OPTS
    );
    return res;
  }

  if (action === "forgot") {
    const email = String(body.email || "").trim().toLowerCase();
    // Always answer the same way so the form can't be used to enumerate accounts.
    const generic = {
      ok: true,
      message: "If that email has an account, a reset link is on its way.",
    };
    if (!email || !underLimit(["forgot", clientIp(req), email], 5, 15 * 60 * 1000)) {
      return NextResponse.json(generic);
    }

    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email);
    if (!user) return NextResponse.json(generic);

    const base = await getBaseUrl();
    const token = createActionToken(
      {
        purpose: "reset-password",
        userId: user.id,
        sv: user.sessionVersion ?? 0,
      },
      30 * 60 * 1000
    );
    const url = `${base}/reset?token=${encodeURIComponent(token)}`;
    const mailed = await sendEmail({
      to: email,
      subject: "Reset your Gatekeeper password",
      html: `<p>Someone asked to reset the password for this account.</p><p><a href="${url}">Choose a new password</a>. The link expires in 30 minutes and stops working once used.</p><p>If it wasn't you, ignore this email.</p>`,
    });
    if (!mailed.sent) console.warn("[auth] reset email not sent:", mailed.error);

    return NextResponse.json({ ...generic, devUrl: devLink(url, mailed.sent) });
  }

  if (action === "reset") {
    const token = String(body.token || "");
    const password = String(body.password || "");
    if (password.length < 6) return fail("Password must be at least 6 characters");
    const payload = verifyActionToken(token, "reset-password");
    if (!payload?.userId) return fail("That reset link is invalid or has expired", 400);

    const db = readDB();
    const user = db.users.find((u) => u.id === payload.userId);
    if (!user || (payload.sv ?? 0) !== (user.sessionVersion ?? 0)) {
      return fail("That reset link has already been used", 400);
    }

    user.passwordHash = hashPassword(password);
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    writeDB(db);

    const res = NextResponse.json({ ok: true });
    // Every device is signed out, including this one.
    res.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
    return res;
  }

  if (action === "send-verification") {
    const session = await getSession();
    if (!session) return fail("Not logged in", 401);
    const db = readDB();
    const user = db.users.find((u) => u.id === session.userId);
    if (!user) return fail("No user", 401);
    if (user.emailVerifiedAt) return NextResponse.json({ ok: true, verified: true });

    const base = await getBaseUrl();
    const token = createActionToken(
      { purpose: "verify-email", userId: user.id, sv: user.sessionVersion ?? 0 },
      24 * 60 * 60 * 1000
    );
    const url = `${base}/verify-email?token=${encodeURIComponent(token)}`;
    const mailed = await sendEmail({
      to: user.email,
      subject: "Confirm your Gatekeeper email",
      html: `<p><a href="${url}">Confirm your email</a> to unlock your verified-creator badge. The link is good for 24 hours.</p>`,
    });
    return NextResponse.json({
      ok: true,
      sent: mailed.sent,
      devUrl: devLink(url, mailed.sent),
    });
  }

  if (action === "verify-email") {
    const token = String(body.token || "");
    const payload = verifyActionToken(token, "verify-email");
    if (!payload?.userId) return fail("That verification link is invalid or has expired", 400);

    const db = readDB();
    const user = db.users.find((u) => u.id === payload.userId);
    if (!user || (payload.sv ?? 0) !== (user.sessionVersion ?? 0)) {
      return fail("That verification link is no longer valid", 400);
    }
    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = Date.now();
      writeDB(db);
    }
    return NextResponse.json({ ok: true, email: user.email });
  }

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
    return res;
  }

  if (action === "claim") {
    // Claim links left by this visitor while signed out.
    const session = await getSession();
    if (!session) return fail("Not logged in", 401);
    const ids: string[] = Array.isArray(body.linkIds) ? body.linkIds : [];
    const db = readDB();
    let claimed = 0;
    for (const id of ids) {
      const link = db.links.find((l) => l.id === id && !l.userId);
      if (link) {
        link.userId = session.userId;
        link.customSlug = link.customSlug || link.slug;
        claimed += 1;
      }
    }
    writeDB(db);
    return NextResponse.json({ ok: true, claimed });
  }

  return fail("Unknown action");
}

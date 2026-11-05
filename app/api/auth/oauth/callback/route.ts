import { NextResponse } from "next/server";
import {
  readDB,
  writeDB,
  uid,
  availableSlug,
  slugify,
  type User,
  type Subscription,
} from "@/lib/db";
import {
  createToken,
  verifyActionToken,
  SESSION_COOKIE,
  COOKIE_OPTS,
} from "@/lib/auth";
import { getBaseUrl } from "@/lib/url";
import { safeNext } from "@/lib/safe-next";
import { isLoginProvider, loginProfile, OAUTH_STATE_COOKIE } from "@/lib/oauth-login";
import { underLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

function back(origin: string, code: string, next?: string): NextResponse {
  const url = new URL("/login", origin);
  url.searchParams.set("oauth_error", code);
  if (next) url.searchParams.set("next", next);
  return NextResponse.redirect(url);
}

/**
 * OAuth redirect target for Google and Discord.
 * Provider is carried in the signed state, so this URL never needs a query.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const denied = url.searchParams.get("error");
  const state = url.searchParams.get("state");

  const payload = verifyActionToken(state, "oauth-login");
  const cookieNonce = req.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)gk_oauth_state=([^;]+)/)?.[1];
  const next = safeNext(payload?.next);

  // Always clear the one-shot state cookie on the way out.
  const clearState = (res: NextResponse) => {
    res.cookies.set(OAUTH_STATE_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  };

  if (denied) return clearState(back(origin, "cancelled", next));
  if (!payload || !payload.provider || !isLoginProvider(payload.provider)) {
    return clearState(back(origin, "invalid-state", next));
  }
  if (!cookieNonce || cookieNonce !== payload.nonce) {
    return clearState(back(origin, "state-mismatch", next));
  }
  if (!code) return clearState(back(origin, "missing-code", next));
  if (!underLimit(["oauth-callback", clientIp(req)], 30, 10 * 60 * 1000)) {
    return clearState(back(origin, "rate-limited", next));
  }

  const base = await getBaseUrl();
  const redirectUri = `${base}/api/auth/oauth/callback`;
  const profile = await loginProfile(payload.provider, code, redirectUri);
  if (!profile) return clearState(back(origin, "provider-failed", next));

  // Provider accounts must have a verified email before we trust the address.
  if (!profile.emailVerified) {
    return clearState(back(origin, "email-unverified", next));
  }

  const db = readDB();
  let user = db.users.find((u) => u.email.toLowerCase() === profile.email);
  let changed = false;

  if (!user) {
    const username = availableSlug(
      db,
      slugify(profile.name || profile.email.split("@")[0]),
      (s) => db.users.some((u) => u.username?.toLowerCase() === s)
    );
    user = {
      id: uid("u"),
      email: profile.email,
      // No password: this account signs in with the provider only.
      passwordHash: "",
      provider: profile.provider,
      username,
      displayName: profile.name || username,
      avatarUrl: profile.avatarUrl,
      bio: "",
      socials: {},
      emailVerifiedAt: Date.now(),
      sessionVersion: 0,
      role: "user",
      createdAt: Date.now(),
    } satisfies User;

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
    changed = true;
  } else {
    // Verified provider email is enough to mark an existing account verified.
    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = Date.now();
      changed = true;
    }
    // Fill in profile gaps without replacing what the user chose.
    if (!user.avatarUrl && profile.avatarUrl) {
      user.avatarUrl = profile.avatarUrl;
      changed = true;
    }
    // A social-only account that later gains a password stays on "email".
    if (!user.passwordHash && user.provider === "email") {
      user.provider = profile.provider;
      changed = true;
    }
  }

  // Attach an unclaimed link created before this social sign-up.
  if (payload.claim) {
    const link = db.links.find((l) => l.id === payload.claim && !l.userId);
    if (link) {
      link.userId = user.id;
      link.customSlug = link.customSlug || link.slug;
      changed = true;
    }
  }

  if (changed) writeDB(db);

  const res = NextResponse.redirect(new URL(next, origin));
  res.cookies.set(
    SESSION_COOKIE,
    createToken({ userId: user.id, sv: user.sessionVersion ?? 0 }),
    COOKIE_OPTS
  );
  return clearState(res);
}

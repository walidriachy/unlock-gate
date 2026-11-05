import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createActionToken } from "@/lib/auth";
import { getBaseUrl } from "@/lib/url";
import { safeNext } from "@/lib/safe-next";
import {
  authorizeUrl,
  isLoginProvider,
  loginProviderConfigured,
  OAUTH_STATE_COOKIE,
} from "@/lib/oauth-login";
import { underLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Starts a social sign-in.
 *   GET /api/auth/oauth?provider=google&next=/dashboard
 * The state cookie holds a random nonce; the state param carries a signed
 * token with the same nonce, the provider and the post-login destination.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const providerRaw = url.searchParams.get("provider") || "";
  const next = safeNext(url.searchParams.get("next"));
  const claim = (url.searchParams.get("claim") || "").slice(0, 64) || undefined;

  if (!isLoginProvider(providerRaw)) {
    return NextResponse.redirect(new URL("/login?oauth_error=unknown-provider", url.origin));
  }

  if (!loginProviderConfigured(providerRaw)) {
    return NextResponse.redirect(
      new URL(`/login?oauth_error=${providerRaw}-not-configured`, url.origin)
    );
  }

  if (!underLimit(["oauth-start", clientIp(req)], 30, 10 * 60 * 1000)) {
    return NextResponse.redirect(new URL("/login?oauth_error=rate-limited", url.origin));
  }

  const nonce = crypto.randomBytes(16).toString("hex");
  const state = createActionToken(
    { purpose: "oauth-login", nonce, next, provider: providerRaw, claim },
    10 * 60 * 1000
  );

  const base = await getBaseUrl();
  const redirectUri = `${base}/api/auth/oauth/callback`;
  const res = NextResponse.redirect(authorizeUrl(providerRaw, redirectUri, state));
  res.cookies.set(OAUTH_STATE_COOKIE, nonce, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

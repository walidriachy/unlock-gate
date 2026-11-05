import crypto from "node:crypto";
import { cookies } from "next/headers";
import { readDB, type User, type Subscription } from "./db";

const COOKIE = "gk_session";
const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

export interface SessionPayload {
  userId: string;
  /** Bumped on password reset to invalidate every existing session. */
  sv?: number;
}

/** Extra claims for one-shot email/OAuth links. */
export interface ActionPayload {
  purpose: "reset-password" | "verify-email" | "oauth-login";
  userId?: string;
  email?: string;
  sv?: number;
  nonce?: string;
  /** Post-login destination for OAuth flows. Always a same-site path. */
  next?: string;
  /** Provider id for OAuth flows. */
  provider?: string;
  /** Unclaimed link id to attach after an OAuth sign-up. */
  claim?: string;
  exp: number;
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function createToken(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE;

/** Create a signed, expiring token for a reset/verify/OAuth link. */
export function createActionToken(
  payload: Omit<ActionPayload, "exp">,
  ttlMs: number
): string {
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Date.now() + ttlMs }),
    "utf8"
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyActionToken(
  token: string | null | undefined,
  purpose: ActionPayload["purpose"]
): ActionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ActionPayload;
    if (payload.purpose !== purpose) return null;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** True when the session still matches the user's current token version. */
export function sessionIsCurrent(
  payload: SessionPayload,
  user: { sessionVersion?: number } | undefined | null
): boolean {
  if (!user) return false;
  return (payload.sv ?? 0) === (user.sessionVersion ?? 0);
}

export const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  secure: process.env.NODE_ENV === "production",
};

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const payload = verifyToken(store.get(COOKIE)?.value);
  if (!payload) return null;
  const db = readDB();
  const user = db.users.find((u) => u.id === payload.userId);
  if (!sessionIsCurrent(payload, user)) return null;
  return payload;
}

export interface CurrentUser {
  user: User;
  subscription: Subscription;
}

export function subscriptionFor(sub: Subscription | undefined, userId: string): Subscription {
  return (
    sub ?? {
      id: `local_${userId}`,
      userId,
      tier: "free",
      status: "active",
      currentPeriodEnd: null,
      stripeCustomerId: null,
      startedAt: Date.now(),
    }
  );
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;
  const db = readDB();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user || !sessionIsCurrent(session, user)) return null;
  if (user.suspended) return null;
  const subscription = subscriptionFor(
    db.subscriptions.find((s) => s.userId === user.id),
    user.id
  );
  return { user, subscription };
}

/** Read the session straight from a Request (route handlers that don't use next/headers cookies). */
export function sessionFromRequest(req: Request): SessionPayload | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)gk_session=([^;]+)/);
  const payload = verifyToken(match?.[1]);
  if (!payload) return null;
  const user = readDB().users.find((u) => u.id === payload.userId);
  return sessionIsCurrent(payload, user) ? payload : null;
}

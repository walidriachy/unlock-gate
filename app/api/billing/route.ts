import { NextResponse } from "next/server";
import { readDB, writeDB, uid, type Tier } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getBaseUrl } from "@/lib/url";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

const VALID: Tier[] = ["free", "pro", "lifetime"];

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return fail("Not logged in", 401);
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const tier = body.tier as Tier;
  if (!VALID.includes(tier)) return fail("Unknown plan");
  const db = readDB();
  let sub = db.subscriptions.find((s) => s.userId === session.userId);
  if (!sub) {
    sub = {
      id: uid("sub"),
      userId: session.userId,
      tier: "free",
      status: "active",
      currentPeriodEnd: null,
      stripeCustomerId: null,
      startedAt: Date.now(),
    };
    db.subscriptions.push(sub);
  }

  const key = process.env.STRIPE_SECRET_KEY;
  const cfg = db.config || {};
  const price =
    tier === "pro"
      ? cfg.stripe_price_pro_monthly || process.env.STRIPE_PRICE_PRO_MONTHLY
      : tier === "lifetime"
        ? cfg.stripe_price_lifetime || process.env.STRIPE_PRICE_LIFETIME
        : null;

  if (key && price) {
    // Real Stripe test-mode checkout.
    try {
      const base = await getBaseUrl();
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(key);
      const checkout = await stripe.checkout.sessions.create({
        mode: tier === "lifetime" ? "payment" : "subscription",
        line_items: [{ price, quantity: 1 }],
        success_url: `${base}/dashboard/settings?upgraded=1`,
        cancel_url: `${base}/dashboard/settings?canceled=1`,
        client_reference_id: session.userId,
      });
      return NextResponse.json({ ok: true, url: checkout.url });
    } catch (err) {
      return fail(`Stripe error: ${String(err)}`, 500);
    }
  }

  // Demo mode: apply the plan directly so the whole product is explorable.
  // Never in production — there it would hand out paid plans for free.
  if (tier !== "free" && process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_BILLING !== "1") {
    return fail("Payments are not configured yet", 503);
  }
  sub.tier = tier;
  sub.status = "active";
  sub.currentPeriodEnd = tier === "free" ? null : Date.now() + (tier === "lifetime" ? 100 * 365 * 86_400_000 : 30 * 86_400_000);
  writeDB(db);
  return NextResponse.json({ ok: true, demo: true, tier });
}

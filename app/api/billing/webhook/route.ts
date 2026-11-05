import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(key);
  const raw = await req.text();
  const sig = req.headers.get("stripe-signature");
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig || "", secret);
  } catch (err) {
    return NextResponse.json({ ok: false, error: `Bad signature: ${String(err)}` }, { status: 400 });
  }

  const db = readDB();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      if (!userId) break;
      const sub = db.subscriptions.find((s) => s.userId === userId);
      const tier = session.mode === "payment" ? "lifetime" : "pro";
      if (sub) {
        sub.tier = tier;
        sub.status = "active";
        sub.stripeCustomerId = session.customer ? String(session.customer) : sub.stripeCustomerId;
        sub.currentPeriodEnd = tier === "lifetime" ? Date.now() + 100 * 365 * 86_400_000 : Date.now() + 30 * 86_400_000;
      } else {
        db.subscriptions.push({
          id: `sub_${session.id}`,
          userId,
          tier,
          status: "active",
          currentPeriodEnd: tier === "lifetime" ? Date.now() + 100 * 365 * 86_400_000 : Date.now() + 30 * 86_400_000,
          stripeCustomerId: session.customer ? String(session.customer) : null,
          startedAt: Date.now(),
        });
      }
      break;
    }
    case "customer.subscription.deleted":
    case "customer.subscription.updated": {
      const s = event.data.object as Stripe.Subscription;
      const customerId = String(s.customer);
      const sub = db.subscriptions.find((x) => x.stripeCustomerId === customerId);
      if (sub) {
        sub.status = s.status === "active" ? "active" : s.status === "past_due" ? "past_due" : "canceled";
        if (s.status === "canceled") sub.tier = "free";
      }
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      const customerId = String(inv.customer);
      const sub = db.subscriptions.find((x) => x.stripeCustomerId === customerId);
      if (sub) sub.status = "past_due";
      break;
    }
    default:
      break;
  }

  writeDB(db);
  return NextResponse.json({ received: true });
}

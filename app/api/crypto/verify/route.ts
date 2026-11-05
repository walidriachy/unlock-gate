import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { findMemoTransaction, rpcUrl } from "@/lib/solana";

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
  const paymentId = String(body.paymentId || "");
  const db = readDB();
  const payment = db.cryptoPayments.find((p) => p.id === paymentId && p.userId === session.userId);
  if (!payment) return fail("Payment not found", 404);
  if (payment.status === "paid") return NextResponse.json({ ok: true, paid: true });

  const cfg = db.config || {};
  const url = rpcUrl(cfg.solana_rpc_url);
  const sig = await findMemoTransaction(payment.wallet, payment.memo, url);
  if (!sig) return NextResponse.json({ ok: true, paid: false });

  payment.status = "paid";
  payment.paidAt = Date.now();
  const sub = db.subscriptions.find((s) => s.userId === session.userId);
  if (sub) {
    sub.tier = payment.tier;
    sub.status = "active";
    sub.currentPeriodEnd = payment.tier === "lifetime" ? Date.now() + 100 * 365 * 86_400_000 : Date.now() + 30 * 86_400_000;
  } else {
    db.subscriptions.push({
      id: `sub_${payment.id}`,
      userId: session.userId,
      tier: payment.tier,
      status: "active",
      currentPeriodEnd: payment.tier === "lifetime" ? Date.now() + 100 * 365 * 86_400_000 : Date.now() + 30 * 86_400_000,
      stripeCustomerId: null,
      startedAt: Date.now(),
    });
  }
  writeDB(db);
  return NextResponse.json({ ok: true, paid: true, signature: sig });
}

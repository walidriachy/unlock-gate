import { NextResponse } from "next/server";
import { readDB, writeDB, uid } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getBaseUrl } from "@/lib/url";
import { rpcUrl } from "@/lib/solana";

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
  const tier: "pro" | "lifetime" = body.tier === "lifetime" ? "lifetime" : "pro";

  const db = readDB();
  const cfg = db.config || {};
  const wallet = cfg.solana_merchant_wallet || process.env.SOLANA_MERCHANT_WALLET;
  if (!wallet) return fail("Solana payments are not configured (set merchant wallet in admin)", 503);

  const mint = cfg.solana_token_mint || process.env.SOLANA_TOKEN_MINT || "";
  const amount = tier === "lifetime"
    ? (cfg.solana_lifetime_amount || process.env.SOLANA_LIFETIME_AMOUNT || "149")
    : (cfg.solana_pro_amount || process.env.SOLANA_PRO_AMOUNT || "19");

  const memo = `gk-${session.userId.slice(-6)}-${Date.now().toString(36)}`;
  const payment = {
    id: uid("cp"),
    userId: session.userId,
    tier,
    memo,
    amount,
    mint: mint || null,
    wallet,
    status: "pending" as const,
    createdAt: Date.now(),
    paidAt: null,
  };
  db.cryptoPayments.push(payment);
  writeDB(db);

  const params = new URLSearchParams();
  params.set("amount", amount);
  if (mint) params.set("spl-token", mint);
  params.set("label", "Gatekeeper");
  params.set("message", `Upgrade to ${tier}`);
  params.set("memo", memo);
  const url = `solana:${wallet}?${params.toString()}`;

  return NextResponse.json({ ok: true, url, memo, paymentId: payment.id, amount, mint: mint || null });
}

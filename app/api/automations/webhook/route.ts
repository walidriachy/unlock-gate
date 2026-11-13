import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

/** The verify token Meta echoes during webhook setup. Required in production. */
function verifyToken(): string | null {
  const value = process.env.META_VERIFY_TOKEN;
  if (value) return value;
  return process.env.NODE_ENV === "production" ? null : "gatekeeper";
}

/**
 * Meta signs every delivery: X-Hub-Signature-256 = "sha256=" + HMAC-SHA256 of
 * the raw body keyed with the app secret. Without this check anyone could POST
 * fake comments and make the app send DMs. Outside production an unset secret
 * is allowed so the flow can be tried locally.
 */
function signatureValid(raw: string, header: string | null): boolean {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return process.env.NODE_ENV !== "production";
  if (!header?.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", appSecret).update(raw, "utf8").digest("hex");
  const given = header.slice("sha256=".length);
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given, "utf8"), Buffer.from(expected, "utf8"));
}
import { getBaseUrl } from "@/lib/url";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expectedToken = verifyToken();
  if (mode === "subscribe" && expectedToken && token === expectedToken) {
    return new Response(challenge || "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const raw = await req.text();
  if (!signatureValid(raw, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ ok: false, error: "Bad signature" }, { status: 401 });
  }
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const db = readDB();
  const entries = Array.isArray(payload?.entry) ? payload.entry : [];

  for (const entry of entries) {
    const igUserId = String(entry.id || "");
    const account = db.igAccounts.find((a) => a.igUserId === igUserId);
    if (!account) continue;
    const campaigns = db.automations.filter((c) => c.igAccountId === account.id && c.active);

    const changes = Array.isArray(entry.changes) ? entry.changes : [];
    for (const change of changes) {
      if (change.field !== "comments") continue;
      const value = change.value || {};
      const text = String(value.text || "");
      const commenterId = String(value.from?.id || "");
      const commenterUsername = String(value.from?.username || "");
      const commentId = String(value.id || "");
      const mediaId = String(value.media?.id || "");

      for (const camp of campaigns) {
        const kw = camp.keywords.map((k) => k.toLowerCase());
        const lower = text.toLowerCase();
        const matched = camp.matchMode === "exact"
          ? kw.some((k) => lower.split(/\s+/).includes(k))
          : kw.some((k) => lower.includes(k));
        if (!matched) continue;

        const link = camp.linkId ? db.links.find((l) => l.id === camp.linkId) : null;
        const base = await getBaseUrl();
        const linkUrl = link ? `${base}/l/${link.slug}` : "";
        const message = camp.dmMessage.replace(/\{username\}/g, commenterUsername || "there") + (linkUrl ? `\n\n${linkUrl}` : "");

        // Send DM via Meta Graph API
        try {
          await fetch(`https://graph.instagram.com/v21.0/${account.igUserId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${account.accessToken}` },
            body: JSON.stringify({ recipient: { id: commenterId }, message: { text: message } }),
          });
        } catch {
          /* ignore */
        }

        // Optional public reply
        if (camp.publicReply && commentId) {
          try {
            await fetch(`https://graph.instagram.com/v21.0/${commentId}/replies`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${account.accessToken}` },
              body: JSON.stringify({ message: camp.publicReply.replace(/\{username\}/g, commenterUsername || "") }),
            });
          } catch {
            /* ignore */
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}

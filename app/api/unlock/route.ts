import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  readDB,
  writeDB,
  uid,
  type Unlock,
  type Link,
} from "@/lib/db";
import { actionsForLink, linkStatus } from "@/lib/queries";
import { classifyRequest } from "@/lib/format";
import { sessionFromRequest } from "@/lib/auth";
import { effectiveMode, oauthAuthorizeUrl, stepRejection } from "@/lib/verify";
import { underLimit, clientIp } from "@/lib/rate-limit";
import { getBaseUrl } from "@/lib/url";

export const runtime = "nodejs";

const VISITOR_COOKIE = "gk_visitor";
const VIEW_WINDOW = 30 * 60 * 1000;

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

async function visitorToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(VISITOR_COOKIE)?.value;
  if (existing) return existing;
  const token = uid("v").replace("v_", "");
  store.set(VISITOR_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
  });
  return token;
}

function unlockRow(db: ReturnType<typeof readDB>, linkId: string, token: string): Unlock {
  let row = db.unlocks.find((u) => u.linkId === linkId && u.visitorToken === token);
  if (!row) {
    row = {
      id: uid("un"),
      linkId,
      userId: null,
      visitorToken: token,
      stepsCompleted: [],
      country: null,
      device: null,
      referrer: null,
      completedAt: 0,
    };
    db.unlocks.push(row);
  }
  return row;
}

/** GET — restore progress for this visitor (so a reload mid-flow doesn't reset). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const linkId = url.searchParams.get("linkId");
  if (!linkId) return fail("linkId required");
  const db = readDB();
  const link = db.links.find((l) => l.id === linkId);
  if (!link) return fail("Link not found", 404);
  const token = (await cookies()).get(VISITOR_COOKIE)?.value || null;
  const row = token ? db.unlocks.find((u) => u.linkId === linkId && u.visitorToken === token) : null;
  const actions = actionsForLink(db, linkId);
  const state = linkStatus(link);
  return NextResponse.json({
    ok: true,
    live: state.live,
    state: state.label,
    stepsCompleted: row?.stepsCompleted ?? [],
    total: actions.length,
    unlocked: (row?.stepsCompleted.length ?? 0) >= actions.length && actions.length > 0,
  });
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const intent = String(body.intent || "");
  const linkId = String(body.linkId || "");
  if (!linkId) return fail("linkId required");
  if (!underLimit(["unlock", clientIp(req)], 120, 60_000)) return fail("Too many requests, slow down", 429);

  const db = readDB();
  const link = db.links.find((l) => l.id === linkId);
  if (!link) return fail("Link not found", 404);

  const actions = actionsForLink(db, linkId);
  const token = await visitorToken();
  const { device, country, referrer } = classifyRequest(req);

  // ---- Record a page view ----
  if (intent === "view") {
    if (!linkStatus(link).live) {
      return NextResponse.json({ ok: true, live: false, state: linkStatus(link).label });
    }
    const ua = req.headers.get("user-agent") || "";
    const isBot = /bot|crawler|spider|preview|facebookexternalhit|slackbot|twitterbot/i.test(ua);
    if (!isBot) {
      const recent = db.linkEvents.find(
        (e) =>
          e.linkId === linkId &&
          e.type === "view" &&
          e.visitorToken === token &&
          Date.now() - e.occurredAt < VIEW_WINDOW
      );
      if (!recent) {
        db.linkEvents.push({
          id: uid("ev"),
          linkId,
          type: "view",
          stepIndex: null,
          country,
          device,
          referrer,
          visitorToken: token,
          occurredAt: Date.now(),
        });
        link.views += 1;
        writeDB(db);
      }
    }
    return NextResponse.json({ ok: true, live: true });
  }

  const row = unlockRow(db, linkId, token);

  /**
   * CHECK — always run before opening anything.
   * Tells the client whether this step is already verified for this visitor,
   * and where to send them only if it is not.
   */
  if (intent === "check") {
    const index = Number(body.index);
    if (!Number.isInteger(index) || index < 0 || index >= actions.length) return fail("Bad step");
    const action = actions[index];
    const completed = row.stepsCompleted.includes(index);
    const mode = effectiveMode(action);
    let verifyUrl: string | null = null;
    if (!completed && mode === "oauth") {
      const base = await getBaseUrl();
      const state = Buffer.from(
        JSON.stringify({ linkId, index, token }),
        "utf8"
      ).toString("base64url");
      verifyUrl = oauthAuthorizeUrl(action.provider, `${base}/api/oauth/callback`, state);
    }
    if (!completed && mode === "click") {
      // Start the dwell clock: "step" is only accepted a few seconds after this.
      row.openedAt = { ...(row.openedAt || {}), [index]: Date.now() };
      writeDB(db);
    }
    const nextPending = actions.map((_, i) => i).find((i) => !row.stepsCompleted.includes(i)) ?? null;
    return NextResponse.json({
      ok: true,
      live: linkStatus(link).live,
      completed,
      mode,
      verifyUrl,
      stepsCompleted: row.stepsCompleted,
      total: actions.length,
      nextPending,
    });
  }

  // ---- Mark one step complete ----
  if (intent === "step") {
    const index = Number(body.index);
    if (!Number.isInteger(index) || index < 0 || index >= actions.length) return fail("Bad step");
    if (!linkStatus(link).live) return fail("Link is not live", 409);
    if (!row.stepsCompleted.includes(index)) {
      const rejection = stepRejection(effectiveMode(actions[index]), row, index);
      if (rejection) return fail(rejection, 409);
      row.stepsCompleted = [...row.stepsCompleted, index].sort((a, b) => a - b);
      row.country = row.country || country;
      row.device = row.device || device;
      row.referrer = row.referrer || referrer;
    }
    db.linkEvents.push({
      id: uid("ev"),
      linkId,
      type: "step",
      stepIndex: index,
      country,
      device,
      referrer,
      visitorToken: token,
      occurredAt: Date.now(),
    });
    writeDB(db);
    return NextResponse.json({
      ok: true,
      stepsCompleted: row.stepsCompleted,
      total: actions.length,
      unlocked: row.stepsCompleted.length >= actions.length,
    });
  }

  // ---- Release the destination ----
  if (intent === "unlock") {
    if (!linkStatus(link).live) return fail("Link is not live", 409);
    const done = new Set(row.stepsCompleted);
    const missing = actions.map((_, i) => i).filter((i) => !done.has(i));
    if (missing.length > 0) return fail("Complete every step first", 409);

    const firstTime = row.completedAt === 0;
    if (firstTime) {
      row.completedAt = Date.now();
      link.unlocks += 1;
      db.linkEvents.push({
        id: uid("ev"),
        linkId,
        type: "unlock",
        stepIndex: null,
        country,
        device,
        referrer,
        visitorToken: token,
        occurredAt: Date.now(),
      });
      const session = sessionFromRequest(req);
      if (session) {
        row.userId = session.userId;
        if (!db.savedUnlocks.some((s) => s.userId === session.userId && s.linkId === linkId)) {
          db.savedUnlocks.push({
            id: uid("su"),
            userId: session.userId,
            linkId,
            completedAt: Date.now(),
          });
        }
      }
    }
    db.linkEvents.push({
      id: uid("ev"),
      linkId,
      type: "destination",
      stepIndex: null,
      country,
      device,
      referrer,
      visitorToken: token,
      occurredAt: Date.now(),
    });
    writeDB(db);

    return NextResponse.json({
      ok: true,
      destination: destinationOf(db, link),
    });
  }

  return fail("Unknown intent");
}

function destinationOf(db: ReturnType<typeof readDB>, link: Link) {
  if (link.destinationType === "text") {
    return { kind: "text" as const, text: link.textSnippet || "" };
  }
  if (link.destinationType === "file") {
    const file = db.files.find((f) => f.id === link.fileId);
    return {
      kind: "file" as const,
      url: file ? `/api/files/${file.id}` : null,
      name: file?.name ?? "download",
    };
  }
  return { kind: "url" as const, url: link.destinationUrl || "#" };
}

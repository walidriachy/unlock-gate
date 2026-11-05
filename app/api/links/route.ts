import { NextResponse } from "next/server";
import {
  readDB,
  writeDB,
  uid,
  availableSlug,
  slugify,
  type Action,
  type Link,
} from "@/lib/db";
import { actionsForLink } from "@/lib/queries";
import { findAction } from "@/lib/platforms";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

interface IncomingAction {
  actionId: string;
  target?: string;
  label?: string;
}

function buildActions(linkId: string, incoming: IncomingAction[]): Action[] {
  const rows: Action[] = [];
  incoming.slice(0, 20).forEach((a, position) => {
    const found = findAction(a.actionId);
    if (!found) return;
    const { provider, action: def } = found;
    rows.push({
      id: uid("act"),
      linkId,
      position,
      provider: provider.id,
      actionType: def.type,
      actionId: def.id,
      label: a.label?.trim() || `${def.label} ${provider.name}`.trim(),
      target: a.target?.trim() || null,
      iconKey: provider.glyph,
      verificationMode: def.verification,
    });
  });
  return rows;
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const action = String(body.action || "");
  const session = await getSession();
  const db = readDB();

  if (action === "create") {
    const title = String(body.title || "").trim();
    if (!title) return fail("Give the link a title");
    const destinationType = ["url", "file", "text"].includes(body.destinationType)
      ? body.destinationType
      : "url";
    if (destinationType === "url" && !String(body.destinationUrl || "").trim()) {
      return fail("Add a destination URL");
    }
    if (destinationType === "text" && !String(body.textSnippet || "").trim()) {
      return fail("Add the text people unlock");
    }
    if (destinationType === "file" && !body.fileId) {
      return fail("Upload a file first");
    }

    const incoming: IncomingAction[] = Array.isArray(body.actions) ? body.actions : [];
    if (incoming.length === 0) return fail("Add at least one action");

    const linkId = uid("link");
    const slug = availableSlug(db, title, (s) => db.links.some((l) => l.slug === s));
    const link: Link = {
      id: linkId,
      userId: session?.userId ?? null,
      slug,
      customSlug: null,
      title,
      accentColor: body.accentColor ? String(body.accentColor) : null,
      coverUrl: body.coverUrl ? String(body.coverUrl) : null,
      background: body.background && typeof body.background === "object" ? body.background : { kind: "gradient" },
      widget: body.widget && typeof body.widget === "object" ? body.widget : null,
      destinationType,
      destinationUrl: destinationType === "url" ? String(body.destinationUrl).trim() : null,
      fileId: destinationType === "file" ? String(body.fileId) : null,
      textSnippet: destinationType === "text" ? String(body.textSnippet) : null,
      status: "published",
      scheduledAt: body.scheduledAt ? Number(body.scheduledAt) : null,
      expiresAt: body.expiresAt ? Number(body.expiresAt) : null,
      collectionId: body.collectionId || null,
      views: 0,
      unlocks: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.links.push(link);
    const rows = buildActions(linkId, incoming);
    db.actions.push(...rows);
    writeDB(db);
    return NextResponse.json({ ok: true, link, actions: rows, unclaimed: !link.userId });
  }

  // Everything below needs ownership.
  if (!session) return fail("Not logged in", 401);
  const link = db.links.find((l) => l.id === body.linkId);
  if (!link) return fail("Link not found", 404);
  if (link.userId !== session.userId) return fail("Not your link", 403);

  if (action === "update") {
    if (typeof body.title === "string" && body.title.trim()) link.title = body.title.trim();
    if (typeof body.accentColor === "string") link.accentColor = body.accentColor || null;
    if (typeof body.coverUrl === "string") link.coverUrl = body.coverUrl || null;
    if (body.background && typeof body.background === "object") link.background = body.background;
    if (body.widget && typeof body.widget === "object") link.widget = body.widget;
    if (typeof body.destinationUrl === "string" && link.destinationType === "url") {
      if (!body.destinationUrl.trim()) return fail("Add a destination URL");
      link.destinationUrl = body.destinationUrl.trim();
    }
    if (typeof body.textSnippet === "string" && link.destinationType === "text") {
      link.textSnippet = body.textSnippet;
    }
    if (typeof body.fileId === "string" && link.destinationType === "file") {
      link.fileId = body.fileId || link.fileId;
    }
    if ("scheduledAt" in body) link.scheduledAt = body.scheduledAt ? Number(body.scheduledAt) : null;
    if ("expiresAt" in body) link.expiresAt = body.expiresAt ? Number(body.expiresAt) : null;
    if ("collectionId" in body) link.collectionId = body.collectionId || null;
    if (typeof body.customSlug === "string" && link.userId) {
      const wanted = slugify(body.customSlug);
      if (wanted) {
        const clash = db.links.some((l) => l.id !== link.id && l.customSlug === wanted);
        if (clash) return fail("That custom URL is taken");
        link.customSlug = wanted;
      }
    }
    if (Array.isArray(body.actions)) {
      db.actions = db.actions.filter((a) => a.linkId !== link.id);
      db.actions.push(...buildActions(link.id, body.actions));
    }
    link.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true, link, actions: actionsForLink(db, link.id) });
  }

  if (action === "status") {
    const status = body.status;
    if (!["draft", "published", "paused"].includes(status)) return fail("Unknown status");
    link.status = status;
    link.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    db.links = db.links.filter((l) => l.id !== link.id);
    db.actions = db.actions.filter((a) => a.linkId !== link.id);
    db.linkEvents = db.linkEvents.filter((e) => e.linkId !== link.id);
    db.unlocks = db.unlocks.filter((u) => u.linkId !== link.id);
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  return fail("Unknown action");
}

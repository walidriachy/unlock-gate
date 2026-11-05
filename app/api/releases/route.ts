import { NextResponse } from "next/server";
import { readDB, writeDB, uid, availableSlug, slugify, ensureDefaultList, type Release, type ReleaseService, type NotifySignup } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getBaseUrl } from "@/lib/url";
import { classifyRequest } from "@/lib/format";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const action = String(body.action || "create");
  const db = readDB();

  // ---- public: play a service link ----
  if (action === "play") {
    const service = db.releaseServices.find((s) => s.id === body.serviceId);
    if (service) {
      service.plays += 1;
      writeDB(db);
    }
    return NextResponse.json({ ok: true });
  }

  // ---- public: notify me ----
  if (action === "notify") {
    const release = db.releases.find((r) => r.id === body.releaseId);
    if (!release) return fail("Release not found", 404);
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a valid email");
    if (!db.notifySignups.some((n) => n.releaseId === release.id && n.email === email)) {
      const signup: NotifySignup = { id: uid("ns"), releaseId: release.id, email, createdAt: Date.now() };
      db.notifySignups.push(signup);
      if (release.notifyListId) {
        if (!db.subscribers.some((s) => s.listId === release.notifyListId && s.email === email)) {
          db.subscribers.push({ id: uid("s"), listId: release.notifyListId, email, sourceLinkId: null, joinedAt: Date.now(), unsubscribedAt: null });
        }
      }
      writeDB(db);
    }
    return NextResponse.json({ ok: true });
  }

  const session = await getSession();
  if (!session) return fail("Not logged in", 401);

  if (action === "create") {
    const title = String(body.title || "").trim();
    if (!title) return fail("Give the release a title");
    const slug = availableSlug(db, body.slug || title, (s) => db.releases.some((r) => r.userId === session.userId && r.slug === s));
    const list = ensureDefaultList(db, session.userId);
    const release: Release = {
      id: uid("rel"),
      userId: session.userId,
      slug,
      title,
      artist: String(body.artist || "").trim(),
      coverUrl: body.coverUrl || null,
      releaseDate: body.releaseDate ? Number(body.releaseDate) : null,
      notifyEnabled: Boolean(body.notifyEnabled),
      notifyListId: list.id,
      bonus: body.bonus ?? null,
      bonusLinkId: body.bonusLinkId ?? null,
      views: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.releases.push(release);
    const services: { service: string; url: string }[] = Array.isArray(body.services) ? body.services.slice(0, 20) : [];
    services.forEach((s, position) => {
      db.releaseServices.push({ id: uid("rs"), releaseId: release.id, service: s.service, url: s.url, position, plays: 0 });
    });
    writeDB(db);
    return NextResponse.json({ ok: true, release });
  }

  const release = db.releases.find((r) => r.id === body.id && r.userId === session.userId);
  if (!release) return fail("Release not found", 404);

  if (action === "update") {
    if (typeof body.title === "string" && body.title.trim()) release.title = body.title.trim();
    if (typeof body.artist === "string") release.artist = body.artist;
    if (typeof body.coverUrl === "string") release.coverUrl = body.coverUrl || null;
    if ("releaseDate" in body) release.releaseDate = body.releaseDate ? Number(body.releaseDate) : null;
    if ("notifyEnabled" in body) release.notifyEnabled = Boolean(body.notifyEnabled);
    if ("bonus" in body) release.bonus = body.bonus ?? null;
    if ("bonusLinkId" in body) release.bonusLinkId = body.bonusLinkId ?? null;
    if (Array.isArray(body.services)) {
      db.releaseServices = db.releaseServices.filter((s) => s.releaseId !== release.id);
      (body.services as { service: string; url: string }[]).slice(0, 20).forEach((s, position) => {
        db.releaseServices.push({ id: uid("rs"), releaseId: release.id, service: s.service, url: s.url, position, plays: 0 });
      });
    }
    release.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "view") {
    const release = db.releases.find((r) => r.id === body.releaseId);
    if (!release) return fail("Release not found", 404);
    release.views = (release.views ?? 0) + 1;
    const { device, country, referrer } = classifyRequest(req);
    db.linkEvents.push({
      id: uid("ev"),
      linkId: release.bonusLinkId ?? "",
      releaseId: release.id,
      type: "view",
      stepIndex: null,
      country,
      device,
      referrer,
      visitorToken: null,
      occurredAt: Date.now(),
    });
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    db.releases = db.releases.filter((r) => r.id !== release.id);
    db.releaseServices = db.releaseServices.filter((s) => s.releaseId !== release.id);
    db.notifySignups = db.notifySignups.filter((n) => n.releaseId !== release.id);
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "notify-fans") {
    const signups = db.notifySignups.filter((n) => n.releaseId === release.id);
    const base = await getBaseUrl();
    let sent = 0;
    for (const s of signups) {
      const r = await sendEmail({
        to: s.email,
        subject: `${release.title} is out`,
        html: `<p>${release.title} by ${release.artist} is out now.</p><p><a href="${base}/release/${release.slug}">Listen here</a></p>`,
      });
      if (r.sent) sent += 1;
    }
    return NextResponse.json({ ok: true, queued: signups.length, sent });
  }

  void (db.releaseServices as ReleaseService[]);
  return fail("Unknown action");
}

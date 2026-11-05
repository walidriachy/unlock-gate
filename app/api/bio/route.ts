import { NextResponse } from "next/server";
import { readDB, writeDB, uid, availableSlug, slugify, type BioButton, type BioPage } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

interface IncomingButton {
  kind?: BioButton["kind"];
  label?: string;
  url?: string | null;
  iconKey?: string;
  linkId?: string | null;
  style?: string | null;
  highlight?: BioButton["highlight"];
  startsAt?: number | null;
  endsAt?: number | null;
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid body");
  }
  const action = String(body.action || "save");
  const db = readDB();

  // ---- public: page view + button click (no session) ----
  if (action === "view" || action === "click") {
    const page = body.username
      ? db.bioPages.find((p) => p.username.toLowerCase() === String(body.username).toLowerCase())
      : db.bioPages.find((p) => p.id === body.bioPageId);
    if (!page) return NextResponse.json({ ok: true });
    if (action === "view") {
      page.views = (page.views || 0) + 1;
    } else {
      const btn = db.bioButtons.find((b) => b.id === body.buttonId && b.bioPageId === page.id);
      if (btn) btn.clicks += 1;
    }
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  const session = await getSession();
  if (!session) return fail("Not logged in", 401);
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return fail("No user", 401);

  let page = db.bioPages.find((p) => p.userId === user.id);
  if (!page) {
    const username = availableSlug(db, user.username || slugify(user.displayName || user.email.split("@")[0]), (s) =>
      db.bioPages.some((p) => p.username.toLowerCase() === s)
    );
    page = {
      id: uid("bio"),
      userId: user.id,
      username,
      theme: "aurora",
      font: "sans",
      accent: "#7c5cff",
      buttonStyle: "glass",
      corners: "rounded",
      background: { kind: "theme" },
      emailListId: null,
      publishedAt: null,
      views: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.bioPages.push(page);
  }

  if (action === "claim-username") {
    const wanted = slugify(String(body.username || ""));
    if (!wanted) return fail("Pick a name");
    const taken = db.bioPages.some((p) => p.id !== page!.id && p.username.toLowerCase() === wanted);
    if (taken) return fail("That name is taken");
    page.username = wanted;
    page.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true, username: wanted });
  }

  if (action === "save") {
    if (typeof body.theme === "string") page.theme = body.theme;
    if (typeof body.font === "string") page.font = body.font;
    if (typeof body.accent === "string") page.accent = body.accent;
    if (typeof body.buttonStyle === "string") page.buttonStyle = body.buttonStyle;
    if (typeof body.corners === "string") page.corners = body.corners;
    if (body.background && typeof body.background === "object") page.background = body.background;
    if ("emailListId" in body) page.emailListId = body.emailListId || null;

    if (Array.isArray(body.buttons)) {
      const incoming: IncomingButton[] = body.buttons.slice(0, 60);
      db.bioButtons = db.bioButtons.filter((b) => b.bioPageId !== page!.id);
      const rows: BioButton[] = incoming.map((b, position) => ({
        id: uid("bb"),
        bioPageId: page!.id,
        position,
        kind: (["link", "unlock", "header", "social"] as const).includes(b.kind as never) ? (b.kind as BioButton["kind"]) : "link",
        label: String(b.label || "Untitled").slice(0, 80),
        url: b.url || null,
        iconKey: b.iconKey || "",
        linkId: b.linkId || null,
        style: b.style || null,
        highlight: (["none", "pulse", "shine", "wobble"] as const).includes(b.highlight as never) ? (b.highlight as BioButton["highlight"]) : "none",
        startsAt: b.startsAt ?? null,
        endsAt: b.endsAt ?? null,
        clicks: 0,
      }));
      db.bioButtons.push(...rows);
    }
    page.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  if (action === "publish") {
    if (!user.emailVerifiedAt) {
      return fail("Verify your email before your page goes public. For this demo, open Settings and verify.", 403);
    }
    page.publishedAt = Date.now();
    page.updatedAt = Date.now();
    writeDB(db);
    return NextResponse.json({ ok: true, publishedAt: page.publishedAt });
  }

  if (action === "unpublish") {
    page.publishedAt = null;
    writeDB(db);
    return NextResponse.json({ ok: true });
  }

  void (page as BioPage);
  return fail("Unknown action");
}

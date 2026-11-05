import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { adminFromSession } from "@/lib/admin";

export const runtime = "nodejs";

const FLAGS = [
  { key: "maintenance_mode", label: "Maintenance mode (show banner, block new signups)" },
  { key: "new_signups", label: "Allow new signups" },
  { key: "releases_enabled", label: "Release links enabled" },
  { key: "bio_enabled", label: "Link-in-bio enabled" },
];

export async function GET() {
  const admin = await adminFromSession();
  if (!admin) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  const db = readDB();
  return NextResponse.json({ ok: true, flags: FLAGS, values: db.settings || {}, config: db.config || {} });
}

export async function POST(req: Request) {
  const admin = await adminFromSession();
  if (!admin) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const db = readDB();
  db.settings = db.settings || {};
  db.config = db.config || {};
  if (typeof body.key === "string") {
    db.settings[body.key] = Boolean(body.value);
  }
  if (typeof body.configKey === "string") {
    db.config[body.configKey] = String(body.configValue ?? "");
  }
  writeDB(db);
  return NextResponse.json({ ok: true });
}

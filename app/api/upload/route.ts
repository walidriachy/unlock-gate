import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { readDB, writeDB, uid, UPLOAD_DIR, type FileRecord } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { underLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB for the local stub (real app: object storage)

export async function POST(req: Request) {
  const session = await getSession();
  if (!underLimit(["upload", clientIp(req)], 10, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Too many uploads, try again later" }, { status: 429 });
  }
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a file upload" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: `File too large (limit ${Math.round(MAX_BYTES / 1024 / 1024)} MB)` },
      { status: 413 }
    );
  }
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name).slice(0, 12);
  const storedName = `${crypto.randomBytes(10).toString("hex")}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, storedName), bytes);

  const db = readDB();
  const record: FileRecord = {
    id: uid("file"),
    userId: session?.userId ?? null,
    name: file.name,
    size: file.size,
    mime: file.type || "application/octet-stream",
    storedName,
    createdAt: Date.now(),
  };
  db.files.push(record);
  writeDB(db);
  return NextResponse.json({ ok: true, file: { id: record.id, name: record.name, size: record.size } });
}

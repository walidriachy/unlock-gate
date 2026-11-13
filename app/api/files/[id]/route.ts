import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { readDB, UPLOAD_DIR, type DB, type FileRecord } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const VISITOR_COOKIE = "gk_visitor";

/**
 * A file is only served to:
 *  - the user who uploaded it,
 *  - an admin / support user,
 *  - a visitor (by cookie) or signed-in user who has completed the unlock of a
 *    link whose destination is this file.
 * Knowing the file id alone is not enough.
 */
async function mayDownload(db: DB, file: FileRecord): Promise<boolean> {
  const session = await getSession();
  if (session) {
    if (file.userId && file.userId === session.userId) return true;
    const user = db.users.find((u) => u.id === session.userId);
    if (user && (user.role === "admin" || user.role === "support")) return true;
  }

  const linkIds = db.links
    .filter((l) => l.destinationType === "file" && l.fileId === file.id)
    .map((l) => l.id);
  if (linkIds.length === 0) return false;

  if (session && db.savedUnlocks.some((s) => s.userId === session.userId && linkIds.includes(s.linkId))) {
    return true;
  }
  const token = (await cookies()).get(VISITOR_COOKIE)?.value;
  if (!token) return false;
  return db.unlocks.some(
    (u) => u.visitorToken === token && linkIds.includes(u.linkId) && u.completedAt > 0
  );
}

export async function GET(_req: Request, ctx: RouteContext<"/api/files/[id]">) {
  const { id } = await ctx.params;
  const db = readDB();
  const file = db.files.find((f) => f.id === id);
  if (!file) return new Response("Not found", { status: 404 });
  // Same 404 as a missing file, so ids can't be probed.
  if (!(await mayDownload(db, file))) return new Response("Not found", { status: 404 });

  const full = path.join(UPLOAD_DIR, file.storedName);
  if (!full.startsWith(UPLOAD_DIR + path.sep) || !fs.existsSync(full)) {
    return new Response("Not found", { status: 404 });
  }
  const data = fs.readFileSync(full);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(data.length),
      "Content-Disposition": `attachment; filename="${file.name.replace(/["\r\n]/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

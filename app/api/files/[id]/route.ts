import fs from "node:fs";
import path from "node:path";
import { readDB, UPLOAD_DIR } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: RouteContext<"/api/files/[id]">) {
  const { id } = await ctx.params;
  const db = readDB();
  const file = db.files.find((f) => f.id === id);
  if (!file) return new Response("Not found", { status: 404 });
  const full = path.join(UPLOAD_DIR, file.storedName);
  if (!full.startsWith(UPLOAD_DIR) || !fs.existsSync(full)) {
    return new Response("Not found", { status: 404 });
  }
  const data = fs.readFileSync(full);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(data.length),
      "Content-Disposition": `attachment; filename="${file.name.replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=0",
    },
  });
}

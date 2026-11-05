import { readDB } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return new Response("Not logged in", { status: 401 });
  const url = new URL(req.url);
  const listId = url.searchParams.get("listId");
  const db = readDB();
  const list = db.emailLists.find((l) => l.id === listId && l.userId === session.userId);
  if (!list) return new Response("List not found", { status: 404 });

  const rows = db.subscribers.filter((s) => s.listId === list.id && !s.unsubscribedAt);
  const csv = ["email,joined_at", ...rows.map((r) => `${r.email},${new Date(r.joinedAt).toISOString()}`)].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${list.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-subscribers.csv"`,
    },
  });
}

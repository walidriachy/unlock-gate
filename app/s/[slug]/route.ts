import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request, ctx: RouteContext<"/s/[slug]">) {
  const { slug } = await ctx.params;
  const db = readDB();
  const row = db.shortLinks.find((s) => s.slug === slug);
  if (!row) {
    return NextResponse.redirect(new URL("/?short=404", req.url));
  }
  // Count the click, ignoring obvious bots and link previews.
  const ua = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider|preview|facebookexternalhit|slackbot|twitterbot|discordbot/i.test(ua);
  if (!isBot) {
    row.clicks += 1;
    writeDB(db);
  }
  return NextResponse.redirect(row.destinationUrl, 302);
}

import { NextResponse } from "next/server";
import { parseStreamingUrl } from "@/lib/streaming";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return NextResponse.json({ ok: false, error: "Missing url" }, { status: 400 });
  const meta = await parseStreamingUrl(url);
  if (!meta) return NextResponse.json({ ok: false, error: "Could not parse that link" }, { status: 422 });
  return NextResponse.json({ ok: true, meta });
}

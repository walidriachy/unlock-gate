import QRCode from "qrcode";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const data = url.searchParams.get("data") || "https://example.com";
  const svg = await QRCode.toString(data, {
    type: "svg",
    margin: 1,
    width: 320,
    color: { dark: "#0d0d17", light: "#ffffff" },
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

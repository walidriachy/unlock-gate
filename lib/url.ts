import { headers } from "next/headers";

/** Best-effort base URL for building absolute links (share, QR codes, redirects). */
export async function getBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "http";
    if (host) return `${proto}://${host}`;
  } catch {
    /* headers() unavailable outside a request */
  }
  return "http://localhost:3000";
}

export function shortDomain(): string {
  return process.env.NEXT_PUBLIC_SHORT_DOMAIN || "rkns.link";
}

export function bioDomain(): string {
  return process.env.NEXT_PUBLIC_BIO_DOMAIN || "rkns.me";
}

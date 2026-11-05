// Small in-memory rate limiter for auth endpoints.
// One process only — swap for Redis/Upstash when the app is deployed on a
// multi-instance host. Keys are hashed so emails/IPs don't sit in memory raw.

import crypto from "node:crypto";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5_000;

function keyFor(parts: string[]): string {
  return crypto.createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 32);
}

/** Returns true when the caller is still under the limit. */
export function underLimit(
  parts: string[],
  limit: number,
  windowMs: number
): boolean {
  const key = keyFor(parts);
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local"
  );
}

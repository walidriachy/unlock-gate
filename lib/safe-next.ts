/** Only allow same-site paths as a post-login destination. */
export function safeNext(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value) return fallback;
  const next = value.trim();
  if (!next.startsWith("/")) return fallback;
  // Reject protocol-relative URLs (//evil.com) and backslash tricks.
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

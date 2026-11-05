export interface EmailResult {
  sent: boolean;
  error?: string;
}

/** Sends via Resend when configured; otherwise reports not-sent (callers fall back to copy/mailto). */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "hello@example.com";
  if (!key) return { sent: false, error: "no-api-key" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) return { sent: false, error: `resend ${res.status}` };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: String(err) };
  }
}

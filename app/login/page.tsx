import Link from "next/link";
import { LoginForm } from "@/components/AuthForms";
import SocialAuth from "@/components/SocialAuth";
import Logo from "@/components/Logo";
import { loginProviders } from "@/lib/oauth-login";
import { safeNext } from "@/lib/safe-next";

export const metadata = { title: "Log in" };

const OAUTH_ERRORS: Record<string, string> = {
  cancelled: "Sign-in was cancelled before it finished.",
  "invalid-state": "That sign-in link has expired or was tampered with. Try again.",
  "state-mismatch": "That sign-in link was opened in a different browser. Start again here.",
  "missing-code": "The provider didn't send a sign-in code. Try again.",
  "provider-failed": "We couldn't finish signing in with that provider. Try again.",
  "email-unverified": "That account's email isn't verified with the provider, so we can't use it.",
  "rate-limited": "Too many sign-in attempts. Wait a few minutes and try again.",
  "unknown-provider": "That sign-in provider isn't supported.",
  "google-not-configured": "Google sign-in isn't set up in this environment yet.",
  "discord-not-configured": "Discord sign-in isn't set up in this environment yet.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; oauth_error?: string; next?: string }>;
}) {
  const { reset, oauth_error, next } = await searchParams;
  const dest = safeNext(next ?? null);
  const providers = loginProviders();
  const oauthMessage = oauth_error
    ? OAUTH_ERRORS[oauth_error] || "We couldn't complete that sign-in. Try again."
    : "";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <Link href="/" className="mb-8 flex justify-center">
        <Logo />
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm muted">Log in to your growth dashboard.</p>
        {reset && (
          <p className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] p-3 text-sm accent-text">
            Password updated. Every other device was signed out — log in with the new one.
          </p>
        )}
        {oauthMessage && (
          <p className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--color-bad)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-bad)_10%,transparent)] p-3 text-sm text-[var(--color-bad)]">
            {oauthMessage}
          </p>
        )}
        <div className="mt-6">
          <SocialAuth providers={providers} next={dest} />
          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wide faint">
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            or with email
            <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>
          <LoginForm next={dest} />
        </div>
        <p className="mt-5 text-center text-sm muted">
          No account?{" "}
          <Link href="/register" className="font-semibold accent-text">
            Start free
          </Link>
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";
import { RegisterForm } from "@/components/AuthForms";
import SocialAuth from "@/components/SocialAuth";
import Logo from "@/components/Logo";
import { loginProviders } from "@/lib/oauth-login";

export const metadata = { title: "Sign up free" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ link?: string }>;
}) {
  const { link } = await searchParams;
  const providers = loginProviders();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <Link href="/" className="mb-8 flex justify-center">
        <Logo />
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm muted">Unlimited links, email capture and a link in bio, free.</p>
        <div className="mt-6">
          <SocialAuth providers={providers} claim={link} />
          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wide faint">
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            or with email
            <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>
          <RegisterForm claimLinkId={link} />
        </div>
        <p className="mt-5 text-center text-sm muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold accent-text">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

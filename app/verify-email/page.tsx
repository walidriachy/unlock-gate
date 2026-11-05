import Link from "next/link";
import Logo from "@/components/Logo";
import VerifyEmail from "@/components/VerifyEmail";

export const metadata = { title: "Confirm your email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <Link href="/" className="mb-8 flex justify-center">
        <Logo />
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Confirm your email</h1>
        <p className="mt-1 text-sm muted">One click and your creator badge is live.</p>
        <div className="mt-6">
          <VerifyEmail token={token || ""} />
        </div>
      </div>
    </main>
  );
}

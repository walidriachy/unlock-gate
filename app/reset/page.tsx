import Link from "next/link";
import { ResetForm } from "@/components/AuthForms";
import Logo from "@/components/Logo";

export const metadata = { title: "Choose a new password" };

export default async function ResetPage({
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
        <h1 className="text-2xl font-bold">Choose a new password</h1>
        <p className="mt-1 text-sm muted">
          The link works once and expires 30 minutes after it was requested.
        </p>
        <div className="mt-6">
          <ResetForm token={token || ""} />
        </div>
      </div>
    </main>
  );
}

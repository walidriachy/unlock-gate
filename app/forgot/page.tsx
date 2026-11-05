import Link from "next/link";
import { ForgotForm } from "@/components/AuthForms";
import Logo from "@/components/Logo";

export const metadata = { title: "Reset your password" };

export default function ForgotPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <Link href="/" className="mb-8 flex justify-center">
        <Logo />
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="mt-1 text-sm muted">
          Enter the email you signed up with and we'll send a link to choose a new one.
        </p>
        <div className="mt-6">
          <ForgotForm />
        </div>
      </div>
    </main>
  );
}

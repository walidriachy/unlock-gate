import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-3xl font-extrabold">404 — not found</h1>
        <p className="mt-2 muted">That link, page or profile doesn't exist.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
          <Link href="/create" className="btn btn-primary">
            Create a link
          </Link>
        </div>
      </div>
    </main>
  );
}

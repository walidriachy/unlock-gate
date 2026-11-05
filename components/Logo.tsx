import Link from "next/link";

export function LockMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="10" width="16" height="11" rx="3" fill="currentColor" opacity="0.18" />
      <rect x="4" y="10" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 10V7.5a4 4 0 0 1 8 0V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="15.5" r="1.7" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ href = "/", small = false }: { href?: string; small?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-extrabold tracking-tight">
      <span className="accent-text">
        <LockMark size={small ? 20 : 26} />
      </span>
      <span className={small ? "text-base" : "text-lg"}>Gatekeeper</span>
    </Link>
  );
}

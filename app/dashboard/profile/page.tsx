import { getCurrentUser } from "@/lib/auth";
import ProfileClient from "@/components/ProfileClient";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const u = me.user;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Profile</h1>
          <p className="mt-1 text-sm muted">Your public creator page.</p>
        </div>
        {u.username && (
          <Link href={`/u/${u.username}`} target="_blank" className="btn btn-secondary">
            View profile ↗
          </Link>
        )}
      </div>
      <ProfileClient
        initial={{
          displayName: u.displayName,
          username: u.username ?? "",
          bio: u.bio,
          avatarUrl: u.avatarUrl,
          socials: u.socials,
          email: u.email,
          verified: Boolean(u.emailVerifiedAt),
        }}
      />
    </div>
  );
}

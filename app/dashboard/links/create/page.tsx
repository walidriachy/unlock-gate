import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { getBaseUrl } from "@/lib/url";
import LinkEditor from "@/components/LinkEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create link" };

export default async function DashboardCreateLink() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const baseUrl = await getBaseUrl();
  const collections = db.collections.filter((c) => c.userId === me.user.id).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/dashboard/links" className="text-sm muted hover:text-[var(--color-fg)]">
            ← Links
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Create a link</h1>
        </div>
      </div>
      <LinkEditor mode="create" baseUrl={baseUrl} owned username={me.user.username} collections={collections} />
    </div>
  );
}

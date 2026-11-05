import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { subscribersForList } from "@/lib/queries";
import SubscribersClient, { type SubRow } from "@/components/SubscribersClient";

export const dynamic = "force-dynamic";

export default async function EmailListDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const list = db.emailLists.find((l) => l.id === id && l.userId === me.user.id);
  if (!list) notFound();
  const rows: SubRow[] = subscribersForList(db, list.id).map((s) => ({ id: s.id, email: s.email, joinedAt: s.joinedAt }));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/email" className="text-sm muted hover:text-[var(--color-fg)]">
          ← Email lists
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{list.name}</h1>
      </div>
      <SubscribersClient listId={list.id} listName={list.name} rows={rows} pro={me.subscription.tier !== "free"} />
    </div>
  );
}

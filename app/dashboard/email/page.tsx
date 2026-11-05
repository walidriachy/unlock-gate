import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { listForUser } from "@/lib/queries";
import EmailListsClient, { type ListRow } from "@/components/EmailListsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Email lists" };

export default async function EmailPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const rows: ListRow[] = listForUser(db, me.user.id).map((l) => ({
    id: l.id,
    name: l.name,
    subscribers: db.subscribers.filter((s) => s.listId === l.id && !s.unsubscribedAt).length,
    createdAt: l.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Email lists</h1>
        <p className="mt-1 text-sm muted">Add an email step to any link and every download builds a list you own.</p>
      </div>
      <EmailListsClient rows={rows} />
    </div>
  );
}

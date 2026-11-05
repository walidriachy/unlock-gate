import MarketingNav from "@/components/MarketingNav";
import MarketingFooter from "@/components/MarketingFooter";
import LinkEditor from "@/components/LinkEditor";
import { getBaseUrl } from "@/lib/url";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Build your first link",
  description: "Add a destination and pick what visitors do to unlock it. No account needed.",
};

export default async function CreatePage() {
  const baseUrl = await getBaseUrl();
  const me = await getCurrentUser();
  const db = readDB();
  const collections = me
    ? db.collections.filter((c) => c.userId === me.user.id).map((c) => ({ id: c.id, name: c.name }))
    : [];

  return (
    <>
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <span className="badge badge-accent">No account needed</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Build your first link</h1>
          <p className="mt-2 max-w-2xl muted">
            Add a destination and pick what visitors do to unlock it. It goes live right away. Sign
            up afterwards to keep it, edit it and see its numbers.
          </p>
        </div>
        <LinkEditor
          mode="create"
          baseUrl={baseUrl}
          owned={Boolean(me)}
          username={me?.user.username ?? null}
          collections={collections}
        />
      </main>
      <MarketingFooter />
    </>
  );
}

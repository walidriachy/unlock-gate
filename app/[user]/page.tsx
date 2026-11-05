import { readDB } from "@/lib/db";
import PublicProfile from "@/components/PublicProfile";

export const dynamic = "force-dynamic";

export default async function VanityProfilePage({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;
  const db = readDB();
  return <PublicProfile db={db} username={user} />;
}

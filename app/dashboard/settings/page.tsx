import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { totalUnlocksForUser } from "@/lib/queries";
import SettingsClient from "@/components/SettingsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings & plan" };

export default async function SettingsPage() {
  const me = await getCurrentUser();
  if (!me) return null;
  const db = readDB();
  const totalUnlocks = totalUnlocksForUser(db, me.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Settings & plan</h1>
          <p className="mt-1 text-sm muted">Your plan, and how to upgrade, switch or cancel.</p>
        </div>
        <Link href="/dashboard/profile" className="btn btn-secondary">
          Profile & socials
        </Link>
      </div>

      <SettingsClient
        tier={me.subscription.tier}
        status={me.subscription.status}
        periodEnd={me.subscription.currentPeriodEnd}
        totalUnlocks={totalUnlocks}
        stripeEnabled={Boolean(process.env.STRIPE_SECRET_KEY)}
      />
    </div>
  );
}

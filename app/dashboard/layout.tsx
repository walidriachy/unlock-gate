import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav
        name={me.user.displayName || me.user.username || "you"}
        username={me.user.username}
        tier={me.subscription.tier}
      />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}

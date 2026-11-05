import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@/lib/db";

export type AdminRole = "admin" | "support";

export function isAdmin(user: User | null | undefined): user is User & { role: AdminRole } {
  return Boolean(user && (user.role === "admin" || user.role === "support"));
}

export function isAdminRole(user: User | null | undefined): user is User & { role: "admin" } {
  return Boolean(user && user.role === "admin");
}

/** Use in server components / route handlers. Redirects non-admins. */
export async function requireAdmin(): Promise<User> {
  const me = await getCurrentUser();
  if (!me || !isAdmin(me.user)) redirect("/");
  return me.user;
}

/** API-level guard: returns the user or null. */
export async function adminFromSession(): Promise<User | null> {
  const me = await getCurrentUser();
  if (!me || !isAdmin(me.user)) return null;
  return me.user;
}

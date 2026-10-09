import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/mongoose";
import { User, type IUser, type UserRole } from "@/models/User";

export async function getCurrentSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function getCurrentUser(): Promise<IUser | null> {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findById(session.user.id);

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

/*
 * PAGE AUTHORIZATION
 */

export async function requireAuth() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

export async function requireCustomer() {
  const session = await requireAuth();

  if (session.user.role !== "customer") {
    redirect("/");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}

/*
 * API AUTHORIZATION
 *
 * These return null instead of redirecting.
 */

export async function getApiSession() {
  return getCurrentSession();
}

export async function getAuthenticatedApiSession() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findById(session.user.id).select("_id role isActive").lean();

  if (!user || !user.isActive) {
    return null;
  }

  /*
   * Prevent stale sessions from retaining an old role.
   *
   * Example:
   * customer -> admin
   * admin -> customer
   * customer -> deactivated
   *
   * The database remains the source of truth.
   */
  if (user.role !== session.user.role) {
    return null;
  }

  return session;
}

export async function getAdminApiSession() {
  const session = await getAuthenticatedApiSession();

  if (!session) {
    return null;
  }

  if (session.user.role !== "admin") {
    return null;
  }

  return session;
}

export function hasSessionRole(session: Session | null, role: UserRole) {
  return session?.user?.role === role;
}

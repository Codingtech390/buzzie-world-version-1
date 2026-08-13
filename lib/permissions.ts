import { USER_ROLES } from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export function isAdmin(role?: string | null) {
  return role === USER_ROLES.ADMIN;
}

export function isCustomer(role?: string | null) {
  return role === USER_ROLES.CUSTOMER;
}

export function hasRole(userRole: string | null | undefined, allowedRoles: UserRole[]) {
  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole as UserRole);
}

export type AccountUserRole = "customer";

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: AccountUserRole;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
  addressCount: number;
}

export type CustomerProfile = AccountUser;

export interface CustomerProfileResponse {
  success: boolean;
  data?: CustomerProfile;
  message?: string;
}

export interface UpdateCustomerProfileInput {
  name: string;
  phone?: string;
}

export interface UpdateCustomerProfileResponse {
  success: boolean;
  data?: CustomerProfile;
  message?: string;
}

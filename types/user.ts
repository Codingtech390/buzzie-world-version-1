export type UserRole = "customer" | "admin";

export interface UserAddress {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  image?: string;
  addresses?: UserAddress[];
  createdAt: string;
  updatedAt: string;
}

import { connectToDatabase } from "@/lib/mongoose";
import { User, type IUser } from "@/models/User";
import type { CustomerProfile, UpdateCustomerProfileInput } from "@/types/customer-account";

function serializeDate(value?: Date | null) {
  return value ? new Date(value).toISOString() : null;
}

function serializeCustomer(user: IUser): CustomerProfile {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || undefined,
    image: user.image || undefined,
    role: "customer",
    emailVerified: serializeDate(user.emailVerified),
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : new Date().toISOString(),
    addressCount: Array.isArray(user.addresses) ? user.addresses.length : 0,
  };
}

async function findActiveCustomer(userId: string) {
  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user || !user.isActive || user.role !== "customer") {
    return null;
  }

  return user;
}

export async function getCustomerProfile(userId: string) {
  const user = await findActiveCustomer(userId);

  if (!user) {
    return null;
  }

  return serializeCustomer(user);
}

export async function updateCustomerProfile(userId: string, input: UpdateCustomerProfileInput) {
  const user = await findActiveCustomer(userId);

  if (!user) {
    throw new Error("Customer account not found.");
  }

  const name = input.name.trim();
  const phone = input.phone?.trim() || undefined;

  if (!name) {
    throw new Error("Name is required.");
  }

  if (name.length < 2) {
    throw new Error("Name must be at least 2 characters.");
  }

  if (name.length > 80) {
    throw new Error("Name must be 80 characters or fewer.");
  }

  if (phone && phone.length > 20) {
    throw new Error("Phone number must be 20 characters or fewer.");
  }

  user.name = name;
  user.phone = phone;

  await user.save();

  return serializeCustomer(user);
}

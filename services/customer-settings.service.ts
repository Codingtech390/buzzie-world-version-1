import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { changeUserPassword } from "@/services/auth.service";
import type {
  ChangePasswordInput,
  CustomerPreferences,
  CustomerSettings,
} from "@/types/customer-settings";

function assertValidUserId(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer ID.");
  }
}

export async function getCustomerSettings(userId: string): Promise<CustomerSettings | null> {
  assertValidUserId(userId);

  await connectToDatabase();

  const user = await User.findById(userId).select("preferences password isActive").lean();

  if (!user || !user.isActive) {
    return null;
  }

  return {
    preferences: {
      emailNotifications: user.preferences?.emailNotifications ?? true,
      marketingEmails: user.preferences?.marketingEmails ?? false,
      wishlistReminders: user.preferences?.wishlistReminders ?? false,
    },
    hasPassword: Boolean(user.password),
  };
}

export async function updateCustomerPreferences(userId: string, preferences: CustomerPreferences) {
  assertValidUserId(userId);

  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    throw new Error("Account not found.");
  }

  user.preferences = {
    emailNotifications: Boolean(preferences.emailNotifications),
    marketingEmails: Boolean(preferences.marketingEmails),
    wishlistReminders: Boolean(preferences.wishlistReminders),
  };

  await user.save();

  return {
    emailNotifications: user.preferences.emailNotifications,
    marketingEmails: user.preferences.marketingEmails,
    wishlistReminders: user.preferences.wishlistReminders,
  };
}

export async function updateCustomerPassword(userId: string, input: ChangePasswordInput) {
  assertValidUserId(userId);

  await changeUserPassword(userId, input.currentPassword, input.newPassword);

  return true;
}

export async function deleteCustomerAccount(userId: string) {
  assertValidUserId(userId);

  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user || !user.isActive) {
    return false;
  }

  /*
   * Soft-delete the customer account instead of physically
   * deleting the User document.
   *
   * This preserves historical order/review relationships
   * while preventing further account access.
   */
  user.isActive = false;

  user.name = "Deleted Customer";
  user.email = `deleted-${user._id.toString()}@deleted.buzzieworld.local`;
  user.phone = undefined;
  user.image = undefined;
  user.googleId = undefined;
  user.password = undefined;
  user.addresses = [];

  user.preferences = {
    emailNotifications: false,
    marketingEmails: false,
  };

  await user.save();

  return true;
}

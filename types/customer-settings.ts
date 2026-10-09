export interface CustomerPreferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  wishlistReminders: boolean;
}

export interface CustomerSettings {
  preferences: CustomerPreferences;
  hasPassword: boolean;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

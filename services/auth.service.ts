import crypto from "crypto";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongoose";
import { User, type IUser, type UserRole } from "@/models/User";
import { PasswordResetToken } from "@/models/PasswordResetToken";

const PASSWORD_SALT_ROUNDS = 12;
const RESET_TOKEN_EXPIRY_MINUTES = 60;

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  image?: string;
  emailVerified?: Date | null;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sanitizeUser(user: IUser): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    image: user.image,
    emailVerified: user.emailVerified ?? null,
  };
}

export async function findUserByEmail(email: string, includePassword = false) {
  await connectToDatabase();

  const query = User.findOne({
    email: normalizeEmail(email),
  });

  if (includePassword) {
    query.select("+password");
  }

  return query;
}

export async function findUserById(id: string) {
  await connectToDatabase();

  return User.findById(id);
}

export async function createUser(input: RegisterUserInput) {
  await connectToDatabase();

  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;
  const phone = input.phone?.trim();

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    phone: phone || undefined,

    /*
     * Never accept role from the registration request.
     */
    role: "customer",

    isActive: true,
  });

  return sanitizeUser(user);
}

export async function authenticateCredentials(email: string, password: string) {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return null;
  }

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  if (!user.password) {
    /*
     * Google-only accounts cannot authenticate through
     * the password provider.
     */
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return null;
  }

  return sanitizeUser(user);
}

export async function findOrCreateGoogleUser(input: {
  googleId: string;
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  await connectToDatabase();

  const email = normalizeEmail(input.email);

  if (!email) {
    throw new Error("Google account does not contain an email address.");
  }

  /*
   * First preference: existing Google identity.
   */
  let user = await User.findOne({
    googleId: input.googleId,
  });

  if (user) {
    if (!user.isActive) {
      throw new Error("This account has been disabled.");
    }

    return sanitizeUser(user);
  }

  /*
   * Second preference: existing account with the same verified
   * Google email. Google provider gives us the verified identity.
   */
  user = await User.findOne({
    email,
  });

  if (user) {
    if (!user.isActive) {
      throw new Error("This account has been disabled.");
    }

    user.googleId = input.googleId;

    if (!user.image && input.image) {
      user.image = input.image;
    }

    if (!user.emailVerified) {
      user.emailVerified = new Date();
    }

    await user.save();

    return sanitizeUser(user);
  }

  /*
   * New Google account.
   */
  user = await User.create({
    name: input.name?.trim() || email.split("@")[0] || "BuzzieWorld Customer",

    email,

    /*
     * No password is created for a Google-only account.
     */
    googleId: input.googleId,

    image: input.image || undefined,

    role: "customer",

    isActive: true,

    emailVerified: new Date(),
  });

  return sanitizeUser(user);
}

export async function updateUserPassword(userId: string, password: string) {
  await connectToDatabase();

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("Account not found.");
  }

  user.password = passwordHash;

  await user.save();

  return sanitizeUser(user);
}

export async function createPasswordResetToken(email: string) {
  await connectToDatabase();

  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({
    email: normalizedEmail,
  });

  /*
   * Always return null for unknown accounts.
   * This prevents email enumeration.
   */
  if (!user || !user.isActive) {
    return null;
  }

  /*
   * Invalidate previous tokens.
   */
  await PasswordResetToken.deleteMany({
    user: user._id,
  });

  const rawToken = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

  await PasswordResetToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  return {
    token: rawToken,
    expiresAt,
    user: sanitizeUser(user),
  };
}

export async function resetPasswordWithToken(rawToken: string, password: string) {
  await connectToDatabase();

  if (!rawToken) {
    throw new Error("Invalid or expired reset token.");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const resetToken = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: {
      $gt: new Date(),
    },
  });

  if (!resetToken) {
    throw new Error("Invalid or expired reset token.");
  }

  const user = await User.findById(resetToken.user);

  if (!user || !user.isActive) {
    await PasswordResetToken.deleteOne({
      _id: resetToken._id,
    });

    throw new Error("Invalid or expired reset token.");
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  user.password = passwordHash;

  await user.save();

  /*
   * Reset tokens are single-use.
   */
  await PasswordResetToken.deleteMany({
    user: user._id,
  });

  return sanitizeUser(user);
}

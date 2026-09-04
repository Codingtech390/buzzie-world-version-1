import { z } from "zod";

const optionalString = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, z.string().optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  MONGODB_URI: z.string().min(1),

  // NextAuth
  NEXTAUTH_SECRET: optionalString,
  NEXTAUTH_URL: optionalString,

  // Google OAuth
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,

  // Password reset email
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: optionalString,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: optionalString,
  CLOUDINARY_API_KEY: optionalString,
  CLOUDINARY_API_SECRET: optionalString,

  // Razorpay
  RAZORPAY_KEY_ID: optionalString,
  RAZORPAY_KEY_SECRET: optionalString,
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,

  MONGODB_URI: process.env.MONGODB_URI,

  // NextAuth
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // Password reset email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Razorpay
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
});

import { z } from "zod";

export const settingsSchema = z
  .object({
    storeName: z.string().trim().min(2).max(100),
    tagline: z.string().trim().max(200),
    supportEmail: z
      .string()
      .trim()
      .max(254, "Support email must be 254 characters or fewer.")
      .refine(
        (value) => value === "" || z.string().email().safeParse(value).success,
        "Enter a valid support email address.",
      ),
    supportPhone: z.string().trim().max(25),
    storeUrl: z
      .string()
      .trim()
      .max(300)
      .refine(
        (value) => value === "" || /^https?:\/\/.+/i.test(value),
        "Enter a valid URL beginning with http:// or https://.",
      ),
    currency: z.literal("INR"),
    timezone: z.string().trim().min(1).max(100),
    storeEnabled: z.boolean(),

    announcementEnabled: z.boolean(),
    announcementText: z.string().trim().max(250),

    allowGuestCheckout: z.boolean(),
    minOrderValue: z.number().min(0).max(10000000),
    freeShippingThreshold: z.number().min(0).max(10000000),
    flatShippingRate: z.number().min(0).max(1000000),
    estimatedDeliveryMinDays: z.number().int().min(0).max(90),
    estimatedDeliveryMaxDays: z.number().int().min(0).max(90),
    orderPrefix: z
      .string()
      .trim()
      .min(1)
      .max(12)
      .regex(/^[A-Za-z0-9-]+$/, "Use only letters, numbers and hyphens for the order prefix."),

    taxEnabled: z.boolean(),
    taxRate: z.number().min(0).max(100),
    pricesIncludeTax: z.boolean(),

    seoTitle: z.string().trim().max(70),
    seoDescription: z.string().trim().max(300),
    instagramUrl: z
      .string()
      .trim()
      .max(300)
      .refine(
        (value) => value === "" || /^https?:\/\/.+/i.test(value),
        "Enter a valid URL beginning with http:// or https://.",
      ),
    facebookUrl: z
      .string()
      .trim()
      .max(300)
      .refine(
        (value) => value === "" || /^https?:\/\/.+/i.test(value),
        "Enter a valid URL beginning with http:// or https://.",
      ),

    maintenanceMode: z.boolean(),
  })
  .strip()
  .refine((settings) => settings.estimatedDeliveryMaxDays >= settings.estimatedDeliveryMinDays, {
    message: "Maximum delivery days must be greater than or equal to minimum delivery days.",
    path: ["estimatedDeliveryMaxDays"],
  });

export type SiteSettings = z.infer<typeof settingsSchema>;

export const defaultSiteSettings: SiteSettings = {
  storeName: "BuzzieWorld",
  tagline: "A little world of big adventures.",
  supportEmail: "",
  supportPhone: "",
  storeUrl: "",
  currency: "INR",
  timezone: "Asia/Kolkata",
  storeEnabled: true,

  announcementEnabled: false,
  announcementText: "",

  allowGuestCheckout: true,
  minOrderValue: 0,
  freeShippingThreshold: 999,
  flatShippingRate: 60,
  estimatedDeliveryMinDays: 3,
  estimatedDeliveryMaxDays: 7,
  orderPrefix: "BW",

  taxEnabled: false,
  taxRate: 0,
  pricesIncludeTax: true,

  seoTitle: "BuzzieWorld | Discover a World of Fun",
  seoDescription: "Discover toys, essentials and delightful finds for little ones at BuzzieWorld.",
  instagramUrl: "",
  facebookUrl: "",

  maintenanceMode: false,
};

export const APP_CONSTANTS = {
  pagination: {
    defaultPage: 1,
    defaultLimit: 12,
    maxLimit: 50,
  },

  product: {
    maxImages: 10,
    minPrice: 0,
  },

  cart: {
    maxQuantityPerItem: 20,
  },

  order: {
    currency: "INR",
  },

  upload: {
    maxImageSizeMB: 10,
  },
} as const;

export const USER_ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PRODUCT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

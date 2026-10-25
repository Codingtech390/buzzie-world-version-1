import mongoose, { Schema, type Model, type Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  slug: string;
  sku?: string;
  image?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface IShipment {
  courier: string;
  trackingNumber: string;
  trackingUrl?: string;
  status: "pending" | "shipped" | "in_transit" | "delivered";
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface IOrder {
  orderNumber: string;
  user?: Types.ObjectId;

  items: IOrderItem[];

  shippingAddress: IShippingAddress;

  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  shipment?: IShipment;

  // Payment provider
  paymentProvider?: "razorpay" | "cashfree";

  // Legacy Razorpay fields — retain for historical orders
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  // Cashfree payment fields
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine2: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      default: "India",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const ShipmentSchema = new Schema<IShipment>(
  {
    courier: {
      type: String,
      required: true,
      trim: true,
    },

    trackingNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    trackingUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "delivered"],
      default: "pending",
    },

    shippedAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    _id: false,
  },
);


const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (value: IOrderItem[]) => value.length > 0,
        message: "Order must contain at least one item",
      },
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    // Payment provider.
    // Existing orders without this field remain readable.
    paymentProvider: {
      type: String,
      enum: ["razorpay", "cashfree"],
      default: "razorpay",
      index: true,
    },

    shipment: {
      type: ShipmentSchema,
      default: undefined,
    },

    // Legacy Razorpay identifiers — do not remove
    razorpayOrderId: {
      type: String,
      index: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      index: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
    },

    // Cashfree identifiers
    cashfreeOrderId: {
      type: String,
      sparse: true,
      index: true,
    },

    cashfreePaymentId: {
      type: String,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);

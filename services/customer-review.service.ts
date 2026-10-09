import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Review, type ReviewStatus } from "@/models/Review";
import type { CustomerReview, ReviewableProduct } from "@/types/customer-review";

function assertValidUserId(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }
}

function assertValidProductId(productId: string) {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product.");
  }
}

function assertValidReviewId(reviewId: string) {
  if (!Types.ObjectId.isValid(reviewId)) {
    throw new Error("Invalid review.");
  }
}

function serializeReview(review: {
  _id: Types.ObjectId;
  product?: {
    _id?: Types.ObjectId;
    name?: string;
    slug?: string;
    images?: Array<string | { url?: string }>;
  } | null;
  rating?: number;
  title?: string;
  comment?: string;
  verifiedPurchase?: boolean;
  status?: ReviewStatus;
  createdAt?: Date;
  updatedAt?: Date;
}): CustomerReview {
  const product = review.product;

  const firstImage = product?.images?.[0];

  const image = typeof firstImage === "string" ? firstImage : (firstImage?.url ?? null);

  return {
    id: review._id.toString(),

    product: {
      id: product?._id?.toString() ?? "",
      name: product?.name ?? "Product",
      slug: product?.slug ?? "",
      image,
    },

    rating: review.rating ?? 0,
    title: review.title ?? "",
    comment: review.comment ?? "",

    verifiedPurchase: Boolean(review.verifiedPurchase),
    status: review.status ?? "pending",

    createdAt:
      review.createdAt instanceof Date ? review.createdAt.toISOString() : new Date().toISOString(),

    updatedAt:
      review.updatedAt instanceof Date ? review.updatedAt.toISOString() : new Date().toISOString(),
  };
}

/**
 * Return reviews belonging only to the authenticated customer.
 */
export async function getCustomerReviews(userId: string): Promise<CustomerReview[]> {
  await connectToDatabase();

  assertValidUserId(userId);

  const reviews = await Review.find({
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: "product",
      select: "name slug images",
    })
    .lean();

  return reviews.map((review) => serializeReview(review));
}

/**
 * Determine whether the customer has actually purchased
 * the requested product.
 *
 * A valid purchase is:
 * - owned by this customer
 * - payment completed
 * - product exists in the order items
 * - order is not cancelled
 */
async function verifyCustomerPurchase(userId: string, productId: string): Promise<boolean> {
  const order = await Order.exists({
    user: userId,
    paymentStatus: "paid",
    status: {
      $ne: "cancelled",
    },
    "items.product": productId,
  });

  return Boolean(order);
}

/**
 * Get products this customer is eligible to review.
 */
export async function getReviewableProducts(userId: string): Promise<ReviewableProduct[]> {
  await connectToDatabase();

  assertValidUserId(userId);

  const orders = await Order.find({
    user: userId,
    paymentStatus: "paid",
    status: {
      $ne: "cancelled",
    },
  })
    .select("items.product")
    .lean();

  const productIds = Array.from(
    new Set(orders.flatMap((order) => order.items.map((item) => item.product.toString()))),
  );

  if (productIds.length === 0) {
    return [];
  }

  const existingReviews = await Review.find({
    user: userId,
    product: {
      $in: productIds,
    },
  })
    .select("product")
    .lean();

  const reviewedProductIds = new Set(existingReviews.map((review) => review.product.toString()));

  const eligibleProductIds = productIds.filter((productId) => !reviewedProductIds.has(productId));

  if (eligibleProductIds.length === 0) {
    return [];
  }

  const products = await Product.find({
    _id: {
      $in: eligibleProductIds,
    },
    status: "active",
    published: true,
  })
    .select("_id name slug images")
    .sort({
      name: 1,
    })
    .lean();

  return products.map((product) => {
    const firstImage = product.images?.[0];

    return {
      productId: product._id.toString(),
      name: product.name,
      slug: product.slug,
      image: typeof firstImage === "string" ? firstImage : (firstImage?.url ?? null),
    };
  });
}

/**
 * Create a customer-owned review.
 */
export async function createCustomerReview(
  userId: string,
  input: {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
  },
): Promise<CustomerReview> {
  await connectToDatabase();

  assertValidUserId(userId);
  assertValidProductId(input.productId);

  const rating = Number(input.rating);
  const title = input.title?.trim() ?? "";
  const comment = input.comment.trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  if (!comment) {
    throw new Error("Review comment is required.");
  }

  if (comment.length > 2000) {
    throw new Error("Review comment cannot exceed 2000 characters.");
  }

  if (title.length > 150) {
    throw new Error("Review title cannot exceed 150 characters.");
  }

  const user = await import("@/models/User").then(({ User }) =>
    User.findById(userId).select("name email"),
  );

  if (!user) {
    throw new Error("Customer not found.");
  }

  const product = await Product.findOne({
    _id: input.productId,
    status: "active",
    published: true,
  })
    .select("_id name slug images")
    .lean();

  if (!product) {
    throw new Error("Product not found or is no longer available.");
  }

  const verifiedPurchase = await verifyCustomerPurchase(userId, input.productId);

  if (!verifiedPurchase) {
    throw new Error("You can review only products you have purchased.");
  }

  const existingReview = await Review.findOne({
    user: userId,
    product: input.productId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product.");
  }

  const review = await Review.create({
    product: product._id,
    user: user._id,
    customerName: user.name,
    customerEmail: user.email,

    rating,
    title: title || undefined,
    comment,

    verifiedPurchase: true,

    /*
     * Customer submissions always enter moderation.
     * Never allow the customer to publish their own review.
     */
    status: "pending",
  });

  const populatedReview = await Review.findById(review._id)
    .populate({
      path: "product",
      select: "name slug images",
    })
    .lean();

  if (!populatedReview) {
    throw new Error("Unable to load the created review.");
  }

  return serializeReview(populatedReview);
}

/**
 * Update a review belonging to the authenticated customer.
 *
 * Editing sends the review back to moderation.
 */
export async function updateCustomerReview(
  userId: string,
  reviewId: string,
  input: {
    rating: number;
    title?: string;
    comment: string;
  },
): Promise<CustomerReview | null> {
  await connectToDatabase();

  assertValidUserId(userId);
  assertValidReviewId(reviewId);

  const rating = Number(input.rating);
  const title = input.title?.trim() ?? "";
  const comment = input.comment.trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  if (!comment) {
    throw new Error("Review comment is required.");
  }

  if (comment.length > 2000) {
    throw new Error("Review comment cannot exceed 2000 characters.");
  }

  if (title.length > 150) {
    throw new Error("Review title cannot exceed 150 characters.");
  }

  const existingReview = await Review.findOne({
    _id: reviewId,
    user: userId,
  });

  if (!existingReview) {
    return null;
  }

  const review = await Review.findOneAndUpdate(
    {
      _id: reviewId,
      user: userId,
    },
    {
      $set: {
        rating,
        title: title || undefined,
        comment,

        /*
         * Any customer edit must go back through moderation.
         */
        status: "pending",
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate({
      path: "product",
      select: "name slug images",
    })
    .lean();

  if (!review) {
    return null;
  }

  return serializeReview(review);
}

/**
 * Delete only a review owned by the authenticated customer.
 */
export async function deleteCustomerReview(userId: string, reviewId: string): Promise<boolean> {
  await connectToDatabase();

  assertValidUserId(userId);
  assertValidReviewId(reviewId);

  const result = await Review.deleteOne({
    _id: reviewId,
    user: userId,
  });

  return result.deletedCount === 1;
}

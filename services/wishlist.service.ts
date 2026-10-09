import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Wishlist from "@/models/Wishlist";

function validateUserId(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }
}

function validateProductId(productId: string) {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product.");
  }
}

export async function getCustomerWishlist(userId: string) {
  await connectToDatabase();

  validateUserId(userId);

  const wishlist = await Wishlist.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "product",
      select: "name slug price compareAtPrice images stock published",
    })
    .lean();

  return wishlist
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product as {
        _id: Types.ObjectId;
        name: string;
        slug: string;
        price?: number;
        compareAtPrice?: number;
        images?: string[];
        stock?: number;
        published?: boolean;
      };

      return {
        id: item._id.toString(),
        productId: product._id.toString(),
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || "/images/placeholder-product.png",
        price: typeof product.price === "number" ? product.price : 0,
        compareAtPrice:
          typeof product.compareAtPrice === "number" ? product.compareAtPrice : undefined,
        inStock: typeof product.stock === "number" && product.stock > 0 && product.published,
        addedAt: item.createdAt.toISOString(),
      };
    });
}

export async function addToWishlist(userId: string, productId: string) {
  await connectToDatabase();

  validateUserId(userId);
  validateProductId(productId);

  const product = await Product.findById(productId)
    .select("name slug price compareAtPrice images stock published")
    .lean();

  if (!product) {
    throw new Error("Product not found.");
  }

 if (product.published === false) {
   throw new Error("This product is not available.");
 }

  const wishlistItem = await Wishlist.findOneAndUpdate(
    {
      user: userId,
      product: productId,
    },
    {
      $setOnInsert: {
        user: userId,
        product: productId,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  if (!wishlistItem) {
    throw new Error("Unable to add product to wishlist.");
  }

  return {
    id: wishlistItem._id.toString(),
    productId: product._id.toString(),
    name: product.name,
    slug: product.slug,
    image: product.images?.[0] || "/images/placeholder-product.png",
    price: typeof product.price === "number" ? product.price : 0,
    compareAtPrice: typeof product.compareAtPrice === "number" ? product.compareAtPrice : undefined,
    inStock: typeof product.stock === "number" && product.stock > 0 && product.published,
    addedAt: wishlistItem.createdAt.toISOString(),
  };
}

export async function removeFromWishlist(userId: string, productId: string) {
  await connectToDatabase();

  validateUserId(userId);
  validateProductId(productId);

  const result = await Wishlist.deleteOne({
    user: userId,
    product: productId,
  });

  if (result.deletedCount === 0) {
    throw new Error("Wishlist item not found.");
  }

  return true;
}

export async function isProductInWishlist(userId: string, productId: string) {
  await connectToDatabase();

  validateUserId(userId);
  validateProductId(productId);

  const item = await Wishlist.exists({
    user: userId,
    product: productId,
  });

  return Boolean(item);
}

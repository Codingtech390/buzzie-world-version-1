import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";
import type { CartItemWithProduct, CartResponse } from "@/types/cart";

export async function getOrCreateCart(sessionId: string) {
  await connectToDatabase();

  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = await Cart.create({
      sessionId,
      items: [],
    });
  }

  return cart;
}

export async function getCart(sessionId: string): Promise<CartResponse> {
  await connectToDatabase();

  const cart = await getOrCreateCart(sessionId);

  const validItems = cart.items.filter((item) => Types.ObjectId.isValid(item.product));

  const productIds = validItems.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
    status: "active",
  })
    .select("_id name slug price compareAtPrice images stock sku")
    .lean();

  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const items: CartItemWithProduct[] = [];

  for (const item of validItems) {
    const product = productMap.get(item.product.toString());

    if (!product) {
      continue;
    }

    const quantity = Math.min(item.quantity, Math.max(product.stock, 0));

    if (quantity < 1) {
      continue;
    }

    items.push({
      productId: product._id.toString(),
      quantity,
      product: {
        _id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        images: product.images ?? [],
        stock: product.stock,
        sku: product.sku,
      },
      lineTotal: product.price * quantity,
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    success: true,
    items,
    subtotal,
    itemCount,
  };
}

export async function addToCart(sessionId: string, productId: string, quantity: number) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const product = await Product.findOne({
    _id: productId,
    status: "active",
  }).lean();

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < 1) {
    throw new Error("Product is out of stock");
  }

  const cart = await getOrCreateCart(sessionId);

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
  } else {
    cart.items.push({
      product: new Types.ObjectId(productId),
      quantity: Math.min(quantity, product.stock),
    });
  }

  await cart.save();

  return getCart(sessionId);
}

export async function updateCartItem(sessionId: string, productId: string, quantity: number) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const cart = await getOrCreateCart(sessionId);

  const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((cartItem) => cartItem.product.toString() !== productId);
  } else {
    const product = await Product.findOne({
      _id: productId,
      status: "active",
    }).lean();

    if (!product) {
      throw new Error("Product not found");
    }

    item.quantity = Math.min(quantity, product.stock);
  }

  await cart.save();

  return getCart(sessionId);
}

export async function removeFromCart(sessionId: string, productId: string) {
  await connectToDatabase();

  const cart = await getOrCreateCart(sessionId);

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  await cart.save();

  return getCart(sessionId);
}

export async function clearCart(sessionId: string) {
  await connectToDatabase();

  const cart = await getOrCreateCart(sessionId);

  cart.items = [];

  await cart.save();

  return getCart(sessionId);
}

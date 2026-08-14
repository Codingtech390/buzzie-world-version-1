"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";

export default function CartClient() {
  const { cart, loading, error, updateItem, removeItem } = useCart();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-black/50">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Unable to load cart</h1>

        <p className="mt-2 text-black/55">{error}</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8EC]">
          <ShoppingBag className="h-7 w-7 text-[#3F7DFF]" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold">Your cart is empty</h1>

        <p className="mt-2 text-black/55">Discover something special for your little one.</p>

        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3F7DFF] px-5 py-3 font-medium text-white"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-[#3F7DFF]">BUZZIEWORLD</p>

        <h1 className="mt-2 text-4xl font-semibold">Your Cart</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <section>
          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdate={async (productId, quantity) => {
                await updateItem(productId, quantity);
              }}
              onRemove={async (productId) => {
                await removeItem(productId);
              }}
            />
          ))}
        </section>

        <aside className="h-fit rounded-2xl bg-[#FFF8EC] p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="mt-6 flex justify-between text-sm">
            <span>Items</span>
            <span>{cart.itemCount}</span>
          </div>

          <div className="mt-3 flex justify-between">
            <span>Subtotal</span>
            <strong>₹{cart.subtotal.toFixed(2)}</strong>
          </div>

          <p className="mt-3 text-xs text-black/50">
            Shipping and applicable charges are calculated during checkout.
          </p>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3F7DFF] px-5 py-3 font-medium text-white"
          >
            Proceed to Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/shop"
            className="mt-3 flex w-full justify-center rounded-xl border border-black/10 px-5 py-3 text-sm font-medium"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

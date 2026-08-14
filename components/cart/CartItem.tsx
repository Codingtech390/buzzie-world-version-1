"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItemWithProduct } from "@/types/cart";

interface CartItemProps {
  item: CartItemWithProduct;
  onUpdate: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

export default function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  const image = item.product.images?.[0]?.url;

  return (
    <div className="flex gap-4 border-b border-black/10 py-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#FFF8EC]">
        {image ? (
          <Image
            src={image}
            alt={item.product.images?.[0]?.alt || item.product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-black/40">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{item.product.name}</h3>

            <p className="mt-1 text-sm text-black/55">₹{item.product.price.toFixed(2)}</p>
          </div>

          <button
            type="button"
            onClick={() => void onRemove(item.productId)}
            className="text-black/45 transition hover:text-red-500"
            aria-label="Remove product"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center overflow-hidden rounded-lg border border-black/10">
            <button
              type="button"
              onClick={() => void onUpdate(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-2 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="min-w-9 text-center text-sm">{item.quantity}</span>

            <button
              type="button"
              onClick={() => void onUpdate(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="p-2 disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <strong>₹{item.lineTotal.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Heart, Minus, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductPurchaseOptionsProps {
  productId: string;
  price: number;
  stock: number;
  disabled?: boolean;
}

const BULK_OPTIONS = [
  { quantity: 5, discountPercent: 5, label: "Pack of 5" },
  { quantity: 20, discountPercent: 10, label: "Pack of 20" },
] as const;

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductPurchaseOptions({
  productId,
  price,
  stock,
  disabled = false,
}: ProductPurchaseOptionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [bulkQuantity, setBulkQuantity] = useState<number | null>(null);

  const maxQuantity = Math.max(stock, 1);
  const selectedQuantity = bulkQuantity ?? quantity;

  const selectedBulk = useMemo(
    () => BULK_OPTIONS.find((option) => option.quantity === bulkQuantity),
    [bulkQuantity],
  );

  const selectedUnitPrice = selectedBulk ? price * (1 - selectedBulk.discountPercent / 100) : price;

  const selectedTotal = selectedUnitPrice * selectedQuantity;

  function selectQuantity(nextQuantity: number) {
    setBulkQuantity(null);
    setQuantity(Math.min(Math.max(nextQuantity, 1), maxQuantity));
  }

  function selectBulk(nextQuantity: number) {
    setBulkQuantity(nextQuantity);
    setQuantity(Math.min(nextQuantity, maxQuantity));
  }

  return (
    <div className="mt-4 space-y-2.5">
      <div className="rounded-[18px] border border-white/75 bg-white/55 p-2.5 shadow-[0_8px_22px_rgba(39,52,74,0.04)] backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.55rem] font-black uppercase tracking-[0.14em] text-[#27344A]">
              Quantity
            </p>
            <p className="mt-0.5 text-[0.48rem] text-[#687489]">
              {selectedBulk ? `${selectedBulk.label} selected` : "Choose how many you need"}
            </p>
          </div>

          <div className="flex h-8 items-center overflow-hidden rounded-full border border-[#EEDDBB] bg-white/85">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={disabled || selectedQuantity <= 1}
              onClick={() => selectQuantity(selectedQuantity - 1)}
              className="flex size-8 items-center justify-center text-[#526075] transition hover:bg-[#FFF8EC] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus className="size-3" />
            </button>

            <span className="min-w-7 text-center text-[0.65rem] font-black text-[#27344A]">
              {selectedQuantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              disabled={disabled || selectedQuantity >= maxQuantity}
              onClick={() => selectQuantity(selectedQuantity + 1)}
              className="flex size-8 items-center justify-center text-[#526075] transition hover:bg-[#FFF8EC] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-[0.55rem] font-black uppercase tracking-[0.14em] text-[#27344A]">
            Buy in bulk
          </p>
          <span className="inline-flex items-center gap-1 text-[0.45rem] font-bold text-[#B68100]">
            <Sparkles className="size-2.5" />
            Save more
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {BULK_OPTIONS.map((option) => {
            const isSelected = bulkQuantity === option.quantity;
            const unitPrice = price * (1 - option.discountPercent / 100);

            return (
              <button
                key={option.quantity}
                type="button"
                disabled={disabled || stock < option.quantity}
                onClick={() => selectBulk(option.quantity)}
                className={[
                  "rounded-[16px] border px-2.5 py-2 text-left transition-all duration-200",
                  "disabled:cursor-not-allowed disabled:opacity-35",
                  isSelected
                    ? "border-[#79A95D] bg-[#F0F9EC] shadow-[0_8px_18px_rgba(121,169,93,0.12)]"
                    : "border-white/75 bg-white/55 hover:-translate-y-0.5 hover:bg-white/75",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[0.55rem] font-black text-[#27344A]">{option.label}</span>
                  <span className="rounded-full bg-[#79D45C]/15 px-1.5 py-0.5 text-[0.42rem] font-black text-[#4D9A38]">
                    -{option.discountPercent}%
                  </span>
                </div>

                <p className="mt-1 text-[0.52rem] font-bold text-[#687489]">
                  {formatPrice(unitPrice)} each
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {selectedBulk ? (
        <div className="flex items-center justify-between rounded-[14px] bg-[#FFF8EC]/80 px-2.5 py-1.5 text-[0.5rem] text-[#687489]">
          <span>
            {selectedQuantity} × {formatPrice(selectedUnitPrice)}
          </span>
          <strong className="text-[#27344A]">{formatPrice(selectedTotal)}</strong>
        </div>
      ) : null}

      <div className="flex gap-2 pt-0.5">
        <AddToCartButton
          productId={productId}
          disabled={disabled || selectedQuantity > stock}
          quantity={selectedQuantity}
          className="h-10 min-h-10 flex-1 rounded-full bg-[#79A95D] px-4 text-[0.65rem] font-black text-white shadow-[0_10px_22px_rgba(121,169,93,0.20)] transition-all hover:-translate-y-0.5 hover:bg-[#6D9C54] sm:h-11 sm:min-h-11"
        />

        <Link
          href="/account/wishlist"
          className="inline-flex h-10 min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#EEDDBB] bg-white/80 px-3.5 text-[0.6rem] font-black text-[#526075] shadow-[0_8px_18px_rgba(39,52,74,0.04)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white sm:h-11 sm:min-h-11"
        >
          <Heart className="size-3" />
          Save
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { notify } from "@/lib/notifications";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  quantity?: number;
  className?: string;
}

export default function AddToCartButton({
  productId,
  disabled = false,
  quantity = 1,
  className = "",
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    if (loading || disabled) return;

    try {
      setLoading(true);

      const sessionResponse = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });

      if (!sessionResponse.ok) {
        throw new Error("Unable to verify your login. Please try again.");
      }

      const session = await sessionResponse.json();

      if (!session?.user || session.user.role !== "customer") {
        const currentPath = window.location.pathname + window.location.search;

        window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
        return;
      }

      await addItem(productId, quantity);

      window.dispatchEvent(new Event("buzzieworld:cart-updated"));
      setAdded(true);

      window.setTimeout(() => {
        setAdded(false);
      }, 1800);
    } catch (error) {
      notify.error(error, "Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  }


return (
  <button
    type="button"
    onClick={handleAdd}
    disabled={disabled || loading}
    className={`
      box-border
      inline-flex
      min-w-0
      items-center
      justify-center
      gap-1
      rounded-full
      bg-[#C391EE]
      px-1.5
      py-2.5
      font-[var(--font-poppins-brand)]
      text-[8px]
      font-extrabold
      uppercase
      leading-none
      whitespace-nowrap
      text-white
      shadow-[0_6px_16px_rgba(169,154,210,0.28)]
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:bg-[#927FC5]
      hover:shadow-[0_8px_20px_rgba(169,154,210,0.35)]
      active:translate-y-0
      disabled:cursor-not-allowed
      disabled:opacity-50
      sm:gap-1.5
      sm:px-3
      sm:py-3
      sm:text-[11px]
      ${className}
    `}
  >
    {added ? (
      <>
        <Check aria-hidden="true" className="size-3.5 shrink-0 sm:size-4" strokeWidth={2.4} />
        <span className="min-w-0 whitespace-nowrap">Added to Cart</span>
      </>
    ) : (
      <>
        <ShoppingCart
          aria-hidden="true"
          className="size-4 shrink-0 sm:size-[18px]"
          strokeWidth={2.2}
        />
        <span className="min-w-0 whitespace-nowrap text-[8px] font-extrabold leading-none sm:text-[11px]">
          {loading ? "Adding..." : "Add to Cart"}
        </span>
      </>
    )}
  </button>
);
}

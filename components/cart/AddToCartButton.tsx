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

      // Verify that a signed-in customer is attempting to add the item.
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
      // The shared useCart hook displays the success toast.
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#3F7DFF] px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {loading ? "Adding..." : "Add to Cart"}
        </>
      )}
    </button>
  );
}

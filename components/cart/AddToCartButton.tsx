"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";

import { useCart } from "@/hooks/useCart";

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
    if (loading || disabled) {
      return;
    }

    try {
      setLoading(true);

      await addItem(productId, quantity);

      setAdded(true);

      window.setTimeout(() => {
        setAdded(false);
      }, 1800);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to add product to cart");
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

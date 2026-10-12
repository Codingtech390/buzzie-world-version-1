"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function ProceedToCheckoutButton() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  // This component listens for successful cart additions.
  // The event will be dispatched by AddToCartButton.
  // The visibility state starts false intentionally.

    useEffect(() => {
      const showCheckout = () => setVisible(true);

      window.addEventListener("buzzieworld:cart-updated", showCheckout);

      return () => {
        window.removeEventListener("buzzieworld:cart-updated", showCheckout);
      };
    }, []);
  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => router.push("/cart")}
      className="relative top-5 inline-flex min-h-12 w-full flex-1 items-center justify-center gap-2 rounded-full border border-[#C391EE] bg-white px-6 py-3 font-[var(--font-poppins)] text-sm font-bold text-[#7044B8] transition-colors hover:bg-[#F5EEFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C391EE] sm:w-auto"
    >
      Proceed to Cart
      <ArrowRight className="size-4" />
    </button>
  );
}

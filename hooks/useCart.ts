"use client";

import { useCallback, useEffect, useState } from "react";

import type { CartResponse } from "@/types/cart";

const emptyCart: CartResponse = {
  success: true,
  items: [],
  subtotal: 0,
  itemCount: 0,
};

export function useCart() {
  const [cart, setCart] = useState<CartResponse>(emptyCart);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch("/api/cart", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load cart");
      }

      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  // Intentionally hydrate the cart from the backend on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  refreshCart();
}, [refreshCart]);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add product");
    }

    setCart(data);

    return data;
  }, []);

  const updateItem = useCallback(async (productId: string, quantity: number) => {
    const response = await fetch("/api/cart", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update cart");
    }

    setCart(data);

    return data;
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const response = await fetch(`/api/cart?productId=${encodeURIComponent(productId)}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to remove item");
    }

    setCart(data);

    return data;
  }, []);

  const clear = useCallback(async () => {
    const response = await fetch("/api/cart", {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to clear cart");
    }

    setCart(data);
  }, []);

  return {
    cart,
    loading,
    error,
    refreshCart,
    addItem,
    updateItem,
    removeItem,
    clear,
  };
}

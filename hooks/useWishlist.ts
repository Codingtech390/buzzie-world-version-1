"use client";

import { useCallback } from "react";

import { notify } from "@/lib/notifications";
import { useWishlistStore } from "@/store/wishlistStore";

export function useWishlist() {
  const {
    items,
    loading,
    initialized,
    setItems,
    addItem,
    removeItem,
    removeByProductId,
    setLoading,
    setInitialized,
  } = useWishlistStore();

  const loadWishlist = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/account/wishlist", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load wishlist.");
      }

      setItems(data?.wishlist ?? []);

      return data?.wishlist ?? [];
    } catch (error) {
      notify.error(error, "Unable to load your wishlist.");
      throw error;
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [setItems, setLoading, setInitialized]);

  const add = useCallback(
    async (productId: string) => {
      try {
        const response = await fetch("/api/account/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to add product to wishlist.");
        }

        if (data?.item) {
          addItem(data.item);
        }

        notify.success("Added to your wishlist.");

        return data?.item;
      } catch (error) {
        notify.error(error, "Unable to add product to wishlist.");
        throw error;
      }
    },
    [addItem],
  );

  const remove = useCallback(
    async (wishlistId: string) => {
      try {
        const response = await fetch(`/api/account/wishlist/${encodeURIComponent(wishlistId)}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Unable to remove product from wishlist.");
        }

        removeItem(wishlistId);
        notify.success("Removed from your wishlist.");
      } catch (error) {
        notify.error(error, "Unable to remove product from wishlist.");
        throw error;
      }
    },
    [removeItem],
  );

  const toggle = useCallback(
    async (productId: string) => {
      const existing = items.find((item) => item.productId === productId);

      if (existing) {
        await remove(existing.id);
        return false;
      }

      await add(productId);
      return true;
    },
    [add, items, remove],
  );

  const isWishlisted = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items],
  );

  return {
    items,
    loading,
    initialized,
    loadWishlist,
    add,
    remove,
    toggle,
    isWishlisted,
    removeByProductId,
  };
}

export default useWishlist;

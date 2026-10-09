"use client";

import { create } from "zustand";

import type { CustomerWishlistItem } from "@/types/customer-wishlist";

interface WishlistStore {
  items: CustomerWishlistItem[];
  loading: boolean;
  initialized: boolean;

  setItems: (items: CustomerWishlistItem[]) => void;
  addItem: (item: CustomerWishlistItem) => void;
  removeItem: (wishlistId: string) => void;
  removeByProductId: (productId: string) => void;
  clear: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
  items: [],
  loading: false,
  initialized: false,

  setItems: (items) =>
    set({
      items,
      initialized: true,
    }),

  addItem: (item) =>
    set((state) => ({
      items: state.items.some((existing) => existing.productId === item.productId)
        ? state.items
        : [item, ...state.items],
    })),

  removeItem: (wishlistId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== wishlistId),
    })),

  removeByProductId: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  clear: () =>
    set({
      items: [],
      initialized: true,
    }),

  setLoading: (loading) => set({ loading }),

  setInitialized: (initialized) => set({ initialized }),
}));

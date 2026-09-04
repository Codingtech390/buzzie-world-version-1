"use client";

import { create } from "zustand";

interface UserStoreState {
  /*
   * This store intentionally contains only UI-level
   * account preferences.
   *
   * Authentication/session state belongs to NextAuth.
   */
  accountMenuOpen: boolean;

  setAccountMenuOpen: (open: boolean) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  accountMenuOpen: false,

  setAccountMenuOpen: (open) =>
    set({
      accountMenuOpen: open,
    }),
}));

export default useUserStore;

"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      offset={16}
      toastOptions={{
        className: "font-[var(--font-poppins)]",
      }}
    />
  );
}

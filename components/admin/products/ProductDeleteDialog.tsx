"use client";

import { useState } from "react";

interface ProductDeleteDialogProps {
  productId: string | null;
  productName?: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ProductDeleteDialog({
  productId,
  productName,
  onClose,
  onDeleted,
}: ProductDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!productId) {
    return null;
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold">Delete product?</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{productName || "this product"}</span>? This
          action cannot be undone.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-[#F56B9A]/30 bg-[#F56B9A]/5 px-4 py-3">
            <p className="text-sm text-[#C44770]">{error}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl bg-[#C44770] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

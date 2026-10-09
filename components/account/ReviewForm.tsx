"use client";

import { useState } from "react";

import type { ReviewableProduct } from "@/types/customer-review";

interface ReviewFormProps {
  product: ReviewableProduct;
  onSubmitted: () => Promise<void> | void;
}

export default function ReviewForm({ product, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Please write a review.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/account/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.productId,
          rating,
          title,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setTitle("");
      setComment("");
      setRating(5);

      setSuccess("Your review has been submitted and is waiting for approval.");

      await onSubmitted();
    } catch (error) {
      console.error("Review submission error:", error);

      setError(error instanceof Error ? error.message : "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#EEE5DB] bg-white p-5 shadow-[0_10px_35px_rgba(65,48,38,0.05)] sm:p-6"
    >
      <div>
        <p className="font-[var(--font-poppins-brand)] text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9A91AC]">
          Review product
        </p>

        <h3 className="mt-1 font-[var(--font-poppins-brand)] text-lg font-bold text-[#302831]">
          {product.name}
        </h3>
      </div>

      <div className="mt-5">
        <label className="block text-xs font-bold text-[#625860]">Rating</label>

        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star rating`}
              className="text-2xl transition-transform hover:scale-110"
            >
              <span className={value <= rating ? "text-[#F2B544]" : "text-[#D9D1CA]"}>★</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`review-title-${product.productId}`}
          className="block text-xs font-bold text-[#625860]"
        >
          Title
        </label>

        <input
          id={`review-title-${product.productId}`}
          type="text"
          value={title}
          maxLength={150}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What did you think?"
          className="mt-2 h-11 w-full rounded-2xl border border-[#E8DED4] bg-[#FFFCF8] px-4 text-sm text-[#302831] outline-none transition focus:border-[#A092CD] focus:ring-2 focus:ring-[#A092CD]/20"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor={`review-comment-${product.productId}`}
          className="block text-xs font-bold text-[#625860]"
        >
          Review
        </label>

        <textarea
          id={`review-comment-${product.productId}`}
          value={comment}
          maxLength={2000}
          rows={5}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Tell us what you liked about this product..."
          className="mt-2 w-full resize-none rounded-2xl border border-[#E8DED4] bg-[#FFFCF8] px-4 py-3 text-sm leading-6 text-[#302831] outline-none transition focus:border-[#A092CD] focus:ring-2 focus:ring-[#A092CD]/20"
        />

        <p className="mt-1 text-right text-[10px] text-[#A59A92]">{comment.length}/2000</p>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl bg-[#FCE8ED] px-4 py-3 text-xs font-semibold text-[#C93552]">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-2xl bg-[#EEF7E9] px-4 py-3 text-xs font-semibold text-[#5B8048]">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#A092CD] px-5 text-xs font-bold text-white transition hover:bg-[#E83D59] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}

"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import ReviewForm from "@/components/account/ReviewForm";

import type { CustomerReview, ReviewableProduct } from "@/types/customer-review";

function statusLabel(status: CustomerReview["status"]) {
  switch (status) {
    case "published":
      return "Published";

    case "hidden":
      return "Hidden";

    default:
      return "Pending approval";
  }
}

function statusClass(status: CustomerReview["status"]) {
  switch (status) {
    case "published":
      return "bg-[#EEF7E9] text-[#5B8048]";

    case "hidden":
      return "bg-[#F3EFEC] text-[#837980]";

    default:
      return "bg-[#FFF5D9] text-[#9B741B]";
  }
}

interface ReviewsResponse {
  success: boolean;
  reviews?: CustomerReview[];
  products?: ReviewableProduct[];
  message?: string;
}

export default function ReviewList() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [products, setProducts] = useState<ReviewableProduct[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<ReviewableProduct | null>(null);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/account/reviews", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as ReviewsResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load reviews.");
      }

      setReviews(data.reviews ?? []);
      setProducts(data.products ?? []);
    } catch (error) {
      console.error("Customer reviews fetch error:", error);

      setError(error instanceof Error ? error.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function deleteReview(reviewId: string) {
    const confirmed = window.confirm("Are you sure you want to delete this review?");

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(reviewId);

      const response = await fetch(`/api/account/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete review.");
      }

      await loadReviews();
    } catch (error) {
      console.error("Customer review delete error:", error);

      window.alert(error instanceof Error ? error.message : "Failed to delete review.");
    } finally {
      setDeleteLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-44 animate-pulse rounded-3xl bg-[#F4EEE7]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-2xl bg-[#FCE8ED] px-4 py-3 text-xs font-semibold text-[#C93552]">
          {error}
        </div>
      )}

      {selectedProduct && (
        <ReviewForm
          product={selectedProduct}
          onSubmitted={async () => {
            setSelectedProduct(null);
            await loadReviews();
          }}
        />
      )}

      {products.length > 0 && !selectedProduct && (
        <section className="rounded-3xl border border-[#EEE5DB] bg-[#FFFCF8] p-5 sm:p-6">
          <div>
            <p className="font-[var(--font-poppins-brand)] text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9A91AC]">
              Your purchases
            </p>

            <h3 className="mt-1 font-[var(--font-poppins-brand)] text-lg font-bold text-[#302831]">
              Products waiting for your review
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#837980]">
              You can review products you have purchased.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {products.map((product) => (
              <button
                key={product.productId}
                type="button"
                onClick={() => setSelectedProduct(product)}
                className="flex items-center gap-3 rounded-2xl border border-[#E8DED4] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#A092CD] hover:shadow-sm"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-contain bg-[#F8F4EF] p-1"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-[#F8F4EF]" />
                )}

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-[#302831]">
                    {product.name}
                  </span>

                  <span className="mt-1 block text-[10px] font-semibold text-[#A092CD]">
                    Write a review
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4">
          <p className="font-[var(--font-poppins-brand)] text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9A91AC]">
            Your reviews
          </p>

          <h3 className="mt-1 font-playpen text-lg font-bold text-[#302831]">Review history</h3>
        </div>

        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-[#EEE5DB] bg-white px-6 py-12 text-center">
            <Star className="mx-auto h-7 w-7 text-[#D9D1CA]" />

            <h3 className="mt-4 font-playpen text-base font-bold text-[#302831]">No reviews yet</h3>


          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-[#EEE5DB] bg-white p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide ${statusClass(
                          review.status,
                        )}`}
                      >
                        {statusLabel(review.status)}
                      </span>

                      {review.verifiedPurchase && (
                        <span className="rounded-full bg-[#EEF7E9] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#5B8048]">
                          Verified purchase
                        </span>
                      )}
                    </div>

                    <h4 className="mt-3 font-[var(--font-poppins-brand)] text-sm font-bold text-[#302831]">
                      {review.product.name}
                    </h4>

                    <div className="mt-2 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className="h-3.5 w-3.5"
                          fill={index < review.rating ? "currentColor" : "none"}
                          strokeWidth={1.7}
                          color={index < review.rating ? "#F2B544" : "#D9D1CA"}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      title="Edit review"
                      onClick={() => {
                        window.alert(
                          "Review editing can be added to this form once the existing review edit UI is required.",
                        );
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DED4] text-[#6F656D] transition hover:border-[#A092CD] hover:text-[#A092CD]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      title="Delete review"
                      disabled={deleteLoading === review.id}
                      onClick={() => void deleteReview(review.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8DED4] text-[#6F656D] transition hover:border-[#E83D59] hover:text-[#E83D59] disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {review.title && (
                  <h5 className="mt-4 text-sm font-bold text-[#302831]">{review.title}</h5>
                )}

                <p className="mt-2 text-sm leading-6 text-[#6F656D]">{review.comment}</p>

                <p className="mt-4 text-[10px] font-medium text-[#A59A92]">
                  {new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(review.createdAt))}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

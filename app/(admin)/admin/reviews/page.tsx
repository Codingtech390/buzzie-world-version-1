"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
  MessageSquare,
  Package,
  RefreshCw,
  Search,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";

type ReviewStatus =
  | "pending"
  | "published"
  | "hidden";

interface ProductOption {
  id: string;
  name: string;
  slug: string;
}

interface Review {
  id: string;

  customer: {
    name: string;
    email: string;
  };

  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };

  rating: number;
  title: string;
  comment: string;

  verifiedPurchase: boolean;
  status: ReviewStatus;

  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  total: number;
  published: number;
  pending: number;
  hidden: number;
  verified: number;
  averageRating: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ReviewsResponse {
  success: boolean;
  message?: string;
  reviews?: Review[];
  stats?: ReviewStats;
  pagination?: Pagination;
  products?: ProductOption[];
}

const DEFAULT_STATS: ReviewStats = {
  total: 0,
  published: 0,
  pending: 0,
  hidden: 0,
  verified: 0,
  averageRating: 0,
};

const DEFAULT_PAGINATION: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function getStatusLabel(
  status: ReviewStatus,
) {
  switch (status) {
    case "published":
      return "Published";

    case "hidden":
      return "Hidden";

    case "pending":
    default:
      return "Pending";
  }
}

function getStatusClasses(
  status: ReviewStatus,
) {
  switch (status) {
    case "published":
      return "border-[#BFE8D0] bg-[#F0FBF4] text-[#167447]";

    case "hidden":
      return "border-[#E3DCE8] bg-[#F7F4F9] text-[#6D6277]";

    case "pending":
    default:
      return "border-[#F3D9A6] bg-[#FFF9EC] text-[#A56600]";
  }
}

function StarRating({
  rating,
  size = 15,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={
            index < rating
              ? "fill-[#F4B740] text-[#F4B740]"
              : "text-[#D8D1DC]"
          }
        />
      ))}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ReviewStatus;
}) {
  const Icon =
    status === "published"
      ? CheckCircle2
      : status === "hidden"
        ? EyeOff
        : AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${getStatusClasses(status)}`}
    >
      <Icon size={12} />
      {getStatusLabel(status)}
    </span>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof MessageSquare;
  accent: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#E9E1EE] bg-white p-5 shadow-[0_6px_24px_rgba(58,38,78,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#8A8190]">
            {label}
          </p>

          <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#27344A]">
            {value}
          </p>

          <p className="mt-1 text-xs font-medium text-[#8A8190]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] ${accent}`}
        >
          <Icon
            size={18}
            className="text-[#27344A]"
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<ReviewStatus | "">("");

  const [rating, setRating] =
    useState("");

  const [product, setProduct] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [stats, setStats] =
    useState<ReviewStats>(
      DEFAULT_STATS,
    );

  const [
    pagination,
    setPagination,
  ] = useState<Pagination>(
    DEFAULT_PAGINATION,
  );

  const [
    products,
    setProducts,
  ] = useState<ProductOption[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    selectedReview,
    setSelectedReview,
  ] = useState<Review | null>(null);

  const [
    actionLoading,
    setActionLoading,
  ] = useState<string | null>(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<Review | null>(null);

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  const fetchReviews =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const params =
            new URLSearchParams();

          params.set(
            "page",
            String(page),
          );

          params.set(
            "limit",
            "20",
          );

          if (search) {
            params.set(
              "search",
              search,
            );
          }

          if (status) {
            params.set(
              "status",
              status,
            );
          }

          if (rating) {
            params.set(
              "rating",
              rating,
            );
          }

          if (product) {
            params.set(
              "product",
              product,
            );
          }

          const response =
            await fetch(
              `/api/reviews?${params.toString()}`,
              {
                method: "GET",
                cache: "no-store",
              },
            );

          const contentType =
            response.headers.get(
              "content-type",
            ) ?? "";

          if (
            !contentType.includes(
              "application/json",
            )
          ) {
            throw new Error(
              "The reviews API returned an invalid response.",
            );
          }

          const data =
            (await response.json()) as ReviewsResponse;

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to load reviews.",
            );
          }

          setReviews(
            data.reviews ?? [],
          );

          setStats(
            data.stats ??
              DEFAULT_STATS,
          );

          setPagination(
            data.pagination ??
              DEFAULT_PAGINATION,
          );

          setProducts(
            data.products ?? [],
          );
        } catch (err) {
          console.error(
            "Admin reviews fetch error:",
            err,
          );

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load reviews.",
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        page,
        search,
        status,
        rating,
        product,
      ],
    );

useEffect(() => {
  // Intentional initial/filter-change review data synchronization.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchReviews();
}, [fetchReviews]);

  function submitSearch() {
    setPage(1);
    setSearch(
      searchInput.trim(),
    );
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setRating("");
    setProduct("");
    setPage(1);
  }

  const hasFilters = useMemo(
    () =>
      Boolean(
        search ||
          status ||
          rating ||
          product,
      ),
    [
      search,
      status,
      rating,
      product,
    ],
  );

  async function updateStatus(
    review: Review,
    nextStatus: ReviewStatus,
  ) {
    try {
      setActionLoading(review.id);

      const response =
        await fetch(
          `/api/reviews/${review.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status: nextStatus,
            }),
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update review.",
        );
      }

      if (
        selectedReview?.id ===
        review.id
      ) {
        setSelectedReview(
          data.review ??
            null,
        );
      }

      await fetchReviews(true);
    } catch (err) {
      console.error(
        "Review status update error:",
        err,
      );

      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to update review.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteReview() {
    if (!deleteTarget) {
      return;
    }

    try {
      setActionLoading(
        deleteTarget.id,
      );

      const response =
        await fetch(
          `/api/reviews/${deleteTarget.id}`,
          {
            method: "DELETE",
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete review.",
        );
      }

      if (
        selectedReview?.id ===
        deleteTarget.id
      ) {
        setSelectedReview(null);
      }

      setDeleteTarget(null);

      if (
        reviews.length === 1 &&
        page > 1
      ) {
        setPage(
          (current) =>
            current - 1,
        );
      } else {
        await fetchReviews(true);
      }
    } catch (err) {
      console.error(
        "Review delete error:",
        err,
      );

      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete review.",
      );
    } finally {
      setActionLoading(null);
    }
  }

  function renderActions(
    review: Review,
  ) {
    const busy =
      actionLoading === review.id;

    return (
      <div className="flex items-center justify-end gap-1.5">
        <button
          type="button"
          title="View review"
          onClick={() =>
            setSelectedReview(
              review,
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E7DFEA] bg-white text-[#657085] transition hover:border-[#C391EE] hover:text-[#7D4FA5]"
        >
          <Eye size={15} />
        </button>

        {review.status !==
          "published" && (
          <button
            type="button"
            title="Publish review"
            disabled={busy}
            onClick={() =>
              void updateStatus(
                review,
                "published",
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#BFE8D0] bg-[#F0FBF4] text-[#167447] transition hover:bg-[#E1F7EA] disabled:opacity-50"
          >
            <Check size={15} />
          </button>
        )}

        {review.status !==
          "hidden" && (
          <button
            type="button"
            title="Hide review"
            disabled={busy}
            onClick={() =>
              void updateStatus(
                review,
                "hidden",
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E3DCE8] bg-[#F7F4F9] text-[#6D6277] transition hover:bg-[#EFEAF2] disabled:opacity-50"
          >
            <EyeOff size={15} />
          </button>
        )}

        <button
          type="button"
          title="Delete review"
          disabled={busy}
          onClick={() =>
            setDeleteTarget(
              review,
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#F2D5DB] bg-[#FFF5F6] text-[#C63E56] transition hover:bg-[#FFECEE] disabled:opacity-50"
        >
          <Trash2 size={15} />
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFAF7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#9A90A1]">
              <span>
                Storefront
              </span>

              <span>
                /
              </span>

              <span className="text-[#7D4FA5]">
                Reviews
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-[-0.035em] text-[#27344A] sm:text-3xl">
              Customer Reviews
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm font-medium leading-6 text-[#7C8798]">
              Review customer feedback,
              moderate published content,
              and keep product reviews
              trustworthy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void fetchReviews(
                  true,
                )
              }
              disabled={refreshing}
              className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-[#E4DDEA] bg-white px-4 text-xs font-bold text-[#536176] transition hover:border-[#CFC0D8] hover:text-[#27344A] disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Reviews"
            value={stats.total}
            description="all reviews"
            icon={MessageSquare}
            accent="bg-[#EDE1F7]"
          />

          <StatCard
            label="Published"
            value={stats.published}
            description="visible on storefront"
            icon={CheckCircle2}
            accent="bg-[#DDF4E7]"
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            description="waiting for moderation"
            icon={AlertCircle}
            accent="bg-[#FFF0D0]"
          />

          <StatCard
            label="Verified"
            value={stats.verified}
            description="verified purchases"
            icon={Check}
            accent="bg-[#E3EEF9]"
          />

          <StatCard
            label="Average Rating"
            value={
              stats.averageRating
                ? `${stats.averageRating.toFixed(1)} / 5`
                : "—"
            }
            description="across all reviews"
            icon={Star}
            accent="bg-[#FFF0CF]"
          />
        </div>

        {/* TOOLBAR */}
        <section className="mb-5 rounded-[20px] border border-[#E9E1EE] bg-white p-4 shadow-[0_6px_24px_rgba(58,38,78,0.04)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 gap-2">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B93A2]"
                />

                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      submitSearch();
                    }
                  }}
                  placeholder="Search customer, email, title or review..."
                  className="h-11 w-full rounded-[13px] border border-[#E4DDEA] bg-[#FCFBFD] pl-10 pr-3 text-sm font-medium text-[#27344A] outline-none transition placeholder:text-[#A49BAA] focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10"
                />
              </div>

              <button
                type="button"
                onClick={
                  submitSearch
                }
                className="h-11 shrink-0 rounded-[13px] bg-[#C391EE] px-5 text-xs font-black text-white transition hover:bg-[#B27ADD]"
              >
                Search
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) =>
                    !value,
                )
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-[13px] border px-4 text-xs font-bold transition ${
                hasFilters
                  ? "border-[#C391EE] bg-[#F6EEFC] text-[#7D4FA5]"
                  : "border-[#E4DDEA] bg-white text-[#657085] hover:border-[#CFC0D8]"
              }`}
            >
              <Filter size={15} />
              Filters
              {hasFilters && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C391EE] px-1.5 text-[9px] text-white">
                  {[
                    search,
                    status,
                    rating,
                    product,
                  ].filter(
                    Boolean,
                  ).length}
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="h-11 rounded-[13px] px-3 text-xs font-bold text-[#8A8190] transition hover:text-[#C63E56]"
              >
                Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#F0EAF2] pt-4 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.1em] text-[#7C8798]">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(
                      event.target
                        .value as
                        | ReviewStatus
                        | "",
                    );
                    setPage(1);
                  }}
                  className="h-11 w-full rounded-[13px] border border-[#E4DDEA] bg-white px-3 text-sm font-medium text-[#27344A] outline-none focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10"
                >
                  <option value="">
                    All statuses
                  </option>
                  <option value="pending">
                    Pending
                  </option>
                  <option value="published">
                    Published
                  </option>
                  <option value="hidden">
                    Hidden
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.1em] text-[#7C8798]">
                  Rating
                </label>

                <select
                  value={rating}
                  onChange={(event) => {
                    setRating(
                      event.target
                        .value,
                    );
                    setPage(1);
                  }}
                  className="h-11 w-full rounded-[13px] border border-[#E4DDEA] bg-white px-3 text-sm font-medium text-[#27344A] outline-none focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10"
                >
                  <option value="">
                    All ratings
                  </option>
                  <option value="5">
                    5 stars
                  </option>
                  <option value="4">
                    4 stars
                  </option>
                  <option value="3">
                    3 stars
                  </option>
                  <option value="2">
                    2 stars
                  </option>
                  <option value="1">
                    1 star
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.1em] text-[#7C8798]">
                  Product
                </label>

                <select
                  value={product}
                  onChange={(event) => {
                    setProduct(
                      event.target
                        .value,
                    );
                    setPage(1);
                  }}
                  className="h-11 w-full rounded-[13px] border border-[#E4DDEA] bg-white px-3 text-sm font-medium text-[#27344A] outline-none focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10"
                >
                  <option value="">
                    All products
                  </option>

                  {products.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          )}
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex flex-col gap-3 rounded-[18px] border border-[#F2D5DB] bg-[#FFF7F8] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-[#C63E56]">
                <AlertCircle
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[#8F3043]">
                  Unable to load reviews
                </p>

                <p className="mt-1 text-xs font-medium text-[#A85A69]">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                void fetchReviews(
                  true,
                )
              }
              className="rounded-[11px] bg-[#C63E56] px-4 py-2.5 text-xs font-bold text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* CONTENT */}
        <section className="overflow-hidden rounded-[20px] border border-[#E9E1EE] bg-white shadow-[0_6px_24px_rgba(58,38,78,0.04)]">
          <div className="flex items-center justify-between border-b border-[#F0EAF2] px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-black text-[#27344A]">
                Reviews
              </h2>

              <p className="mt-0.5 text-[11px] font-medium text-[#8A8190]">
                {pagination.total}{" "}
                review
                {pagination.total ===
                1
                  ? ""
                  : "s"}{" "}
                found
              </p>
            </div>

            {refreshing && (
              <RefreshCw
                size={15}
                className="animate-spin text-[#9A90A1]"
              />
            )}
          </div>

          {loading ? (
            <div className="p-5">
              <div className="space-y-3">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-[14px] bg-[#F7F3F8]"
                  />
                ))}
              </div>
            </div>
          ) : reviews.length ===
            0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[17px] bg-[#F2E9F7] text-[#9A6DC0]">
                <MessageSquare
                  size={24}
                />
              </div>

              <h3 className="text-base font-black text-[#27344A]">
                No reviews found
              </h3>

              <p className="mt-1.5 max-w-md text-sm font-medium leading-6 text-[#8A8190]">
                {hasFilters
                  ? "Try changing your search or filters."
                  : "Customer reviews will appear here once they are submitted."}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="mt-4 rounded-[11px] bg-[#C391EE] px-4 py-2.5 text-xs font-bold text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-[#F0EAF2] bg-[#FCFBFD]">
                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                        Product
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                        Review
                      </th>

                      <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reviews.map(
                      (review) => (
                        <tr
                          key={
                            review.id
                          }
                          className="border-b border-[#F3EEF4] last:border-0"
                        >
                          <td className="px-5 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0E8F5] text-[#7D4FA5]">
                                <User
                                  size={
                                    15
                                  }
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-black text-[#27344A]">
                                  {
                                    review
                                      .customer
                                      .name
                                  }
                                </p>

                                <p className="mt-1 max-w-[190px] truncate text-[11px] font-medium text-[#8A8190]">
                                  {
                                    review
                                      .customer
                                      .email
                                  }
                                </p>

                                {review.verifiedPurchase && (
                                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.07em] text-[#167447]">
                                    <Check
                                      size={
                                        11
                                      }
                                    />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="flex max-w-[220px] items-center gap-3">
                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[10px] border border-[#ECE5EF] bg-[#F8F5F9]">
                                {review
                                  .product
                                  .image ? (
                                  <img
                                    src={
                                      review
                                        .product
                                        .image
                                    }
                                    alt={
                                      review
                                        .product
                                        .name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[#A49BAA]">
                                    <Package
                                      size={
                                        16
                                      }
                                    />
                                  </div>
                                )}
                              </div>

                              <p className="line-clamp-2 text-xs font-bold leading-5 text-[#3D4A5F]">
                                {
                                  review
                                    .product
                                    .name
                                }
                              </p>
                            </div>
                          </td>

                          <td className="max-w-[360px] px-5 py-4 align-top">
                            <StarRating
                              rating={
                                review.rating
                              }
                            />

                            {review.title && (
                              <p className="mt-2 truncate text-xs font-black text-[#27344A]">
                                {
                                  review.title
                                }
                              </p>
                            )}

                            <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-[#7C8798]">
                              {
                                review.comment
                              }
                            </p>

                            <p className="mt-2 text-[10px] font-medium text-[#A19AA5]">
                              {formatDate(
                                review.createdAt,
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <StatusBadge
                              status={
                                review.status
                              }
                            />
                          </td>

                          <td className="px-5 py-4 align-top">
                            {renderActions(
                              review,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE/TABLET CARDS */}
              <div className="divide-y divide-[#F0EAF2] lg:hidden">
                {reviews.map(
                  (review) => (
                    <article
                      key={
                        review.id
                      }
                      className="p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[11px] border border-[#ECE5EF] bg-[#F8F5F9]">
                          {review
                            .product
                            .image ? (
                            <img
                              src={
                                review
                                  .product
                                  .image
                              }
                              alt={
                                review
                                  .product
                                  .name
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#A49BAA]">
                              <Package
                                size={
                                  17
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-black text-[#27344A]">
                                {
                                  review
                                    .customer
                                    .name
                                }
                              </p>

                              <p className="mt-0.5 truncate text-[11px] font-medium text-[#8A8190]">
                                {
                                  review
                                    .customer
                                    .email
                                }
                              </p>
                            </div>

                            <StatusBadge
                              status={
                                review.status
                              }
                            />
                          </div>

                          <p className="mt-3 text-xs font-bold text-[#536176]">
                            {
                              review
                                .product
                                .name
                            }
                          </p>

                          <div className="mt-2">
                            <StarRating
                              rating={
                                review.rating
                              }
                            />
                          </div>

                          {review.title && (
                            <p className="mt-2 text-xs font-black text-[#27344A]">
                              {
                                review.title
                              }
                            </p>
                          )}

                          <p className="mt-1 line-clamp-3 text-xs font-medium leading-5 text-[#7C8798]">
                            {
                              review.comment
                            }
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {review.verifiedPurchase && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#EFFAF3] px-2 py-1 text-[9px] font-black uppercase tracking-[0.06em] text-[#167447]">
                                  <Check
                                    size={
                                      10
                                    }
                                  />
                                  Verified
                                </span>
                              )}

                              <span className="text-[10px] font-medium text-[#A19AA5]">
                                {formatDate(
                                  review.createdAt,
                                )}
                              </span>
                            </div>

                            {renderActions(
                              review,
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>

              {/* PAGINATION */}
              {pagination.totalPages >
                0 && (
                <div className="flex flex-col gap-3 border-t border-[#F0EAF2] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-[11px] font-medium text-[#8A8190]">
                    Showing{" "}
                    <span className="font-bold text-[#536176]">
                      {(pagination.page -
                        1) *
                        pagination.limit +
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-[#536176]">
                      {Math.min(
                        pagination.page *
                          pagination.limit,
                        pagination.total,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-[#536176]">
                      {
                        pagination.total
                      }
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        pagination.page <=
                          1 ||
                        loading
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.max(
                              1,
                              current -
                                1,
                            ),
                        )
                      }
                      className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4DDEA] bg-white px-3 text-xs font-bold text-[#657085] transition hover:border-[#CFC0D8] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft
                        size={14}
                      />
                      Previous
                    </button>

                    <span className="min-w-[80px] text-center text-[11px] font-bold text-[#657085]">
                      Page{" "}
                      {
                        pagination.page
                      }{" "}
                      of{" "}
                      {
                        pagination.totalPages
                      }
                    </span>

                    <button
                      type="button"
                      disabled={
                        pagination.page >=
                          pagination.totalPages ||
                        loading
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.min(
                              pagination.totalPages,
                              current +
                                1,
                            ),
                        )
                      }
                      className="flex h-9 items-center gap-1 rounded-[10px] border border-[#E4DDEA] bg-white px-3 text-xs font-bold text-[#657085] transition hover:border-[#CFC0D8] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight
                        size={14}
                      />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* REVIEW DETAILS MODAL */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#24152F]/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedReview(
                null,
              );
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-[#E7DFEA] bg-white shadow-[0_24px_80px_rgba(39,20,55,0.22)]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F0EAF2] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#9A90A1]">
                  Review Details
                </p>

                <h2 className="mt-1 text-lg font-black tracking-[-0.02em] text-[#27344A]">
                  Customer feedback
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedReview(
                    null,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E4DDEA] text-[#7C8798] transition hover:bg-[#F8F5F9] hover:text-[#27344A]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {/* RATING */}
              <div>
                <StarRating
                  rating={
                    selectedReview.rating
                  }
                  size={19}
                />

                {selectedReview.title && (
                  <h3 className="mt-3 text-lg font-black tracking-[-0.02em] text-[#27344A]">
                    {
                      selectedReview.title
                    }
                  </h3>
                )}

                <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-[#536176]">
                  {
                    selectedReview.comment
                  }
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={
                      selectedReview.status
                    }
                  />

                  {selectedReview.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFE8D0] bg-[#F0FBF4] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#167447]">
                      <Check
                        size={12}
                      />
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="rounded-[16px] border border-[#ECE5EF] bg-[#FCFBFD] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <User
                    size={15}
                    className="text-[#9A6DC0]"
                  />

                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                    Customer
                  </p>
                </div>

                <p className="text-sm font-black text-[#27344A]">
                  {
                    selectedReview
                      .customer
                      .name
                  }
                </p>

                <p className="mt-1 text-xs font-medium text-[#7C8798]">
                  {
                    selectedReview
                      .customer
                      .email
                  }
                </p>
              </div>

              {/* PRODUCT */}
              <div className="rounded-[16px] border border-[#ECE5EF] bg-[#FCFBFD] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Package
                    size={15}
                    className="text-[#9A6DC0]"
                  />

                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                    Product
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border border-[#E9E1EE] bg-white">
                    {selectedReview
                      .product
                      .image ? (
                      <img
                        src={
                          selectedReview
                            .product
                            .image
                        }
                        alt={
                          selectedReview
                            .product
                            .name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#A49BAA]">
                        <Package
                          size={18}
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#27344A]">
                      {
                        selectedReview
                          .product
                          .name
                      }
                    </p>

                    <p className="mt-1 truncate text-xs font-medium text-[#8A8190]">
                      /
                      {
                        selectedReview
                          .product
                          .slug
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* META */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[14px] border border-[#ECE5EF] p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                    Submitted
                  </p>

                  <p className="mt-2 text-xs font-bold text-[#536176]">
                    {formatDateTime(
                      selectedReview.createdAt,
                    )}
                  </p>
                </div>

                <div className="rounded-[14px] border border-[#ECE5EF] p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#8A8190]">
                    Last Updated
                  </p>

                  <p className="mt-2 text-xs font-bold text-[#536176]">
                    {formatDateTime(
                      selectedReview.updatedAt,
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* MODERATION ACTIONS */}
            <div className="flex flex-col gap-2 border-t border-[#F0EAF2] bg-[#FCFBFD] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(
                    selectedReview,
                  )
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] border border-[#F2D5DB] bg-white px-4 text-xs font-bold text-[#C63E56] transition hover:bg-[#FFF1F3]"
              >
                <Trash2
                  size={14}
                />
                Delete
              </button>

              <div className="flex flex-wrap gap-2">
                {selectedReview.status !==
                  "pending" && (
                  <button
                    type="button"
                    disabled={
                      actionLoading ===
                      selectedReview.id
                    }
                    onClick={() =>
                      void updateStatus(
                        selectedReview,
                        "pending",
                      )
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] border border-[#E4DDEA] bg-white px-4 text-xs font-bold text-[#657085] disabled:opacity-50"
                  >
                    <AlertCircle
                      size={14}
                    />
                    Pending
                  </button>
                )}

                {selectedReview.status !==
                  "hidden" && (
                  <button
                    type="button"
                    disabled={
                      actionLoading ===
                      selectedReview.id
                    }
                    onClick={() =>
                      void updateStatus(
                        selectedReview,
                        "hidden",
                      )
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] border border-[#E3DCE8] bg-white px-4 text-xs font-bold text-[#6D6277] disabled:opacity-50"
                  >
                    <EyeOff
                      size={14}
                    />
                    Hide
                  </button>
                )}

                {selectedReview.status !==
                  "published" && (
                  <button
                    type="button"
                    disabled={
                      actionLoading ===
                      selectedReview.id
                    }
                    onClick={() =>
                      void updateStatus(
                        selectedReview,
                        "published",
                      )
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-[#C391EE] px-4 text-xs font-black text-white transition hover:bg-[#B27ADD] disabled:opacity-50"
                  >
                    <Check
                      size={14}
                    />
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#24152F]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDeleteTarget(
                null,
              );
            }
          }}
        >
          <div className="w-full max-w-md rounded-[22px] border border-[#E9DDE3] bg-white p-5 shadow-[0_24px_80px_rgba(39,20,55,0.25)] sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#FFF0F2] text-[#C63E56]">
              <Trash2 size={19} />
            </div>

            <h2 className="mt-4 text-lg font-black text-[#27344A]">
              Delete this review?
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-[#7C8798]">
              This permanently removes
              the review from the
              database. This action
              cannot be undone.
            </p>

            <div className="mt-5 rounded-[13px] bg-[#FCFBFD] p-3">
              <p className="truncate text-xs font-black text-[#27344A]">
                {
                  deleteTarget
                    .customer
                    .name
                }
              </p>

              <p className="mt-1 line-clamp-2 text-xs font-medium text-[#8A8190]">
                {
                  deleteTarget.comment
                }
              </p>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(
                    null,
                  )
                }
                disabled={
                  actionLoading ===
                  deleteTarget.id
                }
                className="h-10 rounded-[11px] border border-[#E4DDEA] bg-white px-4 text-xs font-bold text-[#657085]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  void deleteReview()
                }
                disabled={
                  actionLoading ===
                  deleteTarget.id
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-[#C63E56] px-4 text-xs font-black text-white disabled:opacity-50"
              >
                {actionLoading ===
                deleteTarget.id ? (
                  <RefreshCw
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2
                    size={14}
                  />
                )}
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Eye,
  ImageIcon,
  Link2,
  Megaphone,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type Banner = {
  id: string;
  name: string;
  headline: string;
  subheadline: string;
  image: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
  position: number;
  isActive: boolean;
  featured: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

type FeaturedFilter =
  | "all"
  | "yes"
  | "no";

type BannerForm = {
  name: string;
  headline: string;
  subheadline: string;
  image: string;
  mobileImage: string;
  ctaText: string;
  ctaLink: string;
  position: string;
  isActive: boolean;
  featured: boolean;
  startDate: string;
  endDate: string;
};

const EMPTY_FORM: BannerForm = {
  name: "",
  headline: "",
  subheadline: "",
  image: "",
  mobileImage: "",
  ctaText: "Shop Now",
  ctaLink: "/",
  position: "0",
  isActive: true,
  featured: false,
  startDate: "",
  endDate: "",
};

function formatDate(
  value: string | null,
) {
  if (!value) return "—";

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

function getCampaignState(
  banner: Banner,
) {
  const now = Date.now();

  if (!banner.isActive) {
    return "inactive";
  }

  if (
    banner.startDate &&
    new Date(
      banner.startDate,
    ).getTime() > now
  ) {
    return "scheduled";
  }

  if (
    banner.endDate &&
    new Date(
      banner.endDate,
    ).getTime() < now
  ) {
    return "expired";
  }

  return "live";
}

function campaignLabel(
  banner: Banner,
) {
  const state =
    getCampaignState(banner);

  switch (state) {
    case "scheduled":
      return "Scheduled";

    case "expired":
      return "Expired";

    case "inactive":
      return "Inactive";

    default:
      return "Live";
  }
}

export default function BannersPage() {
  const [banners, setBanners] =
    useState<Banner[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [featured, setFeatured] =
    useState<FeaturedFilter>("all");

  const [showForm, setShowForm] =
    useState(false);

  const [editingBanner, setEditingBanner] =
    useState<Banner | null>(null);

  const [selectedBanner, setSelectedBanner] =
    useState<Banner | null>(null);

  const [menuId, setMenuId] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const fetchBanners = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params =
          new URLSearchParams();

        if (search.trim()) {
          params.set(
            "search",
            search.trim(),
          );
        }

        if (status !== "all") {
          params.set(
            "status",
            status,
          );
        }

        if (featured !== "all") {
          params.set(
            "featured",
            featured,
          );
        }

        const query =
          params.toString();

        const response =
          await fetch(
            query
              ? `/api/banners?${query}`
              : "/api/banners",
            {
              cache: "no-store",
            },
          );

        const raw =
          await response.text();

        let result:
          | {
              success: boolean;
              banners?: Banner[];
              message?: string;
            }
          | null = null;

        try {
          result = raw
            ? JSON.parse(raw)
            : null;
        } catch {
          throw new Error(
            `Server returned an invalid response (${response.status})`,
          );
        }

        if (
          !response.ok ||
          !result?.success
        ) {
          throw new Error(
            result?.message ||
              `Failed to load banners (${response.status})`,
          );
        }

        setBanners(
          Array.isArray(
            result.banners,
          )
            ? result.banners
            : [],
        );
      } catch (err) {
        console.error(
          "Banners fetch error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load banners",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, status, featured],
  );

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          fetchBanners();
        },
        search.trim() ? 350 : 0,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [fetchBanners]);

  const statistics = useMemo(
    () => ({
      total: banners.length,

      active: banners.filter(
        (banner) =>
          banner.isActive,
      ).length,

      featured: banners.filter(
        (banner) =>
          banner.featured,
      ).length,

      live: banners.filter(
        (banner) =>
          getCampaignState(
            banner,
          ) === "live",
      ).length,

      scheduled: banners.filter(
        (banner) =>
          getCampaignState(
            banner,
          ) === "scheduled",
      ).length,
    }),
    [banners],
  );

  const openCreate = () => {
    setEditingBanner(null);
    setShowForm(true);
    setSelectedBanner(null);
    setMenuId(null);
  };

  const openEdit = (
    banner: Banner,
  ) => {
    setEditingBanner(banner);
    setShowForm(true);
    setSelectedBanner(null);
    setMenuId(null);
  };

  const handleSaved = (
    banner: Banner,
  ) => {
    setBanners((current) => {
      const exists = current.some(
        (item) =>
          item.id === banner.id,
      );

      if (exists) {
        return current
          .map((item) =>
            item.id === banner.id
              ? banner
              : item,
          )
          .sort(
            (a, b) =>
              a.position -
                b.position ||
              a.name.localeCompare(
                b.name,
              ),
          );
      }

      return [
        ...current,
        banner,
      ].sort(
        (a, b) =>
          a.position -
            b.position ||
          a.name.localeCompare(
            b.name,
          ),
      );
    });

    setShowForm(false);
    setEditingBanner(null);
  };

  const toggleActive = async (
    banner: Banner,
  ) => {
    try {
      setMenuId(null);

      const response =
        await fetch(
          "/api/banners",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: banner.id,
              isActive:
                !banner.isActive,
            }),
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update banner",
        );
      }

      if (result.banner) {
        setBanners(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                banner.id
                  ? result.banner
                  : item,
            ),
        );

        setSelectedBanner(
          (current) =>
            current?.id ===
            banner.id
              ? result.banner
              : current,
        );
      }
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to update banner",
      );
    }
  };

  const toggleFeatured =
    async (
      banner: Banner,
    ) => {
      try {
        setMenuId(null);

        const response =
          await fetch(
            "/api/banners",
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                id: banner.id,
                featured:
                  !banner.featured,
              }),
            },
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to update banner",
          );
        }

        if (result.banner) {
          setBanners(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  banner.id
                    ? result.banner
                    : item,
              ),
          );

          setSelectedBanner(
            (current) =>
              current?.id ===
              banner.id
                ? result.banner
                : current,
          );
        }
      } catch (err) {
        window.alert(
          err instanceof Error
            ? err.message
            : "Failed to update banner",
        );
      }
    };

  const deleteBanner = async (
    banner: Banner,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${banner.name}"?\n\nThis will remove the campaign from your banner manager.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        banner.id,
      );

      const response =
        await fetch(
          `/api/banners?id=${encodeURIComponent(
            banner.id,
          )}`,
          {
            method: "DELETE",
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete banner",
        );
      }

      setBanners(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              banner.id,
          ),
      );

      if (
        selectedBanner?.id ===
        banner.id
      ) {
        setSelectedBanner(null);
      }
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete banner",
      );
    } finally {
      setDeletingId(null);
      setMenuId(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FCFAF7]"
      onClick={() =>
        setMenuId(null)
      }
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
              <Megaphone className="h-4 w-4" />

              <span>Storefront</span>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Banners
              </span>
            </div>

            <h1 className="font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Banners & Campaigns
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Create promotional campaigns, sales,
              seasonal banners and homepage
              announcements without changing your
              storefront code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                fetchBanners(true);
              }}
              disabled={
                loading || refreshing
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openCreate();
              }}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatCard
            icon={
              <Megaphone className="h-5 w-5" />
            }
            label="Campaigns"
            value={statistics.total}
          />

          <StatCard
            icon={
              <Check className="h-5 w-5" />
            }
            label="Active"
            value={statistics.active}
          />

          <StatCard
            icon={
              <Eye className="h-5 w-5" />
            }
            label="Live Now"
            value={statistics.live}
          />

          <StatCard
            icon={
              <Star className="h-5 w-5" />
            }
            label="Featured"
            value={statistics.featured}
          />
        </div>

        {/* Main */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  placeholder="Search campaigns..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div
                className="flex flex-wrap gap-2"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <FilterSelect
                  value={status}
                  onChange={(value) =>
                    setStatus(value)
                  }
                  options={[
                    {
                      value: "all",
                      label: "All status",
                    },
                    {
                      value: "active",
                      label: "Active",
                    },
                    {
                      value: "inactive",
                      label: "Inactive",
                    },
                  ]}
                />

                <FilterSelect
                  value={featured}
                  onChange={(value) =>
                    setFeatured(value)
                  }
                  options={[
                    {
                      value: "all",
                      label: "All campaigns",
                    },
                    {
                      value: "yes",
                      label: "Featured",
                    },
                    {
                      value: "no",
                      label: "Standard",
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:m-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="flex-1">
                <p className="font-semibold">
                  Unable to load campaigns
                </p>

                <p className="mt-1">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fetchBanners()
                  }
                  className="mt-3 font-semibold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && !error ? (
            <BannerSkeleton />
          ) : !error &&
            banners.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(
                  search.trim(),
                ) ||
                status !== "all" ||
                featured !== "all"
              }
              onCreate={
                openCreate
              }
              onClear={() => {
                setSearch("");
                setStatus("all");
                setFeatured(
                  "all",
                );
              }}
            />
          ) : !error ? (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Campaign
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Preview
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Schedule
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Position
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {banners.map(
                      (banner) => (
                        <BannerRow
                          key={
                            banner.id
                          }
                          banner={
                            banner
                          }
                          menuOpen={
                            menuId ===
                            banner.id
                          }
                          deleting={
                            deletingId ===
                            banner.id
                          }
                          onMenu={() =>
                            setMenuId(
                              menuId ===
                                banner.id
                                ? null
                                : banner.id,
                            )
                          }
                          onView={() =>
                            setSelectedBanner(
                              banner,
                            )
                          }
                          onEdit={() =>
                            openEdit(
                              banner,
                            )
                          }
                          onToggleActive={() =>
                            toggleActive(
                              banner,
                            )
                          }
                          onToggleFeatured={() =>
                            toggleFeatured(
                              banner,
                            )
                          }
                          onDelete={() =>
                            deleteBanner(
                              banner,
                            )
                          }
                        />
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {banners.map(
                  (banner) => (
                    <BannerMobileCard
                      key={
                        banner.id
                      }
                      banner={
                        banner
                      }
                      deleting={
                        deletingId ===
                        banner.id
                      }
                      onView={() =>
                        setSelectedBanner(
                          banner,
                        )
                      }
                      onEdit={() =>
                        openEdit(
                          banner,
                        )
                      }
                      onToggleActive={() =>
                        toggleActive(
                          banner,
                        )
                      }
                      onToggleFeatured={() =>
                        toggleFeatured(
                          banner,
                        )
                      }
                      onDelete={() =>
                        deleteBanner(
                          banner,
                        )
                      }
                    />
                  ),
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Create / edit modal */}
      {showForm && (
        <BannerFormModal
          banner={
            editingBanner
          }
          saving={saving}
          setSaving={
            setSaving
          }
          onClose={() => {
            if (!saving) {
              setShowForm(
                false,
              );
              setEditingBanner(
                null,
              );
            }
          }}
          onSaved={
            handleSaved
          }
        />
      )}

      {/* Details drawer */}
      {selectedBanner && (
        <BannerDetailsDrawer
          banner={
            selectedBanner
          }
          onClose={() =>
            setSelectedBanner(
              null,
            )
          }
          onEdit={() =>
            openEdit(
              selectedBanner,
            )
          }
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat                                                                       */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-1.5 font-[Poppins] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 sm:h-10 sm:w-10">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter                                                                     */
/* -------------------------------------------------------------------------- */

function FilterSelect<
  T extends string,
>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (
    value: T,
  ) => void;
  options: Array<{
    value: T;
    label: string;
  }>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target
              .value as T,
          )
        }
        className="h-11 appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-600 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
      >
        {options.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {option.label}
            </option>
          ),
        )}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Banner image                                                               */
/* -------------------------------------------------------------------------- */

function BannerImage({
  banner,
  large = false,
}: {
  banner: Banner;
  large?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${
        large
          ? "aspect-[16/7] w-full"
          : "h-14 w-24"
      }`}
    >
      {banner.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={banner.image}
          alt={
            banner.headline
          }
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-300">
          <ImageIcon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Status                                                                     */
/* -------------------------------------------------------------------------- */

function CampaignBadge({
  banner,
}: {
  banner: Banner;
}) {
  const state =
    getCampaignState(
      banner,
    );

  const styles: Record<
    string,
    string
  > = {
    live:
      "bg-emerald-50 text-emerald-700",
    scheduled:
      "bg-blue-50 text-blue-700",
    expired:
      "bg-amber-50 text-amber-700",
    inactive:
      "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[state]
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === "live"
            ? "bg-emerald-500"
            : state ===
                "scheduled"
              ? "bg-blue-500"
              : state ===
                  "expired"
                ? "bg-amber-500"
                : "bg-slate-400"
        }`}
      />

      {campaignLabel(
        banner,
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Row                                                                        */
/* -------------------------------------------------------------------------- */

function BannerRow({
  banner,
  menuOpen,
  deleting,
  onMenu,
  onView,
  onEdit,
  onToggleActive,
  onToggleFeatured,
  onDelete,
}: {
  banner: Banner;
  menuOpen: boolean;
  deleting: boolean;
  onMenu: () => void;
  onView: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="group transition hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onView}
          className="flex items-center gap-3 text-left"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900 group-hover:text-violet-700">
                {banner.name}
              </p>

              {banner.featured && (
                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              )}
            </div>

            <p className="mt-1 max-w-[260px] truncate text-xs text-slate-400">
              {banner.headline}
            </p>
          </div>
        </button>
      </td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onView}
        >
          <BannerImage
            banner={banner}
          />
        </button>
      </td>

      <td className="px-5 py-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-600">
            {banner.startDate
              ? formatDate(
                  banner.startDate,
                )
              : "Immediately"}
          </p>

          {banner.endDate ? (
            <p className="text-[11px] text-slate-400">
              Ends{" "}
              {formatDate(
                banner.endDate,
              )}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">
              No end date
            </p>
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-50 px-2 text-xs font-semibold text-slate-600">
          {banner.position}
        </span>
      </td>

      <td className="px-5 py-4">
        <CampaignBadge
          banner={banner}
        />
      </td>

      <td className="px-5 py-4">
        <div className="relative flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onView}
            title="Preview"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-violet-50 hover:text-violet-700"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onEdit}
            title="Edit"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-violet-50 hover:text-violet-700"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMenu();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {deleting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_15px_40px_rgba(15,23,42,0.12)]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                onClick={onToggleActive}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Check className="h-3.5 w-3.5" />
                {banner.isActive
                  ? "Deactivate"
                  : "Activate"}
              </button>

              <button
                type="button"
                onClick={onToggleFeatured}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Star className="h-3.5 w-3.5" />
                {banner.featured
                  ? "Unfeature"
                  : "Feature"}
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile                                                                     */
/* -------------------------------------------------------------------------- */

function BannerMobileCard({
  banner,
  deleting,
  onView,
  onEdit,
  onToggleActive,
  onToggleFeatured,
  onDelete,
}: {
  banner: Banner;
  deleting: boolean;
  onView: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 sm:p-5">
      <BannerImage
        banner={banner}
        large
      />

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {banner.name}
            </h3>

            {banner.featured && (
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {banner.headline}
          </p>
        </div>

        <CampaignBadge
          banner={banner}
        />
      </div>

      {banner.subheadline && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">
          {banner.subheadline}
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="text-[10px] text-slate-400">
            Position
          </p>

          <p className="mt-0.5 text-xs font-semibold text-slate-700">
            {banner.position}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="text-[10px] text-slate-400">
            CTA
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
            {banner.ctaText ||
              "None"}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="text-[10px] text-slate-400">
            End
          </p>

          <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
            {banner.endDate
              ? formatDate(
                  banner.endDate,
                )
              : "None"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={onToggleFeatured}
          className="flex h-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-slate-500 hover:bg-slate-50"
        >
          <Star
            className={`h-3.5 w-3.5 ${
              banner.featured
                ? "fill-amber-400 text-amber-400"
                : ""
            }`}
          />
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="flex h-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-red-600"
        >
          {deleting ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form                                                                       */
/* -------------------------------------------------------------------------- */

function BannerFormModal({
  banner,
  saving,
  setSaving,
  onClose,
  onSaved,
}: {
  banner: Banner | null;
  saving: boolean;
  setSaving: (
    value: boolean,
  ) => void;
  onClose: () => void;
  onSaved: (
    banner: Banner,
  ) => void;
}) {
  const [form, setForm] =
    useState<BannerForm>(() =>
      banner
        ? {
            name: banner.name,
            headline:
              banner.headline,
            subheadline:
              banner.subheadline,
            image: banner.image,
            mobileImage:
              banner.mobileImage,
            ctaText:
              banner.ctaText,
            ctaLink:
              banner.ctaLink,
            position:
              String(
                banner.position,
              ),
            isActive:
              banner.isActive,
            featured:
              banner.featured,
            startDate:
              banner.startDate
                ? banner.startDate.slice(
                    0,
                    16,
                  )
                : "",
            endDate:
              banner.endDate
                ? banner.endDate.slice(
                    0,
                    16,
                  )
                : "",
          }
        : EMPTY_FORM,
    );

  const [error, setError] =
    useState("");

  const [uploading, setUploading] =
    useState<
      "desktop" | "mobile" | null
    >(null);

  const desktopInput =
    useRef<HTMLInputElement>(
      null,
    );

  const mobileInput =
    useRef<HTMLInputElement>(
      null,
    );

  const setField = <
    K extends keyof BannerForm,
  >(
    field: K,
    value: BannerForm[K],
  ) => {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );
  };

  const uploadImage = async (
    file: File,
    type:
      | "desktop"
      | "mobile",
  ) => {
    try {
      setUploading(type);
      setError("");

      const body =
        new FormData();

      body.append(
        "file",
        file,
      );

      const response =
        await fetch(
          "/api/banners/upload",
          {
            method: "POST",
            body,
          },
        );

      const raw =
        await response.text();

      let result:
        | {
            success: boolean;
            url?: string;
            message?: string;
          }
        | null = null;

      try {
        result = raw
          ? JSON.parse(raw)
          : null;
      } catch {
        throw new Error(
          `Upload returned an invalid response (${response.status})`,
        );
      }

      if (
        !response.ok ||
        !result?.success ||
        !result.url
      ) {
        throw new Error(
          result?.message ||
            "Image upload failed",
        );
      }

      if (type === "desktop") {
        setField(
          "image",
          result.url,
        );
      } else {
        setField(
          "mobileImage",
          result.url,
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Image upload failed",
      );
    } finally {
      setUploading(null);
    }
  };

  const submit = async () => {
    try {
      setSaving(true);
      setError("");

      if (
        !form.name.trim()
      ) {
        throw new Error(
          "Campaign name is required",
        );
      }

      if (
        !form.headline.trim()
      ) {
        throw new Error(
          "Banner headline is required",
        );
      }

      if (!form.image.trim()) {
        throw new Error(
          "Please upload a banner image",
        );
      }

      const payload = {
        ...(banner
          ? {
              id: banner.id,
            }
          : {}),

        name: form.name.trim(),

        headline:
          form.headline.trim(),

        subheadline:
          form.subheadline.trim(),

        image: form.image.trim(),

        mobileImage:
          form.mobileImage.trim(),

        ctaText:
          form.ctaText.trim(),

        ctaLink:
          form.ctaLink.trim(),

        position:
          Number(form.position) || 0,

        isActive:
          form.isActive,

        featured:
          form.featured,

        startDate:
          form.startDate ||
          null,

        endDate:
          form.endDate ||
          null,
      };

      const response =
        await fetch(
          "/api/banners",
          {
            method: banner
              ? "PATCH"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload,
            ),
          },
        );

      const raw =
        await response.text();

      let result:
        | {
            success: boolean;
            banner?: Banner;
            message?: string;
          }
        | null = null;

      try {
        result = raw
          ? JSON.parse(raw)
          : null;
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status})`,
        );
      }

      if (
        !response.ok ||
        !result?.success ||
        !result.banner
      ) {
        throw new Error(
          result?.message ||
            "Failed to save campaign",
        );
      }

      onSaved(
        result.banner,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save campaign",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/35 backdrop-blur-[2px]"
      />

      <div className="relative flex min-h-full items-start justify-center p-4 sm:p-6 lg:p-10">
        <div className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-[#FCFAF7] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-violet-600">
                Storefront Campaign
              </p>

              <h2 className="mt-1 font-[Poppins] text-lg font-semibold text-slate-900">
                {banner
                  ? "Edit Campaign"
                  : "Create Campaign"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(100vh-150px)] overflow-y-auto p-5 sm:p-6">
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />

                <div>
                  <p className="font-semibold">
                    Could not save campaign
                  </p>

                  <p className="mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              {/* Left */}
              <div className="space-y-5">
                <FormSection
                  title="Campaign content"
                  description="Define the promotional message shown to customers."
                >
                  <div className="grid gap-4">
                    <Field
                      label="Campaign name"
                      required
                    >
                      <input
                        value={form.name}
                        onChange={(event) =>
                          setField(
                            "name",
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="e.g. Diwali Sale 2026"
                        className="input"
                      />
                    </Field>

                    <Field
                      label="Headline"
                      required
                    >
                      <input
                        value={
                          form.headline
                        }
                        onChange={(
                          event,
                        ) =>
                          setField(
                            "headline",
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Celebrate Diwali with BuzzieWorld"
                        className="input"
                      />
                    </Field>

                    <Field
                      label="Supporting text"
                    >
                      <textarea
                        value={
                          form.subheadline
                        }
                        onChange={(
                          event,
                        ) =>
                          setField(
                            "subheadline",
                            event
                              .target
                              .value,
                          )
                        }
                        rows={3}
                        placeholder="Festive toys, gifts and more..."
                        className="input resize-none py-3"
                      />
                    </Field>
                  </div>
                </FormSection>

                <FormSection
                  title="Desktop banner"
                  description="Upload the main homepage campaign artwork."
                >
                  <ImageUploader
                    value={
                      form.image
                    }
                    uploading={
                      uploading ===
                      "desktop"
                    }
                    inputRef={
                      desktopInput
                    }
                    onSelect={(
                      file,
                    ) =>
                      uploadImage(
                        file,
                        "desktop",
                      )
                    }
                  />
                </FormSection>

                <FormSection
                  title="Mobile banner"
                  description="Optional. Use a separate image if the desktop artwork doesn't work well on small screens."
                >
                  <ImageUploader
                    value={
                      form.mobileImage
                    }
                    uploading={
                      uploading ===
                      "mobile"
                    }
                    inputRef={
                      mobileInput
                    }
                    onSelect={(
                      file,
                    ) =>
                      uploadImage(
                        file,
                        "mobile",
                      )
                    }
                    optional
                  />
                </FormSection>

                <FormSection
                  title="Call to action"
                  description="Control what customers see and where the banner sends them."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Button text">
                      <input
                        value={
                          form.ctaText
                        }
                        onChange={(
                          event,
                        ) =>
                          setField(
                            "ctaText",
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="Shop Now"
                        className="input"
                      />
                    </Field>

                    <Field label="Button link">
                      <input
                        value={
                          form.ctaLink
                        }
                        onChange={(
                          event,
                        ) =>
                          setField(
                            "ctaLink",
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="/collections/diwali-sale"
                        className="input"
                      />
                    </Field>
                  </div>
                </FormSection>

                <FormSection
                  title="Campaign schedule"
                  description="Leave dates empty for a banner that is controlled only by its active status."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Start date">
                      <input
                        type="datetime-local"
                        value={
                          form.startDate
                        }
                        onChange={(
                          event,
                        ) =>
                          setField(
                            "startDate",
                            event
                              .target
                              .value,
                          )
                        }
                        className="input"
                      />
                    </Field>

                    <Field label="End date">
                      <input
                        type="datetime-local"
                        value={
                          form.endDate
                        }
                        onChange={(
                          event,
                        ) =>
                          setField(
                            "endDate",
                            event
                              .target
                              .value,
                          )
                        }
                        className="input"
                      />
                    </Field>
                  </div>
                </FormSection>
              </div>

              {/* Right */}
              <div className="space-y-5">
                <FormSection
                  title="Placement"
                  description="Control where this campaign sits in the banner sequence."
                >
                  <Field label="Position">
                    <input
                      type="number"
                      min="0"
                      value={
                        form.position
                      }
                      onChange={(
                        event,
                      ) =>
                        setField(
                          "position",
                          event
                            .target
                            .value,
                        )
                      }
                      className="input"
                    />
                  </Field>
                </FormSection>

                <FormSection
                  title="Visibility"
                  description="Control whether the campaign is available to the storefront."
                >
                  <Toggle
                    label="Active"
                    description="Allow this campaign to appear on the storefront."
                    checked={
                      form.isActive
                    }
                    onChange={(
                      checked,
                    ) =>
                      setField(
                        "isActive",
                        checked,
                      )
                    }
                  />

                  <div className="my-4 h-px bg-slate-100" />

                  <Toggle
                    label="Featured"
                    description="Mark this campaign as a priority promotional banner."
                    checked={
                      form.featured
                    }
                    onChange={(
                      checked,
                    ) =>
                      setField(
                        "featured",
                        checked,
                      )
                    }
                  />
                </FormSection>

                {/* Preview */}
                <FormSection
                  title="Preview"
                  description="A quick approximation of how your banner will look."
                >
                  <BannerLivePreview
                    form={form}
                  />
                </FormSection>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-white p-4 sm:flex-row sm:justify-end sm:p-5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={
                saving ||
                uploading !==
                  null
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {banner
                    ? "Save Changes"
                    : "Create Campaign"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form helpers                                                               */
/* -------------------------------------------------------------------------- */

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-[Poppins] text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {description}
      </p>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-violet-600">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-violet-600"
            : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function ImageUploader({
  value,
  uploading,
  inputRef,
  onSelect,
  optional = false,
}: {
  value: string;
  uploading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelect: (
    file: File,
  ) => void;
  optional?: boolean;
}) {
  return (
    <div>
      {value ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <div className="relative aspect-[16/7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Banner preview"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-2 rounded-lg bg-white/95 px-3 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur hover:bg-white"
            >
              <Upload className="h-3.5 w-3.5" />
              Replace
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={uploading}
          className="flex aspect-[16/7] w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-center transition hover:border-violet-300 hover:bg-violet-50/40 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <RefreshCw className="h-7 w-7 animate-spin text-violet-500" />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Uploading image...
              </p>
            </>
          ) : (
            <>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-violet-500 shadow-sm">
                <Upload className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Upload banner image
              </p>

              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG, WebP up to 10 MB
              </p>

              {optional && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Optional
                </p>
              )}
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file =
            event.target
              .files?.[0];

          if (file) {
            onSelect(file);
          }

          event.target.value =
            "";
        }}
      />
    </div>
  );
}

function BannerLivePreview({
  form,
}: {
  form: BannerForm;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <div className="relative aspect-[16/9] overflow-hidden">
        {form.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-violet-50">
            <ImageIcon className="h-8 w-8 text-violet-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="line-clamp-2 font-[Poppins] text-sm font-semibold">
            {form.headline ||
              "Your campaign headline"}
          </p>

          {form.subheadline && (
            <p className="mt-1 line-clamp-2 text-[10px] text-white/80">
              {form.subheadline}
            </p>
          )}

          {form.ctaText && (
            <span className="mt-2 inline-flex rounded-lg bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-900">
              {form.ctaText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Details drawer                                                             */
/* -------------------------------------------------------------------------- */

function BannerDetailsDrawer({
  banner,
  onClose,
  onEdit,
}: {
  banner: Banner;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-[#FCFAF7] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-violet-600">
              Campaign Preview
            </p>

            <h2 className="mt-1 font-[Poppins] text-lg font-semibold text-slate-900">
              {banner.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <BannerImage
            banner={banner}
            large
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <CampaignBadge
              banner={banner}
            />

            {banner.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <Star className="h-3.5 w-3.5 fill-current" />
                Featured
              </span>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-[Poppins] text-xl font-semibold text-slate-900">
              {banner.headline}
            </h3>

            {banner.subheadline && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {banner.subheadline}
              </p>
            )}

            {banner.ctaText && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white">
                {banner.ctaText}

                <Link2 className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Detail
              icon={
                <Clock3 className="h-4 w-4" />
              }
              label="Start"
              value={
                banner.startDate
                  ? formatDate(
                      banner.startDate,
                    )
                  : "Immediately"
              }
            />

            <Detail
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="End"
              value={
                banner.endDate
                  ? formatDate(
                      banner.endDate,
                    )
                  : "No end date"
              }
            />

            <Detail
              icon={
                <ArrowUpDownIcon />
              }
              label="Position"
              value={String(
                banner.position,
              )}
            />

            <Detail
              icon={
                <Megaphone className="h-4 w-4" />
              }
              label="Status"
              value={campaignLabel(
                banner,
              )}
            />
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              CTA destination
            </p>

            <p className="mt-2 break-all text-sm font-medium text-slate-700">
              {banner.ctaLink ||
                "No destination configured"}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Campaign
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-violet-600">
        {icon}

        <span className="text-xs font-medium text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function ArrowUpDownIcon() {
  return (
    <span className="text-sm font-bold">
      ↕
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                      */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onCreate,
  onClear,
}: {
  hasFilters: boolean;
  onCreate: () => void;
  onClear: () => void;
}) {
  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
        <Megaphone className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-[Poppins] text-base font-semibold text-slate-900">
        {hasFilters
          ? "No campaigns found"
          : "No campaigns yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your filters or search terms."
          : "Create your first promotional campaign to start managing homepage banners."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 h-10 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Clear filters
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function BannerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="hidden lg:block">
        <div className="h-12 border-b border-slate-100 bg-slate-50" />

        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-5 border-b border-slate-100 px-5 py-5"
          >
            <div className="h-10 w-48 rounded bg-slate-100" />
            <div className="h-14 w-24 rounded-xl bg-slate-100" />
            <div className="h-8 w-28 rounded bg-slate-100" />
            <div className="h-8 w-10 rounded bg-slate-100" />
            <div className="h-7 w-20 rounded-full bg-slate-100" />
            <div className="ml-auto h-9 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="lg:hidden">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="border-b border-slate-100 p-5"
          >
            <div className="aspect-[16/7] rounded-xl bg-slate-100" />

            <div className="mt-4 h-4 w-40 rounded bg-slate-100" />

            <div className="mt-2 h-3 w-64 rounded bg-slate-100" />

            <div className="mt-4 h-12 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertCircle,
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  FolderOpen,
  ImageIcon,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
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

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "C";

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getCollectionColor(name: string) {
  const classes = [
    "bg-violet-100 text-violet-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-indigo-100 text-indigo-700",
    "bg-pink-100 text-pink-700",
    "bg-purple-100 text-purple-700",
  ];

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash =
      name.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return classes[Math.abs(hash) % classes.length];
}

export default function CollectionsPage() {
  const [collections, setCollections] =
    useState<Collection[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [featured, setFeatured] =
    useState<FeaturedFilter>("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [menuId, setMenuId] =
    useState<string | null>(null);

  const fetchCollections = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set(
            "search",
            search.trim(),
          );
        }

        if (status !== "all") {
          params.set("status", status);
        }

        if (featured !== "all") {
          params.set(
            "featured",
            featured,
          );
        }

        const query = params.toString();

        const response = await fetch(
          query
            ? `/api/collections?${query}`
            : "/api/collections",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const raw = await response.text();

        let result: {
          success: boolean;
          collections?: Collection[];
          message?: string;
        } | null = null;

        try {
          result = raw ? JSON.parse(raw) : null;
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
              `Failed to load collections (${response.status})`,
          );
        }

        setCollections(
          Array.isArray(
            result.collections,
          )
            ? result.collections
            : [],
        );
      } catch (err) {
        console.error(
          "Collections fetch error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load collections",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [search, status, featured],
  );

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        fetchCollections();
      },
      search.trim() ? 350 : 0,
    );

    return () =>
      window.clearTimeout(timeout);
  }, [fetchCollections]);

  const statistics = useMemo(() => {
    const active = collections.filter(
      (collection) =>
        collection.isActive,
    ).length;

    const inactive = collections.filter(
      (collection) =>
        !collection.isActive,
    ).length;

    const featuredCount =
      collections.filter(
        (collection) =>
          collection.featured,
      ).length;

    return {
      total: collections.length,
      active,
      inactive,
      featured: featuredCount,
    };
  }, [collections]);

  const updateCollection = async (
    id: string,
    changes: Partial<Collection>,
  ) => {
    try {
      setUpdatingId(id);

      const response = await fetch(
        "/api/collections",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
            ...changes,
          }),
        },
      );

      const raw = await response.text();

      let result:
        | {
            success: boolean;
            collection?: Collection;
            message?: string;
          }
        | null = null;

      try {
        result = raw ? JSON.parse(raw) : null;
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
            "Failed to update collection",
        );
      }

      if (result.collection) {
        setCollections((current) =>
          current.map((item) =>
            item.id === id
              ? result.collection!
              : item,
          ),
        );

        setSelectedCollection(
          (current) =>
            current?.id === id
              ? result.collection!
              : current,
        );
      }
    } catch (err) {
      console.error(
        "Collection update error:",
        err,
      );

      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to update collection",
      );
    } finally {
      setUpdatingId(null);
      setMenuId(null);
    }
  };

  const deleteCollection = async (
    collection: Collection,
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${collection.name}"?\n\nThis action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(collection.id);

      const response = await fetch(
        `/api/collections?id=${encodeURIComponent(
          collection.id,
        )}`,
        {
          method: "DELETE",
        },
      );

      const raw = await response.text();

      let result:
        | {
            success: boolean;
            message?: string;
          }
        | null = null;

      try {
        result = raw ? JSON.parse(raw) : null;
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
            "Failed to delete collection",
        );
      }

      setCollections((current) =>
        current.filter(
          (item) =>
            item.id !== collection.id,
        ),
      );

      if (
        selectedCollection?.id ===
        collection.id
      ) {
        setSelectedCollection(null);
      }
    } catch (err) {
      console.error(
        "Collection delete error:",
        err,
      );

      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete collection",
      );
    } finally {
      setDeletingId(null);
      setMenuId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <div
        className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10"
        onClick={() => setMenuId(null)}
      >
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
              <FolderOpen className="h-4 w-4" />

              <span>Catalog</span>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-slate-500">
                Collections
              </span>
            </div>

            <h1 className="font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Collections
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Organize products into curated
              collections and control which ones
              appear across your storefront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                fetchCollections(true);
              }}
              disabled={
                loading || refreshing
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            <Link
              href="/admin/collections/new"
              onClick={(event) =>
                event.stopPropagation()
              }
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              New Collection
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatCard
            icon={
              <FolderOpen className="h-5 w-5" />
            }
            label="Total"
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
              <Star className="h-5 w-5" />
            }
            label="Featured"
            value={statistics.featured}
          />

          <StatCard
            icon={
              <Eye className="h-5 w-5" />
            }
            label="Inactive"
            value={statistics.inactive}
          />
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              {/* Search */}
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
                  placeholder="Search collections..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              {/* Filters */}
              <div
                className="flex flex-wrap items-center gap-2"
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
                      label: "All collections",
                    },
                    {
                      value: "yes",
                      label: "Featured",
                    },
                    {
                      value: "no",
                      label: "Not featured",
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

              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  Unable to load collections
                </p>

                <p className="mt-1 text-red-600">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fetchCollections()
                  }
                  className="mt-3 font-semibold underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && !error ? (
            <CollectionsSkeleton />
          ) : !error &&
            collections.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(search.trim()) ||
                status !== "all" ||
                featured !== "all"
              }
              onClear={() => {
                setSearch("");
                setStatus("all");
                setFeatured("all");
              }}
            />
          ) : !error ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Collection
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Description
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Position
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Featured
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Created
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
                    {collections.map(
                      (collection) => (
                        <CollectionRow
                          key={collection.id}
                          collection={
                            collection
                          }
                          updating={
                            updatingId ===
                            collection.id
                          }
                          deleting={
                            deletingId ===
                            collection.id
                          }
                          menuOpen={
                            menuId ===
                            collection.id
                          }
                          onMenu={() =>
                            setMenuId(
                              menuId ===
                                collection.id
                                ? null
                                : collection.id,
                            )
                          }
                          onView={() =>
                            setSelectedCollection(
                              collection,
                            )
                          }
                          onToggleActive={() =>
                            updateCollection(
                              collection.id,
                              {
                                isActive:
                                  !collection.isActive,
                              },
                            )
                          }
                          onToggleFeatured={() =>
                            updateCollection(
                              collection.id,
                              {
                                featured:
                                  !collection.featured,
                              },
                            )
                          }
                          onDelete={() =>
                            deleteCollection(
                              collection,
                            )
                          }
                        />
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile/tablet */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {collections.map(
                  (collection) => (
                    <CollectionMobileCard
                      key={collection.id}
                      collection={
                        collection
                      }
                      updating={
                        updatingId ===
                        collection.id
                      }
                      deleting={
                        deletingId ===
                        collection.id
                      }
                      onView={() =>
                        setSelectedCollection(
                          collection,
                        )
                      }
                      onToggleActive={() =>
                        updateCollection(
                          collection.id,
                          {
                            isActive:
                              !collection.isActive,
                          },
                        )
                      }
                      onToggleFeatured={() =>
                        updateCollection(
                          collection.id,
                          {
                            featured:
                              !collection.featured,
                          },
                        )
                      }
                      onDelete={() =>
                        deleteCollection(
                          collection,
                        )
                      }
                    />
                  ),
                )}
              </div>
            </>

          ) : null}

          {/* Footer */}
          {!loading &&
            !error &&
            collections.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-400 sm:text-sm">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                    {collections.length}
                  </span>{" "}
                  collection
                  {collections.length ===
                  1
                    ? ""
                    : "s"}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sorted by position
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Details drawer */}
      {selectedCollection && (
        <CollectionDrawer
          collection={
            selectedCollection
          }
          updating={
            updatingId ===
            selectedCollection.id
          }
          deleting={
            deletingId ===
            selectedCollection.id
          }
          onClose={() =>
            setSelectedCollection(null)
          }
          onToggleActive={() =>
            updateCollection(
              selectedCollection.id,
              {
                isActive:
                  !selectedCollection.isActive,
              },
            )
          }
          onToggleFeatured={() =>
            updateCollection(
              selectedCollection.id,
              {
                featured:
                  !selectedCollection.featured,
              },
            )
          }
          onDelete={() =>
            deleteCollection(
              selectedCollection,
            )
          }
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat card                                                                  */
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

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 sm:h-10 sm:w-10">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filter select                                                              */
/* -------------------------------------------------------------------------- */

function FilterSelect<
  T extends string,
>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
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
            event.target.value as T,
          )
        }
        className="h-11 appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-slate-600 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Collection row                                                             */
/* -------------------------------------------------------------------------- */

function CollectionRow({
  collection,
  updating,
  deleting,
  menuOpen,
  onMenu,
  onView,
  onToggleActive,
  onToggleFeatured,
  onDelete,
}: {
  collection: Collection;
  updating: boolean;
  deleting: boolean;
  menuOpen: boolean;
  onMenu: () => void;
  onView: () => void;
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
          <CollectionImage
            collection={collection}
          />

          <div className="min-w-0">
            <p className="max-w-[210px] truncate text-sm font-semibold text-slate-900 transition group-hover:text-violet-700">
              {collection.name}
            </p>

            <p className="mt-0.5 max-w-[210px] truncate text-xs text-slate-400">
              /{collection.slug}
            </p>
          </div>
        </button>
      </td>

      <td className="px-5 py-4">
        <p className="max-w-[310px] truncate text-sm text-slate-600">
          {collection.description ||
            "No description added"}
        </p>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-slate-50 px-2 text-xs font-semibold text-slate-600">
          {collection.sortOrder}
        </span>
      </td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onToggleFeatured}
          disabled={updating}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
            collection.featured
              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Star
            className={`h-3.5 w-3.5 ${
              collection.featured
                ? "fill-current"
                : ""
            }`}
          />

          {collection.featured
            ? "Featured"
            : "Standard"}
        </button>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

          {formatDate(
            collection.createdAt,
          )}
        </div>
      </td>

      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onToggleActive}
          disabled={updating}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
            collection.isActive
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              collection.isActive
                ? "bg-emerald-500"
                : "bg-slate-400"
            }`}
          />

          {collection.isActive
            ? "Active"
            : "Inactive"}
        </button>
      </td>

      <td className="px-5 py-4">
        <div className="relative flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onView}
            title="View collection"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Eye className="h-4 w-4" />
          </button>

          <Link
            href={`/admin/collections/${collection.id}/edit`}
            onClick={(event) =>
              event.stopPropagation()
            }
            title="Edit collection"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Pencil className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMenu();
            }}
            title="More actions"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            {updating ||
            deleting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_15px_40px_rgba(15,23,42,0.12)]"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                type="button"
                onClick={onView}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Eye className="h-3.5 w-3.5" />
                View details
              </button>

              <Link
                href={`/admin/collections/${collection.id}/edit`}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit collection
              </Link>

              <button
                type="button"
                onClick={onDelete}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete collection
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile collection card                                                     */
/* -------------------------------------------------------------------------- */

function CollectionMobileCard({
  collection,
  updating,
  deleting,
  onView,
  onToggleActive,
  onToggleFeatured,
  onDelete,
}: {
  collection: Collection;
  updating: boolean;
  deleting: boolean;
  onView: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <CollectionImage
          collection={collection}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button
                type="button"
                onClick={onView}
                className="block max-w-full truncate text-left text-sm font-semibold text-slate-900"
              >
                {collection.name}
              </button>

              <p className="mt-0.5 truncate text-xs text-slate-400">
                /{collection.slug}
              </p>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                collection.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  collection.isActive
                    ? "bg-emerald-500"
                    : "bg-slate-400"
                }`}
              />

              {collection.isActive
                ? "Active"
                : "Inactive"}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
            {collection.description ||
              "No description added"}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-slate-50 p-2.5">
              <p className="text-[10px] font-medium text-slate-400">
                Position
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-700">
                {collection.sortOrder}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5">
              <p className="text-[10px] font-medium text-slate-400">
                Featured
              </p>

              <p className="mt-0.5 text-xs font-semibold text-slate-700">
                {collection.featured
                  ? "Yes"
                  : "No"}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-2.5">
              <p className="text-[10px] font-medium text-slate-400">
                Created
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-slate-700">
                {formatDate(
                  collection.createdAt,
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onView}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>

            <Link
              href={`/admin/collections/${collection.id}/edit`}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>

            <button
              type="button"
              onClick={onToggleFeatured}
              disabled={updating}
              className={`inline-flex h-9 items-center justify-center rounded-lg border px-3 ${
                collection.featured
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
              title="Toggle featured"
            >
              <Star
                className={`h-3.5 w-3.5 ${
                  collection.featured
                    ? "fill-current"
                    : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-red-500 hover:border-red-200 hover:bg-red-50"
              title="Delete"
            >
              {deleting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Collection image                                                            */
/* -------------------------------------------------------------------------- */

function CollectionImage({
  collection,
}: {
  collection: Collection;
}) {
  if (collection.image) {
    return (
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={collection.image}
          alt={collection.name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getCollectionColor(
        collection.name,
      )}`}
    >
      {getInitials(
        collection.name,
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Drawer                                                                     */
/* -------------------------------------------------------------------------- */

function CollectionDrawer({
  collection,
  updating,
  deleting,
  onClose,
  onToggleActive,
  onToggleFeatured,
  onDelete,
}: {
  collection: Collection;
  updating: boolean;
  deleting: boolean;
  onClose: () => void;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close collection details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-[#FCFAF7] shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-violet-600">
                Catalog
              </p>

              <h2 className="mt-1 font-[Poppins] text-lg font-semibold text-slate-900">
                Collection Details
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Hero */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative aspect-[2/1] overflow-hidden bg-slate-100">
              {collection.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center ${getCollectionColor(
                    collection.name,
                  )}`}
                >
                  <FolderOpen className="h-12 w-12 opacity-50" />
                </div>
              )}

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {collection.featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Featured
                  </span>
                )}

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-semibold shadow-sm ${
                    collection.isActive
                      ? "text-emerald-700"
                      : "text-slate-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      collection.isActive
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {collection.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-[Poppins] text-xl font-semibold text-slate-900">
                {collection.name}
              </h3>

              <p className="mt-1 text-sm text-violet-600">
                /{collection.slug}
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {collection.description ||
                  "No description has been added to this collection."}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Collection information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <DetailCard
                label="Sort order"
                value={String(
                  collection.sortOrder,
                )}
                icon={
                  <ArrowUpDown className="h-4 w-4" />
                }
              />

              <DetailCard
                label="Status"
                value={
                  collection.isActive
                    ? "Active"
                    : "Inactive"
                }
                icon={
                  <Check className="h-4 w-4" />
                }
              />

              <DetailCard
                label="Featured"
                value={
                  collection.featured
                    ? "Yes"
                    : "No"
                }
                icon={
                  <Star className="h-4 w-4" />
                }
              />

              <DetailCard
                label="Created"
                value={formatDate(
                  collection.createdAt,
                )}
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
              />
            </div>
          </div>

          {/* Image */}
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Collection image
            </h3>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <ImageIcon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    Image URL
                  </p>

                  <p className="mt-1 break-all text-xs leading-5 text-slate-600">
                    {collection.image ||
                      "No image configured"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Timestamps
            </h3>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailText
                  label="Created"
                  value={formatDate(
                    collection.createdAt,
                  )}
                />

                <DetailText
                  label="Last updated"
                  value={formatDate(
                    collection.updatedAt,
                  )}
                />

                <DetailText
                  label="Collection ID"
                  value={collection.id}
                  mono
                />

                <DetailText
                  label="Slug"
                  value={collection.slug}
                  mono
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Link
              href={`/admin/collections/${collection.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Link>

            <button
              type="button"
              disabled={updating}
              onClick={onToggleFeatured}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <Star
                className={`h-3.5 w-3.5 ${
                  collection.featured
                    ? "fill-current text-amber-500"
                    : ""
                }`}
              />

              {collection.featured
                ? "Unfeature"
                : "Feature"}
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={onToggleActive}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {collection.isActive ? (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  Disable
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Activate
                </>
              )}
            </button>

            <button
              type="button"
              disabled={deleting}
              onClick={onDelete}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}

              Delete
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail cards                                                               */
/* -------------------------------------------------------------------------- */

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
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

function DetailText({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 break-all text-xs font-medium text-slate-700 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
        <FolderOpen className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-[Poppins] text-base font-semibold text-slate-900">
        {hasFilters
          ? "No collections found"
          : "No collections yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or filters to find the collection you are looking for."
          : "Create your first collection to start organizing products across your storefront."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Clear filters
        </button>
      ) : (
        <Link
          href="/admin/collections/new"
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          Create Collection
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

function CollectionsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="hidden lg:block">
        <div className="h-12 border-b border-slate-100 bg-slate-50" />

        {Array.from({
          length: 7,
        }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-5 border-b border-slate-100 px-5 py-5"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-100" />

            <div className="w-48 space-y-2">
              <div className="h-3 w-28 rounded bg-slate-100" />
              <div className="h-2.5 w-20 rounded bg-slate-100" />
            </div>

            <div className="w-64">
              <div className="h-3 w-52 rounded bg-slate-100" />
            </div>

            <div className="h-8 w-12 rounded-lg bg-slate-100" />

            <div className="h-7 w-20 rounded-full bg-slate-100" />

            <div className="h-3 w-20 rounded bg-slate-100" />

            <div className="h-7 w-20 rounded-full bg-slate-100" />

            <div className="ml-auto h-9 w-28 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="lg:hidden">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <div
            key={index}
            className="flex gap-3 border-b border-slate-100 p-5"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-100" />

            <div className="flex-1 space-y-3">
              <div className="h-3 w-36 rounded bg-slate-100" />
              <div className="h-2.5 w-48 rounded bg-slate-100" />
              <div className="h-14 w-full rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

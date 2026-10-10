"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, LoaderCircle, Search, Sparkles, Star } from "lucide-react";

import type { StorefrontProduct, StorefrontProductsResponse } from "@/types/storefront";

interface FavoritesResponse {
  success: boolean;
  productIds?: string[];
  message?: string;
}

export default function HighlightsPage() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, favoritesResponse] = await Promise.all([
        fetch("/api/products?limit=100&sort=newest", {
          cache: "no-store",
        }),
        fetch("/api/homepage/favorites", {
          cache: "no-store",
        }),
      ]);

      const productData = (await productsResponse.json()) as StorefrontProductsResponse;

      const favoritesData = (await favoritesResponse.json()) as FavoritesResponse;

      if (!productsResponse.ok || !productData.success) {
        throw new Error("Could not load products.");
      }

      if (!favoritesResponse.ok || !favoritesData.success) {
        throw new Error(favoritesData.message ?? "Could not load saved highlights.");
      }

      setProducts(productData.products ?? []);
      setSelectedIds(favoritesData.productIds ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load highlights.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product._id, product])),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      `${product.name} ${product.slug}`.toLowerCase().includes(query),
    );
  }, [products, search]);

  function toggleProduct(productId: string) {
    setNotice("");
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function moveProduct(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= selectedIds.length) return;

    setSelectedIds((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });

    setNotice("");
  }

  async function saveSelection() {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/homepage/favorites", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productIds: selectedIds,
        }),
      });

      const data = (await response.json()) as FavoritesResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Failed to save highlights.");
      }

      setSelectedIds(data.productIds ?? selectedIds);
      setNotice("Buzzie Favorite products saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save highlights.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>


            <h1 className="font-playpen text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Buzzie Favorite
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Choose the products displayed in the large 3D homepage card. Arrange them in the order
              you want them to rotate.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSelection}
            disabled={loading || saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Highlights"}
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Available products</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{products.length}</p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-5">
            <p className="text-sm text-slate-500">Selected products</p>
            <p className="mt-2 text-2xl font-semibold text-violet-700">{selectedIds.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Carousel interval</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">5 seconds</p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="font-playpen font-semibold text-slate-900">All products</h2>

              <p className="mt-1 text-sm text-slate-500">
                Select or deselect products to control what appears in the carousel.
              </p>

              <label className="mt-4 flex h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 focus-within:border-violet-400">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-500">No products found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const selected = selectedIds.includes(product._id);
                  const image = product.images?.find((item) => item.url)?.url;

                  return (
                    <label
                      key={product._id}
                      className={`flex cursor-pointer items-center gap-4 p-4 transition hover:bg-violet-50/50 ${
                        selected ? "bg-violet-50/60" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleProduct(product._id)}
                        className="h-4 w-4 shrink-0 accent-violet-600"
                      />

                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                        {image ? (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {product.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">/{product.slug}</p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              product.published
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {product.published ? "Published" : "Unpublished"}
                          </span>

                          {product.status !== "active" && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                              {product.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {selected && (
                        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                          Selected
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-violet-600" />
                <h2 className="font-playpen font-semibold text-slate-900">Carousel order</h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                The carousel rotates through these products in this order.
              </p>
            </div>

            {selectedIds.length === 0 ? (
              <div className="p-8 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-700">No products selected</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Select at least one product to populate Buzzie Favorite.
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-slate-100">
                {selectedIds.map((id, index) => {
                  const product = productMap.get(id);

                  return (
                    <li key={id} className="flex items-center gap-3 p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                        {index + 1}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {product?.name ?? "Product unavailable"}
                        </p>
                        {!product?.published && (
                          <p className="mt-1 text-xs text-amber-700">
                            Not visible publicly until published
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          type="button"
                          aria-label={`Move ${product?.name ?? "product"} up`}
                          disabled={index === 0}
                          onClick={() => moveProduct(index, -1)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          aria-label={`Move ${product?.name ?? "product"} down`}
                          disabled={index === selectedIds.length - 1}
                          onClick={() => moveProduct(index, 1)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleProduct(id)}
                        aria-label={`Remove ${product?.name ?? "product"}`}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="border-t border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
              Save your changes to update the homepage. Unpublished products remain saved in your
              selection but are hidden from visitors until published.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

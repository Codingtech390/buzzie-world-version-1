"use client";

import { Check, LoaderCircle, Plus, Save, Search, Send, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { StorefrontProduct, StorefrontProductsResponse } from "@/types/storefront";

type OfferType = "buy_x_get_y" | "percentage";

interface DealItem {
  productId: string;
  offerType: OfferType;
  buyQuantity?: number;
  freeQuantity?: number;
  discountPercent?: number;
  isEnabled: boolean;
}

interface SavedDealItem extends DealItem {
  product?: StorefrontProduct;
}

interface DealSettings {
  title: string;
  description: string;
  isPublished: boolean;
  items: SavedDealItem[];
}

interface DealSettingsResponse {
  success: boolean;
  settings?: DealSettings;
  message?: string;
}

const EMPTY_SETTINGS: DealSettings = {
  title: "Crazy Deals",
  description: "",
  isPublished: false,
  items: [],
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

export default function DealsEditor() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [settings, setSettings] = useState<DealSettings>(EMPTY_SETTINGS);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, dealsResponse] = await Promise.all([
        fetch("/api/products?limit=100&sort=newest", {
          cache: "no-store",
        }),
        fetch("/api/homepage/deals", {
          cache: "no-store",
        }),
      ]);

      const productData: StorefrontProductsResponse = await productsResponse.json();
      const dealsData: DealSettingsResponse = await dealsResponse.json();

      if (!productsResponse.ok || !productData.success) {
        throw new Error(productData.message || "Could not load products.");
      }

      if (!dealsResponse.ok || !dealsData.success || !dealsData.settings) {
        throw new Error(dealsData.message || "Could not load deal settings.");
      }

      setProducts(productData.products ?? []);
      setSettings({
        ...EMPTY_SETTINGS,
        ...dealsData.settings,
        items: dealsData.settings.items ?? [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load Crazy Deals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query);

      const alreadySelected = settings.items.some((item) => item.productId === product._id);

      return matchesSearch && !alreadySelected;
    });
  }, [products, search, settings.items]);

  const selectedProduct = products.find((product) => product._id === selectedProductId);

  function updateSettings(patch: Partial<DealSettings>) {
    setSettings((current) => ({ ...current, ...patch }));
    setNotice("");
  }

  function addProduct() {
    if (!selectedProduct) return;

    const newItem: DealItem = {
      productId: selectedProduct._id,
      offerType: "percentage",
      discountPercent: 30,
      isEnabled: true,
    };

    updateSettings({
      items: [...settings.items, newItem],
    });

    setSelectedProductId("");
    setSearch("");
  }

  function updateItem(index: number, patch: Partial<DealItem>) {
    updateSettings({
      items: settings.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  function removeItem(index: number) {
    updateSettings({
      items: settings.items.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  async function saveSettings(publish: boolean) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        title: settings.title,
        description: settings.description,
        isPublished: publish,
        items: settings.items.map((item) => ({
          productId: item.productId,
          offerType: item.offerType,
          ...(item.offerType === "buy_x_get_y"
            ? {
                buyQuantity: item.buyQuantity ?? 2,
                freeQuantity: item.freeQuantity ?? 1,
              }
            : {
                discountPercent: item.discountPercent ?? 30,
              }),
          isEnabled: item.isEnabled,
        })),
      };

      const response = await fetch("/api/homepage/deals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: DealSettingsResponse = await response.json();

      if (!response.ok || !data.success || !data.settings) {
        throw new Error(data.message || "Could not save deal settings.");
      }

      setSettings({
        ...EMPTY_SETTINGS,
        ...data.settings,
        items: data.settings.items ?? [],
      });

      setNotice(publish ? "Crazy Deals saved and published." : "Crazy Deals saved as unpublished.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save Crazy Deals.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Loading Crazy Deals…
      </div>
    );
  }

  return (
    <main className="min-h-full bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              Storefront / Deals
            </p>
            <h1 className="text-3xl font-playpen font-bold tracking-tight text-slate-900">Crazy Deals</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Choose products, configure their offers, and control when the deals are visible to
              shoppers.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
              settings.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                settings.isPublished ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {settings.isPublished ? "Published" : "Unpublished"}
          </span>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <Check className="h-4 w-4 shrink-0" />
            {notice}
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-playpen font-bold text-slate-900">Deal section details</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              These details describe the Crazy Deals section on the storefront.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label htmlFor="deal-title" className={labelClass}>
                Section title
              </label>
              <input
                id="deal-title"
                className={inputClass}
                maxLength={120}
                value={settings.title}
                onChange={(event) => updateSettings({ title: event.target.value })}
              />
            </div>

            <div>
              <label htmlFor="deal-description" className={labelClass}>
                Section description
              </label>
              <input
                id="deal-description"
                className={inputClass}
                maxLength={500}
                placeholder="Add a short promotional message"
                value={settings.description}
                onChange={(event) => updateSettings({ description: event.target.value })}
              />
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-base font-playpen font-bold text-slate-900">Add products to deals</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Each product can appear only once in this deal configuration.
            </p>
          </div>

          {products.length === 0 ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              No products were returned by the products API. Check that products exist and that the
              API request is successful.
            </p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  aria-label="Search available products"
                  className={`${inputClass} pl-9`}
                  placeholder="Search products by name or slug…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                aria-label="Choose a product"
                className={`${inputClass} sm:max-w-[360px]`}
                value={selectedProductId}
                onChange={(event) => setSelectedProductId(event.target.value)}
              >
                <option value="">Select a product…</option>
                {filteredProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                    {typeof product.price === "number" ? ` — ₹${product.price}` : ""}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addProduct}
                disabled={!selectedProduct}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add product
              </button>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-base font-playpen font-bold text-slate-900">Configured offers</h2>
              <p className="mt-1 text-xs text-slate-500">
                {settings.items.length} {settings.items.length === 1 ? "product" : "products"} added
              </p>
            </div>
          </div>

          {settings.items.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-playpen text-sm font-bold text-slate-900">No deal products yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                Search for a product above and add it to create your first offer.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {settings.items.map((item, index) => {
                const product =
                  item.product ?? products.find((entry) => entry._id === item.productId);

                return (
                  <div
                    key={item.productId}
                    className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(220px,1fr)_minmax(220px,0.9fr)_minmax(220px,0.9fr)_auto]"
                  >
                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Product {index + 1}
                      </p>
                      <h3 className="break-words font-playpen text-sm font-bold text-slate-900">
                        {product?.name ?? "Product no longer available"}
                      </h3>
                      {typeof product?.price === "number" && (
                        <p className="mt-1 text-xs text-slate-500">
                          Current price: ₹{product.price.toLocaleString("en-IN")}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove product
                      </button>
                    </div>

                    <div>
                      <label htmlFor={`offer-type-${index}`} className={labelClass}>
                        Offer type
                      </label>
                      <select
                        id={`offer-type-${index}`}
                        className={inputClass}
                        value={item.offerType}
                        onChange={(event) => {
                          const offerType = event.target.value as OfferType;

                          updateItem(index, {
                            offerType,
                            ...(offerType === "buy_x_get_y"
                              ? { buyQuantity: 2, freeQuantity: 1 }
                              : { discountPercent: 30 }),
                          });
                        }}
                      >
                        <option value="buy_x_get_y">Buy X Get Y</option>
                        <option value="percentage">Percentage discount</option>
                      </select>
                    </div>

                    <div>
                      {item.offerType === "buy_x_get_y" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor={`buy-quantity-${index}`} className={labelClass}>
                              Buy quantity
                            </label>
                            <input
                              id={`buy-quantity-${index}`}
                              type="number"
                              min={1}
                              max={20}
                              className={inputClass}
                              value={item.buyQuantity ?? 2}
                              onChange={(event) =>
                                updateItem(index, {
                                  buyQuantity: Number(event.target.value),
                                })
                              }
                            />
                          </div>
                          <div>
                            <label htmlFor={`free-quantity-${index}`} className={labelClass}>
                              Free quantity
                            </label>
                            <input
                              id={`free-quantity-${index}`}
                              type="number"
                              min={1}
                              max={20}
                              className={inputClass}
                              value={item.freeQuantity ?? 1}
                              onChange={(event) =>
                                updateItem(index, {
                                  freeQuantity: Number(event.target.value),
                                })
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <label htmlFor={`discount-${index}`} className={labelClass}>
                            Discount
                          </label>
                          <select
                            id={`discount-${index}`}
                            className={inputClass}
                            value={item.discountPercent ?? 30}
                            onChange={(event) =>
                              updateItem(index, {
                                discountPercent: Number(event.target.value),
                              })
                            }
                          >
                            <option value={30}>30% off</option>
                            <option value={50}>50% off</option>
                            <option value={60}>60% off</option>
                          </select>
                        </>
                      )}
                    </div>

                    <div className="flex items-center xl:justify-end">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.isEnabled}
                          onChange={(event) =>
                            updateItem(index, {
                              isEnabled: event.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-slate-300 accent-violet-600"
                        />
                        Offer enabled
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col justify-between gap-3 border-t border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:px-6">
            <p className="max-w-xl text-xs leading-5 text-slate-500">
              Publishing makes enabled offers visible through the deals API. Saving as unpublished
              preserves your configuration without publishing it.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveSettings(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveSettings(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Publish deals
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

import type {
  ProductImage,
  ProductStatus,
  ProductVariant,
} from "@/types/product";

import ProductMedia from "./ProductMedia";

interface SelectorItem {
  _id: string;
  name: string;
  slug: string;
}

interface SelectorResponse {
  success: boolean;
  categories?: SelectorItem[];
  brands?: SelectorItem[];
  collections?: SelectorItem[];
  message?: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: string;
  status: ProductStatus;
  featured: boolean;
  category: string;
  brand: string;
  collection: string;
  ageMin: string;
  ageMax: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

const initialForm: FormState = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  compareAtPrice: "",
  sku: "",
  stock: "0",
  status: "draft",
  featured: false,
  category: "",
  brand: "",
  collection: "",
  ageMin: "",
  ageMax: "",
  images: [],
  variants: [],
};

export default function ProductForm({
  mode,
  productId,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);

  const [categories, setCategories] = useState<SelectorItem[]>([]);
  const [brands, setBrands] = useState<SelectorItem[]>([]);
  const [collections, setCollections] = useState<SelectorItem[]>([]);

  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isLoadingSelectors, setIsLoadingSelectors] =
    useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadSelectors() {
      try {
        setIsLoadingSelectors(true);

        const [
          categoriesResponse,
          brandsResponse,
          collectionsResponse,
        ] = await Promise.all([
          fetch("/api/categories", {
            signal: controller.signal,
          }),
          fetch("/api/brands", {
            signal: controller.signal,
          }),
          fetch("/api/collections", {
            signal: controller.signal,
          }),
        ]);

        if (
          !categoriesResponse.ok ||
          !brandsResponse.ok ||
          !collectionsResponse.ok
        ) {
          throw new Error(
            "Failed to load product selectors",
          );
        }

        const [
          categoriesData,
          brandsData,
          collectionsData,
        ]: SelectorResponse[] = await Promise.all([
          categoriesResponse.json(),
          brandsResponse.json(),
          collectionsResponse.json(),
        ]);

        if (
          !categoriesData.success ||
          !brandsData.success ||
          !collectionsData.success
        ) {
          throw new Error(
            "Failed to load product selectors",
          );
        }

        setCategories(categoriesData.categories ?? []);
        setBrands(brandsData.brands ?? []);
        setCollections(collectionsData.collections ?? []);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load selectors",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSelectors(false);
        }
      }
    }

    loadSelectors();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !productId) {
      return;
    }

    const controller = new AbortController();

    async function loadProduct() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/products/${productId}`,
          {
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.product) {
          throw new Error(
            data.message || "Failed to load product",
          );
        }

        const product = data.product;

        setForm({
          name: product.name ?? "",
          slug: product.slug ?? "",
          description: product.description ?? "",
          shortDescription:
            product.shortDescription ?? "",
          price:
            product.price !== undefined
              ? String(product.price)
              : "",
          compareAtPrice:
            product.compareAtPrice !== undefined
              ? String(product.compareAtPrice)
              : "",
          sku: product.sku ?? "",
          stock:
            product.stock !== undefined
              ? String(product.stock)
              : "0",
          status: product.status ?? "draft",
          featured: Boolean(product.featured),
          category:
            typeof product.category === "object"
              ? product.category?._id
              : product.category ?? "",
          brand:
            typeof product.brand === "object"
              ? product.brand?._id
              : product.brand ?? "",
          collection:
            typeof product.collection === "object"
              ? product.collection?._id
              : product.collection ?? "",
          ageMin:
            product.ageRange?.min !== undefined
              ? String(product.ageRange.min)
              : "",
          ageMax:
            product.ageRange?.max !== undefined
              ? String(product.ageRange.max)
              : "",
          images: product.images ?? [],
          variants: (product.variants ?? []).map(
            (variant: ProductVariant) => ({
              _id: variant._id,
              name: variant.name ?? "",
              value: variant.value ?? "",
              sku: variant.sku ?? "",
              price:
                variant.price !== undefined
                  ? Number(variant.price)
                  : undefined,
              stock:
                variant.stock !== undefined
                  ? Number(variant.stock)
                  : 0,
            }),
          ),
        });
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [mode, productId]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        {
          name: "",
          value: "",
          sku: "",
          price: undefined,
          stock: 0,
        },
      ],
    }));
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string | number | undefined,
  ) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    }));
  }

  function removeVariant(index: number) {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter(
        (_, variantIndex) => variantIndex !== index,
      ),
    }));
  }

  function validate(): string | null {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (!form.description.trim()) {
      return "Product description is required.";
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      return "Enter a valid product price.";
    }

    const stock = Number(form.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      return "Stock must be a non-negative integer.";
    }

    if (form.compareAtPrice) {
      const compareAtPrice = Number(form.compareAtPrice);

      if (
        !Number.isFinite(compareAtPrice) ||
        compareAtPrice < 0
      ) {
        return "Compare-at price must be valid.";
      }

      if (compareAtPrice < price) {
        return "Compare-at price should be greater than or equal to the selling price.";
      }
    }

    if (
      form.ageMin &&
      (!Number.isInteger(Number(form.ageMin)) ||
        Number(form.ageMin) < 0)
    ) {
      return "Minimum age must be a non-negative integer.";
    }

    if (
      form.ageMax &&
      (!Number.isInteger(Number(form.ageMax)) ||
        Number(form.ageMax) < 0)
    ) {
      return "Maximum age must be a non-negative integer.";
    }

    if (
      form.ageMin &&
      form.ageMax &&
      Number(form.ageMin) > Number(form.ageMax)
    ) {
      return "Minimum age cannot be greater than maximum age.";
    }

    for (const variant of form.variants) {
      if (!variant.name.trim() || !variant.value.trim()) {
        return "Every variant must have a name and value.";
      }

      if (
        variant.price !== undefined &&
        (!Number.isFinite(Number(variant.price)) ||
          Number(variant.price) < 0)
      ) {
        return "Variant price must be valid.";
      }

      if (
        variant.stock !== undefined &&
        (!Number.isInteger(Number(variant.stock)) ||
          Number(variant.stock) < 0)
      ) {
        return "Variant stock must be a non-negative integer.";
      }
    }

    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description.trim(),
        shortDescription:
          form.shortDescription.trim() || undefined,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice
          ? Number(form.compareAtPrice)
          : undefined,
        sku: form.sku.trim() || undefined,
        images: form.images,
        category: form.category || undefined,
        brand: form.brand || undefined,
        collection: form.collection || undefined,
        variants: form.variants.map((variant) => ({
          _id: variant._id,
          name: variant.name.trim(),
          value: variant.value.trim(),
          sku: variant.sku?.trim() || undefined,
          price:
            variant.price === undefined ||
            variant.price === null
              ? undefined
              : Number(variant.price),
          stock:
            variant.stock === undefined
              ? 0
              : Number(variant.stock),
        })),
        stock: Number(form.stock),
        status: form.status,
        featured: form.featured,
        ageRange:
          form.ageMin || form.ageMax
            ? {
                min: form.ageMin
                  ? Number(form.ageMin)
                  : undefined,
                max: form.ageMax
                  ? Number(form.ageMax)
                  : undefined,
              }
            : undefined,
      };

      const response = await fetch(
        mode === "create"
          ? "/api/products"
          : `/api/products/${productId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save product",
        );
      }

      setSuccess(
        mode === "create"
          ? "Product created successfully."
          : "Product updated successfully.",
      );

      if (mode === "create") {
        setForm(initialForm);

        window.setTimeout(() => {
          window.location.href = "/admin/products";
        }, 700);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save product",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-[#3F7DFF]" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "create"
              ? "Create Product"
              : "Edit Product"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "create"
              ? "Add a new product to your BuzzieWorld catalog."
              : "Update product information and catalog settings."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/admin/products";
          }}
          className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-[#F56B9A]/30 bg-[#F56B9A]/5 px-4 py-3">
          <p className="text-sm text-[#C44770]">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-[#79D45C]/30 bg-[#79D45C]/10 px-4 py-3">
          <p className="text-sm text-[#4D9A38]">{success}</p>
        </div>
      )}

      {/* Basic information */}
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <h2 className="text-base font-semibold">
          Basic Information
        </h2>

        <div className="mt-5 grid gap-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Product Name *
            </label>

            <input
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="e.g. Wooden Safari Puzzle"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Slug
            </label>

            <input
              value={form.slug}
              onChange={(event) =>
                updateField("slug", event.target.value)
              }
              placeholder="wooden-safari-puzzle"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />

            <p className="mt-1.5 text-xs text-muted-foreground">
              Leave empty to generate automatically from the
              product name.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Short Description
            </label>

            <input
              value={form.shortDescription}
              onChange={(event) =>
                updateField(
                  "shortDescription",
                  event.target.value,
                )
              }
              placeholder="Short product summary"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Description *
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              rows={6}
              placeholder="Describe the product..."
              className="w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>
        </div>
      </section>

      {/* Pricing and inventory */}
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <h2 className="text-base font-semibold">
          Pricing & Inventory
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Price *
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(event) =>
                updateField("price", event.target.value)
              }
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Compare-at Price
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.compareAtPrice}
              onChange={(event) =>
                updateField(
                  "compareAtPrice",
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              SKU
            </label>

            <input
              value={form.sku}
              onChange={(event) =>
                updateField("sku", event.target.value)
              }
              placeholder="BW-SAFARI-001"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Stock *
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) =>
                updateField("stock", event.target.value)
              }
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>
        </div>
      </section>

      {/* Selectors */}
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <h2 className="text-base font-semibold">
          Catalog Classification
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Category
            </label>

            <select
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              disabled={isLoadingSelectors}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15 disabled:opacity-60"
            >
              <option value="">Select category</option>

              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Brand
            </label>

            <select
              value={form.brand}
              onChange={(event) =>
                updateField("brand", event.target.value)
              }
              disabled={isLoadingSelectors}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15 disabled:opacity-60"
            >
              <option value="">Select brand</option>

              {brands.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Collection
            </label>

            <select
              value={form.collection}
              onChange={(event) =>
                updateField(
                  "collection",
                  event.target.value,
                )
              }
              disabled={isLoadingSelectors}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15 disabled:opacity-60"
            >
              <option value="">Select collection</option>

              {collections.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <h2 className="text-base font-semibold">
          Product Settings
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Status
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as ProductStatus,
                )
              }
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Minimum Age
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.ageMin}
              onChange={(event) =>
                updateField("ageMin", event.target.value)
              }
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Maximum Age
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={form.ageMax}
              onChange={(event) =>
                updateField("ageMax", event.target.value)
              }
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
            />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              updateField("featured", event.target.checked)
            }
            className="h-4 w-4 rounded border"
          />

          <span className="text-sm font-medium">
            Featured product
          </span>
        </label>
      </section>

      {/* Media */}
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <ProductMedia
          images={form.images}
          onChange={(images) =>
            updateField("images", images)
          }
          disabled={isSaving}
        />
      </section>

      {/* Variants */}
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">
              Variants
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add size, color, age or other product variants.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Add Variant
          </button>
        </div>

        {form.variants.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No variants added.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {form.variants.map((variant, index) => (
              <div
                key={variant._id || index}
                className="rounded-xl border p-4"
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <input
                    value={variant.name}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="Name e.g. Color"
                    className="h-10 rounded-xl border bg-background px-3 text-sm"
                  />

                  <input
                    value={variant.value}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "value",
                        event.target.value,
                      )
                    }
                    placeholder="Value e.g. Blue"
                    className="h-10 rounded-xl border bg-background px-3 text-sm"
                  />

                  <input
                    value={variant.sku || ""}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "sku",
                        event.target.value,
                      )
                    }
                    placeholder="Variant SKU"
                    className="h-10 rounded-xl border bg-background px-3 text-sm"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      variant.price === undefined
                        ? ""
                        : variant.price
                    }
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "price",
                        event.target.value
                          ? Number(event.target.value)
                          : undefined,
                      )
                    }
                    placeholder="Variant price"
                    className="h-10 rounded-xl border bg-background px-3 text-sm"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={variant.stock ?? 0}
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "stock",
                        Number(event.target.value),
                      )
                    }
                    placeholder="Stock"
                    className="h-10 w-40 rounded-xl border bg-background px-3 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="rounded-xl border border-[#F56B9A]/30 px-3 py-2 text-sm font-medium text-[#C44770] hover:bg-[#F56B9A]/5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit */}
      <div className="flex justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/admin/products";
          }}
          disabled={isSaving}
          className="rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#3F7DFF] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : mode === "create"
              ? "Create Product"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

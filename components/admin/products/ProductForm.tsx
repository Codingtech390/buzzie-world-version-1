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
  stock: "",
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

function isAbortError(error: unknown) {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

function optionalNumber(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {eyebrow && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3F7DFF]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h2>

      {description && (
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-2 block text-sm font-medium text-foreground">
      {children}
      {required && (
        <span className="ml-1 text-[#E83D59]">*</span>
      )}
    </label>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-[#3F7DFF] focus:ring-4 focus:ring-[#3F7DFF]/10";

const textareaClass =
  "w-full rounded-xl border border-border/80 bg-background px-3.5 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-[#3F7DFF] focus:ring-4 focus:ring-[#3F7DFF]/10";

const selectClass =
  "h-11 w-full rounded-xl border border-border/80 bg-background px-3.5 text-sm text-foreground outline-none transition-all focus:border-[#3F7DFF] focus:ring-4 focus:ring-[#3F7DFF]/10 disabled:cursor-not-allowed disabled:opacity-60";

export default function ProductForm({
  mode,
  productId,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);

  const [categories, setCategories] = useState<SelectorItem[]>(
    [],
  );
  const [brands, setBrands] = useState<SelectorItem[]>([]);
  const [collections, setCollections] = useState<SelectorItem[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isLoadingSelectors, setIsLoadingSelectors] =
    useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        if (isAbortError(err)) {
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
            product.price !== undefined &&
            product.price !== null
              ? String(product.price)
              : "",

          compareAtPrice:
            product.compareAtPrice !== undefined &&
            product.compareAtPrice !== null
              ? String(product.compareAtPrice)
              : "",

          sku: product.sku ?? "",

          stock:
            product.stock !== undefined &&
            product.stock !== null
              ? String(product.stock)
              : "",

          status: product.status ?? "draft",

          featured: Boolean(product.featured),

          category:
            typeof product.category === "object"
              ? product.category?._id ?? ""
              : product.category ?? "",

          brand:
            typeof product.brand === "object"
              ? product.brand?._id ?? ""
              : product.brand ?? "",

          collection:
            typeof product.collection === "object"
              ? product.collection?._id ?? ""
              : product.collection ?? "",

          ageMin:
            product.ageRange?.min !== undefined &&
            product.ageRange?.min !== null
              ? String(product.ageRange.min)
              : "",

          ageMax:
            product.ageRange?.max !== undefined &&
            product.ageRange?.max !== null
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
                variant.price !== undefined &&
                variant.price !== null
                  ? Number(variant.price)
                  : undefined,

              stock:
                variant.stock !== undefined &&
                variant.stock !== null
                  ? Number(variant.stock)
                  : undefined,
            }),
          ),
        });
      } catch (err) {
        if (isAbortError(err)) {
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

    if (error) {
      setError(null);
    }
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
          stock: undefined,
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
      variants: current.variants.map(
        (variant, variantIndex) =>
          variantIndex === index
            ? {
                ...variant,
                [field]: value,
              }
            : variant,
      ),
    }));

    if (error) {
      setError(null);
    }
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

    const price = optionalNumber(form.price);
    const stock = optionalNumber(form.stock);

    /*
     * Price is optional for drafts, but if supplied it must
     * always be valid.
     */
    if (
      price !== undefined &&
      (!Number.isFinite(price) || price < 0)
    ) {
      return "Enter a valid product price.";
    }

    /*
     * Stock is optional for drafts, but if supplied it must
     * always be a non-negative integer.
     */
    if (
      stock !== undefined &&
      (!Number.isInteger(stock) || stock < 0)
    ) {
      return "Stock must be a non-negative integer.";
    }

    /*
     * Active products must have both price and stock.
     */
    if (form.status === "active") {
      if (price === undefined) {
        return "Active products require a price.";
      }

      if (stock === undefined) {
        return "Active products require stock.";
      }
    }

    if (form.compareAtPrice.trim()) {
      const compareAtPrice = Number(
        form.compareAtPrice,
      );

      if (
        !Number.isFinite(compareAtPrice) ||
        compareAtPrice < 0
      ) {
        return "Compare-at price must be valid.";
      }

      if (
        price !== undefined &&
        compareAtPrice < price
      ) {
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
      if (
        !variant.name.trim() ||
        !variant.value.trim()
      ) {
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

      const price = optionalNumber(form.price);
      const stock = optionalNumber(form.stock);

      const payload = {
        name: form.name.trim(),

        slug: form.slug.trim() || undefined,

        description: form.description.trim(),

        shortDescription:
          form.shortDescription.trim() || undefined,

        price,

        compareAtPrice:
          form.compareAtPrice.trim() === ""
            ? undefined
            : Number(form.compareAtPrice),

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
            variant.stock === undefined ||
            variant.stock === null
              ? undefined
              : Number(variant.stock),
        })),

        stock,

        status: form.status,

        featured: form.featured,

        ageRange:
          form.ageMin || form.ageMax
            ? {
                min:
                  form.ageMin.trim() === ""
                    ? undefined
                    : Number(form.ageMin),

                max:
                  form.ageMax.trim() === ""
                    ? undefined
                    : Number(form.ageMax),
              }
            : undefined,
      };

      const response = await fetch(
        mode === "create"
          ? "/api/products"
          : `/api/products/${productId}`,
        {
          method:
            mode === "create" ? "POST" : "PATCH",

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
      <div className="flex min-h-[460px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-muted border-t-[#3F7DFF]" />

          <p className="mt-4 text-sm font-medium text-foreground">
            Loading product...
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Preparing your product details
          </p>
        </div>
      </div>
    );
  }

  const isDraft = form.status === "draft";
  const isActive = form.status === "active";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-6xl space-y-6 pb-10"
    >
      {/* Page header */}
      <div className="rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3F7DFF]">
              Catalog Management
            </p>

            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[28px]">
              {mode === "create"
                ? "Create Product"
                : "Edit Product"}
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
              {mode === "create"
                ? "Add a new product to your BuzzieWorld catalog."
                : "Update product information, pricing and catalog settings."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/admin/products";
            }}
            disabled={isSaving}
            className="h-10 rounded-xl border border-border/80 bg-background px-4 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Status notices */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#F56B9A]/25 bg-[#F56B9A]/[0.06] px-4 py-3.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F56B9A]/15 text-xs font-bold text-[#C44770]">
            !
          </div>

          <div>
            <p className="text-sm font-medium text-[#C44770]">
              Unable to save product
            </p>

            <p className="mt-0.5 text-sm leading-5 text-[#C44770]/90">
              {error}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#79D45C]/25 bg-[#79D45C]/[0.08] px-4 py-3.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#79D45C]/15 text-xs font-bold text-[#4D9A38]">
            ✓
          </div>

          <p className="pt-0.5 text-sm font-medium text-[#4D9A38]">
            {success}
          </p>
        </div>
      )}

      {/* Draft guidance */}
      {isDraft && (
        <div className="rounded-2xl border border-[#3F7DFF]/15 bg-[#3F7DFF]/[0.035] px-4 py-3.5 sm:px-5">
          <p className="text-sm font-medium text-foreground">
            Draft mode
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            You can save this product while pricing and inventory
            information is still incomplete. Price and stock are
            required before the product can be made Active.
          </p>
        </div>
      )}

      {isActive && (
        <div className="rounded-2xl border border-[#79D45C]/20 bg-[#79D45C]/[0.055] px-4 py-3.5 sm:px-5">
          <p className="text-sm font-medium text-foreground">
            Active product
          </p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            This product is ready to be published. Make sure its
            price and stock information are complete.
          </p>
        </div>
      )}

      {/* Basic information */}
      <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6">
        <SectionHeader
          eyebrow="01"
          title="Basic Information"
          description="Define the core information customers and your team will use to identify this product."
        />

        <div className="mt-6 grid gap-5">
          <div>
            <FieldLabel required>
              Product Name
            </FieldLabel>

            <input
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="e.g. Wooden Safari Puzzle"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>
              Slug
            </FieldLabel>

            <input
              value={form.slug}
              onChange={(event) =>
                updateField("slug", event.target.value)
              }
              placeholder="wooden-safari-puzzle"
              className={inputClass}
            />

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Leave empty to generate automatically from the
              product name.
            </p>
          </div>

          <div>
            <FieldLabel>
              Short Description
            </FieldLabel>

            <input
              value={form.shortDescription}
              onChange={(event) =>
                updateField(
                  "shortDescription",
                  event.target.value,
                )
              }
              placeholder="A short product summary"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel required>
              Description
            </FieldLabel>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              rows={6}
              placeholder="Describe the product, its contents, learning value and important details..."
              className={textareaClass}
            />

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Keep the description clear and useful for both
              parents and customers.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6">
        <SectionHeader
          eyebrow="02"
          title="Pricing & Inventory"
          description={
            isDraft
              ? "Pricing and stock can remain empty while this product is a draft."
              : "Set the selling price and inventory information for this active product."
          }
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <FieldLabel required={isActive}>
              Price
            </FieldLabel>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  updateField(
                    "price",
                    event.target.value,
                  )
                }
                placeholder="0.00"
                className={`${inputClass} pl-8`}
              />
            </div>

            {isDraft && (
              <p className="mt-2 text-xs text-muted-foreground">
                Optional while Draft.
              </p>
            )}
          </div>

          <div>
            <FieldLabel>
              Compare-at Price
            </FieldLabel>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>

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
                placeholder="0.00"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          <div>
            <FieldLabel>
              SKU
            </FieldLabel>

            <input
              value={form.sku}
              onChange={(event) =>
                updateField("sku", event.target.value)
              }
              placeholder="BW-SAFARI-001"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel required={isActive}>
              Stock
            </FieldLabel>

            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) =>
                updateField(
                  "stock",
                  event.target.value,
                )
              }
              placeholder="0"
              className={inputClass}
            />

            {isDraft && (
              <p className="mt-2 text-xs text-muted-foreground">
                Optional while Draft.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Catalog classification */}
      <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6">
        <SectionHeader
          eyebrow="03"
          title="Catalog Classification"
          description="Organize the product so it can be discovered and managed throughout the store."
        />

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div>
            <FieldLabel>
              Category
            </FieldLabel>

            <select
              value={form.category}
              onChange={(event) =>
                updateField(
                  "category",
                  event.target.value,
                )
              }
              disabled={isLoadingSelectors}
              className={selectClass}
            >
              <option value="">
                Select category
              </option>

              {categories.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>
              Brand
            </FieldLabel>

            <select
              value={form.brand}
              onChange={(event) =>
                updateField(
                  "brand",
                  event.target.value,
                )
              }
              disabled={isLoadingSelectors}
              className={selectClass}
            >
              <option value="">
                Select brand
              </option>

              {brands.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>
              Collection
            </FieldLabel>

            <select
              value={form.collection}
              onChange={(event) =>
                updateField(
                  "collection",
                  event.target.value,
                )
              }
              disabled={isLoadingSelectors}
              className={selectClass}
            >
              <option value="">
                Select collection
              </option>

              {collections.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Product settings */}
      <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6">
        <SectionHeader
          eyebrow="04"
          title="Product Settings"
          description="Control the product's publishing state, age guidance and featured visibility."
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <FieldLabel>
              Status
            </FieldLabel>

            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as ProductStatus,
                )
              }
              className={selectClass}
            >
              <option value="draft">
                Draft
              </option>

              <option value="active">
                Active
              </option>

              <option value="archived">
                Archived
              </option>
            </select>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Active products require both price and stock.
            </p>
          </div>

          <div>
            <FieldLabel>
              Minimum Age
            </FieldLabel>

            <input
              type="number"
              min="0"
              step="1"
              value={form.ageMin}
              onChange={(event) =>
                updateField(
                  "ageMin",
                  event.target.value,
                )
              }
              placeholder="e.g. 3"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>
              Maximum Age
            </FieldLabel>

            <input
              type="number"
              min="0"
              step="1"
              value={form.ageMax}
              onChange={(event) =>
                updateField(
                  "ageMax",
                  event.target.value,
                )
              }
              placeholder="e.g. 8"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border/60 bg-muted/20 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) =>
                updateField(
                  "featured",
                  event.target.checked,
                )
              }
              className="mt-0.5 h-4 w-4 rounded border-border accent-[#3F7DFF]"
            />

            <span>
              <span className="block text-sm font-medium text-foreground">
                Featured product
              </span>

              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                Highlight this product in featured sections
                across the storefront.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Media */}
      <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6">
        <SectionHeader
          eyebrow="05"
          title="Product Media"
          description="Manage the product images used across your catalog and storefront."
        />

        <div className="mt-6">
          <ProductMedia
            images={form.images}
            onChange={(images) =>
              updateField("images", images)
            }
            disabled={isSaving}
          />
        </div>
      </section>

      {/* Variants */}
      <section className="rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            eyebrow="06"
            title="Variants"
            description="Add size, color, age or other product-specific variations when needed."
          />

          <button
            type="button"
            onClick={addVariant}
            disabled={isSaving}
            className="shrink-0 rounded-xl border border-border/80 bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add Variant
          </button>
        </div>

        {form.variants.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border/80 bg-muted/[0.18] px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No variants added
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              Variants are optional. Add them when this product
              has different sizes, colors, formats or other
              selectable options.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {form.variants.map((variant, index) => (
              <div
                key={variant._id || index}
                className="rounded-2xl border border-border/70 bg-muted/[0.12] p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Variant {index + 1}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Define the option and its optional
                      inventory details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(index)
                    }
                    disabled={isSaving}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#C44770] transition-colors hover:bg-[#F56B9A]/10 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <FieldLabel>
                      Name
                    </FieldLabel>

                    <input
                      value={variant.name}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "name",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Color"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      Value
                    </FieldLabel>

                    <input
                      value={variant.value}
                      onChange={(event) =>
                        updateVariant(
                          index,
                          "value",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Blue"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      SKU
                    </FieldLabel>

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
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      Price
                    </FieldLabel>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        ₹
                      </span>

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
                            event.target.value === ""
                              ? undefined
                              : Number(
                                  event.target.value,
                                ),
                          )
                        }
                        placeholder="0.00"
                        className={`${inputClass} pl-8`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 max-w-[220px]">
                  <FieldLabel>
                    Stock
                  </FieldLabel>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      variant.stock ?? ""
                    }
                    onChange={(event) =>
                      updateVariant(
                        index,
                        "stock",
                        event.target.value === ""
                          ? undefined
                          : Number(
                              event.target.value,
                            ),
                      )
                    }
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submit */}
      <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/admin/products";
          }}
          disabled={isSaving}
          className="h-11 rounded-xl border border-border/80 bg-background px-5 text-sm font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="h-11 rounded-xl bg-[#3F7DFF] px-6 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#356FE6] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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

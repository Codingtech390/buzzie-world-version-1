import { notFound } from "next/navigation";

import ProductGallery from "@/components/product/ProductGallery";
import RelatedProducts from "@/components/product/RelatedProducts";
import AddToCartButton from "@/components/cart/AddToCartButton";
import type { StorefrontProductResponse, StorefrontProduct } from "@/types/storefront";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string): Promise<StorefrontProduct | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/products/slug/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data: StorefrontProductResponse = await response.json();

  if (!data.success || !data.product) {
    return null;
  }

  return data.product;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const hasDiscount =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;

  const isOutOfStock = product.stock <= 0;

  const categoryId = product.category?._id;

  return (
    <main className="min-h-screen bg-[#FFFDF9]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col justify-center">
            {product.category?.name && (
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3F7DFF]">
                {product.category.name}
              </p>
            )}

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#252525] sm:text-4xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-bold text-[#252525]">
                {formatPrice(product.price)}
              </span>

              {hasDiscount && (
                <span className="pb-1 text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {product.sku && (
              <p className="mt-3 text-xs text-muted-foreground">SKU: {product.sku}</p>
            )}

            <div className="mt-6">
              {isOutOfStock ? (
                <div className="rounded-2xl bg-[#F56B9A]/10 px-4 py-3 text-sm font-semibold text-[#C44770]">
                  This product is currently out of stock.
                </div>
              ) : (
                <div className="rounded-2xl bg-[#79D45C]/10 px-4 py-3 text-sm font-semibold text-[#4D9A38]">
                  {product.stock <= 5
                    ? `Only ${product.stock} left in stock`
                    : "In stock and ready to ship"}
                </div>
              )}
            </div>

            {product.variants.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-[#252525]">Available options</h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <span
                      key={variant._id || `${variant.name}-${variant.value}`}
                      className="rounded-full border border-[#F8EFD8] bg-white px-4 py-2 text-sm"
                    >
                      {variant.name}: {variant.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                productId={product._id}
                disabled={isOutOfStock}
                quantity={1}
                className="h-12 flex-1 rounded-full px-6 text-sm font-semibold"
              />

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#F8EFD8] bg-white px-6 text-sm font-semibold text-[#252525] transition hover:bg-[#FFF8EC]"
              >
                Save for later
              </button>
            </div>

            <div className="mt-10 border-t border-[#F8EFD8] pt-8">
              <h2 className="text-lg font-semibold text-[#252525]">About this product</h2>

              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {product.description}
              </div>
            </div>

            {(product.brand?.name || product.collection?.name || product.ageRange) && (
              <div className="mt-8 grid gap-3 border-t border-[#F8EFD8] pt-8 sm:grid-cols-2">
                {product.brand?.name && (
                  <div className="rounded-2xl bg-[#FFF8EC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Brand
                    </p>
                    <p className="mt-1 font-semibold text-[#252525]">{product.brand.name}</p>
                  </div>
                )}

                {product.collection?.name && (
                  <div className="rounded-2xl bg-[#FFF8EC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Collection
                    </p>
                    <p className="mt-1 font-semibold text-[#252525]">{product.collection.name}</p>
                  </div>
                )}

                {product.ageRange && (
                  <div className="rounded-2xl bg-[#FFF8EC] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Recommended age
                    </p>

                    <p className="mt-1 font-semibold text-[#252525]">
                      {product.ageRange.min !== undefined && product.ageRange.max !== undefined
                        ? `${product.ageRange.min}–${product.ageRange.max} years`
                        : product.ageRange.min !== undefined
                          ? `${product.ageRange.min}+ years`
                          : product.ageRange.max !== undefined
                            ? `Up to ${product.ageRange.max} years`
                            : "All ages"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <RelatedProducts categoryId={categoryId} currentProductId={product._id} />
      </div>
    </main>
  );
}

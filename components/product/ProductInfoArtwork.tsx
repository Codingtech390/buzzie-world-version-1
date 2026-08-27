"use client";

import { Check, Clock3, Heart, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";

import ProductPurchaseOptions from "@/components/product/ProductPurchaseOptions";
import type { StorefrontProduct } from "@/types/storefront";

interface ProductInfoArtworkProps {
  product: StorefrontProduct;
  ageLabel: string | null;
  hasDiscount: boolean;
  discount: number;
  isOutOfStock: boolean;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductInfoArtwork({
  product,
  ageLabel,
  hasDiscount,
  discount,
  isOutOfStock,
}: ProductInfoArtworkProps) {
  const [wishlistActive, setWishlistActive] = useState(false);
  const [deliveryPin, setDeliveryPin] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  function checkDelivery() {
    const pin = deliveryPin.trim();

    if (!pin) {
      setDeliveryMessage("Please enter your pincode.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setDeliveryMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    setDeliveryMessage("We'll confirm delivery availability at checkout.");
  }

  return (
    <section className="w-full">
      <div
        className="
          grid
          gap-6
          lg:grid-cols-[minmax(0,1fr)_230px]
          xl:grid-cols-[minmax(0,1fr)_245px]
          lg:items-start
        "
      >
        {/* =====================================================================
            LEFT — PRODUCT INFORMATION
        ====================================================================== */}

        <div className="min-w-0">
          {/* BADGES + WISHLIST */}

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {product.featured ? (
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[#E72D5A]
                    px-3
                    py-1.5
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-extrabold
                    leading-none
                    text-white
                    shadow-[0_6px_18px_rgba(231,45,90,0.16)]
                    sm:text-[11px]
                  "
                >
                  Best Seller
                </span>
              ) : null}

              {ageLabel ? (
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-[#F0E9FF]
                    px-3
                    py-1.5
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-extrabold
                    leading-none
                    text-[#7044B8]
                    sm:text-[11px]
                  "
                >
                  {ageLabel}
                </span>
              ) : null}
            </div>

            <button
              type="button"
              aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlistActive}
              onClick={() => setWishlistActive((value) => !value)}
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#E5E1E3]
                bg-white
                text-[#17203B]
                transition
                hover:border-[#E72D5A]/40
                hover:text-[#E72D5A]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E72D5A]
              "
            >
              <Heart
                className={`size-[19px] ${wishlistActive ? "fill-[#E72D5A] text-[#E72D5A]" : ""}`}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* CATEGORY */}

          {product.category?.name ? (
            <p
              className="
                mt-5
                font-[var(--font-poppins)]
                text-[10px]
                font-bold
                uppercase
                tracking-[0.13em]
                text-[#E72D5A]
                sm:text-[11px]
              "
            >
              {product.category.name}
            </p>
          ) : null}

          {/* PRODUCT NAME */}

          <h1
            className="
              mt-2
              font-[var(--font-roboto)]
              text-[clamp(2rem,3.2vw,2.75rem)]
              font-black
              leading-[1.02]
              tracking-[-0.055em]
              text-[#10183B]
            "
          >
            {product.name}
          </h1>

          {/* SHORT DESCRIPTION */}

          {product.shortDescription ? (
            <p
              className="
                mt-4
                max-w-2xl
                font-[var(--font-poppins)]
                text-[14px]
                font-medium
                leading-6
                text-[#20243D]
                sm:text-[15px]
                sm:leading-7
              "
            >
              {product.shortDescription}
            </p>
          ) : null}

          {/* RATING / META */}

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-2
              font-[var(--font-poppins)]
              text-[11px]
              font-medium
              text-[#64687A]
              sm:text-[12px]
            "
          >
            <span className="flex items-center gap-1">
              <span className="text-[#FFB000]">★★★★★</span>
            </span>

            <span className="text-[#4F5367]">Loved by little explorers</span>

            {product.sku ? (
              <>
                <span className="hidden h-4 w-px bg-[#DCD9DC] sm:block" />
                <span>SKU: {product.sku}</span>
              </>
            ) : null}
          </div>

          {/* PRICE */}

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span
              className="
                font-[var(--font-roboto)]
                text-[2.25rem]
                font-black
                leading-none
                tracking-[-0.055em]
                text-[#E72D5A]
                sm:text-[2.65rem]
              "
            >
              {formatPrice(product.price)}
            </span>

            {hasDiscount ? (
              <span
                className="
                  pb-1
                  font-[var(--font-poppins)]
                  text-[15px]
                  font-medium
                  text-[#777985]
                  line-through
                  sm:text-[16px]
                "
              >
                {formatPrice(product.compareAtPrice!)}
              </span>
            ) : null}

            {discount > 0 ? (
              <span
                className="
                  mb-1
                  rounded-full
                  bg-[#FFF0F4]
                  px-3
                  py-1.5
                  font-[var(--font-poppins)]
                  text-[10px]
                  font-extrabold
                  text-[#E72D5A]
                  sm:text-[11px]
                "
              >
                {discount}% OFF
              </span>
            ) : null}
          </div>

          {/* PRODUCT FEATURES */}

          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-4
            "
          >
            <Feature
              icon="✦"
              title="Playful"
              subtitle="Made for fun"
              className="bg-[#FFF5F7]"
              iconClass="bg-[#FFE0E8] text-[#E72D5A]"
            />

            <Feature
              icon="◉"
              title="Kids"
              subtitle={ageLabel || "Age group"}
              className="bg-[#F6F1FF]"
              iconClass="bg-[#E8DEFF] text-[#7044B8]"
            />

            <Feature
              icon="✓"
              title="Ready"
              subtitle="To ship"
              className="bg-[#FFF8ED]"
              iconClass="bg-[#FFE9C9] text-[#F59A23]"
            />

            <Feature
              icon="♡"
              title="Trusted"
              subtitle="Quality"
              className="bg-[#F3FAF4]"
              iconClass="bg-[#DDF1E0] text-[#4C955A]"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">
            <p
              className="
                font-[var(--font-poppins)]
                text-[13px]
                font-medium
                leading-6
                text-[#292D43]
                sm:text-[14px]
                sm:leading-7
              "
            >
              {product.description}
            </p>

            <button
              type="button"
              className="
                mt-2
                font-[var(--font-poppins)]
                text-[12px]
                font-bold
                text-[#E72D5A]
                transition
                hover:text-[#C91F49]
              "
            >
              Read more
            </button>
          </div>
        </div>

        {/* =====================================================================
            RIGHT — PURCHASE / DELIVERY CARD
        ====================================================================== */}

        <aside
          className="
            rounded-[20px]
            border
            border-[#E9E5E6]
            bg-white
            p-4
            shadow-[0_12px_35px_rgba(20,24,48,0.06)]
            sm:p-5
            lg:sticky
            lg:top-5
          "
        >
          {/* STOCK */}

          <div
            className="
              flex
              items-center
              gap-2.5
              border-b
              border-[#ECE9EA]
              pb-4
            "
          >
            <span className="size-2.5 rounded-full bg-[#39A65A]" />

            <div>
              <p
                className="
                  font-[var(--font-poppins)]
                  text-[12px]
                  font-extrabold
                  text-[#3B8F50]
                  sm:text-[13px]
                "
              >
                {isOutOfStock ? "Out of stock" : "In stock"}
              </p>

              {!isOutOfStock ? (
                <p
                  className="
                    mt-0.5
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-medium
                    text-[#747783]
                    sm:text-[11px]
                  "
                >
                  Ready to ship
                </p>
              ) : null}
            </div>
          </div>

          {/* PURCHASE CONTROLS */}

          <ProductPurchaseOptions
            productId={product._id}
            price={product.price}
            stock={product.stock}
            disabled={isOutOfStock}
          />

          {/* SERVICE BENEFITS */}

          <div
            className="
              mt-5
              space-y-3
              border-t
              border-[#ECE9EA]
              pt-5
            "
          >
            <ServiceBenefit
              icon={<Truck />}
              title="Free Shipping"
              description="On eligible orders"
            />

            <ServiceBenefit
              icon={<Clock3 />}
              title="Easy Returns"
              description="Simple return process"
            />

            <ServiceBenefit
              icon={<ShieldCheck />}
              title="Secure Payments"
              description="Safe checkout"
            />
          </div>

          {/* DELIVERY */}

          <div
            className="
              mt-5
              border-t
              border-[#ECE9EA]
              pt-5
            "
          >
            <div className="flex items-start gap-2.5">
              <span
                className="
                  flex
                  size-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FFF0F4]
                  text-[#E72D5A]
                "
              >
                <Truck className="size-4" strokeWidth={1.8} />
              </span>

              <div>
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-[12px]
                    font-extrabold
                    text-[#171B35]
                    sm:text-[13px]
                  "
                >
                  Check delivery
                </p>

                <p
                  className="
                    mt-0.5
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-medium
                    leading-5
                    text-[#777985]
                    sm:text-[11px]
                  "
                >
                  Enter your pincode to check availability.
                </p>
              </div>
            </div>

            <div className="mt-3 flex overflow-hidden rounded-[10px] border border-[#E3E0E2]">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={deliveryPin}
                onChange={(event) => {
                  setDeliveryPin(event.target.value.replace(/\D/g, ""));
                  setDeliveryMessage("");
                }}
                placeholder="Enter pincode"
                aria-label="Delivery pincode"
                className="
                  min-w-0
                  flex-1
                  bg-white
                  px-3
                  py-3
                  font-[var(--font-poppins)]
                  text-[11px]
                  font-medium
                  text-[#20243D]
                  outline-none
                  placeholder:text-[#A1A2AA]
                "
              />

              <button
                type="button"
                onClick={checkDelivery}
                className="
                  bg-[#E72D5A]
                  px-4
                  font-[var(--font-poppins)]
                  text-[10px]
                  font-extrabold
                  text-white
                  transition
                  hover:bg-[#D92150]
                  sm:text-[11px]
                "
              >
                Check
              </button>
            </div>

            {deliveryMessage ? (
              <p
                className="
                  mt-2
                  font-[var(--font-poppins)]
                  text-[9px]
                  font-medium
                  leading-4
                  text-[#777985]
                "
              >
                {deliveryMessage}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ============================================================================
   FEATURE
============================================================================ */

function Feature({
  icon,
  title,
  subtitle,
  className,
  iconClass,
}: {
  icon: string;
  title: string;
  subtitle: string;
  className: string;
  iconClass: string;
}) {
  return (
    <div
      className={`
        flex
        min-w-0
        items-center
        gap-2.5
        rounded-[14px]
        px-3
        py-3
        ${className}
      `}
    >
      <span
        className={`
          flex
          size-8
          shrink-0
          items-center
          justify-center
          rounded-full
          text-[13px]
          font-black
          ${iconClass}
        `}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p
          className="
            truncate
            font-[var(--font-poppins)]
            text-[10px]
            font-extrabold
            text-[#22263E]
            sm:text-[11px]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            truncate
            font-[var(--font-poppins)]
            text-[8px]
            font-medium
            text-[#747783]
            sm:text-[9px]
          "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   SERVICE BENEFIT
============================================================================ */

function ServiceBenefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="
          flex
          size-8
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#F8F5FF]
          text-[#7044B8]
        "
      >
        {icon}
      </span>

      <div>
        <p
          className="
            font-[var(--font-poppins)]
            text-[11px]
            font-extrabold
            text-[#272B41]
            sm:text-[12px]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            font-[var(--font-poppins)]
            text-[9px]
            font-medium
            text-[#858692]
            sm:text-[10px]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

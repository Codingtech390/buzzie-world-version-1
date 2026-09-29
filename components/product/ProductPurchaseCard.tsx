"use client";

import { Tag } from "lucide-react";
import { useState } from "react";

import ProductPurchaseOptions from "@/components/product/ProductPurchaseOptions";

import type { StorefrontProduct } from "@/types/storefront";

interface ProductPurchaseCardProps {
  product: StorefrontProduct;
  isOutOfStock: boolean;
}

export default function ProductPurchaseCard({ product, isOutOfStock }: ProductPurchaseCardProps) {
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
    <aside
      className="
        w-full
        rounded-[24px]
        border
        border-[#E9E5E6]
        bg-white
        p-4
        shadow-[0_18px_45px_rgba(20,24,48,0.07)]
        sm:p-5
        lg:sticky
        lg:top-6
      "
    >
      {/* ================================================================
          STOCK
      ================================================================= */}

      <div
        className="
          flex
          items-center
          gap-2.5
          border-b
          border-[#ECE9EA]
          pb-5
        "
      >
        <span
          className={`size-2.5 rounded-full ${isOutOfStock ? "bg-[#D64545]" : "bg-[#39A65A]"}`}
        />

        <div>
          <p
            className="
              font-[var(--font-poppins)]
              text-[12px]
              font-extrabold
              text-[#3B8F50]
            "
          >
            {isOutOfStock ? "Out of stock" : "In stock"}
          </p>

          {!isOutOfStock ? (
            <p
              className="
                mt-0.5
                font-[var(--font-poppins)]
                text-[12px]
                font-medium
                text-[#747783]
              "
            >
              Ready to ship
            </p>
          ) : null}
        </div>
      </div>

      {/* ================================================================
          PURCHASE OPTIONS
      ================================================================= */}

      <div
        className="
          [&>div]:!gap-3
          [&_button]:!min-h-10
          [&_button]:!px-3
          [&_button]:!text-[12px]
          [&_input]:!h-10
          [&_input]:!text-[12px]
          [&_label]:!text-[12px]
          [&_p]:!text-[12px]
        "
      >
        {typeof product.price === "number" && typeof product.stock === "number" ? (
          <ProductPurchaseOptions
            productId={product._id}
            price={product.price}
            stock={product.stock}
            disabled={isOutOfStock}
          />
        ) : (
          <div className="mt-5 rounded-[18px] border border-[#EEE8F4] bg-[#FAF8FC] p-4">
            <p className="font-[var(--font-poppins)] text-[11px] font-extrabold text-[#171B35]">
              Purchase details coming soon
            </p>

            <p className="mt-1 font-[var(--font-poppins)] text-[10px] leading-5 text-[#777985]">
              Price and availability will be updated before this product becomes available to
              purchase.
            </p>
          </div>
        )}
      </div>

      {/* ================================================================
          DISCOUNT OFFERS
      ================================================================= */}

      <div
        className="
          mt-6
          border-t
          border-[#F0ECEE]
          pt-6
        "
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p
              className="
                font-[var(--font-poppins)]
                text-[12px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-[#171B35]
              "
            >
              Special Offers
            </p>

            <p
              className="
                mt-0.5
                font-[var(--font-poppins)]
                text-[10px]
                font-medium
                text-[#858692]
              "
            >
              Save more on your order
            </p>
          </div>

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
            <Tag className="size-4" strokeWidth={1.9} />
          </span>
        </div>

        <div className="space-y-3">
          {/* Offer 1 */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[16px]
              border
              border-[#EFDCE4]
              bg-[linear-gradient(135deg,#FFF9FB_0%,#FFF1F5_100%)]
              px-4
              py-3.5
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-[19px]
                    font-black
                    leading-none
                    tracking-[-0.03em]
                    text-[#171B35]
                  "
                >
                  15% OFF
                </p>

                <p
                  className="
                    mt-1.5
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-medium
                    text-[#777985]
                  "
                >
                  On orders above ₹999
                </p>
              </div>

              <div
                className="
                  shrink-0
                  rounded-[8px]
                  bg-[#E72D5A]
                  px-2.5
                  py-1.5
                  text-center
                  shadow-[0_5px_12px_rgba(231,45,90,0.14)]
                "
              >
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-white/80
                  "
                >
                  Code
                </p>

                <p
                  className="
                    mt-0.5
                    font-[var(--font-poppins)]
                    text-[11px]
                    font-black
                    leading-none
                    text-white
                  "
                >
                  FIRST15
                </p>
              </div>
            </div>
          </div>

          {/* Offer 2 */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[16px]
              border
              border-[#E6DDF1]
              bg-[linear-gradient(135deg,#FCFAFF_0%,#F5EEFF_100%)]
              px-4
              py-3.5
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-[19px]
                    font-black
                    leading-none
                    tracking-[-0.03em]
                    text-[#171B35]
                  "
                >
                  20% OFF
                </p>

                <p
                  className="
                    mt-1.5
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-medium
                    text-[#777985]
                  "
                >
                  On orders above ₹1299
                </p>
              </div>

              <div
                className="
                  shrink-0
                  rounded-[8px]
                  bg-[#A66BD5]
                  px-2.5
                  py-1.5
                  text-center
                  shadow-[0_5px_12px_rgba(166,107,213,0.14)]
                "
              >
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-white/80
                  "
                >
                  Code
                </p>

                <p
                  className="
                    mt-0.5
                    font-[var(--font-poppins)]
                    text-[11px]
                    font-black
                    leading-none
                    text-white
                  "
                >
                  FIRST20
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          DELIVERY CHECK
      ================================================================= */}

      <div
        className="
          mt-6
          border-t
          border-[#F0ECEE]
          pt-6
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
              bg-[#FFF2F5]
              text-[#E72D5A]
              shadow-[0_5px_14px_rgba(231,45,90,0.07)]
            "
          >
            <Tag className="size-4" strokeWidth={1.8} />
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

        <div
          className="
            mt-3
            flex
            overflow-hidden
            rounded-[10px]
            border
            border-[#E3E0E2]
          "
        >
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
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import StatusState from "@/components/layout/StatusState";
import CartItem from "./CartItem";

export default function CartClient() {
  const { cart, loading, error, updateItem, removeItem } = useCart();

  /* ================================================================
     LOADING
  ================================================================ */

if (loading) {
  return (
    <main className="min-h-screen bg-[#24104f]">
      <StatusState
        variant="loading"
        title="Preparing your cart"
        description="Just a moment while we get everything ready for you."
      />
    </main>
  );
}

  /* ================================================================
     ERROR
  ================================================================ */

  if (error) {
    return (
      <main className="min-h-screen bg-[#24104f] px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-[30px] bg-[#fff8e8] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <h1 className="text-2xl font-black text-[#17213d]">Unable to load cart</h1>

          <p className="mt-2 text-sm text-[#687489]">{error}</p>

          <Link
            href="/shop"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#4c6f2b]
              px-6
              py-3
              text-sm
              font-black
              text-white
              shadow-[0_8px_18px_rgba(76,111,43,0.25)]
              transition
              hover:-translate-y-0.5
            "
          >
            Continue Shopping
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  /* ================================================================
     EMPTY CART
  ================================================================ */

  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-[#24104f] px-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-[32px] bg-[#fff8e8] px-8 py-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="mx-auto flex size-20 items-center justify-center rounded-[24px] bg-[#f8e8ba]">
            <ShoppingBag className="size-9 text-[#55752e]" />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-[#17213d]">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#687489]">
            Discover something special for your little one.
          </p>

          <Link
            href="/shop"
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#4c6f2b]
              px-7
              py-3.5
              text-sm
              font-black
              text-white
              shadow-[0_10px_22px_rgba(76,111,43,0.22)]
              transition
              hover:-translate-y-0.5
            "
          >
            Continue Shopping
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#24104f] overflow-x-hidden">
      {/* ==============================================================
          DESKTOP / TABLET ARTWORK STAGE

          IMPORTANT:
          The artwork was designed around a 1252 × 848 composition.

          Keeping this exact aspect ratio means:
          - purple artwork never ends before the content
          - paper cannot flow outside the artwork
          - totals cannot flow into the footer
          - the whole composition scales proportionally
      ============================================================== */}

      <section className="hidden md:block w-full bg-[#24104f]">
        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1252px]
            aspect-[1252/848]
            overflow-hidden
            bg-[#24104f]
          "
        >
          {/* ==========================================================
              PURPLE BACKGROUND
          ========================================================== */}

          <img
            src="/images/cartpage/cart-page-purple-background.jpg"
            alt=""
            aria-hidden="true"
            className="
              absolute
              inset-0
              z-0
              h-full
              w-full
              object-fill
              pointer-events-none
              select-none
            "
          />

          {/* ==========================================================
              TOP BANNER

              The banner contains the page heading itself.
          ========================================================== */}

          <div
            className="
              absolute
              left-[5%]
              right-[5%]
              top-[2%]
              z-10
              flex
              justify-center
            "
          >
            <img
              src="/images/cartpage/cart-top-banner.png"
              alt="Your Cart Treasures - Review Your Items"
              className="
                block
                h-auto
                w-full
                max-w-[1120px]
                object-contain
                pointer-events-none
                select-none
              "
            />
          </div>

          {/* ==========================================================
              LEFT PAPER

              Everything belonging to the left side lives INSIDE the
              artwork stage.
          ========================================================== */}

          <section
            className="
              absolute
              left-[5.8%]
              top-[39.5%]
              z-10
              h-[56%]
              w-[43%]
              overflow-hidden
              bg-[url('/images/cartpage/cart-paper-background.png')]
              bg-[length:100%_100%]
              bg-center
              bg-no-repeat
            "
          >
            {/* --------------------------------------------------------
                CART ITEMS

                The paper artwork already contains:
                "Your Cart Items"

                Therefore there is intentionally no HTML heading here.
            -------------------------------------------------------- */}

            <div
              className="
                absolute
                left-[8.5%]
                right-[8%]
                top-[19%]
                space-y-[1.2%]
              "
            >
              {cart.items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdate={async (productId, quantity) => {
                    await updateItem(productId, quantity);
                  }}
                  onRemove={async (productId) => {
                    await removeItem(productId);
                  }}
                />
              ))}
            </div>
          </section>

          {/* ==========================================================
              RIGHT CART TOTALS

              This is also absolutely contained within the artwork.
          ========================================================== */}

          <aside
            className="
              absolute
              right-[5.7%]
              top-[41.5%]
              z-20
              w-[38.5%]
            "
          >
            <div
              className="
                w-full
                rounded-[2.3vw]
                border-[0.42vw]
                border-[#b6a347]
                bg-[#fff2c9]
                px-[6.8%]
                py-[5.8%]
                shadow-[0_1.2vw_2.5vw_rgba(19,8,57,0.35)]
              "
            >
              {/* ======================================================
                  TITLE
              ====================================================== */}

              <h2
                className="
                  text-center
                  font-black
                  tracking-[-0.035em]
                  text-[#11182f]
                  text-[clamp(1.05rem,2vw,1.75rem)]
                "
              >
                Kingdom Cart Totals
              </h2>

              {/* ======================================================
                  DIVIDER
              ====================================================== */}

              <div className="mt-[7%] border-t border-[#aa985c]" />

              {/* ======================================================
                  SUBTOTAL
              ====================================================== */}

              <div
                className="
                  mt-[6%]
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-[clamp(0.72rem,1.25vw,1rem)]
                  text-[#202337]
                "
              >
                <span>Subtotal:</span>

                <strong className="whitespace-nowrap font-black">
                  ₹{cart.subtotal.toFixed(2)}
                </strong>
              </div>

              {/* ======================================================
                  SHIPPING
              ====================================================== */}

              <div
                className="
                  mt-[5%]
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-[clamp(0.68rem,1.12vw,0.95rem)]
                  text-[#202337]
                "
              >
                <span className="whitespace-nowrap">Shipping (Standard):</span>

                <strong className="whitespace-nowrap text-right font-black">
                  Calculated at checkout
                </strong>
              </div>

              {/* ======================================================
                  DIVIDER
              ====================================================== */}

              <div className="mt-[7%] border-t border-[#aa985c]" />

              {/* ======================================================
                  GRAND TOTAL
              ====================================================== */}

              <div
                className="
                  mt-[6%]
                  flex
                  items-center
                  justify-between
                  gap-3
                  font-black
                  text-[#11182f]
                "
              >
                <span className="text-[clamp(1rem,1.9vw,1.45rem)]">Grand Total:</span>

                <strong className="whitespace-nowrap text-[clamp(1rem,2vw,1.55rem)]">
                  ₹{cart.subtotal.toFixed(2)}
                </strong>
              </div>

              {/* ======================================================
                  CHECKOUT BUTTON
              ====================================================== */}

              <Link
                href="/checkout"
                className="
                  mt-[8%]
                  flex
                  min-h-[54px]
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[1.4vw]
                  border-2
                  border-[#6c3519]
                  bg-[linear-gradient(180deg,#ad6530_0%,#873f1d_100%)]
                  px-4
                  text-center
                  text-[clamp(0.65rem,1.15vw,0.95rem)]
                  font-black
                  text-white
                  shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_0.7vw_1.4vw_rgba(71,31,12,0.28)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:brightness-105
                  active:translate-y-0
                "
              >
                <span className="whitespace-nowrap">Proceed to Kingdom Checkout</span>

                <ArrowRight className="size-4 shrink-0" />
              </Link>

              {/* ======================================================
                  CONTINUE SHOPPING
              ====================================================== */}

              <Link
                href="/shop"
                className="
                  mt-[4%]
                  block
                  text-center
                  text-[clamp(0.58rem,0.9vw,0.75rem)]
                  font-black
                  text-[#18203b]
                  transition-colors
                  hover:text-[#6a341d]
                "
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ==============================================================
          MOBILE RESPONSIVE VERSION

          Below md, the fixed artwork composition is intentionally
          replaced by a real responsive layout.

          This prevents:
          - tiny unreadable content
          - horizontal overflow
          - paper overflowing the background
          - totals overlapping the paper
          - oversized banner
      ============================================================== */}

      <section
        className="
          block
          min-h-screen
          bg-[url('/images/cartpage/cart-page-purple-background.jpg')]
          bg-cover
          bg-center
          bg-fixed
          px-4
          py-5
          md:hidden
        "
      >
        {/* ============================================================
            MOBILE BANNER
        ============================================================ */}

        <div className="mx-auto w-full max-w-[620px]">
          <img
            src="/images/cartpage/cart-top-banner.png"
            alt="Your Cart Treasures - Review Your Items"
            className="
              block
              h-auto
              w-full
              object-contain
            "
          />
        </div>

        {/* ============================================================
            MOBILE PAPER
        ============================================================ */}

        <section
          className="
            relative
            mx-auto
            mt-5
            min-h-[560px]
            w-full
            max-w-[620px]
            overflow-hidden
            bg-[url('/images/cartpage/cart-paper-background.png')]
            bg-[length:100%_100%]
            bg-center
            bg-no-repeat
          "
        >
          <div
            className="
              absolute
              left-[8%]
              right-[8%]
              top-[19%]
              space-y-4
            "
          >
            {cart.items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdate={async (productId, quantity) => {
                  await updateItem(productId, quantity);
                }}
                onRemove={async (productId) => {
                  await removeItem(productId);
                }}
              />
            ))}
          </div>
        </section>

        {/* ============================================================
            MOBILE TOTALS
        ============================================================ */}

        <aside className="mx-auto mt-6 w-full max-w-[620px]">
          <div
            className="
              rounded-[28px]
              border-[5px]
              border-[#b6a347]
              bg-[#fff2c9]
              p-6
              shadow-[0_16px_35px_rgba(19,8,57,0.38)]
              sm:p-7
            "
          >
            <h2 className="text-center text-2xl font-black text-[#11182f] sm:text-3xl">
              Kingdom Cart Totals
            </h2>

            <div className="my-5 border-t border-[#aa985c]" />

            <div className="flex items-center justify-between gap-4 text-base text-[#202337] sm:text-lg">
              <span>Subtotal:</span>

              <strong>₹{cart.subtotal.toFixed(2)}</strong>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-[#202337] sm:text-base">
              <span>Shipping (Standard):</span>

              <strong className="text-right">Calculated at checkout</strong>
            </div>

            <div className="my-5 border-t border-[#aa985c]" />

            <div className="flex items-center justify-between gap-4 text-xl font-black text-[#11182f] sm:text-2xl">
              <span>Grand Total:</span>

              <strong>₹{cart.subtotal.toFixed(2)}</strong>
            </div>

            <Link
              href="/checkout"
              className="
                mt-6
                flex
                min-h-[64px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-[20px]
                border-2
                border-[#6c3519]
                bg-[linear-gradient(180deg,#ad6530,#873f1d)]
                px-5
                text-center
                text-sm
                font-black
                text-white
                shadow-[0_8px_18px_rgba(71,31,12,0.3)]
                transition
                hover:-translate-y-0.5
              "
            >
              Proceed to Kingdom Checkout
              <ArrowRight className="size-5 shrink-0" />
            </Link>

            <Link
              href="/shop"
              className="
                mt-4
                block
                text-center
                text-sm
                font-black
                text-[#18203b]
              "
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

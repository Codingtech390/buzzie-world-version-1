"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Package, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";

/* ============================================================================
   BUZZIEWORLD — CART CLIENT

   Presentation:
   - Premium children's ecommerce
   - Warm off-white canvas
   - Purple / lavender brand surfaces
   - Navy typography
   - Pink primary accent
   - Soft borders and restrained shadows
   - Responsive-first
   - Cart behaviour remains unchanged
   ============================================================================ */

const pageEase = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: pageEase,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: pageEase,
    },
  },
};

function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`min-h-[calc(100svh-5rem)] overflow-x-hidden bg-[#FFFDF9] ${className}`}>
      {children}
    </main>
  );
}

/* ============================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function CartClient() {
  const { cart, loading, error, updateItem, removeItem } = useCart();

  /* ==========================================================================
     LOADING
     ========================================================================== */

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: pageEase }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, -2, 2, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                flex size-[68px] items-center justify-center rounded-[22px]
                bg-[#F4E9FF] text-[#C391EE]
                shadow-[0_14px_35px_rgba(195,145,238,0.16)]
              "
            >
              <ShoppingBag className="size-7" strokeWidth={1.8} />
            </motion.div>

            <h1
              className="
                mt-6 font-[var(--font-roboto)] text-2xl font-black
                tracking-[-0.04em] text-[#27344A] sm:text-3xl
              "
            >
              Preparing your cart
            </h1>

            <p
              className="
                mt-2 font-[var(--font-poppins)] text-sm leading-6
                text-[#687489]
              "
            >
              Just a moment while we get everything ready for you.
            </p>

            <div
              aria-hidden="true"
              className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-[#EEE7F5]"
            >
              <motion.div
                className="h-full rounded-full bg-[#C391EE]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </div>
      </PageShell>
    );
  }

  /* ==========================================================================
     ERROR
     ========================================================================== */

  if (error) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: pageEase }}
            className="
              w-full max-w-[480px] overflow-hidden rounded-[30px]
              border border-[#E8DDF2] bg-white text-center
              shadow-[0_24px_70px_rgba(39,52,74,0.08)]
            "
          >
            <div className="bg-[#FBF7FF] px-6 pb-7 pt-8 sm:px-10 sm:pt-10">
              <div
                className="
                  mx-auto flex size-[68px] items-center justify-center
                  rounded-[22px] bg-[#FFF0F2] text-[#E83D59]
                "
              >
                <ShoppingBag className="size-7" strokeWidth={1.8} />
              </div>

              <p
                className="
                  mt-5 font-[var(--font-poppins)] text-[10px] font-black
                  uppercase tracking-[0.18em] text-[#C391EE]
                "
              >
                Something went wrong
              </p>

              <h1
                className="
                  mt-2 font-[var(--font-roboto)] text-2xl font-black
                  tracking-[-0.04em] text-[#27344A] sm:text-3xl
                "
              >
                Unable to load your cart
              </h1>

              <p
                className="
                  mx-auto mt-3 max-w-md font-[var(--font-poppins)]
                  text-sm leading-6 text-[#687489]
                "
              >
                {error}
              </p>
            </div>

            <div className="px-6 py-6 sm:px-10">
              <Link
                href="/shop"
                className="
                  group inline-flex min-h-11 items-center justify-center gap-2
                  rounded-full bg-[#C391EE] px-6 py-3
                  font-[var(--font-poppins)] text-sm font-bold text-white
                  shadow-[0_10px_24px_rgba(195,145,238,0.24)]
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:bg-[#E83D59]
                  focus-visible:outline-none focus-visible:ring-4
                  focus-visible:ring-[#C391EE]/25
                "
              >
                Continue Shopping
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.2}
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </PageShell>
    );
  }

  /* ==========================================================================
     EMPTY CART
     ========================================================================== */

  if (!cart || cart.items.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="
              relative w-full max-w-[560px] overflow-hidden rounded-[32px]
              border border-[#E8DDF2] bg-white text-center
              shadow-[0_24px_75px_rgba(39,52,74,0.075)]
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute -right-24 -top-24 size-64
                rounded-full bg-[#C391EE]/10 blur-3xl
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute -bottom-28 -left-24 size-64
                rounded-full bg-[#E83D59]/[0.055] blur-3xl
              "
            />

            <div className="relative px-6 pb-10 pt-10 sm:px-12 sm:pb-12 sm:pt-12">
              <motion.div
                variants={itemVariants}
                className="
                  mx-auto flex size-[82px] items-center justify-center
                  rounded-[26px] bg-[#F4E9FF] text-[#C391EE]
                  shadow-[0_14px_32px_rgba(195,145,238,0.15)]
                "
              >
                <ShoppingBag className="size-9" strokeWidth={1.65} />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Sparkles className="size-3.5 text-[#E83D59]" />
                  <p
                    className="
                      font-[var(--font-poppins)] text-[10px] font-black
                      uppercase tracking-[0.18em] text-[#8B62B4]
                    "
                  >
                    Your little cart
                  </p>
                  <Sparkles className="size-3.5 text-[#C391EE]" />
                </div>

                <h1
                  className="
                    mt-3 font-[var(--font-roboto)] text-[2.1rem] font-black
                    leading-[1.02] tracking-[-0.05em] text-[#27344A]
                    sm:text-[2.65rem]
                  "
                >
                  Your cart is empty
                </h1>

                <p
                  className="
                    mx-auto mt-4 max-w-[430px] font-[var(--font-poppins)]
                    text-sm leading-7 text-[#687489]
                  "
                >
                  Looks like you haven't added anything yet. Let's find something fun for your next
                  adventure.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="relative mt-8">
                <Link
                  href="/shop"
                  className="
                    group inline-flex min-h-12 items-center justify-center gap-2
                    rounded-full bg-[#C391EE] px-7 py-3
                    font-[var(--font-poppins)] text-sm font-bold text-white
                    shadow-[0_12px_28px_rgba(195,145,238,0.25)]
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:bg-[#E83D59]
                    focus-visible:outline-none focus-visible:ring-4
                    focus-visible:ring-[#C391EE]/25
                  "
                >
                  Explore Products
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.2}
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </PageShell>
    );
  }

  /* ==========================================================================
     CART
     ========================================================================== */

  return (
    <PageShell>
      {/* ======================================================================
          PAGE HEADER
      ====================================================================== */}

      <section className="relative overflow-hidden border-b border-[#EEE8F4] bg-white">
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -right-32 -top-40 size-[420px]
            rounded-full bg-[#C391EE]/[0.07] blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -bottom-44 left-[-12rem] size-[360px]
            rounded-full bg-[#E83D59]/[0.035] blur-3xl
          "
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-9 sm:px-6 sm:pb-10 sm:pt-11 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className="h-1.5 w-7 rounded-full bg-[#E83D59]" />
                <p
                  className="
                    font-[var(--font-poppins)] text-[10px] font-black
                    uppercase tracking-[0.18em] text-[#8B62B4]
                  "
                >
                  Your BuzzieWorld cart
                </p>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="
                  mt-3 font-[var(--font-roboto)] text-[2.35rem] font-black
                  leading-[0.98] tracking-[-0.055em] text-[#27344A]
                  sm:text-[3rem] lg:text-[3.45rem]
                "
              >
                Your little treasures.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="
                  mt-3 max-w-[620px] font-[var(--font-poppins)] text-sm
                  leading-6 text-[#687489] sm:text-[15px] sm:leading-7
                "
              >
                Everything you've picked for your next BuzzieWorld adventure, all in one place.
              </motion.p>
            </div>

            <motion.div
              variants={itemVariants}
              className="
                flex w-fit items-center gap-2 rounded-full
                border border-[#E7D9F1] bg-[#FBF7FF] px-4 py-2.5
                font-[var(--font-poppins)] text-xs font-bold text-[#6F4B91]
                shadow-[0_6px_18px_rgba(39,52,74,0.035)]
              "
            >
              <ShoppingBag className="size-3.5" strokeWidth={2} />
              <span>
                {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================================
          MAIN CART AREA
      ====================================================================== */}

      <section className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-12">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px] xl:gap-8">
          {/* ====================================================================
              CART ITEMS
          ==================================================================== */}

          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            aria-label="Cart items"
            className="
              min-w-0 overflow-hidden rounded-[26px]
              border border-[#EAE4EF] bg-white
              shadow-[0_16px_50px_rgba(39,52,74,0.055)]
            "
          >
            <div
              className="
                flex items-center justify-between gap-4
                border-b border-[#EEE9F2] px-5 py-5
                sm:px-7 sm:py-6
              "
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#C391EE]" />
                  <h2
                    className="
                      font-[var(--font-roboto)] text-xl font-black
                      tracking-[-0.035em] text-[#27344A] sm:text-2xl
                    "
                  >
                    Cart items
                  </h2>
                </div>

                <p
                  className="
                    mt-1 font-[var(--font-poppins)] text-xs leading-5
                    text-[#7A8495] sm:text-sm
                  "
                >
                  Review your picks before checkout.
                </p>
              </div>

              <div
                className="
                  hidden size-10 shrink-0 items-center justify-center
                  rounded-[14px] bg-[#F7F0FC] text-[#C391EE] sm:flex
                "
              >
                <ShoppingBag className="size-[18px]" strokeWidth={1.8} />
              </div>
            </div>

            <div className="divide-y divide-[#F0ECF3] px-4 sm:px-6">
              <AnimatePresence initial={false}>
                {cart.items.map((item) => (
                  <motion.div
                    key={item.productId}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: pageEase }}
                    className="py-4 sm:py-5"
                  >
                    <CartItem
                      item={item}
                      onUpdate={async (productId, quantity) => {
                        await updateItem(productId, quantity);
                      }}
                      onRemove={async (productId) => {
                        await removeItem(productId);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Continue shopping */}

            <div className="border-t border-[#EEE9F2] px-5 py-5 sm:px-7">
              <Link
                href="/shop"
                className="
                  group inline-flex items-center gap-2 rounded-full
                  px-1 py-1 font-[var(--font-poppins)] text-sm font-bold
                  text-[#687489] transition-colors duration-200
                  hover:text-[#8B62B4]
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[#C391EE] focus-visible:ring-offset-2
                "
              >
                <ArrowLeft
                  className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
                  strokeWidth={2.1}
                />
                Continue Shopping
              </Link>
            </div>
          </motion.section>

          {/* ====================================================================
              ORDER SUMMARY
          ==================================================================== */}

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.08,
              ease: pageEase,
            }}
            className="lg:sticky lg:top-24"
          >
            <div
              className="
                overflow-hidden rounded-[26px]
                border border-[#E4D6EF] bg-[#FBF7FF]
                shadow-[0_18px_52px_rgba(39,52,74,0.065)]
              "
            >
              {/* Summary header */}

              <div className="border-b border-[#E9DDF1] px-5 py-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex size-11 shrink-0 items-center justify-center
                        rounded-[15px] bg-white text-[#C391EE]
                        shadow-[0_7px_20px_rgba(195,145,238,0.10)]
                      "
                    >
                      <Package className="size-5" strokeWidth={1.8} />
                    </div>

                    <div>
                      <h2
                        className="
                          font-[var(--font-roboto)] text-xl font-black
                          tracking-[-0.035em] text-[#27344A]
                        "
                      >
                        Order summary
                      </h2>

                      <p
                        className="
                          mt-0.5 font-[var(--font-poppins)] text-[11px]
                          font-medium text-[#7A8495]
                        "
                      >
                        Almost ready for checkout
                      </p>
                    </div>
                  </div>

                  <span
                    className="
                      hidden rounded-full bg-white px-2.5 py-1
                      font-[var(--font-poppins)] text-[9px] font-black
                      uppercase tracking-[0.12em] text-[#8B62B4]
                      sm:inline-flex
                    "
                  >
                    {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              {/* Summary content */}

              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-5">
                    <span
                      className="
                        font-[var(--font-poppins)] text-sm font-medium
                        text-[#687489]
                      "
                    >
                      Subtotal
                    </span>

                    <strong
                      className="
                        whitespace-nowrap font-[var(--font-poppins)]
                        text-sm font-bold text-[#27344A]
                      "
                    >
                      ₹{cart.subtotal.toFixed(2)}
                    </strong>
                  </div>

                  <div className="flex items-start justify-between gap-5">
                    <span
                      className="
                        font-[var(--font-poppins)] text-sm font-medium
                        text-[#687489]
                      "
                    >
                      Shipping
                    </span>

                    <span
                      className="
                        max-w-[150px] text-right font-[var(--font-poppins)]
                        text-xs font-semibold leading-5 text-[#7A8495]
                      "
                    >
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="my-5 h-px bg-[#E7DCEB]" />

                {/* Total */}

                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p
                      className="
                        font-[var(--font-poppins)] text-[10px] font-black
                        uppercase tracking-[0.14em] text-[#8B62B4]
                      "
                    >
                      Total
                    </p>

                    <p
                      className="
                        mt-1 font-[var(--font-poppins)] text-[11px]
                        text-[#8A93A2]
                      "
                    >
                      Before shipping
                    </p>
                  </div>

                  <strong
                    className="
                      whitespace-nowrap font-[var(--font-roboto)]
                      text-[1.9rem] font-black tracking-[-0.045em]
                      text-[#27344A]
                    "
                  >
                    ₹{cart.subtotal.toFixed(2)}
                  </strong>
                </div>

                {/* Checkout */}

                <Link
                  href="/checkout"
                  className="
                    group mt-6 flex min-h-[54px] w-full items-center
                    justify-center gap-2 rounded-[16px] bg-[#C391EE]
                    px-5 py-3.5 font-[var(--font-poppins)] text-sm
                    font-bold text-white
                    shadow-[0_12px_26px_rgba(195,145,238,0.25)]
                    transition-all duration-300
                    hover:-translate-y-0.5 hover:bg-[#E83D59]
                    hover:shadow-[0_16px_34px_rgba(232,61,89,0.20)]
                    focus-visible:outline-none focus-visible:ring-4
                    focus-visible:ring-[#C391EE]/25
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#FBF7FF]
                  "
                >
                  Proceed to Checkout
                  <ArrowRight
                    className="size-[18px] transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.2}
                  />
                </Link>

                {/* Trust message */}

                <div
                  className="
                    mt-4 flex items-start gap-2.5 rounded-[14px]
                    border border-white/80 bg-white/70 px-3.5 py-3
                  "
                >
                  <div
                    className="
                      mt-0.5 flex size-5 shrink-0 items-center justify-center
                      rounded-full bg-[#F0F9ED] text-[#65A358]
                    "
                  >
                    <Check className="size-3" strokeWidth={2.8} />
                  </div>

                  <p
                    className="
                      font-[var(--font-poppins)] text-[10.5px] font-medium
                      leading-5 text-[#7A8495]
                    "
                  >
                    Your cart is safely saved while you continue shopping.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </PageShell>
  );
}


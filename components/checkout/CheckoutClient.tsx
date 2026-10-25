"use client";

import {
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import type { ShippingAddress } from "@/types/order";

type CashfreeEnvironment = "sandbox" | "production";

interface CashfreeCheckoutResult {
  error?: {
    message?: string;
  };
}

interface CashfreeInstance {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget: "_modal";
  }) => Promise<CashfreeCheckoutResult | void>;
}

interface PendingCashfreePayment {
  orderId: string;
  orderNumber: string;
  cashfreeOrderId: string;
  paymentSessionId: string;
  environment: CashfreeEnvironment;
}

interface DeliveryQuote {
  amount: number;
  courierName: string;
  courierId: number;
  estimatedDeliveryDays: string | null;
  estimatedDeliveryDate: string | null;
  pickupPincode: string;
  deliveryPincode: string;
}

interface CheckoutPricing {
  subtotal: number;
  discount: number;
  discountLabel: string | null;
  shipping: number | null;
  totalBeforeShipping: number;
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: CashfreeEnvironment }) => CashfreeInstance;
  }
}

const initialAddress: ShippingAddress = {
  fullName: "",

  email: "",

  phone: "",

  addressLine1: "",

  addressLine2: "",

  city: "",

  state: "",

  postalCode: "",

  country: "India",
};


export default function CheckoutClient() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [pendingCashfreePayment, setPendingCashfreePayment] = useState<PendingCashfreePayment | null>(
  null,
);
  const [pricing, setPricing] = useState<CheckoutPricing | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  function updateField(field: keyof ShippingAddress, value: string) {
    setAddress((current) => ({
      ...current,

      [field]: value,
    }));

    if (field === "postalCode") {
      setDeliveryQuote(null);

      setQuoteError(null);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadPricing() {
      setPricingLoading(true);

      try {
        const response = await fetch("/api/checkout/pricing", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to calculate checkout pricing.");
        }

        if (!cancelled) {
          setPricing(data.pricing as CheckoutPricing);
        }
      } catch (pricingError) {
        if (!cancelled) {
          setPricing(null);

          setError(
            pricingError instanceof Error
              ? pricingError.message
              : "Unable to calculate checkout pricing.",
          );
        }
      } finally {
        if (!cancelled) {
          setPricingLoading(false);
        }
      }
    }

    if (!cartLoading && cart && cart.items.length > 0) {
      void loadPricing();
    }

    return () => {
      cancelled = true;
    };
  }, [cartLoading, cart?.subtotal, cart?.items.length]);

  async function checkDelivery() {
    const pincode = address.postalCode.trim();

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setQuoteError("Enter a valid 6-digit delivery pincode.");

      setDeliveryQuote(null);

      return;
    }

    setQuoteLoading(true);

    setQuoteError(null);

    setDeliveryQuote(null);

    try {
      const response = await fetch("/api/checkout/shipping", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        cache: "no-store",

        body: JSON.stringify({
          deliveryPincode: pincode,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.quote) {
        throw new Error(result.message || "Unable to check delivery.");
      }

      // Ignore a response if the customer changed the pincode*

      // while the quote request was running.*

      if (address.postalCode.trim() !== pincode) {
        return;
      }

      setDeliveryQuote(result.quote as DeliveryQuote);
    } catch (error) {
      setQuoteError(
        error instanceof Error ? error.message : "Unable to check delivery. Please try again.",
      );
    } finally {
      setQuoteLoading(false);
    }
  }


  async function verifyCashfreePayment(pending: PendingCashfreePayment) {
    const verifyResponse = await fetch("/api/orders/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        orderId: pending.orderId,
        cashfreeOrderId: pending.cashfreeOrderId,
      }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyData.success || verifyData.order?.paymentStatus !== "paid") {
      throw new Error(
        verifyData.message || "Payment has not yet been confirmed. Please retry verification.",
      );
    }

    // Clear the cart only after the server confirms payment.
    const cartResponse = await fetch("/api/cart", {
      method: "DELETE",
      cache: "no-store",
    });

    if (!cartResponse.ok) {
      console.error("Payment was confirmed, but clearing the cart failed.", {
        orderNumber: pending.orderNumber,
      });
    }

    setPendingCashfreePayment(null);

    router.push(
      `/order/success?order=${encodeURIComponent(
        verifyData.order.orderNumber || pending.orderNumber,
      )}`,
    );
  }

  async function resumeCashfreePayment() {
    if (!pendingCashfreePayment || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First check whether the payment already succeeded.
      // This avoids opening checkout again unnecessarily.
      try {
        await verifyCashfreePayment(pendingCashfreePayment);
        return;
      } catch {
        // If it isn't confirmed yet, reopen the same Cashfree session.
        // Do not create another order here.
      }

      if (!window.Cashfree) {
        throw new Error("Cashfree Checkout is still loading. Please try again shortly.");
      }

      const cashfree = window.Cashfree({
        mode: pendingCashfreePayment.environment,
      });

      await cashfree.checkout({
        paymentSessionId: pendingCashfreePayment.paymentSessionId,
        redirectTarget: "_modal",
      });

      // A checkout result is not proof of payment.
      // Ask the server to check Cashfree again.
      await verifyCashfreePayment(pendingCashfreePayment);
    } catch (retryError) {
      setError(
        retryError instanceof Error
          ? retryError.message
          : "Payment is not confirmed yet. Please retry.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);

    // If an order was already created, resume that payment instead
    // of creating another order.
    if (pendingCashfreePayment) {
      await resumeCashfreePayment();
      return;
    }

    if (!pricing || !deliveryQuote || deliveryQuote.deliveryPincode !== address.postalCode.trim()) {
      setError("Please check delivery for your current pincode before paying.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          shippingAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create order.");
      }

      const environment = data.cashfree?.environment;

      if (
        typeof data.order?.id !== "string" ||
        typeof data.order?.orderNumber !== "string" ||
        typeof data.cashfree?.orderId !== "string" ||
        typeof data.cashfree?.paymentSessionId !== "string" ||
        !data.cashfree.paymentSessionId ||
        (environment !== "sandbox" && environment !== "production")
      ) {
        throw new Error(
          "The order was created, but Cashfree checkout details are incomplete. Please contact support before creating another order.",
        );
      }

      const pending: PendingCashfreePayment = {
        orderId: data.order.id,
        orderNumber: data.order.orderNumber,
        cashfreeOrderId: data.cashfree.orderId,
        paymentSessionId: data.cashfree.paymentSessionId,
        environment,
      };

      // Save the identifiers immediately. If checkout or verification
      // fails, the customer can resume this same payment session.
      setPendingCashfreePayment(pending);

      if (!window.Cashfree) {
        throw new Error(
          "Cashfree Checkout has not loaded yet. Your order is retained; use the retry option to continue without creating another order.",
        );
      }

      const cashfree = window.Cashfree({
        mode: environment,
      });

      await cashfree.checkout({
        paymentSessionId: pending.paymentSessionId,
        redirectTarget: "_modal",
      });

      // The modal closing does not prove that payment succeeded.
      await verifyCashfreePayment(pending);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to complete checkout. Your payment may still be pending.",
      );
    } finally {
      setLoading(false);
    }
  }


  if (cartLoading) {
    return (
      <main className="min-h-[calc(100svh-5rem)] bg-[#FFFDF9]">
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div
              className="

                flex size-[68px] items-center justify-center rounded-[22px]

                bg-[#F4E9FF] text-[#C391EE]

                shadow-[0_14px_35px_rgba(195,145,238,0.16)]

              "
            >
              <ShoppingBag className="size-7" strokeWidth={1.8} />
            </div>

            <h1
              className="

                mt-6 font-[var(--font-roboto)] text-2xl font-black

                tracking-[-0.04em] text-[#27344A] sm:text-3xl

              "
            >
              Preparing checkout
            </h1>

            <p
              className="

                mt-2 font-[var(--font-poppins)] text-sm leading-6

                text-[#687489]

              "
            >
              Getting everything ready for you.
            </p>

            <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-[#EEE7F5]">
              <div className="h-full w-1/2 rounded-full bg-[#C391EE]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-[calc(100svh-5rem)] bg-[#FFFDF9]">
        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-3xl items-center justify-center px-4 py-12 sm:px-6">
          <div
            className="

              w-full overflow-hidden rounded-[30px]

              border border-[#E8DDF2] bg-white text-center

              shadow-[0_24px_70px_rgba(39,52,74,0.075)]

            "
          >
            <div className="bg-[#FBF7FF] px-6 pb-8 pt-10 sm:px-10 sm:pt-12">
              <div
                className="

                  mx-auto flex size-[76px] items-center justify-center

                  rounded-[24px] bg-[#F4E9FF] text-[#C391EE]

                "
              >
                <ShoppingBag className="size-8" strokeWidth={1.7} />
              </div>

              <p
                className="

                  mt-6 font-[var(--font-poppins)] text-[10px] font-black

                  uppercase tracking-[0.18em] text-[#8B62B4]

                "
              >
                Your little cart
              </p>

              <h1
                className="

                  mt-2 font-[var(--font-roboto)] text-[2rem] font-black

                  tracking-[-0.045em] text-[#27344A] sm:text-[2.5rem]

                "
              >
                Your cart is empty
              </h1>

              <p
                className="

                  mx-auto mt-3 max-w-md font-[var(--font-poppins)]

                  text-sm leading-7 text-[#687489]

                "
              >
                Add something fun to your cart and come back when you're ready to check out.
              </p>
            </div>

            <div className="px-6 py-6 sm:px-10">
              <button
                type="button"
                onClick={() => router.push("/shop")}
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
                Continue Shopping
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.2}
                />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />

      <main className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#FFFDF9]">
        {/* ====================================================================*

*            BACKGROUND ARTWORK*

*            ==================================================================== */}

        <div
          aria-hidden="true"
          className="

            pointer-events-none absolute inset-0 overflow-hidden

          "
        >
          <div
            className="

              absolute inset-0 bg-cover bg-center bg-no-repeat

              opacity-[0.16]

            "
            style={{
              backgroundImage: "url('/images/backgrounds/perfect-background.png')",

              backgroundPosition: "center top",
            }}
          />

          <div className="absolute inset-0 bg-[#FFFDF9]/70" />

          <div
            className="

              absolute -right-48 -top-48 size-[600px] rounded-full

              bg-[#C391EE]/[0.09] blur-3xl

            "
          />

          <div
            className="

              absolute -bottom-56 -left-48 size-[620px] rounded-full

              bg-[#E83D59]/[0.035] blur-3xl

            "
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {/* ==================================================================*

*              HEADER*

*              ================================================================== */}

          <header className="mb-7 sm:mb-9">
            <h1
              className="

                mt-3 font-playpen text-[2.35rem] font-black

                leading-[0.98] tracking-[-0.055em] text-[#27344A]

                sm:text-[3rem] lg:text-[3rem]

              "
            >
              Almost yours.
            </h1>

            <p
              className="

                mt-3 max-w-[600px] font-[var(--font-poppins)] text-sm

                leading-6 text-[#687489] sm:text-[15px] sm:leading-7

              "
            >
              Add your delivery details, review your order, and you're ready for your next
              BuzzieWorld adventure.
            </p>
          </header>

          {/* ==================================================================*

*              CHECKOUT*

*              ================================================================== */}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] xl:gap-8"
          >
            {/* ==================================================================*

*                DELIVERY INFORMATION*

*                ================================================================== */}

            <section
              className="

                overflow-hidden rounded-[28px] border border-[#E8DDF2]

                bg-white/95 shadow-[0_22px_65px_rgba(39,52,74,0.065)]

                backdrop-blur-sm

              "
            >
              <div
                className="

                  border-b border-[#EEE8F3] bg-[#FBF7FF]/75

                  px-5 py-5 sm:px-7 sm:py-6

                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="

                      flex size-11 shrink-0 items-center justify-center

                      rounded-[15px] bg-white text-[#C391EE]

                      shadow-[0_7px_20px_rgba(195,145,238,0.10)]

                    "
                  >
                    <MapPin className="size-5" strokeWidth={1.8} />
                  </div>

                  <div>
                    <h2
                      className="

                        font-playpen text-xl font-black

                        tracking-[-0.035em] text-[#27344A] sm:text-2xl

                      "
                    >
                      Delivery Information
                    </h2>

                    <p
                      className="

                        mt-0.5 font-[var(--font-poppins)] text-[11px]

                        leading-5 text-[#7A8495] sm:text-xs

                      "
                    >
                      Where should we send your order?
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 py-6 sm:px-7 sm:py-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Full Name"
                    value={address.fullName}
                    onChange={(value) => updateField("fullName", value)}
                    required
                  />

                  <Field
                    label="Email"
                    type="email"
                    value={address.email}
                    onChange={(value) => updateField("email", value)}
                    required
                  />

                  <Field
                    label="Phone"
                    type="tel"
                    value={address.phone}
                    onChange={(value) => updateField("phone", value)}
                    required
                  />

                  <Field
                    label="Postal Code"
                    inputMode="numeric"
                    value={address.postalCode}
                    onChange={(value) => updateField("postalCode", value)}
                    required
                  />

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => void checkDelivery()}
                      disabled={quoteLoading || !/^[1-9][0-9]{5}$/.test(address.postalCode.trim())}
                      className="rounded-xl bg-[#C391EE] px-5 py-3 font-semibold text-white transition hover:bg-[#E83D59] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {quoteLoading ? "Checking delivery..." : "Check Delivery"}
                    </button>

                    {quoteError && (
                      <p className="mt-2 text-sm text-red-600" role="alert">
                        {quoteError}
                      </p>
                    )}

                    {deliveryQuote && (
                      <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                        <p className="font-semibold">Delivery available</p>

                        <p className="mt-1">Courier: {deliveryQuote.courierName}</p>

                        <p>Delivery charge: ₹{deliveryQuote.amount.toFixed(2)}</p>

                        {deliveryQuote.estimatedDeliveryDays && (
                          <p>Estimated delivery: {deliveryQuote.estimatedDeliveryDays} days</p>
                        )}

                        {!deliveryQuote.estimatedDeliveryDays &&
                          deliveryQuote.estimatedDeliveryDate && (
                            <p>Estimated delivery: {deliveryQuote.estimatedDeliveryDate}</p>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Address"
                      value={address.addressLine1}
                      onChange={(value) => updateField("addressLine1", value)}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Apartment, Suite, etc. (optional)"
                      value={address.addressLine2 || ""}
                      onChange={(value) => updateField("addressLine2", value)}
                    />
                  </div>

                  <Field
                    label="City"
                    value={address.city}
                    onChange={(value) => updateField("city", value)}
                    required
                  />

                  <Field
                    label="State"
                    value={address.state}
                    onChange={(value) => updateField("state", value)}
                    required
                  />

                  <div className="sm:col-span-2 lg:col-span-1">
                    <Field
                      label="Country"
                      value={address.country}
                      onChange={(value) => updateField("country", value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="
      mt-6 flex items-start gap-3 rounded-[16px]
      border border-[#F3CDD3] bg-[#FFF3F5] px-4 py-3.5
      font-[var(--font-poppins)] text-sm leading-6 text-[#C33E4E]
    "
                  >
                    <span className="mt-1 size-2 shrink-0 rounded-full bg-[#E83D59]" />

                    <div className="min-w-0 flex-1">
                      <p>{error}</p>

                      {pendingCashfreePayment && (
                        <button
                          type="button"
                          onClick={() => void resumeCashfreePayment()}
                          disabled={loading}
                          className="
            mt-3 inline-flex min-h-10 items-center justify-center
            rounded-full bg-[#C391EE] px-4 py-2
            text-xs font-bold text-white transition
            hover:bg-[#E83D59]
            disabled:cursor-not-allowed disabled:opacity-50
          "
                        >
                          {loading ? "Checking payment..." : "Retry / Resume Payment"}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-7 border-t border-[#EEE9F2] pt-6">
                  <button
                    type="submit"
                    disabled={
                      loading ||
                      pricingLoading ||
                      quoteLoading ||
                      !pricing ||
                      !deliveryQuote ||
                      deliveryQuote.deliveryPincode !== address.postalCode.trim()
                    }
                    className="

                      group flex min-h-[56px] w-full items-center

                      justify-center gap-2.5 rounded-[17px] bg-[#C391EE]

                      px-5 py-3.5 font-[var(--font-poppins)] text-sm

                      font-bold text-white

                      shadow-[0_13px_30px_rgba(195,145,238,0.25)]

                      transition-all duration-300

                      hover:-translate-y-0.5 hover:bg-[#E83D59]

                      hover:shadow-[0_17px_35px_rgba(232,61,89,0.20)]

                      disabled:cursor-not-allowed disabled:translate-y-0

                      disabled:opacity-55

                      focus-visible:outline-none focus-visible:ring-4

                      focus-visible:ring-[#C391EE]/25

                    "
                  >
                    <CreditCard className="size-[18px]" strokeWidth={2} />

                    <span>
                      {loading
                        ? "Starting Payment..."
                        : !deliveryQuote
                          ? "Check Delivery to Continue"
                          : `Pay ₹${(
                              (pricing?.totalBeforeShipping ?? 0) + deliveryQuote.amount
                            ).toFixed(2)}`}
                    </span>

                    {!loading && (
                      <ArrowRight
                        className="

                          size-[17px] transition-transform duration-300

                          group-hover:translate-x-1

                        "
                        strokeWidth={2.2}
                      />
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <ShieldCheck className="size-4 text-[#65A358]" strokeWidth={2} />

                    <p
                      className="

                        font-[var(--font-poppins)] text-[10.5px]

                        font-medium text-[#7A8495]

                      "
                    >
                      Secure payment powered by Cashfree
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================================================================*

*                ORDER SUMMARY*

*                ================================================================== */}

            <aside className="lg:sticky lg:top-24">
              <div
                className="

                  overflow-hidden rounded-[28px] border border-[#E4D6EF]

                  bg-[#FBF7FF]/95 shadow-[0_22px_65px_rgba(39,52,74,0.07)]

                  backdrop-blur-sm

                "
              >
                <div
                  className="

                    border-b border-[#E9DDF1] px-5 py-5

                    sm:px-6 sm:py-6

                  "
                >
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
                      <div className="flex items-center gap-2">
                        <h2
                          className="

                            font-playpen text-xl font-black

                            tracking-[-0.035em] text-[#27344A]

                          "
                        >
                          Order Summary
                        </h2>
                      </div>

                      <p
                        className="

                          mt-0.5 font-[var(--font-poppins)] text-[11px]

                          font-medium text-[#7A8495]

                        "
                      >
                        Your selected treasures
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  <div className="space-y-3.5">
                    {cart.items.map((item) => (
                      <div
                        key={item.productId}
                        className="

                          flex items-start justify-between gap-4

                          rounded-[15px] border border-white/80

                          bg-white/70 px-3.5 py-3

                        "
                      >
                        <div className="min-w-0">
                          <p
                            className="

                              truncate font-[var(--font-poppins)] text-xs

                              font-semibold text-[#27344A]

                            "
                          >
                            {item.product.name}
                          </p>

                          <p
                            className="

                              mt-1 font-[var(--font-poppins)] text-[10px]

                              font-medium text-[#8A93A2]

                            "
                          >
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <strong
                          className="

                            shrink-0 font-[var(--font-poppins)] text-xs

                            font-bold text-[#27344A]

                          "
                        >
                          ₹{item.lineTotal.toFixed(2)}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="my-5 h-px bg-[#E7DCEB]" />

                  <div className="space-y-3.5">
                    <div className="flex justify-between gap-4">
                      <span className="font-[var(--font-poppins)] text-sm font-medium text-[#687489]">
                        Subtotal
                      </span>
                      <strong className="font-[var(--font-poppins)] text-sm font-bold text-[#27344A]">
                        ₹{(pricing?.subtotal ?? cart.subtotal).toFixed(2)}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="font-[var(--font-poppins)] text-sm font-medium text-[#687489]">
                        Shipping
                      </span>
                      <span className="text-right font-[var(--font-poppins)] text-xs font-semibold text-[#8B62B4]">
                        {quoteLoading
                          ? "Checking delivery..."
                          : deliveryQuote
                            ? `₹${deliveryQuote.amount.toFixed(2)}`
                            : "Awaiting delivery quote"}
                      </span>
                    </div>
                    {pricing && pricing.discount > 0 && (
                      <div className="flex justify-between gap-4">
                        <span className="font-[var(--font-poppins)] text-sm font-medium text-[#65A358]">
                          {pricing.discountLabel ?? "Discount"}
                        </span>
                        <strong className="font-[var(--font-poppins)] text-sm font-bold text-[#65A358]">
                          −₹{pricing.discount.toFixed(2)}
                        </strong>
                      </div>
                    )}
                  </div>
                  <div className="my-5 h-px bg-[#E7DCEB]" />
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-[var(--font-poppins)] text-[10px] font-black uppercase tracking-[0.14em] text-[#8B62B4]">
                        {deliveryQuote ? "Total" : "Total before shipping"}
                      </p>
                      <p className="mt-1 font-[var(--font-poppins)] text-[10px] text-[#8A93A2]">
                        {deliveryQuote
                          ? `Shipping included · ${deliveryQuote.courierName}`
                          : "Shipping will be added after delivery verification"}
                      </p>
                    </div>
                    <strong className="whitespace-nowrap font-[var(--font-roboto)] text-[1.9rem] font-black tracking-[-0.045em] text-[#27344A]">
                      ₹
                      {(
                        (pricing?.totalBeforeShipping ?? cart.subtotal) +
                        (deliveryQuote?.amount ?? 0)
                      ).toFixed(2)}
                    </strong>
                  </div>

                  <div
                    className="

                      mt-5 flex items-start gap-2.5 rounded-[15px]

                      border border-white/80 bg-white/70 px-3.5 py-3

                    "
                  >
                    <div
                      className="

                        mt-0.5 flex size-5 shrink-0 items-center

                        justify-center rounded-full bg-[#F0F9ED] text-[#65A358]

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
                      Your order is protected by secure Cashfree payment verification.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="

                  mt-4 flex items-center justify-center gap-2

                  font-[var(--font-poppins)] text-[10px] font-medium

                  text-[#8A93A2]

                "
              >
                <ShoppingBag className="size-3.5 text-[#C391EE]" />
                BuzzieWorld · Made for curious minds
              </div>
            </aside>
          </form>
        </div>
      </main>
    </>
  );
}

interface FieldProps {
  label: string;

  value: string;

  onChange: (value: string) => void;

  type?: string;

  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";

  required?: boolean;
}

function Field({ label, value, onChange, type = "text", inputMode, required = false }: FieldProps) {
  return (
    <label className="block">
      <span
        className="

          mb-2 flex items-center gap-1.5

          font-[var(--font-poppins)] text-xs font-bold text-[#526075]

        "
      >
        {label}

        {required && <span className="text-[#E83D59]">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        inputMode={inputMode}
        className="

          h-12 w-full rounded-[14px]

          border border-[#E5DCEB] bg-white px-4

          font-[var(--font-poppins)] text-sm font-medium text-[#27344A]

          outline-none transition-all duration-200

          placeholder:text-[#A0A7B3]

          hover:border-[#D8C6E5]

          focus:border-[#C391EE]

          focus:bg-[#FFFEFF]

          focus:ring-4 focus:ring-[#C391EE]/10

        "
      />
    </label>
  );
}

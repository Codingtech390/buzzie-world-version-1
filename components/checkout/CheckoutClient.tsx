"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { useCart } from "@/hooks/useCart";
import type { ShippingAddress } from "@/types/order";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };

  theme?: {
    color?: string;
  };

  handler: (response: RazorpaySuccessResponse) => void;

  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
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

const pageEase = [0.22, 1, 0.36, 1] as const;

/* ============================================================================
   BUZZIEWORLD — PREMIUM CHECKOUT

   Design direction:
   - Premium children's ecommerce
   - Existing BuzzieWorld typography preserved
   - Warm off-white canvas
   - Lavender / purple brand surfaces
   - #C391EE primary action
   - #E83D59 hover / accent
   - Navy typography
   - Background artwork used as a restrained page backdrop
   - Functional checkout / Razorpay flow unchanged
   ========================================================================== */

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();

  const [address, setAddress] = useState<ShippingAddress>(initialAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof ShippingAddress, value: string) {
    setAddress((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create order");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout failed to load");
      }

      const razorpay = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: "BuzzieWorld",
        description: `Order ${data.order.orderNumber}`,
        order_id: data.razorpay.orderId,

        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },

        theme: {
          color: "#C391EE",
        },

        handler: async (payment) => {
          try {
            const verifyResponse = await fetch("/api/orders/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: data.order.id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_signature: payment.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.message || "Payment verification failed");
            }

            await fetch("/api/cart", {
              method: "DELETE",
            });

            router.push(`/order/success?order=${encodeURIComponent(verifyData.order.orderNumber)}`);
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed",
            );

            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to start checkout");

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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[#FFFDF9]">
        {/* ====================================================================
            BACKGROUND ARTWORK
            ==================================================================== */}

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
          {/* ==================================================================
              HEADER
              ================================================================== */}

          <header className="mb-7 sm:mb-9">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-[#E83D59]" />

              <p
                className="
                  font-[var(--font-poppins)] text-[10px] font-black
                  uppercase tracking-[0.18em] text-[#8B62B4]
                "
              >
                BuzzieWorld checkout
              </p>

              <Sparkles className="size-3.5 text-[#C391EE]" />
            </div>

            <h1
              className="
                mt-3 font-[var(--font-roboto)] text-[2.35rem] font-black
                leading-[0.98] tracking-[-0.055em] text-[#27344A]
                sm:text-[3rem] lg:text-[3.45rem]
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

          {/* ==================================================================
              CHECKOUT
              ================================================================== */}

          <form
            onSubmit={handleSubmit}
            className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:gap-8"
          >
            {/* ==================================================================
                DELIVERY INFORMATION
                ================================================================== */}

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
                        font-[var(--font-roboto)] text-xl font-black
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
                    <span>{error}</span>
                  </div>
                )}

                <div className="mt-7 border-t border-[#EEE9F2] pt-6">
                  <button
                    type="submit"
                    disabled={loading}
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
                      {loading ? "Starting Payment..." : `Pay ₹${cart.subtotal.toFixed(2)}`}
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
                      Secure payment powered by Razorpay
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ==================================================================
                ORDER SUMMARY
                ================================================================== */}

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
                            font-[var(--font-roboto)] text-xl font-black
                            tracking-[-0.035em] text-[#27344A]
                          "
                        >
                          Order Summary
                        </h2>

                        <span
                          className="
                            rounded-full bg-white px-2 py-0.5
                            font-[var(--font-poppins)] text-[9px] font-black
                            uppercase tracking-[0.1em] text-[#8B62B4]
                          "
                        >
                          {cart.items.length}
                        </span>
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
                          font-[var(--font-poppins)] text-sm font-bold
                          text-[#27344A]
                        "
                      >
                        ₹{cart.subtotal.toFixed(2)}
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4">
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
                          rounded-full bg-[#F0F9ED] px-2.5 py-1
                          font-[var(--font-poppins)] text-[10px] font-bold
                          text-[#65A358]
                        "
                      >
                        Free
                      </span>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-[#E7DCEB]" />

                  <div className="flex items-end justify-between gap-4">
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
                          mt-1 font-[var(--font-poppins)] text-[10px]
                          text-[#8A93A2]
                        "
                      >
                        Including free shipping
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
                      Your order is protected by secure Razorpay payment verification.
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


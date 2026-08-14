"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { FormEvent, useState } from "react";

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
          color: "#3F7DFF",
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
    return <div className="flex min-h-[60vh] items-center justify-center">Loading checkout...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>

        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="mt-6 rounded-xl bg-[#3F7DFF] px-5 py-3 font-medium text-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-medium text-[#3F7DFF]">BUZZIEWORLD</p>

          <h1 className="mt-2 text-4xl font-semibold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-black/10 p-6">
            <h2 className="text-xl font-semibold">Delivery Information</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                value={address.phone}
                onChange={(value) => updateField("phone", value)}
                required
              />

              <Field
                label="Postal Code"
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

              <Field
                label="Country"
                value={address.country}
                onChange={(value) => updateField("country", value)}
                required
              />
            </div>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-[#3F7DFF] px-5 py-4 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Starting Payment..." : `Pay ₹${cart.subtotal.toFixed(2)}`}
            </button>
          </section>

          <aside className="h-fit rounded-2xl bg-[#FFF8EC] p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between gap-4 text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>

                  <strong>₹{item.lineTotal.toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-black/10 pt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <strong>₹{cart.subtotal.toFixed(2)}</strong>
              </div>

              <div className="mt-3 flex justify-between">
                <span>Shipping</span>

                <span>Free</span>
              </div>

              <div className="mt-5 flex justify-between text-lg">
                <strong>Total</strong>

                <strong>₹{cart.subtotal.toFixed(2)}</strong>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

function Field({ label, value, onChange, type = "text", required = false }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus:border-[#3F7DFF]"
      />
    </label>
  );
}

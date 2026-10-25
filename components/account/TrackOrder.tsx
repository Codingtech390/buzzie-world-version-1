"use client";

import { useState } from "react";
import { ExternalLink, Package, Search, Truck } from "lucide-react";

import type { CustomerTrackingOrder } from "@/types/shipment";
import { useSearchParams } from "next/navigation";
export default function TrackOrder() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState(() => searchParams.get("orderId") ?? "");

  const [order, setOrder] = useState<CustomerTrackingOrder | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedOrderId = orderId.trim();

    if (!trimmedOrderId) {
      setError("Please enter an order ID.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(
        `/api/account/tracking?orderId=${encodeURIComponent(trimmedOrderId)}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load tracking information.");
      }

      setOrder(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load tracking information.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-[#E7E1F0] bg-white p-5 shadow-[0_18px_60px_rgba(82,68,112,0.06)] sm:p-6">
        <div>
          <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
            Shipment tracking
          </p>

          <h2 className="mt-1 font-playpen text-xl font-bold text-[#303746]">
            Track your order
          </h2>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#7B8494]">
            Enter the order ID from your order confirmation to view courier and shipment
            information.
          </p>
        </div>

        <form onSubmit={handleTrack} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Enter order ID"
            className="min-w-0 flex-1 rounded-xl border border-[#DDD6E8] px-4 py-3 text-sm outline-none transition focus:border-[#C391EE]"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A092CD] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8F7FC1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search className="size-4" />

            {loading ? "Tracking..." : "Track order"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </section>

      {order ? (
        <section className="rounded-[28px] border border-[#E7E1F0] bg-white p-5 shadow-[0_18px_60px_rgba(82,68,112,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-playpen font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
                Order
              </p>

              <h3 className="mt-1 font-playpen text-lg font-bold text-[#303746]">#{order.orderNumber}</h3>
            </div>

            <span className="inline-flex w-fit rounded-full bg-[#F4EFFA] px-3 py-1.5 text-xs font-semibold capitalize text-[#6B5A97]">
              {order.status.replace("_", " ")}
            </span>
          </div>

          {order.shipment ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#ECE8F2] bg-[#FBFAFD] p-4">
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-[#A092CD]" />

                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9A91AC]">
                    Courier
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold capitalize text-[#303746]">
                  {order.shipment.courier}
                </p>
              </div>

              <div className="rounded-2xl border border-[#ECE8F2] bg-[#FBFAFD] p-4">
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-[#A092CD]" />

                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#9A91AC]">
                    AWB / Tracking number
                  </p>
                </div>

                <p className="mt-2 break-all text-sm font-semibold text-[#303746]">
                  {order.shipment.trackingNumber}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[#ECE8F2] bg-[#FBFAFD] p-5">
              <p className="text-sm font-semibold text-[#303746]">Shipment not assigned yet</p>

              <p className="mt-1 text-sm leading-5 text-[#7B8494]">
                Your order has been received, but courier tracking information has not been added
                yet.
              </p>
            </div>
          )}

          {order.shipment?.trackingUrl ? (
            <a
              href={order.shipment.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#A092CD] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#8F7FC1]"
            >
              Track with courier
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

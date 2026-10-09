import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  ExternalLink,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import type { CustomerOrder } from "@/types/customer-order";

interface OrderDetailsProps {
  order: CustomerOrder;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-5">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 font-[var(--font-poppins-brand)] text-[10px] font-semibold text-[#6B5A97] transition-colors hover:text-[#4F3E7A]"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        Back to orders
      </Link>

      <div className="rounded-[28px] border border-[#E7E1F0] bg-white p-5 shadow-[0_18px_60px_rgba(82,68,112,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
              Order details
            </p>

            <h2 className="mt-1 font-[var(--font-poppins-brand)] text-xl font-bold text-[#303746]">
              #{order.orderNumber}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={order.status} />

              <span className="inline-flex items-center gap-1.5 font-[var(--font-roboto)] text-[11px] text-[#8A92A0]">
                <CalendarDays className="size-3.5" strokeWidth={1.8} />
                {formatDate(order.createdAt)}
              </span>

              <Link
                href={`/account/track-order?orderId=${encodeURIComponent(order.id)}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#DDD6E8] px-4 py-2.5 text-xs font-semibold text-[#6B5A97] transition hover:bg-[#F7F4FB]"
              >
                Track this order
                <Truck className="size-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8F6FB] px-4 py-3 sm:text-right">
            <p className="font-[var(--font-poppins-brand)] text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9A91AC]">
              Total
            </p>

            <p className="mt-1 font-[var(--font-poppins-brand)] text-lg font-bold text-[#303746]">
              {formatCurrency(order.total, order.currency)}
            </p>

            <p className="mt-1 font-[var(--font-roboto)] text-[10px] capitalize text-[#8A92A0]">
              Payment: {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#E9E4F1] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.05)] sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F2EDF9] text-[#6B5A97]">
            <Package className="size-[18px]" strokeWidth={1.9} />
          </div>

          <div>
            <h3 className="font-[var(--font-poppins-brand)] text-sm font-bold text-[#303746]">
              Items in this order
            </h3>

            <p className="mt-0.5 font-[var(--font-roboto)] text-[11px] text-[#8A92A0]">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-[#F0ECF5]">
          {order.items.map((item, index) => (
            <div key={`${item.product}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#ECE8F2] bg-[#FBFAFD]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                ) : (
                  <Package className="size-6 text-[#A092CD]" strokeWidth={1.6} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-[var(--font-poppins-brand)] text-sm font-semibold text-[#303746]">
                  {item.name}
                </p>

                {item.sku ? (
                  <p className="mt-1 font-[var(--font-roboto)] text-[10px] text-[#9A91AC]">
                    SKU: {item.sku}
                  </p>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-3">
                  <span className="font-[var(--font-roboto)] text-xs text-[#667085]">
                    Qty: {item.quantity}
                  </span>

                  <span className="font-[var(--font-roboto)] text-xs text-[#667085]">
                    {formatCurrency(item.price, order.currency)} each
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-[var(--font-poppins-brand)] text-sm font-bold text-[#303746]">
                  {formatCurrency(item.lineTotal, order.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {order.shipment ? (
        <section className="rounded-[24px] border border-[#E7E1F0] bg-[#FBFAFD] p-5">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-[#A092CD]" strokeWidth={1.8} />

            <h3 className="font-[var(--font-poppins-brand)] text-sm font-bold text-[#303746]">
              Shipment tracking
            </h3>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9A91AC]">
                Courier
              </p>

              <p className="mt-1 text-xs font-semibold capitalize text-[#303746]">
                {order.shipment.courier}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9A91AC]">
                AWB / Tracking
              </p>

              <p className="mt-1 break-all text-xs font-semibold text-[#303746]">
                {order.shipment.trackingNumber}
              </p>
            </div>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9A91AC]">
                Shipment status
              </p>

              <p className="mt-1 text-xs font-semibold capitalize text-[#303746]">
                {order.shipment.status.replace("_", " ")}
              </p>
            </div>
          </div>

          {order.shipment.trackingUrl ? (
            <a
              href={order.shipment.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#A092CD] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#8F7FC1]"
            >
              Track shipment
              <ExternalLink className="size-3.5" strokeWidth={2} />
            </a>
          ) : null}
        </section>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[28px] border border-[#E9E4F1] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.05)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F2EDF9] text-[#6B5A97]">
              <MapPin className="size-[18px]" strokeWidth={1.9} />
            </div>

            <h3 className="font-[var(--font-poppins-brand)] text-sm font-bold text-[#303746]">
              Delivery address
            </h3>
          </div>

          <div className="mt-5 font-[var(--font-roboto)] text-sm leading-6 text-[#526078]">
            <p className="font-semibold text-[#303746]">{order.shippingAddress.fullName}</p>

            <p className="mt-2">{order.shippingAddress.phone}</p>

            <p className="mt-2">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? (
                <>
                  <br />
                  {order.shippingAddress.addressLine2}
                </>
              ) : null}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#E9E4F1] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.05)] sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F2EDF9] text-[#6B5A97]">
              <CreditCard className="size-[18px]" strokeWidth={1.9} />
            </div>

            <h3 className="font-[var(--font-poppins-brand)] text-sm font-bold text-[#303746]">
              Payment summary
            </h3>
          </div>

          <div className="mt-5 space-y-3 font-[var(--font-roboto)] text-xs">
            <div className="flex items-center justify-between gap-4 text-[#667085]">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal, order.currency)}</span>
            </div>

            <div className="flex items-center justify-between gap-4 text-[#667085]">
              <span>Shipping</span>
              <span>
                {order.shipping === 0 ? "Free" : formatCurrency(order.shipping, order.currency)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-[#667085]">
              <span>Discount</span>
              <span>
                {order.discount > 0 ? `-${formatCurrency(order.discount, order.currency)}` : "—"}
              </span>
            </div>

            <div className="border-t border-[#F0ECF5] pt-3">
              <div className="flex items-center justify-between gap-4">
                <span className="font-[var(--font-poppins-brand)] font-semibold text-[#303746]">
                  Total
                </span>

                <span className="font-[var(--font-poppins-brand)] text-base font-bold text-[#303746]">
                  {formatCurrency(order.total, order.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

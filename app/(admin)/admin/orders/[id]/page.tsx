import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { Types } from "mongoose";

import ShipmentForm from "@/components/admin/orders/ShipmentForm";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { Order, type IOrder, type OrderStatus } from "@/models/Order";
import type { Shipment, ShipmentStatus } from "@/types/shipment";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View and manage BuzzieWorld order details.",
};

interface AdminOrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

type OrderWithShipment = IOrder & {
  _id: Types.ObjectId;
  shipment?: {
    courier: string;
    trackingNumber: string;
    trackingUrl?: string;
    status: ShipmentStatus;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
};

function formatDate(date: Date | string | undefined) {
  if (!date) {
    return "Date unavailable";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

function formatCurrency(
  amount: number,
  currency = "INR",
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusClasses(status: string) {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700";

    case "shipped":
      return "bg-indigo-50 text-indigo-700";

    case "processing":
    case "confirmed":
      return "bg-blue-50 text-blue-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    case "refunded":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function getPaymentStatusClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "refunded":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  await requireAdmin();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();

  const order = (await Order.findById(id).lean()) as
    | OrderWithShipment
    | null;

  if (!order) {
    notFound();
  }

  const orderId = order._id.toString();

  const shipment: Shipment | undefined = order.shipment
    ? {
        courier: order.shipment.courier,
        trackingNumber: order.shipment.trackingNumber,
        trackingUrl: order.shipment.trackingUrl,
        status: order.shipment.status,
        shippedAt: order.shipment.shippedAt
          ? new Date(order.shipment.shippedAt).toISOString()
          : undefined,
        deliveredAt: order.shipment.deliveredAt
          ? new Date(order.shipment.deliveredAt).toISOString()
          : undefined,
      }
    : undefined;

  return (
    <div className="min-h-full bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Back */}
        <Link
          href="/admin/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-violet-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>

        {/* Header */}
        <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">
                Order details
              </p>

              <h1 className="mt-1 font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                #{order.orderNumber}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    order.status,
                  )}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {capitalize(order.status)}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                    order.paymentStatus,
                  )}`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Payment: {capitalize(order.paymentStatus)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CalendarDays className="h-4 w-4" />
              {formatDate(order.createdAt)}
            </div>
          </div>
        </section>

        {/* Shipment — BEFORE order details */}
        <div className="mb-6">
          <ShipmentForm
            orderId={orderId}
            initialShipment={shipment}
          />
        </div>

        {/* Main order details */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.5fr)]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Products */}
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-violet-600" />

                  <h2 className="text-sm font-semibold text-slate-800">
                    Order items
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.product.toString()}-${index}`}
                    className="flex gap-4 p-5 sm:p-6"
                  >
                    {/* Product image */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Package className="h-7 w-7 text-slate-300" />
                      )}
                    </div>

                    {/* Product information */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {item.name}
                      </h3>

                      {item.sku ? (
                        <p className="mt-1 text-xs text-slate-400">
                          SKU: {item.sku}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          Qty:{" "}
                          <strong className="font-semibold text-slate-700">
                            {item.quantity}
                          </strong>
                        </span>

                        <span>
                          Unit:{" "}
                          <strong className="font-semibold text-slate-700">
                            {formatCurrency(
                              item.price,
                              order.currency,
                            )}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Line total */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-800">
                        {formatCurrency(
                          item.lineTotal,
                          order.currency,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping address */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)] sm:p-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-violet-600" />

                <h2 className="text-sm font-semibold text-slate-800">
                  Shipping address
                </h2>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {order.shippingAddress.fullName}
                </p>

                <div className="mt-2 space-y-1 text-sm leading-6 text-slate-500">
                  <p>{order.shippingAddress.addressLine1}</p>

                  {order.shippingAddress.addressLine2 ? (
                    <p>
                      {order.shippingAddress.addressLine2}
                    </p>
                  ) : null}

                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>

                  <p>{order.shippingAddress.country}</p>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">
                  <p>
                    Email:{" "}
                    <span className="font-medium text-slate-700">
                      {order.shippingAddress.email}
                    </span>
                  </p>

                  <p className="mt-1">
                    Phone:{" "}
                    <span className="font-medium text-slate-700">
                      {order.shippingAddress.phone}
                    </span>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Customer */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-violet-600" />

                <h2 className="text-sm font-semibold text-slate-800">
                  Customer
                </h2>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-800">
                  {order.shippingAddress.fullName}
                </p>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {order.shippingAddress.email}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {order.shippingAddress.phone}
                </p>

                {order.user ? (
                  <p className="mt-3 text-[11px] text-slate-400">
                    Customer account linked
                  </p>
                ) : (
                  <p className="mt-3 text-[11px] text-slate-400">
                    Guest order
                  </p>
                )}
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-violet-600" />

                <h2 className="text-sm font-semibold text-slate-800">
                  Payment
                </h2>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                      order.paymentStatus,
                    )}`}
                  >
                    {capitalize(order.paymentStatus)}
                  </span>
                </div>

                {order.razorpayOrderId ? (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Razorpay order
                    </p>

                    <p className="mt-1 break-all font-mono text-[11px] text-slate-600">
                      {order.razorpayOrderId}
                    </p>
                  </div>
                ) : null}

                {order.razorpayPaymentId ? (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Razorpay payment
                    </p>

                    <p className="mt-1 break-all font-mono text-[11px] text-slate-600">
                      {order.razorpayPaymentId}
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            {/* Order totals */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
              <h2 className="text-sm font-semibold text-slate-800">
                Order summary
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-700">
                    {formatCurrency(
                      order.subtotal,
                      order.currency,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Shipping
                  </span>

                  <span className="font-medium text-slate-700">
                    {formatCurrency(
                      order.shipping,
                      order.currency,
                    )}
                  </span>
                </div>

                {order.discount > 0 ? (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-500">
                      Discount
                    </span>

                    <span className="font-medium text-emerald-600">
                      -
                      {formatCurrency(
                        order.discount,
                        order.currency,
                      )}
                    </span>
                  </div>
                ) : null}

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-slate-800">
                      Total
                    </span>

                    <span className="text-lg font-semibold text-slate-900">
                      {formatCurrency(
                        order.total,
                        order.currency,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Order timestamps */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
              <h2 className="text-sm font-semibold text-slate-800">
                Order timeline
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    <Package className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Order created
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {order.shipment?.shippedAt ? (
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <Package className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Shipment dispatched
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(
                          order.shipment.shippedAt,
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}

                {order.shipment?.deliveredAt ? (
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Order delivered
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(
                          order.shipment.deliveredAt,
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

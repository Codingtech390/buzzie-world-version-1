"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Package } from "lucide-react";

import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import type { CustomerOrder } from "@/types/customer-order";

interface OrderCardProps {
  order: CustomerOrder;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderCard({ order }: OrderCardProps) {
  const visibleItems = order.items.slice(0, 3);
  const remainingCount = Math.max(order.items.length - 3, 0);

  return (
    <article className="rounded-[26px] border border-[#E9E4F1] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.05)] transition-shadow hover:shadow-[0_18px_50px_rgba(82,68,112,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-[var(--font-poppins-brand)] text-sm font-bold text-[#303746]">
              #{order.orderNumber}
            </p>

            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[#8A92A0]">
            <span className="inline-flex items-center gap-1.5 font-[var(--font-roboto)] text-[11px]">
              <CalendarDays className="size-3.5" strokeWidth={1.8} />
              {formatDate(order.createdAt)}
            </span>

            <span className="inline-flex items-center gap-1.5 font-[var(--font-roboto)] text-[11px]">
              <Package className="size-3.5" strokeWidth={1.8} />
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="font-[var(--font-poppins-brand)] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9A91AC]">
            Order total
          </p>

          <p className="mt-1 font-[var(--font-poppins-brand)] text-base font-bold text-[#303746]">
            {formatCurrency(order.total, order.currency)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 overflow-hidden">
        {visibleItems.map((item, index) => (
          <div
            key={`${order.id}-${item.product}-${index}`}
            className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#ECE8F2] bg-[#FBFAFD]"
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                className="object-contain p-2"
              />
            ) : (
              <Package className="size-5 text-[#A092CD]" strokeWidth={1.6} />
            )}
          </div>
        ))}

        {remainingCount > 0 ? (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-[#ECE8F2] bg-[#F7F4FB] font-[var(--font-poppins-brand)] text-[10px] font-semibold text-[#6B5A97]">
            +{remainingCount}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[#F0ECF5] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-[var(--font-poppins-brand)] text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9A91AC]">
            Payment
          </p>

          <p className="mt-1 font-[var(--font-roboto)] text-xs capitalize text-[#667085]">
            {order.paymentStatus}
          </p>
        </div>

        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#A092CD] px-4 font-[var(--font-poppins-brand)] text-[10px] font-semibold text-white transition-colors hover:bg-[#8F7FC1]"
        >
          View order
          <ArrowRight className="size-3.5" strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}

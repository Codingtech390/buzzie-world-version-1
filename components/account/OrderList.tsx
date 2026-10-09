"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ClipboardList,
  Loader2,
  RefreshCcw,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

import OrderCard from "@/components/account/OrderCard";
import type {
  CustomerOrder,
  CustomerOrdersResponse,
} from "@/types/customer-order";

interface OrderListProps {
  initialOrders?: CustomerOrder[];
}

export default function OrderList({
  initialOrders = [],
}: OrderListProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [loading, setLoading] = useState(initialOrders.length === 0);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/account/orders", {
        method: "GET",
        cache: "no-store",
      });

      const result =
        (await response.json().catch(() => null)) as CustomerOrdersResponse | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Unable to load your orders.");
      }

      setOrders(result.data || []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your orders.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[#E7E1F0] bg-white px-6 py-14 text-center shadow-[0_12px_40px_rgba(82,68,112,0.05)]">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#F2EDF9] text-[#6B5A97]">
          <Loader2 className="size-5 animate-spin" strokeWidth={1.9} />
        </div>

        <p className="mt-4 font-[var(--font-poppins-brand)] text-sm font-semibold text-[#526078]">
          Loading your orders...
        </p>

        <p className="mt-1 font-[var(--font-roboto)] text-xs text-[#8A92A0]">
          Please wait a moment.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-[28px] border border-[#F2CDD5] bg-[#FFF5F6] px-6 py-12 text-center"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#FDE8EC] text-[#B95367]">
          <AlertCircle className="size-5" strokeWidth={1.8} />
        </div>

        <h3 className="mt-4 font-[var(--font-poppins-brand)] text-sm font-bold text-[#7F3444]">
          We couldn't load your orders
        </h3>

        <p className="mx-auto mt-2 max-w-md font-[var(--font-roboto)] text-xs leading-5 text-[#B94B60]">
          {error}
        </p>

        <button
          type="button"
          onClick={() => void loadOrders()}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#A092CD] px-5 font-[var(--font-poppins-brand)] text-xs font-semibold text-white"
        >
          <RefreshCcw className="size-3.5" strokeWidth={1.9} />
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#DCD5E8] bg-white px-6 py-14 text-center shadow-[0_12px_40px_rgba(82,68,112,0.04)]">
        <div className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-[#F2EDF9] text-[#6B5A97]">
          <ClipboardList className="size-6" strokeWidth={1.7} />
        </div>

        <h3 className="mt-5 font-[var(--font-poppins-brand)] text-base font-bold text-[#303746]">
          No orders yet
        </h3>

        <p className="mx-auto mt-2 max-w-md font-[var(--font-roboto)] text-xs leading-5 text-[#8A92A0]">
          Your completed purchases will appear here once you place your first
          order.
        </p>

        <Link
          href="/shop"
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#A092CD] px-5 font-[var(--font-poppins-brand)] text-xs font-semibold text-white shadow-[0_10px_25px_rgba(160,146,205,0.22)] transition-colors hover:bg-[#8F7FC1]"
        >
          <ShoppingBag className="size-4" strokeWidth={1.9} />
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

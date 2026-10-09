import { CheckCircle2, Clock3, Package, Truck, XCircle } from "lucide-react";

import type { OrderStatus } from "@/models/Order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#FFF8E8] text-[#A9791C]",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-[#F2EDF9] text-[#6B5A97]",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    className: "bg-[#F2EDF9] text-[#6B5A97]",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    className: "bg-[#EEF7FF] text-[#4178A8]",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-[#EEF9F2] text-[#47815B]",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[#FFF1F3] text-[#B95367]",
    icon: XCircle,
  },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-[var(--font-poppins-brand)] text-[9px] font-semibold uppercase tracking-[0.08em] ${config.className}`}
    >
      <Icon className="size-3" strokeWidth={2} />
      {config.label}
    </span>
  );
}

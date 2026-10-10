"use client";

import { Check, Edit3, MapPin, MoreVertical, Star, Trash2 } from "lucide-react";

import type { CustomerAddress } from "@/types/customer-address";

interface AddressCardProps {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (address: CustomerAddress) => void;
  onSetDefault: (address: CustomerAddress) => void;
  busy?: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  busy = false,
}: AddressCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-[26px] border bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.05)] transition-shadow sm:p-6 ${
        address.isDefault ? "border-[#CFC4E8] ring-1 ring-[#E9E3F3]" : "border-[#E9E4F1]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${
              address.isDefault ? "bg-[#A092CD] text-white" : "bg-[#F2EDF9] text-[#6B5A97]"
            }`}
          >
            <MapPin className="size-[18px]" strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-playpen text-sm font-bold text-[#303746]">
                {address.fullName}
              </h3>

              {address.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F2EDF9] px-2.5 py-1 font-playpen text-[9px] font-semibold uppercase tracking-[0.1em] text-[#6B5A97]">
                  <Star className="size-3 fill-current" />
                  Default
                </span>
              )}
            </div>

            <p className="mt-1 font-[var(--font-poppins-brand)] text-[11px] text-[#8A92A0]">
              {address.phone}
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            aria-label={`Address actions for ${address.fullName}`}
            disabled={busy}
            className="flex size-9 items-center justify-center rounded-xl text-[#8A92A0] transition-colors hover:bg-[#F6F3FA] hover:text-[#5F4C8C] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onEdit(address)}
          >
            <MoreVertical className="size-[18px]" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="mt-5 border-t border-[#F0ECF5] pt-4">
        <p className="font-[var(--font-roboto)] text-sm leading-6 text-[#526078]">
          {address.addressLine1}
          {address.addressLine2 ? (
            <>
              <br />
              {address.addressLine2}
            </>
          ) : null}
          <br />
          {address.city}, {address.state} {address.postalCode}
          <br />
          {address.country}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy || address.isDefault}
          onClick={() => onSetDefault(address)}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 font-[var(--font-poppins-brand)] text-[10px] font-semibold transition-colors ${
            address.isDefault
              ? "cursor-default bg-[#F2EDF9] text-[#6B5A97]"
              : "bg-[#F8F6FB] text-[#667085] hover:bg-[#F2EDF9] hover:text-[#5F4C8C]"
          } disabled:opacity-50`}
        >
          {address.isDefault ? (
            <>
              <Check className="size-3.5" strokeWidth={2.2} />
              Default address
            </>
          ) : (
            <>
              <Star className="size-3.5" strokeWidth={1.9} />
              Make default
            </>
          )}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => onEdit(address)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F8F6FB] px-3 py-2 font-[var(--font-poppins-brand)] text-[10px] font-semibold text-[#667085] transition-colors hover:bg-[#F2EDF9] hover:text-[#5F4C8C] disabled:opacity-50"
        >
          <Edit3 className="size-3.5" strokeWidth={1.9} />
          Edit
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(address)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#FFF4F5] px-3 py-2 font-[var(--font-poppins-brand)] text-[10px] font-semibold text-[#C05D70] transition-colors hover:bg-[#FDE8EC] disabled:opacity-50"
        >
          <Trash2 className="size-3.5" strokeWidth={1.9} />
          Delete
        </button>
      </div>
    </article>
  );
}

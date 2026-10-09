"use client";

import { useState } from "react";
import { MapPin, Plus } from "lucide-react";

import AddressCard from "@/components/account/AddressCard";
import AddressForm from "@/components/account/AddressForm";
import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerAddressesResponse,
  CustomerAddressResponse,
} from "@/types/customer-address";

interface AddressListProps {
  initialAddresses: CustomerAddress[];
}

interface ApiMessage {
  success: boolean;
  message?: string;
}

function sortAddresses(addresses: CustomerAddress[]): CustomerAddress[] {
  return [...addresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;

    return a.fullName.localeCompare(b.fullName);
  });
}

export default function AddressList({ initialAddresses }: AddressListProps) {
  const [addresses, setAddresses] = useState<CustomerAddress[]>(() =>
    sortAddresses(initialAddresses),
  );
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function openCreateForm() {
    setEditingAddress(null);
    setError("");
    setShowForm(true);
  }

  function openEditForm(address: CustomerAddress) {
    setEditingAddress(address);
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (busy) return;

    setShowForm(false);
    setEditingAddress(null);
    setError("");
  }

  async function saveAddress(input: CustomerAddressInput): Promise<void> {
    setBusy(true);
    setError("");

    try {
      const isEditing = editingAddress !== null;
      const url = isEditing
        ? `/api/account/addresses/${encodeURIComponent(editingAddress.id)}`
        : "/api/account/addresses";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const result: CustomerAddressResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Unable to save your address.");
      }

      const savedAddress = result.data;

      setAddresses((current) => {
        const updated = isEditing
          ? current.map((address) => (address.id === savedAddress.id ? savedAddress : address))
          : [...current, savedAddress];

        const normalized = updated.map((address) => ({
          ...address,
          isDefault: savedAddress.isDefault ? address.id === savedAddress.id : address.isDefault,
        }));

        return sortAddresses(normalized);
      });

      setShowForm(false);
      setEditingAddress(null);
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save your address.";

      setError(message);
      throw saveError;
    } finally {
      setBusy(false);
    }
  }

  async function setDefaultAddress(address: CustomerAddress): Promise<void> {
    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/account/addresses/${encodeURIComponent(address.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDefault: true }),
      });

      const result: CustomerAddressResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Unable to update the default address.");
      }

      setAddresses((current) =>
        sortAddresses(
          current.map((item) => ({
            ...item,
            isDefault: item.id === result.data?.id,
          })),
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update the default address.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function deleteAddress(address: CustomerAddress): Promise<void> {
    const confirmed = window.confirm(`Delete the delivery address for ${address.fullName}?`);

    if (!confirmed) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/account/addresses/${encodeURIComponent(address.id)}`, {
        method: "DELETE",
      });

      const result: ApiMessage = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete your address.");
      }

const refreshResponse = await fetch("/api/account/addresses", {
  cache: "no-store",
});

const refreshed: CustomerAddressesResponse = await refreshResponse.json();

if (refreshResponse.ok && refreshed.success && refreshed.data) {
  setAddresses(sortAddresses(refreshed.data));
} else {
  // The deletion succeeded; retain a consistent local list if refresh fails.
  const remaining = addresses.filter((item) => item.id !== address.id);

  setAddresses(
    sortAddresses(
      remaining.map((item, index) => ({
        ...item,
        isDefault: item.isDefault || (address.isDefault && index === 0),
      })),
    ),
  );
}

      if (editingAddress?.id === address.id) {
        setEditingAddress(null);
        setShowForm(false);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Unable to delete your address.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-5">
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-[#F2CDD5] bg-[#FFF5F6] px-4 py-3 font-[var(--font-roboto)] text-sm text-[#B94B60]"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-[var(--font-roboto)] text-xs text-[#8A92A0]">
          {addresses.length} {addresses.length === 1 ? "saved address" : "saved addresses"}
        </p>

        {!showForm ? (
          <button
            type="button"
            onClick={openCreateForm}
            disabled={busy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#A092CD] px-5 font-[var(--font-poppins-brand)] text-xs font-semibold text-white transition-colors hover:bg-[#8F7FC1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-4" />
            Add new address
          </button>
        ) : null}
      </div>

      {showForm ? (
        <AddressForm
          address={editingAddress}
          saving={busy}
          onSubmit={saveAddress}
          onCancel={closeForm}
        />
      ) : null}

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-[28px] border border-dashed border-[#DCD4EA] bg-white px-6 py-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#F2EDF9] text-[#6B5A97]">
            <MapPin className="size-5" />
          </div>

          <h3 className="mt-4 font-[var(--font-poppins-brand)] text-sm font-bold text-[#303746]">
            No saved addresses yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm font-[var(--font-roboto)] text-xs leading-5 text-[#8A92A0]">
            Add a delivery address to make your next BuzzieWorld checkout easier.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            disabled={busy}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#A092CD] px-4 font-[var(--font-poppins-brand)] text-xs font-semibold text-white transition-colors hover:bg-[#8F7FC1] disabled:opacity-60"
          >
            <Plus className="size-4" />
            Add your first address
          </button>
        </div>
      ) : null}

      {addresses.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              busy={busy}
              onEdit={openEditForm}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

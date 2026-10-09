"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, X } from "lucide-react";

import type { CustomerAddress, CustomerAddressInput } from "@/types/customer-address";

interface AddressFormProps {
  address?: CustomerAddress | null;
  saving?: boolean;
  onSubmit: (input: CustomerAddressInput) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

function getInitialForm(address?: CustomerAddress | null): FormState {
  if (!address) {
    return EMPTY_FORM;
  }

  return {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
  };
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  onChange: (value: string) => void;
}

function Field({
  label,
  name,
  value,
  placeholder,
  required = false,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7B8494]">
        {label}
        {required ? <span className="ml-1 text-[#E72D5A]">*</span> : null}
      </span>

      <input
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-[#E4DFEB] bg-white px-3.5 font-[var(--font-roboto)] text-sm text-[#303746] outline-none transition-all placeholder:text-[#B0B5BF] focus:border-[#A092CD] focus:ring-4 focus:ring-[#A092CD]/10"
      />
    </label>
  );
}

export default function AddressForm({
  address,
  saving = false,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [form, setForm] = useState<FormState>(() => getInitialForm(address));
  const [error, setError] = useState("");

  const editing = Boolean(address);

  useEffect(() => {
    setForm(getInitialForm(address));
    setError("");
  }, [address]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const input: CustomerAddressInput = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim() || "India",
      isDefault: form.isDefault,
    };

    if (!input.fullName || input.fullName.length < 2) {
      setError("Please enter a valid full name.");
      return;
    }

    if (!input.phone) {
      setError("Please enter a phone number.");
      return;
    }

    if (!input.addressLine1) {
      setError("Please enter your address.");
      return;
    }

    if (!input.city) {
      setError("Please enter your city.");
      return;
    }

    if (!input.state) {
      setError("Please enter your state.");
      return;
    }

    if (!input.postalCode) {
      setError("Please enter your postal code.");
      return;
    }

    try {
      await onSubmit(input);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to save your address.");
    }
  }

  return (
    <div className="rounded-[28px] border border-[#E7E1F0] bg-white p-5 shadow-[0_18px_60px_rgba(82,68,112,0.06)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F2EDF9] text-[#6B5A97]">
            <MapPin className="size-[18px]" strokeWidth={1.9} />
          </div>

          <div>
            <h3 className="font-[var(--font-poppins-brand)] text-base font-bold text-[#303746]">
              {editing ? "Edit address" : "Add a new address"}
            </h3>

            <p className="mt-1 font-[var(--font-roboto)] text-xs leading-5 text-[#8A92A0]">
              {editing
                ? "Update your delivery details below."
                : "Save a delivery address for a faster checkout."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          aria-label="Close address form"
          className="flex size-9 items-center justify-center rounded-xl text-[#8A92A0] transition-colors hover:bg-[#F6F3FA] hover:text-[#5F4C8C] disabled:opacity-50"
        >
          <X className="size-[18px]" strokeWidth={1.9} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            name="fullName"
            value={form.fullName}
            placeholder="Enter full name"
            required
            onChange={(value) => updateField("fullName", value)}
          />

          <Field
            label="Phone number"
            name="phone"
            value={form.phone}
            placeholder="Enter phone number"
            type="tel"
            required
            onChange={(value) => updateField("phone", value)}
          />
        </div>

        <Field
          label="Address line 1"
          name="addressLine1"
          value={form.addressLine1}
          placeholder="House / flat / building / street"
          required
          onChange={(value) => updateField("addressLine1", value)}
        />

        <Field
          label="Address line 2"
          name="addressLine2"
          value={form.addressLine2}
          placeholder="Apartment, landmark, area (optional)"
          onChange={(value) => updateField("addressLine2", value)}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="City"
            name="city"
            value={form.city}
            placeholder="City"
            required
            onChange={(value) => updateField("city", value)}
          />

          <Field
            label="State"
            name="state"
            value={form.state}
            placeholder="State"
            required
            onChange={(value) => updateField("state", value)}
          />

          <Field
            label="Postal code"
            name="postalCode"
            value={form.postalCode}
            placeholder="Postal code"
            required
            onChange={(value) => updateField("postalCode", value)}
          />
        </div>

        <Field
          label="Country"
          name="country"
          value={form.country}
          placeholder="Country"
          required
          onChange={(value) => updateField("country", value)}
        />

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ECE8F2] bg-[#FBFAFD] p-4">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) => updateField("isDefault", event.target.checked)}
            className="mt-0.5 size-4 accent-[#A092CD]"
          />

          <span>
            <span className="block font-[var(--font-poppins-brand)] text-xs font-semibold text-[#303746]">
              Make this my default address
            </span>

            <span className="mt-1 block font-[var(--font-roboto)] text-[11px] leading-4 text-[#8A92A0]">
              This address will be selected first when a delivery address is required.
            </span>
          </span>
        </label>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#F2CDD5] bg-[#FFF5F6] px-4 py-3 font-[var(--font-roboto)] text-xs text-[#B94B60]"
          >
            {error}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-11 rounded-2xl border border-[#E4DFEB] px-5 font-[var(--font-poppins-brand)] text-xs font-semibold text-[#667085] transition-colors hover:bg-[#F8F6FB] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#A092CD] px-6 font-[var(--font-poppins-brand)] text-xs font-semibold text-white shadow-[0_10px_25px_rgba(160,146,205,0.25)] transition-all hover:bg-[#8F7FC1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={2} />
                Saving...
              </>
            ) : editing ? (
              "Save changes"
            ) : (
              "Save address"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

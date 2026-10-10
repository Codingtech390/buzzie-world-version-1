"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, Phone, UserRound } from "lucide-react";

import { updateCustomerProfile } from "@/lib/customer-api";
import type { CustomerProfile } from "@/types/customer-account";

interface ProfileFormProps {
  initialProfile: CustomerProfile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [name, setName] = useState(initialProfile.name);
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isDirty = name !== initialProfile.name || phone !== (initialProfile.phone || "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (trimmedName.length > 80) {
      setError("Name must be 80 characters or fewer.");
      return;
    }

    if (trimmedPhone.length > 20) {
      setError("Phone number must be 20 characters or fewer.");
      return;
    }

    setSaving(true);

    try {
      const response = await updateCustomerProfile({
        name: trimmedName,
        phone: trimmedPhone || undefined,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to update your profile.");
      }

      setName(response.data.name);
      setPhone(response.data.phone || "");
      setSuccess(response.message || "Your profile has been updated successfully.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-[26px] border border-[#E9E4F1] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.05)] sm:p-7">
        <div className="border-b border-[#EEEAF4] pb-5">
          <p className="font-playpen text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
            Personal information
          </p>

          <h2 className="mt-1 font-playpen text-lg font-bold text-[#303746]">
            Keep your details up to date
          </h2>

          <p className="mt-1.5 max-w-2xl font-[var(--font-poppins-brand)] text-[11px] leading-5 text-[#8A92A0]">
            Your email is tied to your account identity and is displayed here for reference. Name
            and phone can be updated from this page.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex items-center gap-1.5 font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737C8B]">
              <UserRound className="size-3.5" strokeWidth={1.9} />
              Full name
            </span>

            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSuccess("");
                setError("");
              }}
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              className="h-12 w-full rounded-2xl border border-[#DED8E9] bg-[#FCFBFE] px-4 font-[var(--font-poppins-brand)] text-sm text-[#303746] outline-none transition focus:border-[#A092CD] focus:ring-4 focus:ring-[#A092CD]/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-1.5 font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737C8B]">
              <Phone className="size-3.5" strokeWidth={1.9} />
              Phone number
            </span>

            <input
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setSuccess("");
                setError("");
              }}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="Add a phone number"
              className="h-12 w-full rounded-2xl border border-[#DED8E9] bg-[#FCFBFE] px-4 font-[var(--font-poppins-brand)] text-sm text-[#303746] outline-none transition placeholder:text-[#A3A9B3] focus:border-[#A092CD] focus:ring-4 focus:ring-[#A092CD]/10"
            />
          </label>

          <div className="block md:col-span-2">
            <span className="mb-2 flex items-center gap-1.5 font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#737C8B]">
              <Mail className="size-3.5" strokeWidth={1.9} />
              Email address
            </span>

            <div className="flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-[#E8E3EF] bg-[#F7F5F9] px-4">
              <span className="min-w-0 truncate font-[var(--font-poppins-brand)] text-sm text-[#646D7B]">
                {initialProfile.email}
              </span>

              <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-[var(--font-poppins-brand)] text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9991A7]">
                Account email
              </span>
            </div>

            <p className="mt-2 font-[var(--font-poppins-brand)] text-[10px] leading-4 text-[#9A91AC]">
              Email changes are intentionally outside this Phase 1 profile API so account identity
              and authentication remain stable.
            </p>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`mt-5 flex items-start gap-2.5 rounded-2xl border px-4 py-3 font-[var(--font-poppins-brand)] text-[11px] leading-5 ${
              error
                ? "border-[#F0CDD5] bg-[#FFF5F7] text-[#9A4D61]"
                : "border-[#D5E9D9] bg-[#F4FBF5] text-[#4E8058]"
            }`}
          >
            {success && <CheckCircle2 className="mt-0.5 size-4 shrink-0" strokeWidth={2} />}

            <span>{error || success}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#EEEAF4] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[var(--font-poppins-brand)] text-[10px] text-[#9A91AC]">
            Changes are saved securely to your customer account.
          </p>

          <button
            type="submit"
            disabled={saving || !isDirty}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#A092CD] px-5 font-[var(--font-poppins-brand)] text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(160,146,205,0.24)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}

            {saving ? "Saving changes" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

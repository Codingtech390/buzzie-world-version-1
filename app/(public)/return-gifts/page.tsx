"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Check, ChevronDown, Gift, Package, Sparkles } from "lucide-react";

const AGE_GROUPS = ["Age 0–3", "Age 3+", "Age 6+", "Age 8+"];

const BUDGETS = ["Rs. 0–500", "Rs. 500–1000", "Rs. 1000–1500"];

const REQUIREMENTS = ["Return Gifts", "Bulk Orders", "Both"];

export default function ReturnGiftsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    requirement: "",
    ageGroup: "",
    quantity: "",
    budget: "",
    deliveryDate: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);

    // ---------------------------------------------------------
    // BACKEND INTEGRATION
    // ---------------------------------------------------------
    // When the API is ready, replace the temporary success
    // handling above with your API request.
    //
    // Example:
    //
    // await fetch("/api/return-gifts", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });
    // ---------------------------------------------------------
  };

  return (
    <main className="min-h-screen bg-[#FFFCF8] text-[#24385E]">
      {/* =====================================================
          HERO / PAGE INTRO
      ====================================================== */}
      <section className="relative overflow-hidden px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-14 lg:px-10 lg:pb-12 lg:pt-16">
        {/* Decorative background shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-[#F6E9FF] opacity-70 blur-[2px] sm:h-60 sm:w-60"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-52 w-52 rounded-full bg-[#FFF0D9] opacity-80 sm:h-72 sm:w-72"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 text-center sm:px-8 lg:px-10">
          {/* Eyebrow */}
          <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4">
            <span className="h-[2px] w-7 rounded-full bg-[#E83D59] sm:w-9" />

            <p className="font-[var(--font-poppins)] text-[8px] font-black uppercase tracking-[0.2em] text-[#E83D59] sm:text-[9px] lg:text-[10px]">
              Celebrations · Gifting · Bulk Orders
            </p>

            <span className="h-[2px] w-7 rounded-full bg-[#E83D59] sm:w-9" />
          </div>

          {/* Main heading */}
          <h1 className="text-balance font-[var(--font-roboto)] text-[clamp(2.3rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#24385E]">
            Return Gifts
            <br />
            <span className="text-[#E83D59]">Bulk Orders</span>
          </h1>

          {/* Description */}
          <div className="mx-auto flex w-full justify-center">
            <p className="mt-4 w-full max-w-[560px] text-center font-[var(--font-poppins)] text-[10px] font-medium leading-[1.65] text-[#687489] sm:mt-5 sm:max-w-[620px] sm:text-[11px] lg:max-w-[680px] lg:text-[13px] xl:max-w-[720px] xl:text-[14px]">
              Planning a special celebration or looking for gifts in bulk? Tell us what you&apos;re
              looking for and our team will help you find something perfect for your little guests.
            </p>
          </div>

          {/* Feature pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-7 sm:gap-3">
            <FeaturePill icon={<Gift className="h-3.5 w-3.5" />} text="Perfect for parties" />

            <FeaturePill icon={<Package className="h-3.5 w-3.5" />} text="Bulk quantities" />

            <FeaturePill icon={<Sparkles className="h-3.5 w-3.5" />} text="Personalized support" />
          </div>
        </div>
      </section>

      {/* =====================================================
          FORM SECTION
      ====================================================== */}
      <section className="relative px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-[860px]">
          <div className="relative overflow-hidden rounded-[28px] border border-[#EDE2D6] bg-white px-5 py-7 shadow-[0_18px_60px_rgba(36,56,94,0.07)] sm:rounded-[34px] sm:px-8 sm:py-9 lg:px-12 lg:py-12">
            {/* Top decorative accent */}
            <div aria-hidden="true" className="absolute left-0 right-0 top-0 h-1.5 bg-[#E83D59]" />

            {/* Form heading */}
            <div className="mb-8 sm:mb-10">
              <p className="font-[var(--font-poppins)] text-[9px] font-bold uppercase tracking-[0.18em] text-[#A1A9B8]">
                Tell us what you need
              </p>

              <h2 className="mt-2 font-[var(--font-roboto)] text-[26px] font-black tracking-[-0.035em] text-[#24385E] sm:text-[30px]">
                Let&apos;s plan something special.
              </h2>

              <p className="mt-2 max-w-[590px] font-[var(--font-poppins)] text-[11px] leading-[1.65] text-[#7A8495] sm:text-[12px]">
                Share a few details about your requirement and our team will get in touch with you.
              </p>
            </div>

            {/* Success message */}
            {submitted ? (
              <div className="mb-8 rounded-[20px] border border-[#D9F0DF] bg-[#F4FBF5] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDF4E2] text-[#278542]">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </div>

                  <div>
                    <h3 className="font-[var(--font-poppins)] text-[13px] font-bold text-[#28733B]">
                      Thank you!
                    </h3>

                    <p className="mt-1 font-[var(--font-poppins)] text-[11px] leading-[1.6] text-[#5E7564]">
                      Your requirement has been received. Our team will get in touch with you
                      shortly.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8">
              {/* =================================================
                  BASIC DETAILS
              ================================================== */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-7">
                <FormField label="Name" required htmlFor="name">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className={INPUT_CLASS}
                  />
                </FormField>

                <FormField label="Email" required htmlFor="email">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={INPUT_CLASS}
                  />
                </FormField>

                <FormField label="Contact Number" required htmlFor="contactNumber">
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    required
                    inputMode="tel"
                    value={formData.contactNumber}
                    onChange={(event) => updateField("contactNumber", event.target.value)}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    className={INPUT_CLASS}
                  />
                </FormField>

                <FormField label="Requirement" required htmlFor="requirement">
                  <div className="relative">
                    <select
                      id="requirement"
                      name="requirement"
                      required
                      value={formData.requirement}
                      onChange={(event) => updateField("requirement", event.target.value)}
                      className={`${INPUT_CLASS} appearance-none pr-11 ${
                        !formData.requirement ? "text-[#A8AFBB]" : "text-[#24385E]"
                      }`}
                    >
                      <option value="" disabled>
                        -- Select an option --
                      </option>

                      {REQUIREMENTS.map((requirement) => (
                        <option key={requirement} value={requirement}>
                          {requirement}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8791A2]"
                    />
                  </div>
                </FormField>
              </div>

              {/* =================================================
                  AGE GROUP
              ================================================== */}
              <div>
                <FieldLabel label="What age group are you looking at?" required />

                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                  {AGE_GROUPS.map((age) => (
                    <RadioCard
                      key={age}
                      name="ageGroup"
                      value={age}
                      checked={formData.ageGroup === age}
                      onChange={(value) => updateField("ageGroup", value)}
                      label={age}
                    />
                  ))}
                </div>
              </div>

              {/* =================================================
                  QUANTITY
              ================================================== */}
              <FormField label="Quantity you're looking at?" required htmlFor="quantity">
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  inputMode="numeric"
                  value={formData.quantity}
                  onChange={(event) => updateField("quantity", event.target.value)}
                  placeholder="Enter quantity"
                  className={INPUT_CLASS}
                />
              </FormField>

              {/* =================================================
                  BUDGET
              ================================================== */}
              <div>
                <FieldLabel label="Budget per product?" required />

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                  {BUDGETS.map((budget) => (
                    <RadioCard
                      key={budget}
                      name="budget"
                      value={budget}
                      checked={formData.budget === budget}
                      onChange={(value) => updateField("budget", value)}
                      label={budget}
                    />
                  ))}
                </div>
              </div>

              {/* =================================================
                  DELIVERY DATE
              ================================================== */}
              <FormField label="Estimated Delivery Date" required htmlFor="deliveryDate">
                <div className="relative">
                  <input
                    id="deliveryDate"
                    name="deliveryDate"
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(event) => updateField("deliveryDate", event.target.value)}
                    className={`${INPUT_CLASS} pr-11`}
                  />

                  <CalendarDays
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8791A2]"
                  />
                </div>
              </FormField>

              {/* =================================================
                  SUBMIT
              ================================================== */}
              <div className="pt-1 sm:pt-2">
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#E83D59] px-6 py-4 font-[var(--font-poppins)] text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_25px_rgba(232,61,89,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D9324E] hover:shadow-[0_16px_30px_rgba(232,61,89,0.23)] active:translate-y-0 sm:rounded-[16px] sm:py-[17px]"
                >
                  Submit Requirement
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>

              {/* =================================================
                  NOTE
              ================================================== */}
              <div className="border-t border-[#F0E9E1] pt-5">
                <p className="font-[var(--font-poppins)] text-[9px] leading-[1.7] text-[#8B94A3] sm:text-[10px]">
                  <span className="font-bold text-[#E83D59]">Please Note:</span> This page is
                  dedicated to providing personalized support for return favors and bulk orders.
                  Once submitted, our team will get in touch with you.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================================
   REUSABLE FORM FIELD
============================================================= */

const INPUT_CLASS =
  "h-[50px] w-full rounded-[12px] border border-[#E5DED5] bg-[#FFFEFC] px-4 font-[var(--font-poppins)] text-[11px] font-medium text-[#24385E] outline-none transition-all placeholder:text-[#A8AFBB] focus:border-[#E83D59] focus:bg-white focus:ring-4 focus:ring-[#E83D59]/[0.07] sm:h-[52px] sm:text-[12px]";

function FormField({
  label,
  required = false,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} htmlFor={htmlFor} />

      <div className="mt-2.5">{children}</div>
    </div>
  );
}

/* =============================================================
   FIELD LABEL
============================================================= */

function FieldLabel({
  label,
  required = false,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
}) {
  const content = (
    <>
      <span>{label}</span>

      {required ? <span className="ml-1 text-[#E83D59]">*</span> : null}
    </>
  );

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className="font-[var(--font-poppins)] text-[10px] font-bold text-[#344461] sm:text-[11px]"
      >
        {content}
      </label>
    );
  }

  return (
    <p className="font-[var(--font-poppins)] text-[10px] font-bold text-[#344461] sm:text-[11px]">
      {content}
    </p>
  );
}

/* =============================================================
   RADIO CARD
============================================================= */

function RadioCard({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`group flex min-h-[50px] cursor-pointer items-center gap-2.5 rounded-[12px] border px-3.5 py-3 transition-all duration-200 sm:min-h-[52px] sm:px-4 ${
        checked
          ? "border-[#E83D59] bg-[#FFF5F6] shadow-[0_5px_18px_rgba(232,61,89,0.08)]"
          : "border-[#E5DED5] bg-[#FFFEFC] hover:border-[#D8CFC5] hover:bg-white"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border transition-all ${
          checked
            ? "border-[#E83D59] bg-[#E83D59]"
            : "border-[#C8C2BA] bg-white group-hover:border-[#AFA79E]"
        }`}
      >
        {checked ? <span className="h-[5px] w-[5px] rounded-full bg-white" /> : null}
      </span>

      <span
        className={`font-[var(--font-poppins)] text-[10px] font-semibold sm:text-[11px] ${
          checked ? "text-[#24385E]" : "text-[#687489]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

/* =============================================================
   FEATURE PILL
============================================================= */

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-[#EDE2D6] bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
      <span className="text-[#E83D59]">{icon}</span>

      <span className="font-[var(--font-poppins)] text-[8px] font-semibold text-[#687489] sm:text-[9px]">
        {text}
      </span>
    </div>
  );
}

"use client";

import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Save,
  Settings2,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { defaultSiteSettings, settingsSchema, type SiteSettings } from "@/types/settings";

type ApiResponse = {
  success?: boolean;
  message?: string;
  data?: SiteSettings;
};

type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="block text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {hint ? <span className="block text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100";

const numberClass = inputClass;

type TextKey =
  | "storeName"
  | "tagline"
  | "supportEmail"
  | "supportPhone"
  | "storeUrl"
  | "timezone"
  | "announcementText"
  | "orderPrefix"
  | "seoTitle"
  | "seoDescription"
  | "instagramUrl"
  | "facebookUrl";

type NumberKey =
  | "minOrderValue"
  | "freeShippingThreshold"
  | "flatShippingRate"
  | "estimatedDeliveryMinDays"
  | "estimatedDeliveryMaxDays"
  | "taxRate";

type BooleanKey =
  | "storeEnabled"
  | "announcementEnabled"
  | "allowGuestCheckout"
  | "taxEnabled"
  | "pricesIncludeTax"
  | "maintenanceMode";


 function normalizeSettings(value: unknown): SiteSettings {
   const input =
     value && typeof value === "object" && !Array.isArray(value)
       ? (value as Record<string, unknown>)
       : {};

   const normalized = { ...defaultSiteSettings };

   for (const key of Object.keys(defaultSiteSettings) as Array<keyof SiteSettings>) {
     const incoming = input[key];
     const fallback = defaultSiteSettings[key];

     // Missing or null values use the default.
     if (incoming === undefined || incoming === null) {
       continue;
     }

     // Keep values only when their types match the defaults.
     if (typeof fallback === "string") {
       if (typeof incoming === "string") {
         Object.assign(normalized, { [key]: incoming });
       }
       continue;
     }

     if (typeof fallback === "boolean") {
       if (typeof incoming === "boolean") {
         Object.assign(normalized, { [key]: incoming });
       }
       continue;
     }

     if (typeof fallback === "number") {
       if (typeof incoming === "number" && Number.isFinite(incoming)) {
         Object.assign(normalized, { [key]: incoming });
       }
       continue;
     }

     // Preserve the INR-only currency setting.
     if (key === "currency" && incoming === "INR") {
       Object.assign(normalized, { [key]: incoming });
     }
   }

   const result = settingsSchema.safeParse(normalized);

   if (!result.success) {
     console.error("Settings validation details:", JSON.stringify(result.error.issues, null, 2));

     throw new Error(
       `Settings validation failed: ${result.error.issues
         .map((issue) => `${issue.path.join(".") || "settings"}: ${issue.message}`)
         .join("; ")}`,
     );
   }

   return result.data;
 }
export default function SettingsClient() {
  const [settings, setSettings] = useState<SiteSettings>({
    ...defaultSiteSettings,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/settings", {
        method: "GET",
        cache: "no-store",
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message ?? "Unable to load store settings.");
      }

        setSettings(normalizeSettings(result.data));

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load store settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  function updateText(key: TextKey, value: string) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setNotice("");
  }

  function updateNumber(key: NumberKey, value: string) {
    setSettings((current) => ({
      ...current,
      [key]: value === "" ? 0 : Number(value),
    }));
    setNotice("");
  }

  function updateBoolean(key: BooleanKey, value: boolean) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setNotice("");
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    setNotice("");

    const parsed = settingsSchema.safeParse(settings);

    if (!parsed.success) {
      setSaving(false);
      setError(parsed.error.issues[0]?.message ?? "Invalid settings.");
      return;
    }

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message ?? "Unable to save store settings.");
      }

      setSettings(normalizeSettings(result.data));
      setNotice(result.message ?? "Settings saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save store settings.");
    } finally {
      setSaving(false);
    }
  }

  function textField(
    key: TextKey,
    label: string,
    hint?: string,
    options?: {
      type?: "text" | "email" | "url";
      placeholder?: string;
    },
  ) {
    return (
      <Field key={key} label={label} hint={hint}>
        <input
          className={inputClass}
          type={options?.type ?? "text"}
          value={settings[key]}
          placeholder={options?.placeholder}
          onChange={(event) => updateText(key, event.target.value)}
        />
      </Field>
    );
  }

  function numberField(
    key: NumberKey,
    label: string,
    hint?: string,
    options?: {
      min?: number;
      max?: number;
      step?: number;
      prefix?: string;
    },
  ) {
    return (
      <Field key={key} label={label} hint={hint}>
        <div className="relative">
          {options?.prefix ? (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              {options.prefix}
            </span>
          ) : null}
          <input
            className={`${numberClass} ${options?.prefix ? "pl-9" : ""}`}
            type="number"
            min={options?.min ?? 0}
            max={options?.max}
            step={options?.step ?? 1}
            value={settings[key]}
            onChange={(event) => updateNumber(key, event.target.value)}
          />
        </div>
      </Field>
    );
  }

  function toggle(key: BooleanKey, label: string, description: string) {
    return (
      <div
        key={key}
        className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={settings[key]}
          onClick={() => updateBoolean(key, !settings[key])}
          className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
            settings[key] ? "bg-violet-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
              settings[key] ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    );
  }

  function section(title: string, description: string, icon: ReactNode, children: ReactNode) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            {icon}
          </div>
          <div>
            <h2 className="font-playpen text-base font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">{children}</div>
      </section>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[420px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin text-violet-600" />
          Loading store settings...
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 space-y-6 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-700">
            <Settings2 className="h-4 w-4" />
            Store configuration
          </div>
          <h1 className="font-playpen text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Admin Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your store profile, checkout defaults, shipping, tax, SEO and storefront
            behaviour.
          </p>
        </div>

        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save settings"}
        </button>
      </header>

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">Something needs your attention</p>
            <p className="mt-1 break-words">{error}</p>
            <button
              type="button"
              onClick={() => void loadSettings()}
              className="mt-2 font-bold underline underline-offset-2"
            >
              Reload settings
            </button>
          </div>
        </div>
      ) : null}

      {notice ? (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {notice}
        </div>
      ) : null}

      <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
          <div>
            <p className="text-sm font-bold text-slate-900">Protected settings</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Changes are saved to MongoDB. Payment keys, API secrets and authentication credentials
              are not exposed or editable on this page.
            </p>
          </div>
        </div>
      </div>

      {section(
        "Store profile",
        "Basic business details and store availability.",
        <Store className="h-5 w-5" />,
        <>
          {textField("storeName", "Store name")}
          {textField("tagline", "Store tagline")}
          {textField("supportEmail", "Support email", "Used as a store contact detail.", {
            type: "email",
            placeholder: "support@example.com",
          })}
          {textField("supportPhone", "Support phone")}
          {textField("storeUrl", "Public store URL", "Include https:// when entering a URL.", {
            type: "url",
            placeholder: "https://example.com",
          })}
          {textField("timezone", "Store timezone", "Default: Asia/Kolkata")}
          <Field
            label="Currency"
            hint="The existing product and order prices are in INR. Currency conversion is not performed."
          >
            <select className={inputClass} value={settings.currency} disabled>
              <option value="INR">INR — Indian Rupee (₹)</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            {toggle(
              "storeEnabled",
              "Store enabled",
              "A setting for future storefront availability integration. This does not yet block public pages.",
            )}
          </div>
        </>,
      )}

      {section(
        "Announcements",
        "Configure the default announcement message for your storefront.",
        <Settings2 className="h-5 w-5" />,
        <>
          <div className="sm:col-span-2">
            {toggle(
              "announcementEnabled",
              "Enable announcement",
              "Stores the announcement preference. Your storefront must be connected to display it.",
            )}
          </div>
          <div className="sm:col-span-2">
            {textField(
              "announcementText",
              "Announcement text",
              "Keep the message short and clear.",
            )}
          </div>
        </>,
      )}

      {section(
        "SEO and social links",
        "Set default metadata and social profile URLs.",
        <Settings2 className="h-5 w-5" />,
        <>
          <div className="sm:col-span-2">
            {textField(
              "seoTitle",
              "Default SEO title",
              "Recommended: keep this near 60 characters.",
            )}
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Default SEO description"
              hint="A concise description for search engine snippets."
            >
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={settings.seoDescription}
                maxLength={300}
                onChange={(event) => updateText("seoDescription", event.target.value)}
              />
            </Field>
          </div>
          {textField(
            "instagramUrl",
            "Instagram URL",
            "Optional. Must begin with http:// or https://.",
            { type: "url", placeholder: "https://instagram.com/..." },
          )}
          {textField(
            "facebookUrl",
            "Facebook URL",
            "Optional. Must begin with http:// or https://.",
            { type: "url", placeholder: "https://facebook.com/..." },
          )}
        </>,
      )}

      {section(
        "Store operations",
        "Administrative switches that require an explicit application integration.",
        <ShieldCheck className="h-5 w-5" />,
        <>
          <div className="sm:col-span-2">
            {toggle(
              "maintenanceMode",
              "Maintenance mode",
              "Saves the maintenance preference. Customer access is not blocked until maintenance mode is integrated into the application.",
            )}
          </div>

        </>,
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Remember to save your changes before leaving this page.
        </p>
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save all settings"}
        </button>
      </div>
    </main>
  );
}

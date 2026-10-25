"use client";

import { useEffect, useState } from "react";

import type { CustomerPreferences } from "@/types/customer-settings";

const DEFAULT_PREFERENCES: CustomerPreferences = {
  emailNotifications: true,
  marketingEmails: false,
  wishlistReminders: false,
};

export default function AccountPreferences() {
  const [preferences, setPreferences] = useState<CustomerPreferences>(DEFAULT_PREFERENCES);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      try {
        const response = await fetch("/api/account/preferences", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load account preferences.");
        }

        if (!cancelled && data.preferences) {
          setPreferences({
            emailNotifications: Boolean(data.preferences.emailNotifications),
            marketingEmails: Boolean(data.preferences.marketingEmails),
            wishlistReminders: Boolean(data.preferences.wishlistReminders),
          });
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(
            error instanceof Error ? error.message : "Unable to load account preferences.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPreferences();

    return () => {
      cancelled = true;
    };
  }, []);

  async function savePreferences(nextPreferences: CustomerPreferences) {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/account/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextPreferences),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update account preferences.");
      }

      setPreferences(nextPreferences);
      setMessage(data.message || "Account preferences updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update account preferences.");
    } finally {
      setSaving(false);
    }
  }

  function updatePreference(key: keyof CustomerPreferences, value: boolean) {
    const nextPreferences = {
      ...preferences,
      [key]: value,
    };

    void savePreferences(nextPreferences);
  }

  return (
    <section className="rounded-[24px] border border-[#E6E0EF] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.06)]">
      <div>
        <h3 className="font-playpen text-base font-bold text-[#303746]">
          Account preferences
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-[#7B8494]">
          Choose how BuzzieWorld communicates with you.
        </p>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-[#7B8494]">Loading preferences...</p>
      ) : (
        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              disabled={saving}
              onChange={(event) => updatePreference("emailNotifications", event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#C391EE]"
            />

            <span>
              <span className="block text-sm font-semibold text-[#303746]">
                Account notifications
              </span>

              <span className="mt-0.5 block text-sm leading-5 text-[#7B8494]">
                Receive important account and order-related emails.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={preferences.marketingEmails}
              disabled={saving}
              onChange={(event) => updatePreference("marketingEmails", event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#C391EE]"
            />

            <span>
              <span className="block text-sm font-semibold text-[#303746]">Marketing emails</span>

              <span className="mt-0.5 block text-sm leading-5 text-[#7B8494]">
                Receive occasional product, offer and BuzzieWorld updates.
              </span>
            </span>
          </label>
        </div>
      )}

      {message ? <p className="mt-4 text-sm text-[#7B8494]">{message}</p> : null}
    </section>
  );
}

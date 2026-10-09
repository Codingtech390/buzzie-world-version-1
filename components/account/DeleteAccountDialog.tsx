"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canDelete = confirmation === "DELETE";

  async function handleDelete() {
    if (!canDelete || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/account/settings", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete account.");
      }

      await signOut({
        callbackUrl: "/",
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to delete account.");

      setLoading(false);
    }
  }

  return (
    <section className="rounded-[24px] border border-red-200 bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.06)]">
      <div>
        <h3 className="font-[var(--font-poppins-brand)] text-base font-bold text-[#B42318]">
          Delete account
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-[#7B8494]">
          Permanently deactivate your BuzzieWorld customer account and remove your personal account
          information.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setConfirmation("");
          setError("");
        }}
        className="mt-5 rounded-xl border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        Delete my account
      </button>

      {open ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-[#303746]">Are you sure?</p>

          <p className="mt-1.5 text-sm leading-5 text-[#7B8494]">
            Your account will be deactivated and your personal account information will be removed.
            This action cannot be undone.
          </p>

          <label
            htmlFor="delete-account-confirmation"
            className="mt-4 block text-sm font-medium text-[#303746]"
          >
            Type DELETE to confirm
          </label>

          <input
            id="delete-account-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-red-400"
          />

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl border border-[#DDD6E8] bg-white px-4 py-2.5 text-sm font-semibold text-[#303746]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={!canDelete || loading}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Confirm deletion"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

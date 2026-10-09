"use client";

import { FormEvent, useState } from "react";

export default function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (newPassword.length < 8) {
      setMessage("Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage(data.message || "Password changed successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to change password.");
    } finally {
      setLoading(false);
    }
  }

  if (!hasPassword) {
    return (
      <section className="rounded-[24px] border border-[#E6E0EF] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.06)]">
        <h3 className="font-[var(--font-poppins-brand)] text-base font-bold text-[#303746]">
          Password
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-[#7B8494]">
          Your account currently uses Google sign-in and does not have a password.
        </p>

        <a
          href="/forgot-password"
          className="mt-4 inline-flex rounded-xl bg-[#C391EE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E83D59]"
        >
          Set a password
        </a>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-[#E6E0EF] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.06)]">
      <div>
        <h3 className="font-[var(--font-poppins-brand)] text-base font-bold text-[#303746]">
          Change password
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-[#7B8494]">
          Update the password used to sign in to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="current-password"
            className="mb-1.5 block text-sm font-medium text-[#303746]"
          >
            Current password
          </label>

          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-[#DDD6E8] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#C391EE]"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-[#303746]">
            New password
          </label>

          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-xl border border-[#DDD6E8] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#C391EE]"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-1.5 block text-sm font-medium text-[#303746]"
          >
            Confirm new password
          </label>

          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-xl border border-[#DDD6E8] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#C391EE]"
          />
        </div>

        {message ? <p className="text-sm text-[#7B8494]">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#C391EE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E83D59] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}

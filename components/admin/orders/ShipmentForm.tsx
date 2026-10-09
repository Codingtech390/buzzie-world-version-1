"use client";

import { useState } from "react";

import type { Shipment, ShipmentStatus } from "@/types/shipment";

interface ShipmentFormProps {
  orderId: string;
  initialShipment?: Shipment;
}

const STATUS_OPTIONS: Array<{
  value: ShipmentStatus;
  label: string;
}> = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "shipped",
    label: "Shipped",
  },
  {
    value: "in_transit",
    label: "In transit",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
];

export default function ShipmentForm({ orderId, initialShipment }: ShipmentFormProps) {
  const [courier, setCourier] = useState(initialShipment?.courier ?? "");

  const [trackingNumber, setTrackingNumber] = useState(initialShipment?.trackingNumber ?? "");

  const [trackingUrl, setTrackingUrl] = useState(initialShipment?.trackingUrl ?? "");

  const [status, setStatus] = useState<ShipmentStatus>(initialShipment?.status ?? "pending");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courier,
          trackingNumber,
          trackingUrl,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update shipment.");
      }

      setMessage(data.message || "Shipment information updated successfully.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update shipment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">Shipment information</h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Add or update courier and tracking information for this order.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`courier-${orderId}`}
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Courier
            </label>

            <input
              id={`courier-${orderId}`}
              value={courier}
              onChange={(event) => setCourier(event.target.value)}
              placeholder="DTDC"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label
              htmlFor={`tracking-${orderId}`}
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              AWB / Tracking number
            </label>

            <input
              id={`tracking-${orderId}`}
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="Enter AWB"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor={`tracking-url-${orderId}`}
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Tracking URL
          </label>

          <input
            id={`tracking-url-${orderId}`}
            type="url"
            value={trackingUrl}
            onChange={(event) => setTrackingUrl(event.target.value)}
            placeholder="https://courier.example/track/..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
          />
        </div>

        <div>
          <label
            htmlFor={`shipment-status-${orderId}`}
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Shipment status
          </label>

          <select
            id={`shipment-status-${orderId}`}
            value={status}
            onChange={(event) => setStatus(event.target.value as ShipmentStatus)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save shipment information"}
        </button>
      </form>
    </section>
  );
}

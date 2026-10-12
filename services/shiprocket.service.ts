import "server-only";

const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

type ShiprocketCourier = {
  courier_company_id: number;
  courier_name: string;
  freight_charge?: number;
  rate?: number;
  estimated_delivery_days?: string | number;
  etd?: string;
  blocked?: number;
};

type ShiprocketServiceabilityResponse = {
  data?: {
    available_courier_companies?: ShiprocketCourier[];
  };
  message?: string;
};

export type ShippingQuote = {
  amount: number;
  courierName: string;
  courierId: number;
  estimatedDeliveryDays: string | null;
  estimatedDeliveryDate: string | null;
  pickupPincode: string;
  deliveryPincode: string;
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing server configuration: ${name}`);
  }

  return value;
}

function positiveEnvNumber(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number.`);
  }

  return value;
}

export function getShipmentPackage() {
  return {
    weight: positiveEnvNumber("SHIPMENT_WEIGHT_KG", 0.5),
    length: positiveEnvNumber("SHIPMENT_LENGTH_CM", 20),
    breadth: positiveEnvNumber("SHIPMENT_BREADTH_CM", 15),
    height: positiveEnvNumber("SHIPMENT_HEIGHT_CM", 10),
  };
}

function validatePincode(value: string): string {
  const pincode = String(value ?? "").trim();

  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    throw new Error("Enter a valid 6-digit Indian delivery pincode.");
  }

  return pincode;
}

async function getShiprocketToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: requiredEnv("SHIPROCKET_EMAIL"),
      password: requiredEnv("SHIPROCKET_PASSWORD"),
    }),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => ({}))) as {
    token?: string;
    message?: string;
  };

  if (!response.ok || !result.token) {
    console.error("Shiprocket authentication failed:", response.status);
    throw new Error("Unable to authenticate with the shipping provider. Please try again later.");
  }

  cachedToken = result.token;

  // Shiprocket documents a 10-day token lifetime.
  // Refresh early; this in-memory cache is best-effort in serverless deployments.
  tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return cachedToken;
}

export async function getShippingQuote(
  deliveryPincodeInput: string,
  declaredValue: number,
): Promise<ShippingQuote> {
  const pickupPincode = validatePincode(requiredEnv("SHIPROCKET_PICKUP_PINCODE"));
  const deliveryPincode = validatePincode(deliveryPincodeInput);

  if (!Number.isFinite(declaredValue) || declaredValue <= 0) {
    throw new Error("Invalid shipment value.");
  }

  const token = await getShiprocketToken();
  const parcel = getShipmentPackage();

  const params = new URLSearchParams({
    pickup_postcode: pickupPincode,
    delivery_postcode: deliveryPincode,
    cod: "0",
    weight: String(parcel.weight),
    length: String(parcel.length),
    breadth: String(parcel.breadth),
    height: String(parcel.height),
    declared_value: String(Math.ceil(declaredValue)),
  });

  const response = await fetch(
    `${SHIPROCKET_BASE_URL}/courier/serviceability/?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );

  const result = (await response.json().catch(() => ({}))) as ShiprocketServiceabilityResponse;

  if (!response.ok) {
    console.error("Shiprocket quote failed:", response.status);
    throw new Error("Unable to check delivery serviceability for this pincode.");
  }

  const couriers = (result.data?.available_courier_companies ?? [])
    .filter((courier) => courier.blocked !== 1)
    .map((courier) => ({
      courier,
      amount: Number(courier.freight_charge ?? courier.rate),
    }))
    .filter((item) => Number.isFinite(item.amount) && item.amount > 0)
    .sort((a, b) => a.amount - b.amount);

  const cheapest = couriers[0];

  if (!cheapest) {
    throw new Error("No prepaid courier is currently available for this delivery pincode.");
  }

  return {
    amount: Math.round(cheapest.amount * 100) / 100,
    courierName: cheapest.courier.courier_name,
    courierId: cheapest.courier.courier_company_id,
    estimatedDeliveryDays:
      cheapest.courier.estimated_delivery_days != null
        ? String(cheapest.courier.estimated_delivery_days)
        : null,
    estimatedDeliveryDate: cheapest.courier.etd || null,
    pickupPincode,
    deliveryPincode,
  };
}

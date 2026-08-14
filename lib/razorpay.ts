import crypto from "crypto";

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
}

function getCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }

  return {
    keyId,
    keySecret,
  };
}

export async function createRazorpayOrder(amount: number, receipt: string) {
  const { keyId, keySecret } = getCredentials();

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),

      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),

    cache: "no-store",
  });

  const data = (await response.json()) as
    | RazorpayOrderResponse
    | {
        error?: {
          description?: string;
        };
      };

  if (!response.ok) {
    throw new Error(
      "error" in data && data.error?.description
        ? data.error.description
        : "Failed to create Razorpay order",
    );
  }

  return data as RazorpayOrderResponse;
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = getCredentials();

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expected = Buffer.from(generatedSignature);

  const received = Buffer.from(signature);

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, received);
}

export function getRazorpayKeyId() {
  return getCredentials().keyId;
}

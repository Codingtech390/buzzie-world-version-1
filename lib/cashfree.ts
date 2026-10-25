import crypto from "node:crypto";

const API_VERSION = process.env.CASHFREE_API_VERSION || "2025-01-01";

type CashfreeOrderResponse = {
  cf_order_id?: number | string;
  order_id: string;
  order_amount: number;
  order_currency: string;
  order_status: string;
  payment_session_id: string;
};

type CashfreePayment = {
  cf_payment_id: number | string;
  order_id: string;
  payment_status: string;
  payment_amount: number;
  payment_currency: string;
};

function getConfig() {
  const clientId = process.env.CASHFREE_CLIENT_ID;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
  const environment = process.env.CASHFREE_ENV;

  if (!clientId || !clientSecret) {
    throw new Error("Cashfree credentials are not configured.");
  }

  if (environment !== "sandbox" && environment !== "production") {
    throw new Error("CASHFREE_ENV must be sandbox or production.");
  }

  return {
    clientId,
    clientSecret,
    baseUrl:
      environment === "production"
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg",
  };
}

async function cashfreeRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getConfig();

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      "x-client-id": config.clientId,
      "x-client-secret": config.clientSecret,
      "x-api-version": API_VERSION,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  const responseText = await response.text();
  let data: unknown;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error("Cashfree returned an invalid response.");
  }

  if (!response.ok) {
    // Do not send gateway internals or credentials to the browser.
    console.error("Cashfree API error", {
      status: response.status,
      response: data,
    });

    throw new Error("Cashfree payment service request failed.");
  }

  return data as T;
}

export async function createCashfreeOrder(input: {
  orderId: string;
  amount: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Invalid payment amount.");
  }

  return cashfreeRequest<CashfreeOrderResponse>("/orders", {
    method: "POST",
    headers: {
      "x-idempotency-key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: Number(input.amount.toFixed(2)),
      order_currency: "INR",
      customer_details: {
        customer_id: input.customerId,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone,
      },
    }),
  });
}

export async function getCashfreePayments(orderId: string) {
  return cashfreeRequest<CashfreePayment[]>(`/orders/${encodeURIComponent(orderId)}/payments`, {
    method: "GET",
  });
}

export function verifyCashfreeWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
) {
  const { clientSecret } = getConfig();

  if (!rawBody || !timestamp || !signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", clientSecret)
    .update(timestamp + rawBody)
    .digest("base64");

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

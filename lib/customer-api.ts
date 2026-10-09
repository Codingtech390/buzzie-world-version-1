import type {
  CustomerProfileResponse,
  UpdateCustomerProfileInput,
  UpdateCustomerProfileResponse,
} from "@/types/customer-account";

export class CustomerApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CustomerApiError";
    this.status = status;
  }
}

async function requestCustomerApi<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new CustomerApiError(
      payload?.message || "Something went wrong. Please try again.",
      response.status,
    );
  }

  return payload as T;
}

export async function getCustomerProfile() {
  return requestCustomerApi<CustomerProfileResponse>("/api/account/profile", {
    method: "GET",
    cache: "no-store",
  });
}

export async function updateCustomerProfile(input: UpdateCustomerProfileInput) {
  return requestCustomerApi<UpdateCustomerProfileResponse>("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export type ProducerSalesItem = {
  productVariantId: string;
  productVariantName: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

export type ProducerSalesProduct = {
  productId: string;
  productName: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  items: ProducerSalesItem[];
};

export type ProducerSalesResponse = {
  storeId: string;
  producerId: string;
  from: string;
  to: string;
  products: ProducerSalesProduct[];
};

export type ProducerSalesRequest = {
  storeId: string;
  producerId: string;
  from: string;
  to: string;
};

type APIErrorPayload = {
  error?: string;
};

const defaultBaseUrl = "http://localhost:8080";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || defaultBaseUrl;

export async function fetchProducerSales(
  request: ProducerSalesRequest,
): Promise<ProducerSalesResponse> {
  const url = new URL(
    `/stores/${request.storeId}/producers/${request.producerId}/sales`,
    API_BASE_URL,
  );
  url.searchParams.set("from", request.from);
  url.searchParams.set("to", request.to);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as APIErrorPayload;
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Ignore parse failures and preserve the generic message.
    }
    throw new Error(message);
  }

  return (await response.json()) as ProducerSalesResponse;
}

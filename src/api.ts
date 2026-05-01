export type ProducerSalesItem = {
  productVariantId: string;
  productVariantName: string;
  iconKey?: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

export type ProducerSalesProduct = {
  productId: string;
  productName: string;
  iconKey?: string;
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

export type BuyerSalesItem = {
  productVariantId: string;
  productVariantName: string;
  iconKey?: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

export type BuyerSalesBuyer = {
  buyerId: string;
  buyerName: string;
  buyerType: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  items: BuyerSalesItem[];
};

export type BuyerSalesResponse = {
  storeId: string;
  producerId: string;
  from: string;
  to: string;
  buyers: BuyerSalesBuyer[];
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

export const API_URL_PREFIX = "/api";

export async function fetchProducerSales(
  request: ProducerSalesRequest,
): Promise<ProducerSalesResponse> {
  const url = new URL(
    `${API_URL_PREFIX}/stores/${request.storeId}/producers/${request.producerId}/sales`,
    window.location.origin,
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

export type BuyerSalesRequest = ProducerSalesRequest;

export async function fetchBuyerSales(
  request: BuyerSalesRequest,
): Promise<BuyerSalesResponse> {
  const url = new URL(
    `${API_URL_PREFIX}/stores/${request.storeId}/producers/${request.producerId}/sales`,
    window.location.origin,
  );
  url.searchParams.set("group_by", "buyer");
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

  return (await response.json()) as BuyerSalesResponse;
}

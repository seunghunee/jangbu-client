export type ProducerSalesItem = {
  productVariantId: string;
  productVariantName: string;
  imageUrl?: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

export type ProducerSalesProduct = {
  productId: string;
  productName: string;
  imageUrl?: string;
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
  imageUrl?: string;
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

type RawProducerSalesItem = {
  productVariantId: string;
  productVariantName: string;
  iconUrl?: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

type RawProducerSalesProduct = {
  productId: string;
  productName: string;
  iconUrl?: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  items: RawProducerSalesItem[];
};

type RawProducerSalesResponse = {
  storeId: string;
  producerId: string;
  from: string;
  to: string;
  products: RawProducerSalesProduct[];
};

type RawBuyerSalesItem = {
  productVariantId: string;
  productVariantName: string;
  iconUrl?: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

type RawBuyerSalesBuyer = {
  buyerId: string;
  buyerName: string;
  buyerType: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  items: RawBuyerSalesItem[];
};

type RawBuyerSalesResponse = {
  storeId: string;
  producerId: string;
  from: string;
  to: string;
  buyers: RawBuyerSalesBuyer[];
};

function normalizeProducerSalesResponse(
  response: RawProducerSalesResponse,
): ProducerSalesResponse {
  return {
    ...response,
    products: response.products.map((product) => ({
      ...product,
      imageUrl: product.iconUrl,
      items: product.items.map((item) => ({
        ...item,
        imageUrl: item.iconUrl,
      })),
    })),
  };
}

function normalizeBuyerSalesResponse(
  response: RawBuyerSalesResponse,
): BuyerSalesResponse {
  return {
    ...response,
    buyers: response.buyers.map((buyer) => ({
      ...buyer,
      items: buyer.items.map((item) => ({
        ...item,
        imageUrl: item.iconUrl,
      })),
    })),
  };
}

export const API_URL_PREFIX = "/api";

export async function fetchProducerSales(
  request: ProducerSalesRequest,
): Promise<ProducerSalesResponse> {
  const url = new URL(
    `${API_URL_PREFIX}/stores/${request.storeId}/producers/${request.producerId}/sales`,
    window.location.origin,
  );
  url.searchParams.set("group_by", "product");
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

  const payload = (await response.json()) as RawProducerSalesResponse;
  return normalizeProducerSalesResponse(payload);
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

  const payload = (await response.json()) as RawBuyerSalesResponse;
  return normalizeBuyerSalesResponse(payload);
}

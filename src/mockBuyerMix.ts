export type BuyerMixSummary = {
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  payoutRate: number;
};

export type BuyerMixDelta = {
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  payoutRate: number;
  grossSalesPct: number;
  payoutAmountPct: number;
};

export type BuyerMixComparison = {
  previousFrom: string;
  previousTo: string;
  previousSummary: BuyerMixSummary;
  delta: BuyerMixDelta;
};

export type BuyerTypeMetric = {
  buyerType: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  payoutRate: number;
  shareOfPayout: number;
};

export type TopProductByPayout = {
  productId: string;
  productName: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

export type BuyerPurchaseItem = {
  id: string;
  itemName: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
};

export type BuyerSalesRow = {
  buyerId: string;
  buyerName: string;
  buyerType: string;
  soldQty: number;
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  payoutRate: number;
  items: BuyerPurchaseItem[];
};

export type BuyerMixMockReport = {
  from: string;
  to: string;
  summary: BuyerMixSummary;
  comparison: BuyerMixComparison;
  buyerTypes: BuyerTypeMetric[];
  topProductsByPayout: TopProductByPayout[];
  buyers: BuyerSalesRow[];
};

function toIsoLocalDate(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function deriveCurrentSummary(from: string): BuyerMixSummary {
  const monthFactor = new Date(from).getMonth() % 4;

  const soldQty = 1260 + monthFactor * 35;
  const grossSalesKrw = 18_900_000 + monthFactor * 540_000;
  const fundTotalKrw = 1_260_000 + monthFactor * 38_000;
  const payoutAmountKrw = grossSalesKrw - fundTotalKrw;

  return {
    soldQty,
    grossSalesKrw,
    fundTotalKrw,
    payoutAmountKrw,
    payoutRate: payoutAmountKrw / grossSalesKrw,
  };
}

function derivePreviousSummary(current: BuyerMixSummary): BuyerMixSummary {
  const soldQty = Math.max(0, Math.round(current.soldQty * 0.91));
  const grossSalesKrw = Math.max(0, Math.round(current.grossSalesKrw * 0.89));
  const fundTotalKrw = Math.max(0, Math.round(current.fundTotalKrw * 0.92));
  const payoutAmountKrw = grossSalesKrw - fundTotalKrw;

  return {
    soldQty,
    grossSalesKrw,
    fundTotalKrw,
    payoutAmountKrw,
    payoutRate: grossSalesKrw === 0 ? 0 : payoutAmountKrw / grossSalesKrw,
  };
}

function deriveBuyerTypes(summary: BuyerMixSummary): BuyerTypeMetric[] {
  const slices = [
    { key: "retailer", qtyWeight: 0.52, grossWeight: 0.57, fundWeight: 0.44 },
    {
      key: "unregistered_institution",
      qtyWeight: 0.28,
      grossWeight: 0.26,
      fundWeight: 0.41,
    },
    {
      key: "unregistered_individual",
      qtyWeight: 0.16,
      grossWeight: 0.13,
      fundWeight: 0.11,
    },
    { key: "producer", qtyWeight: 0.03, grossWeight: 0.03, fundWeight: 0.03 },
    { key: "staff", qtyWeight: 0.01, grossWeight: 0.01, fundWeight: 0.01 },
  ];

  const rows = slices.map((slice) => {
    const soldQty = Math.round(summary.soldQty * slice.qtyWeight);
    const grossSalesKrw = Math.round(summary.grossSalesKrw * slice.grossWeight);
    const fundTotalKrw = Math.round(summary.fundTotalKrw * slice.fundWeight);
    const payoutAmountKrw = grossSalesKrw - fundTotalKrw;
    const payoutRate =
      grossSalesKrw === 0 ? 0 : payoutAmountKrw / grossSalesKrw;
    const shareOfPayout =
      summary.payoutAmountKrw === 0
        ? 0
        : payoutAmountKrw / summary.payoutAmountKrw;

    return {
      buyerType: slice.key,
      soldQty,
      grossSalesKrw,
      fundTotalKrw,
      payoutAmountKrw,
      payoutRate,
      shareOfPayout,
    };
  });

  return rows.sort(
    (left, right) => right.payoutAmountKrw - left.payoutAmountKrw,
  );
}

function deriveTopProducts(summary: BuyerMixSummary): TopProductByPayout[] {
  const rows = [
    { id: "p1", name: "Tomato" },
    { id: "p2", name: "Potato" },
    { id: "p3", name: "Apple" },
    { id: "p4", name: "Cabbage" },
    { id: "p5", name: "Cucumber" },
  ];

  return rows.map((row, index) => {
    const grossWeight = [0.24, 0.2, 0.18, 0.16, 0.12][index] ?? 0.1;
    const fundWeight = [0.14, 0.12, 0.11, 0.1, 0.09][index] ?? 0.08;
    const qtyWeight = [0.19, 0.16, 0.14, 0.13, 0.1][index] ?? 0.09;
    const grossSalesKrw = Math.round(summary.grossSalesKrw * grossWeight);
    const fundTotalKrw = Math.round(summary.fundTotalKrw * fundWeight);
    const soldQty = Math.round(summary.soldQty * qtyWeight);

    return {
      productId: row.id,
      productName: row.name,
      soldQty,
      grossSalesKrw,
      fundTotalKrw,
      payoutAmountKrw: grossSalesKrw - fundTotalKrw,
    };
  });
}

function toBuyerTypeFundRate(type: string): number {
  switch (type) {
    case "unregistered_institution":
      return 0.12;
    case "retailer":
      return 0.08;
    case "unregistered_individual":
      return 0.06;
    case "producer":
      return 0.05;
    case "staff":
      return 0.04;
    default:
      return 0.08;
  }
}

function deriveBuyers(summary: BuyerMixSummary): BuyerSalesRow[] {
  const buyerTemplates = [
    { id: "b01", name: "Green Mart", type: "retailer", weight: 0.17 },
    { id: "b02", name: "Hanaro Market", type: "retailer", weight: 0.14 },
    {
      id: "b03",
      name: "Seoul Welfare Center",
      type: "unregistered_institution",
      weight: 0.13,
    },
    {
      id: "b04",
      name: "Mirae High School",
      type: "unregistered_institution",
      weight: 0.11,
    },
    {
      id: "b05",
      name: "Kim Jiho",
      type: "unregistered_individual",
      weight: 0.1,
    },
    {
      id: "b06",
      name: "Lee Minseo",
      type: "unregistered_individual",
      weight: 0.09,
    },
    { id: "b07", name: "Farm Outlet", type: "producer", weight: 0.08 },
    { id: "b08", name: "Staff Canteen", type: "staff", weight: 0.05 },
  ];

  const productTemplates = [
    { name: "Tomato", qtyWeight: 0.34, grossWeight: 0.32 },
    { name: "Potato", qtyWeight: 0.26, grossWeight: 0.24 },
    { name: "Apple", qtyWeight: 0.2, grossWeight: 0.22 },
    { name: "Cabbage", qtyWeight: 0.12, grossWeight: 0.13 },
    { name: "Cucumber", qtyWeight: 0.08, grossWeight: 0.09 },
  ];

  const buyers = buyerTemplates.map((buyer, buyerIndex) => {
    const grossSalesKrw = Math.round(summary.grossSalesKrw * buyer.weight);
    const soldQty = Math.round(summary.soldQty * buyer.weight);
    const fundRate = toBuyerTypeFundRate(buyer.type);
    const fundTotalKrw = Math.round(grossSalesKrw * fundRate);
    const payoutAmountKrw = grossSalesKrw - fundTotalKrw;

    const items = productTemplates
      .filter((_, index) => (index + buyerIndex) % 2 === 0 || index < 2)
      .slice(0, 4)
      .map((product, itemIndex) => {
        const gross = Math.round(grossSalesKrw * product.grossWeight * 0.92);
        const qty = Math.max(1, Math.round(soldQty * product.qtyWeight * 0.92));
        const fund = Math.round(gross * fundRate);
        return {
          id: `${buyer.id}-i${itemIndex + 1}`,
          itemName: product.name,
          soldQty: qty,
          grossSalesKrw: gross,
          fundTotalKrw: fund,
          payoutAmountKrw: gross - fund,
        };
      });

    return {
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerType: buyer.type,
      soldQty,
      grossSalesKrw,
      fundTotalKrw,
      payoutAmountKrw,
      payoutRate: grossSalesKrw === 0 ? 0 : payoutAmountKrw / grossSalesKrw,
      items,
    };
  });

  return buyers.sort(
    (left, right) => right.payoutAmountKrw - left.payoutAmountKrw,
  );
}

export function buildMockBuyerMixReport(
  from: string,
  to: string,
): BuyerMixMockReport {
  const currentSummary = deriveCurrentSummary(from);
  const previousSummary = derivePreviousSummary(currentSummary);
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const duration = Math.max(0, toDate.getTime() - fromDate.getTime());
  const previousFrom = new Date(fromDate.getTime() - duration);

  const delta: BuyerMixDelta = {
    soldQty: currentSummary.soldQty - previousSummary.soldQty,
    grossSalesKrw: currentSummary.grossSalesKrw - previousSummary.grossSalesKrw,
    fundTotalKrw: currentSummary.fundTotalKrw - previousSummary.fundTotalKrw,
    payoutAmountKrw:
      currentSummary.payoutAmountKrw - previousSummary.payoutAmountKrw,
    payoutRate: currentSummary.payoutRate - previousSummary.payoutRate,
    grossSalesPct:
      previousSummary.grossSalesKrw === 0
        ? 0
        : ((currentSummary.grossSalesKrw - previousSummary.grossSalesKrw) /
            previousSummary.grossSalesKrw) *
          100,
    payoutAmountPct:
      previousSummary.payoutAmountKrw === 0
        ? 0
        : ((currentSummary.payoutAmountKrw - previousSummary.payoutAmountKrw) /
            previousSummary.payoutAmountKrw) *
          100,
  };

  return {
    from,
    to,
    summary: currentSummary,
    comparison: {
      previousFrom: toIsoLocalDate(previousFrom),
      previousTo: from,
      previousSummary,
      delta,
    },
    buyerTypes: deriveBuyerTypes(currentSummary),
    topProductsByPayout: deriveTopProducts(currentSummary),
    buyers: deriveBuyers(currentSummary),
  };
}

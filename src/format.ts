import type { ProducerSalesProduct, ProducerSalesResponse } from "./api";
import { UI_LOCALE } from "./i18n";

const currencyFormatter = new Intl.NumberFormat(UI_LOCALE, {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat(UI_LOCALE);

export function formatKrw(value: number): string {
  return currencyFormatter.format(value);
}

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatDateTimeRangeValue(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatDateTimeLabel(value: string): string {
  return new Intl.DateTimeFormat(UI_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toOffsetDateTime(localDateTime: string): string {
  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHours = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(
    2,
    "0",
  );
  const offsetRemainder = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetRemainder}`;
}

export function getDefaultDateRange(now: Date): { from: string; to: string } {
  const from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 0, 0);
  return {
    from: formatDateTimeRangeValue(from),
    to: formatDateTimeRangeValue(to),
  };
}

export function getSalesTotals(report: ProducerSalesResponse) {
  return report.products.reduce(
    (totals, product) => {
      totals.soldQty += product.soldQty;
      totals.grossSalesKrw += product.grossSalesKrw;
      totals.fundTotalKrw += product.fundTotalKrw;
      totals.payoutAmountKrw += product.payoutAmountKrw;
      return totals;
    },
    {
      soldQty: 0,
      grossSalesKrw: 0,
      fundTotalKrw: 0,
      payoutAmountKrw: 0,
    },
  );
}

export function sortProductsByGrossSales(
  products: ProducerSalesProduct[],
): ProducerSalesProduct[] {
  return [...products].sort(
    (left, right) => right.grossSalesKrw - left.grossSalesKrw,
  );
}

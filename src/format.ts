import type { ProducerSalesProduct, ProducerSalesResponse } from "./api";
import { getUILocale } from "./i18n";

const currencyFormatterByLocale = new Map<string, Intl.NumberFormat>();
const integerFormatterByLocale = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(locale: string): Intl.NumberFormat {
  let formatter = currencyFormatterByLocale.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    });
    currencyFormatterByLocale.set(locale, formatter);
  }
  return formatter;
}

function getIntegerFormatter(locale: string): Intl.NumberFormat {
  let formatter = integerFormatterByLocale.get(locale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale);
    integerFormatterByLocale.set(locale, formatter);
  }
  return formatter;
}

export function formatKrw(value: number): string {
  return getCurrencyFormatter(getUILocale()).format(value);
}

export function formatInteger(value: number): string {
  return getIntegerFormatter(getUILocale()).format(value);
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
  return new Intl.DateTimeFormat(getUILocale(), {
    dateStyle: "medium",
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

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { fetchProducerSales, type ProducerSalesResponse } from "../api";
import {
  getDefaultDateRange,
  getSalesTotals,
  sortProductsByGrossSales,
  toOffsetDateTime,
} from "../format";
import { getUILocale, t } from "../i18n";

type FormState = {
  selectedDate: string;
  rangeDays: number;
  rangePreset: "day" | "week" | "month" | "year" | "custom";
};

type IdentityState = {
  storeId: string;
  producerId: string;
};

const initialDateRange = getDefaultDateRange(new Date());
const IDENTITY_STORAGE_KEY = "jangbu.identity";

export function getRangeOptions() {
  return [
    { label: t("range.today"), days: 1 },
    { label: t("range.oneWeek"), days: 7 },
    { label: t("range.oneMonth"), days: 30 },
    { label: t("range.oneYear"), days: 365 },
  ] as const;
}

const initialFormState: FormState = {
  selectedDate: initialDateRange.to.slice(0, 10),
  rangeDays: 1,
  rangePreset: "day",
};

function loadStoredIdentity(): IdentityState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(IDENTITY_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<IdentityState>;
    const storeId = parsed.storeId?.trim() ?? "";
    const producerId = parsed.producerId?.trim() ?? "";
    if (!storeId || !producerId) {
      return null;
    }
    return { storeId, producerId };
  } catch {
    return null;
  }
}

function toDateTimeLocalValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function shiftDateValue(dateValue: string, deltaDays: number): string {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + deltaDays);
  return toDateTimeLocalValue(date).slice(0, 10);
}

function getTodayDateValue(): string {
  return toDateTimeLocalValue(new Date()).slice(0, 10);
}

function clampDateValueToToday(dateValue: string): string {
  const today = getTodayDateValue();
  return dateValue > today ? today : dateValue;
}

function getInclusiveDayDistance(fromDate: string, toDate: string): number {
  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);
  const diffMs = to.getTime() - from.getTime();
  return Math.floor(diffMs / 86_400_000) + 1;
}

function getRequestDateRange(form: FormState): { from: string; to: string } {
  const todayEnd = new Date(`${getTodayDateValue()}T23:59:59`);

  if (form.rangePreset === "week") {
    const selected = new Date(`${form.selectedDate}T00:00:00`);
    const day = selected.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    const from = new Date(selected);
    from.setDate(selected.getDate() + mondayOffset);
    from.setHours(0, 0, 0, 0);

    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    to.setHours(23, 59, 59, 0);
    const clampedTo = to > todayEnd ? todayEnd : to;

    return {
      from: toDateTimeLocalValue(from),
      to: toDateTimeLocalValue(clampedTo),
    };
  }

  if (form.rangePreset === "month") {
    const selected = new Date(`${form.selectedDate}T00:00:00`);
    const from = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const to = new Date(
      selected.getFullYear(),
      selected.getMonth() + 1,
      0,
      23,
      59,
      59,
      0,
    );
    const clampedTo = to > todayEnd ? todayEnd : to;

    return {
      from: toDateTimeLocalValue(from),
      to: toDateTimeLocalValue(clampedTo),
    };
  }

  if (form.rangePreset === "year") {
    const selected = new Date(`${form.selectedDate}T00:00:00`);
    const from = new Date(selected.getFullYear(), 0, 1, 0, 0, 0, 0);
    const to = new Date(selected.getFullYear(), 11, 31, 23, 59, 59, 0);
    const clampedTo = to > todayEnd ? todayEnd : to;

    return {
      from: toDateTimeLocalValue(from),
      to: toDateTimeLocalValue(clampedTo),
    };
  }

  const end = new Date(`${form.selectedDate}T23:59:59`);
  const from = new Date(end);
  from.setDate(end.getDate() - (form.rangeDays - 1));
  from.setHours(0, 0, 0, 0);

  return {
    from: toDateTimeLocalValue(from),
    to: toDateTimeLocalValue(end),
  };
}

export function toDateDisplayLabel(dateValue: string): string {
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat(getUILocale(), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function useSalesReport() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [identity, setIdentity] = useState<IdentityState | null>(() =>
    loadStoredIdentity(),
  );
  const [identityDraft, setIdentityDraft] = useState<IdentityState>(() => {
    const stored = loadStoredIdentity();
    return {
      storeId: stored?.storeId ?? "",
      producerId: stored?.producerId ?? "",
    };
  });
  const [report, setReport] = useState<ProducerSalesResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeRange = useMemo(() => getRequestDateRange(form), [form]);
  const totals = report ? getSalesTotals(report) : null;
  const sortedProducts = report
    ? sortProductsByGrossSales(report.products)
    : [];

  function setSelectedDate(value: string) {
    setForm((current) => ({
      ...current,
      selectedDate: clampDateValueToToday(value),
    }));
  }

  function setSelectedRange(fromDate: string, toDate: string) {
    const from = fromDate <= toDate ? fromDate : toDate;
    const to = clampDateValueToToday(fromDate <= toDate ? toDate : fromDate);
    const rangeDays = Math.max(1, getInclusiveDayDistance(from, to));
    setForm((current) => ({
      ...current,
      selectedDate: to,
      rangeDays,
      rangePreset: "custom",
    }));
  }

  function handleIdentitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextIdentity = {
      storeId: identityDraft.storeId.trim(),
      producerId: identityDraft.producerId.trim(),
    };

    if (!nextIdentity.storeId || !nextIdentity.producerId) {
      setErrorMessage(t("error.identityRequired"));
      return;
    }

    setIdentity(nextIdentity);
    setErrorMessage(null);
    setReport(null);
    window.localStorage.setItem(
      IDENTITY_STORAGE_KEY,
      JSON.stringify(nextIdentity),
    );
  }

  function handleIdentityReset() {
    setIdentity(null);
    setReport(null);
    setErrorMessage(null);
    setIdentityDraft({ storeId: "", producerId: "" });
    window.localStorage.removeItem(IDENTITY_STORAGE_KEY);
  }

  function applyQuickRange(days: number) {
    const today = getTodayDateValue();
    const rangePreset: FormState["rangePreset"] =
      days === 7
        ? "week"
        : days === 30
          ? "month"
          : days === 365
            ? "year"
            : "day";

    setForm((current) => ({
      ...current,
      selectedDate: today,
      rangeDays: days,
      rangePreset,
    }));
  }

  function shiftSelectedDate(step: number) {
    setForm((current) => ({
      ...current,
      selectedDate: clampDateValueToToday(
        current.rangePreset === "week"
          ? shiftDateValue(current.selectedDate, step * 7)
          : current.rangePreset === "month"
            ? (() => {
                const date = new Date(`${current.selectedDate}T00:00:00`);
                date.setMonth(date.getMonth() + step);
                return toDateTimeLocalValue(date).slice(0, 10);
              })()
            : current.rangePreset === "year"
              ? (() => {
                  const date = new Date(`${current.selectedDate}T00:00:00`);
                  date.setFullYear(date.getFullYear() + step);
                  return toDateTimeLocalValue(date).slice(0, 10);
                })()
              : shiftDateValue(current.selectedDate, step * current.rangeDays),
      ),
    }));
  }

  const loadReport = useCallback(async () => {
    if (!identity) {
      setErrorMessage(t("error.loginRequired"));
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextReport = await fetchProducerSales({
        storeId: identity.storeId,
        producerId: identity.producerId,
        from: toOffsetDateTime(activeRange.from),
        to: toOffsetDateTime(activeRange.to),
      });
      setReport(nextReport);
    } catch (error) {
      setReport(null);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [activeRange.from, activeRange.to, identity]);

  useEffect(() => {
    if (!identity) {
      return;
    }
    void loadReport();
  }, [identity, loadReport]);

  return {
    form,
    identity,
    identityDraft,
    report,
    totals,
    sortedProducts,
    activeRange,
    errorMessage,
    isLoading,
    setIdentityDraft,
    setSelectedDate,
    setSelectedRange,
    handleIdentitySubmit,
    handleIdentityReset,
    applyQuickRange,
    shiftSelectedDate,
  };
}

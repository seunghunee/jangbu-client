import { FormEvent, useMemo, useState } from "react";
import { fetchProducerSales, type ProducerSalesResponse } from "../api";
import {
  getDefaultDateRange,
  getSalesTotals,
  sortProductsByGrossSales,
  toOffsetDateTime,
} from "../format";

type FormState = {
  selectedDate: string;
  rangeDays: number;
};

type IdentityState = {
  storeId: string;
  producerId: string;
};

const initialDateRange = getDefaultDateRange(new Date());
const IDENTITY_STORAGE_KEY = "jangbu.identity";

export const RANGE_OPTIONS = [
  { label: "Today", days: 1 },
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 },
] as const;

const initialFormState: FormState = {
  selectedDate: initialDateRange.to.slice(0, 10),
  rangeDays: 1,
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

function getRequestDateRange(form: FormState): { from: string; to: string } {
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
  return new Intl.DateTimeFormat("en-US", {
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
    setForm((current) => ({ ...current, selectedDate: value }));
  }

  function handleIdentitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextIdentity = {
      storeId: identityDraft.storeId.trim(),
      producerId: identityDraft.producerId.trim(),
    };

    if (!nextIdentity.storeId || !nextIdentity.producerId) {
      setErrorMessage("Store ID and Producer ID are required.");
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
    const today = toDateTimeLocalValue(new Date()).slice(0, 10);
    setForm((current) => ({
      ...current,
      selectedDate: today,
      rangeDays: days,
    }));
  }

  function shiftSelectedDate(deltaDays: number) {
    setForm((current) => ({
      ...current,
      selectedDate: shiftDateValue(current.selectedDate, deltaDays),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!identity) {
      setErrorMessage("Please log in first.");
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
  }

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
    handleIdentitySubmit,
    handleIdentityReset,
    applyQuickRange,
    shiftSelectedDate,
    handleSubmit,
  };
}

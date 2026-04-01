import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { fetchProducerSales, type ProducerSalesResponse } from "./api";
import {
  formatDateTimeLabel,
  formatInteger,
  formatKrw,
  getDefaultDateRange,
  getSalesTotals,
  sortProductsByGrossSales,
  toOffsetDateTime,
} from "./format";
import { DateFilterCard } from "./components/DateFilterCard";
import { LoginCard } from "./components/LoginCard";
import { ProductSalesList } from "./components/ProductSalesList";
import { ReportStats } from "./components/ReportStats";

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
const RANGE_OPTIONS = [
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

function toDateDisplayLabel(dateValue: string): string {
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
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

export function App() {
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
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = "Jangbu Client";
  }, []);

  const activeRange = useMemo(() => getRequestDateRange(form), [form]);

  function openDatePicker() {
    const picker = dateInputRef.current;
    if (!picker) {
      return;
    }
    if (picker.showPicker) {
      picker.showPicker();
      return;
    }
    picker.click();
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

  const totals = report ? getSalesTotals(report) : null;
  const sortedProducts = report ? sortProductsByGrossSales(report.products) : [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, sm: 3 },
        px: { xs: 1.5, sm: 2.5 },
        background:
          "radial-gradient(circle at top left, rgba(22,163,74,0.14), transparent 32%), radial-gradient(circle at top right, rgba(249,115,22,0.10), transparent 28%), linear-gradient(180deg, #f5f7fb 0%, #edf1f7 100%)",
      }}
    >
      <Container maxWidth="md" disableGutters>
        {!identity ? (
          <LoginCard
            identityDraft={identityDraft}
            onStoreIdChange={(value) => {
              setIdentityDraft((current) => ({ ...current, storeId: value }));
            }}
            onProducerIdChange={(value) => {
              setIdentityDraft((current) => ({ ...current, producerId: value }));
            }}
            onSubmit={handleIdentitySubmit}
          />
        ) : (
          <Stack spacing={1.5}>
            <Card>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={1.25}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Sales report
                  </Typography>
                  <Button variant="outlined" onClick={handleIdentityReset}>
                    Switch account
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <DateFilterCard
              selectedDateLabel={toDateDisplayLabel(form.selectedDate)}
              rangeDays={form.rangeDays}
              isLoading={isLoading}
              rangeOptions={RANGE_OPTIONS}
              onShiftDate={shiftSelectedDate}
              onOpenDatePicker={openDatePicker}
              onSelectRange={applyQuickRange}
              onSubmit={handleSubmit}
            />

            <input
              ref={dateInputRef}
              type="date"
              value={form.selectedDate}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
              onChange={(event) => {
                setForm((current) => ({
                  ...current,
                  selectedDate: event.target.value,
                }));
              }}
            />
          </Stack>
        )}

        {errorMessage ? <Alert severity="error" sx={{ mt: 1.5 }}>{errorMessage}</Alert> : null}

        {report && totals ? (
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <ReportStats
              totals={totals}
              reportFrom={report.from}
              reportTo={report.to}
              productCount={report.products.length}
              formatKrw={formatKrw}
              formatInteger={formatInteger}
              formatDateTimeLabel={formatDateTimeLabel}
            />

            <ProductSalesList
              products={sortedProducts}
              formatInteger={formatInteger}
              formatKrw={formatKrw}
            />
          </Stack>
        ) : (
          <Card sx={{ mt: 1.5 }}>
            <CardContent>
              <Typography align="center" color="text.secondary">
                {identity
                  ? `Selected period: ${formatDateTimeLabel(activeRange.from)} - ${formatDateTimeLabel(activeRange.to)}`
                  : "Log in with Store ID and Producer ID to begin."}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

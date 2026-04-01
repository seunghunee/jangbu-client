import { useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { formatDateTimeLabel, formatInteger, formatKrw } from "./format";
import {
  AppLayout,
  DateFilterCard,
  LoginCard,
  ProductSalesList,
  ReportStats,
} from "./components";
import { RANGE_OPTIONS, toDateDisplayLabel, useSalesReport } from "./hooks";

export function App() {
  const {
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
  } = useSalesReport();

  useEffect(() => {
    document.title = "Jangbu Client";
  }, []);

  return (
    <AppLayout>
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
            selectedDate={form.selectedDate}
            selectedDateLabel={toDateDisplayLabel(form.selectedDate)}
            rangeDays={form.rangeDays}
            isLoading={isLoading}
            rangeOptions={RANGE_OPTIONS}
            onShiftDate={shiftSelectedDate}
            onSelectedDateChange={setSelectedDate}
            onSelectRange={applyQuickRange}
            onSubmit={handleSubmit}
          />
        </Stack>
      )}

      {errorMessage ? (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {errorMessage}
        </Alert>
      ) : null}

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
    </AppLayout>
  );
}

import { useEffect } from "react";
import { Alert, Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { formatDateTimeLabel, formatInteger, formatKrw } from "./format";
import {
  AppLayout,
  DateFilterCard,
  LoginCard,
  ProductSalesList,
  ReportStats,
} from "./components";
import { getRangeOptions, useSalesReport } from "./hooks";
import { t } from "./i18n";

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
    setSelectedRange,
    handleIdentitySubmit,
    handleIdentityReset,
    applyQuickRange,
    shiftSelectedDate,
  } = useSalesReport();

  const rangeOptions = getRangeOptions();
  const selectedDateLabel =
    form.rangeDays === 1
      ? formatDateTimeLabel(activeRange.to)
      : `${formatDateTimeLabel(activeRange.from)} - ${formatDateTimeLabel(activeRange.to)}`;

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
        <Stack spacing={1}>
          <Box
            sx={{
              px: 0.5,
              py: 0.25,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 40px",
                alignItems: "center",
              }}
            >
              <IconButton
                size="small"
                onClick={handleIdentityReset}
                aria-label={t("app.switchAccount")}
                sx={{ width: 36, height: 36 }}
              >
                <ArrowBackRoundedIcon />
              </IconButton>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, textAlign: "center" }}
              >
                {t("app.salesReport")}
              </Typography>
              <Box sx={{ width: 36, height: 36 }} />
            </Box>
          </Box>

          <DateFilterCard
            selectedFromDate={activeRange.from.slice(0, 10)}
            selectedToDate={activeRange.to.slice(0, 10)}
            selectedDateLabel={selectedDateLabel}
            rangeDays={form.rangeDays}
            isLoading={isLoading}
            rangeOptions={rangeOptions}
            onShiftDate={(delta) => {
              shiftSelectedDate(delta * form.rangeDays);
            }}
            onSelectedRangeChange={setSelectedRange}
            onSelectRange={applyQuickRange}
          />
        </Stack>
      )}

      {errorMessage ? (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      ) : null}

      {report && totals ? (
        <Stack spacing={1} sx={{ mt: 1 }}>
          <ReportStats
            totals={totals}
            formatKrw={formatKrw}
            formatInteger={formatInteger}
          />

          <ProductSalesList
            products={sortedProducts}
            formatInteger={formatInteger}
            formatKrw={formatKrw}
          />
        </Stack>
      ) : null}
    </AppLayout>
  );
}

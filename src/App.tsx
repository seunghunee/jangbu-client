import { useEffect } from "react";
import { Alert, Box, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
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
      <Box sx={{ pb: identity ? { xs: 8.5, sm: 9.5 } : 0 }}>
        {!identity ? (
          <LoginCard
            identityDraft={identityDraft}
            onStoreIdChange={(value) => {
              setIdentityDraft((current) => ({ ...current, storeId: value }));
            }}
            onProducerIdChange={(value) => {
              setIdentityDraft((current) => ({
                ...current,
                producerId: value,
              }));
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
                shiftSelectedDate(delta);
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
      </Box>

      {identity ? (
        <Box
          component="footer"
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 30,
            backgroundColor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{ maxWidth: 900, mx: "auto", px: { xs: 1, sm: 2 }, py: 0.75 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                spacing={0.2}
                alignItems="center"
                sx={{ flex: 1, color: "text.secondary" }}
              >
                <HomeOutlinedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  {t("footer.home")}
                </Typography>
              </Stack>
              <Stack
                spacing={0.2}
                alignItems="center"
                sx={{ flex: 1, color: "primary.main" }}
              >
                <BarChartRoundedIcon fontSize="small" />
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.7rem", fontWeight: 700 }}
                >
                  {t("footer.sales")}
                </Typography>
              </Stack>
              <Stack
                spacing={0.2}
                alignItems="center"
                sx={{ flex: 1, color: "text.secondary" }}
              >
                <Inventory2OutlinedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  {t("footer.inventory")}
                </Typography>
              </Stack>
              <Stack
                spacing={0.2}
                alignItems="center"
                sx={{ flex: 1, color: "text.secondary" }}
              >
                <SettingsOutlinedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  {t("footer.settings")}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      ) : null}
    </AppLayout>
  );
}

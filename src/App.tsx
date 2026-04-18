import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  ButtonBase,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  formatPercent,
  formatDateRangeLabel,
  formatDateTimeLabel,
  formatInteger,
  formatKrw,
} from "./format";
import {
  AppLayout,
  BuyerSalesList,
  TotalsCard,
  DateFilterCard,
  HomeOverview,
  LoginCard,
  ProductSalesList,
} from "./components";
import { getRangeOptions, useSalesReport } from "./hooks";
import { t } from "./i18n";
import { buildMockSalesByBuyerReport } from "./mockSalesByBuyer";

type ActivePage = "home" | "salesByProduct" | "salesByBuyer";

type FooterNavItemProps = {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
};

function FooterNavItem({ active, label, onClick, icon }: FooterNavItemProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        flex: 1,
        py: 0.25,
        px: 0.4,
        borderRadius: 1,
        color: active ? "primary.main" : "text.secondary",
      }}
      aria-label={label}
    >
      <Stack spacing={0.2} alignItems="center" sx={{ width: "100%" }}>
        {icon}
        <Typography
          variant="caption"
          sx={{ fontSize: "0.7rem", fontWeight: active ? 700 : 500 }}
        >
          {label}
        </Typography>
      </Stack>
    </ButtonBase>
  );
}

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const {
    form,
    identity,
    identityDraft,
    report,
    totals,
    sortedProducts,
    activeRange,
    errorMessage,
    salesByBuyerErrorMessage,
    isLoading,
    salesByBuyerIsLoading,
    salesByBuyerReport,
    setIdentityDraft,
    setSelectedRange,
    handleIdentitySubmit,
    handleIdentityReset,
    applyQuickRange,
    shiftSelectedDate,
  } = useSalesReport(activePage);

  const rangeOptions = getRangeOptions();
  const now = new Date();
  const todayDateValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const disableForwardShift = activeRange.to.slice(0, 10) >= todayDateValue;
  const selectedDateLabel =
    form.rangeDays === 1
      ? formatDateTimeLabel(activeRange.to)
      : formatDateRangeLabel(activeRange.from, activeRange.to);
  const salesByBuyerPreviewReport = useMemo(
    () => buildMockSalesByBuyerReport(activeRange.from, activeRange.to),
    [activeRange.from, activeRange.to],
  );
  const topProductByPayout =
    salesByBuyerPreviewReport.topProductsByPayout[0] ?? null;
  const highestFundImpactType =
    [...salesByBuyerPreviewReport.buyerTypes].sort(
      (left, right) => right.fundTotalKrw - left.fundTotalKrw,
    )[0] ?? null;

  function toBuyerTypeLabel(type: string): string {
    switch (type) {
      case "retailer":
        return t("buyerType.retailer");
      case "unregistered_individual":
        return t("buyerType.unregisteredIndividual");
      case "unregistered_institution":
        return t("buyerType.unregisteredInstitution");
      case "producer":
        return t("buyerType.producer");
      case "staff":
        return t("buyerType.staff");
      default:
        return type;
    }
  }

  useEffect(() => {
    if (activePage === "home") {
      document.title = `Jangbu Client - ${t("app.home")}`;
      return;
    }
    document.title =
      activePage === "salesByProduct"
        ? `Jangbu Client - ${t("app.sales.byProduct")}`
        : `Jangbu Client - ${t("app.sales.byBuyer")}`;
  }, [activePage]);

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
                  {activePage === "salesByProduct"
                    ? t("app.sales.byProduct")
                    : activePage === "salesByBuyer"
                      ? t("app.sales.byBuyer")
                      : t("app.home")}
                </Typography>
                <Box sx={{ width: 36, height: 36 }} />
              </Box>
            </Box>

            <DateFilterCard
              selectedFromDate={activeRange.from.slice(0, 10)}
              selectedToDate={activeRange.to.slice(0, 10)}
              selectedDateLabel={selectedDateLabel}
              rangeDays={form.rangeDays}
              isLoading={isLoading || salesByBuyerIsLoading}
              disableForwardShift={disableForwardShift}
              rangeOptions={rangeOptions}
              onShiftDate={(delta) => {
                shiftSelectedDate(delta);
              }}
              onSelectedRangeChange={setSelectedRange}
              onSelectRange={applyQuickRange}
            />
          </Stack>
        )}

        {activePage === "salesByProduct" && errorMessage ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Alert>
        ) : null}

        {activePage === "salesByProduct" && report && totals ? (
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TotalsCard
              summary={totals}
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

        {activePage === "home" && identity ? (
          <>
            <Alert severity="info" sx={{ mt: 1 }}>
              {t("home.mockDataNote")}
            </Alert>
            <HomeOverview
              summary={salesByBuyerPreviewReport.summary}
              comparison={salesByBuyerPreviewReport.comparison}
              topProduct={topProductByPayout}
              highestFundImpactType={highestFundImpactType}
              formatKrw={formatKrw}
              formatPercent={formatPercent}
              buyerTypeLabel={toBuyerTypeLabel}
            />
          </>
        ) : null}

        {activePage === "salesByBuyer" && identity ? (
          <Stack spacing={1} sx={{ mt: 1 }}>
            {/* Simplified sales-by-buyer page: keep buyer list only */}
            {salesByBuyerErrorMessage ? (
              <Alert severity="error" sx={{ mt: 0 }}>
                {salesByBuyerErrorMessage}
              </Alert>
            ) : null}

            {salesByBuyerIsLoading && !salesByBuyerReport ? (
              <Alert severity="info" sx={{ mt: 0 }}>
                {t("date.loadingReport")}
              </Alert>
            ) : null}

            {salesByBuyerReport ? (
              <>
                <TotalsCard
                  summary={salesByBuyerReport.summary}
                  formatKrw={formatKrw}
                  formatInteger={formatInteger}
                />

                <BuyerSalesList
                  buyers={salesByBuyerReport.buyers}
                  buyerTypeLabel={toBuyerTypeLabel}
                  formatInteger={formatInteger}
                  formatKrw={formatKrw}
                />
              </>
            ) : null}
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
              <FooterNavItem
                active={activePage === "home"}
                label={t("footer.home")}
                onClick={() => {
                  setActivePage("home");
                }}
                icon={<HomeOutlinedIcon fontSize="small" />}
              />
              <FooterNavItem
                active={activePage === "salesByProduct"}
                label={t("footer.sales.byProduct")}
                onClick={() => {
                  setActivePage("salesByProduct");
                }}
                icon={<BarChartRoundedIcon fontSize="small" />}
              />
              <FooterNavItem
                active={activePage === "salesByBuyer"}
                label={t("footer.sales.byBuyer")}
                onClick={() => {
                  setActivePage("salesByBuyer");
                }}
                icon={<Inventory2OutlinedIcon fontSize="small" />}
              />
              <FooterNavItem
                active={false}
                label={t("footer.settings")}
                onClick={() => undefined}
                icon={<SettingsOutlinedIcon fontSize="small" />}
              />
            </Stack>
          </Box>
        </Box>
      ) : null}
    </AppLayout>
  );
}

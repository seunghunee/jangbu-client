import { useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
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
import { getRangeOptions, useSalesReport } from "./hooks";
import { getUILanguage, setUILanguage, t, type UILanguage } from "./i18n";
import { useState } from "react";

export function App() {
  const [language, setLanguage] = useState<UILanguage>(getUILanguage());

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

  function handleLanguageChange(
    _event: React.MouseEvent<HTMLElement>,
    nextLanguage: UILanguage | null,
  ) {
    if (!nextLanguage || nextLanguage === language) {
      return;
    }
    setUILanguage(nextLanguage);
    setLanguage(nextLanguage);
  }

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
          <Card>
            <CardContent
              sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
              >
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {t("app.salesReport")}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ToggleButtonGroup
                    size="small"
                    value={language}
                    exclusive
                    onChange={handleLanguageChange}
                    aria-label={t("app.language")}
                  >
                    <ToggleButton value="en" aria-label={t("app.langEnglish")}>
                      EN
                    </ToggleButton>
                    <ToggleButton value="ko" aria-label={t("app.langKorean")}>
                      KO
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Button variant="outlined" onClick={handleIdentityReset}>
                    {t("app.switchAccount")}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

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

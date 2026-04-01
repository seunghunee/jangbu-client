import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { t } from "../i18n";

type Totals = {
  grossSalesKrw: number;
  fundTotalKrw: number;
  payoutAmountKrw: number;
  soldQty: number;
};

type ReportStatsProps = {
  totals: Totals;
  reportFrom: string;
  reportTo: string;
  productCount: number;
  formatKrw: (value: number) => string;
  formatInteger: (value: number) => string;
  formatDateTimeLabel: (value: string) => string;
};

export function ReportStats({
  totals,
  reportFrom,
  reportTo,
  productCount,
  formatKrw,
  formatInteger,
  formatDateTimeLabel,
}: ReportStatsProps) {
  return (
    <>
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {t("stats.grossSales")}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatKrw(totals.grossSalesKrw)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {t("stats.fundTotal")}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatKrw(totals.fundTotalKrw)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {t("stats.payoutAmount")}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatKrw(totals.payoutAmountKrw)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                {t("stats.unitsSold")}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatInteger(totals.soldQty)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Box flex={1}>
              <Typography variant="overline" color="text.secondary">
                {t("report.period")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatDateTimeLabel(reportFrom)} -{" "}
                {formatDateTimeLabel(reportTo)}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="overline" color="text.secondary">
                {t("report.products")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatInteger(productCount)} {t("report.items")}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="overline" color="text.secondary">
                {t("report.session")}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {t("report.sessionTemporaryLogin")}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { t } from "../i18n";

type Totals = {
  grossSalesKrw: number;
  soldQty: number;
};

type ReportStatsProps = {
  totals: Totals;
  formatKrw: (value: number) => string;
  formatInteger: (value: number) => string;
};

export function ReportStats({
  totals,
  formatKrw,
  formatInteger,
}: ReportStatsProps) {
  return (
    <Grid container spacing={1.25}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent sx={{ py: 1, px: 1.5, "&:last-child": { pb: 1 } }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="overline" color="text.secondary">
                  {t("stats.unitsSold")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatInteger(totals.soldQty)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="overline" color="text.secondary">
                  {t("stats.grossSales")}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatKrw(totals.grossSalesKrw)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

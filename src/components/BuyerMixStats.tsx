import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import type { BuyerMixComparison, BuyerMixSummary } from "../mockBuyerMix";
import { t } from "../i18n";

type BuyerMixStatsProps = {
  summary: BuyerMixSummary;
  comparison: BuyerMixComparison;
  formatKrw: (value: number) => string;
  formatInteger: (value: number) => string;
  formatPercent: (value: number) => string;
};

function formatSignedPercent(
  value: number,
  formatPercent: (value: number) => string,
) {
  const abs = formatPercent(Math.abs(value));
  if (value > 0) {
    return `+${abs}`;
  }
  if (value < 0) {
    return `-${abs}`;
  }
  return abs;
}

export function BuyerMixStats({
  summary,
  comparison,
  formatKrw,
  formatInteger,
  formatPercent,
}: BuyerMixStatsProps) {
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
            <Stack spacing={0.2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("stats.grossSales")}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "secondary.main" }}
              >
                {formatKrw(summary.grossSalesKrw)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("buyerMix.changeVsPrevious")}:{" "}
                {formatSignedPercent(
                  comparison.delta.grossSalesPct,
                  formatPercent,
                )}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
            <Stack spacing={0.2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("stats.payoutAmount")}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {formatKrw(summary.payoutAmountKrw)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("buyerMix.changeVsPrevious")}:{" "}
                {formatSignedPercent(
                  comparison.delta.payoutAmountPct,
                  formatPercent,
                )}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
            <Stack spacing={0.2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("stats.unitsSold")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatInteger(summary.soldQty)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("buyerMix.previousPeriod")}:{" "}
                {formatInteger(comparison.previousSummary.soldQty)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
            <Stack spacing={0.2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("buyerMix.payoutRate")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatPercent(summary.payoutRate * 100)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("buyerMix.previousPeriod")}:{" "}
                {formatPercent(comparison.previousSummary.payoutRate * 100)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

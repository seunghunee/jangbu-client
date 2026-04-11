import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import type { BuyerTypeMetric } from "../mockBuyerMix";
import { t } from "../i18n";

type BuyerMixInsightsProps = {
  rows: BuyerTypeMetric[];
  formatKrw: (value: number) => string;
  formatPercent: (value: number) => string;
  buyerTypeLabel: (type: string) => string;
};

export function BuyerMixInsights({
  rows,
  formatKrw,
  formatPercent,
  buyerTypeLabel,
}: BuyerMixInsightsProps) {
  const bestPayoutRate = [...rows].sort(
    (left, right) => right.payoutRate - left.payoutRate,
  )[0];
  const highestFundImpact = [...rows].sort(
    (left, right) => right.fundTotalKrw - left.fundTotalKrw,
  )[0];

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ py: 1.1, px: 1.4, "&:last-child": { pb: 1.1 } }}>
            <Stack spacing={0.2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("buyerMix.bestPayoutQuality")}
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {bestPayoutRate
                  ? buyerTypeLabel(bestPayoutRate.buyerType)
                  : "-"}
              </Typography>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: 600 }}
              >
                {bestPayoutRate
                  ? `${formatPercent(bestPayoutRate.payoutRate * 100)} (${formatKrw(bestPayoutRate.payoutAmountKrw)})`
                  : "-"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Card>
          <CardContent sx={{ py: 1.1, px: 1.4, "&:last-child": { pb: 1.1 } }}>
            <Stack spacing={0.2}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("buyerMix.largestFundDrag")}
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {highestFundImpact
                  ? buyerTypeLabel(highestFundImpact.buyerType)
                  : "-"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {highestFundImpact
                  ? `${formatKrw(highestFundImpact.fundTotalKrw)} (${formatPercent(highestFundImpact.shareOfPayout * 100)} ${t("buyerMix.shareOfPayout")})`
                  : "-"}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

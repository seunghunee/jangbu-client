import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import type {
  BuyerMixComparison,
  BuyerMixSummary,
  BuyerTypeMetric,
  TopProductByPayout,
} from "../mockBuyerMix";
import { t } from "../i18n";

type HomeOverviewProps = {
  summary: BuyerMixSummary;
  comparison: BuyerMixComparison;
  topProduct: TopProductByPayout | null;
  highestFundImpactType: BuyerTypeMetric | null;
  formatKrw: (value: number) => string;
  formatPercent: (value: number) => string;
  buyerTypeLabel: (type: string) => string;
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

export function HomeOverview({
  summary,
  comparison,
  topProduct,
  highestFundImpactType,
  formatKrw,
  formatPercent,
  buyerTypeLabel,
}: HomeOverviewProps) {
  return (
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Card>
        <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 4 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("home.periodChange")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatSignedPercent(
                  comparison.delta.payoutAmountPct,
                  formatPercent,
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent sx={{ py: 1.1, px: 1.4, "&:last-child": { pb: 1.1 } }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("home.topProductByPayout")}
              </Typography>
              <Typography sx={{ fontWeight: 700, mt: 0.2 }}>
                {topProduct ? topProduct.productName : "-"}
              </Typography>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ fontWeight: 600 }}
              >
                {topProduct ? formatKrw(topProduct.payoutAmountKrw) : "-"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card>
            <CardContent sx={{ py: 1.1, px: 1.4, "&:last-child": { pb: 1.1 } }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("home.highestFundImpactType")}
              </Typography>
              <Typography sx={{ fontWeight: 700, mt: 0.2 }}>
                {highestFundImpactType
                  ? buyerTypeLabel(highestFundImpactType.buyerType)
                  : "-"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {highestFundImpactType
                  ? formatKrw(highestFundImpactType.fundTotalKrw)
                  : "-"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

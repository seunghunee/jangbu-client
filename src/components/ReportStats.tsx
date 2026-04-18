import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { t } from "../i18n";

type Totals = {
  grossSalesKrw: number;
  soldQty: number;
  payoutAmountKrw: number;
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                alignItems: "baseline",
                columnGap: 1.6,
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700 }}
              >
                {t("stats.total")}
              </Typography>

              <Stack
                direction="row"
                spacing={0.35}
                alignItems="baseline"
                sx={{ justifySelf: "end" }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatInteger(totals.soldQty)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("product.sold")}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={0.35}
                alignItems="baseline"
                sx={{ justifySelf: "end" }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "secondary.main" }}
                >
                  {formatKrw(totals.payoutAmountKrw)}
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

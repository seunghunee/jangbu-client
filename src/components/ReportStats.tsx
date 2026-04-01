import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

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
                Gross sales
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
                Fund total
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
                Payout amount
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
                Units sold
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
                Report period
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatDateTimeLabel(reportFrom)} -{" "}
                {formatDateTimeLabel(reportTo)}
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="overline" color="text.secondary">
                Products
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatInteger(productCount)} items
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="overline" color="text.secondary">
                Session
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Temporary login active
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

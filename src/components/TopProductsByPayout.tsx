import { Box, Stack, Typography } from "@mui/material";
import type { TopProductByPayout } from "../mockBuyerMix";
import { t } from "../i18n";

type TopProductsByPayoutProps = {
  rows: TopProductByPayout[];
  formatKrw: (value: number) => string;
  formatInteger: (value: number) => string;
};

export function TopProductsByPayout({
  rows,
  formatKrw,
  formatInteger,
}: TopProductsByPayoutProps) {
  return (
    <>
      <Typography variant="subtitle1" color="text.secondary" sx={{ px: 0.9 }}>
        {t("buyerMix.topProductsByPayout")}
      </Typography>
      <Box
        sx={{
          mt: 0.2,
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {rows.map((row, index) => (
          <Stack
            key={row.productId}
            direction="row"
            justifyContent="space-between"
            spacing={1}
            sx={{
              py: 1.15,
              px: 1.3,
              borderBottom: index < rows.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <Stack spacing={0.2} sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700 }}>
                {row.productName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatInteger(row.soldQty)} {t("product.sold")}
              </Typography>
            </Stack>
            <Stack spacing={0.2} sx={{ textAlign: "right", flexShrink: 0 }}>
              <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
                {formatKrw(row.payoutAmountKrw)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("stats.grossSales")}: {formatKrw(row.grossSalesKrw)}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Box>
    </>
  );
}

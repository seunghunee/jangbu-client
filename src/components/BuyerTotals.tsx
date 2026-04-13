import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Collapse,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { t } from "../i18n";
import type { BuyerMixSummary } from "../mockBuyerMix";

type BuyerTotalsProps = {
  summary: BuyerMixSummary;
  formatKrw: (v: number) => string;
  formatInteger: (v: number) => string;
};

export function BuyerTotals({
  summary,
  formatKrw,
  formatInteger,
}: BuyerTotalsProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent sx={{ py: 1, px: 1.5, "&:last-child": { pb: 1 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            alignItems: "baseline",
            columnGap: 1.6,
            cursor: "pointer",
          }}
          onClick={() => setExpanded((s) => !s)}
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
              {formatInteger(summary.soldQty)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("product.sold")}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={0.35}
            alignItems="baseline"
            sx={{ justifySelf: "end", cursor: "pointer" }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {formatKrw(summary.payoutAmountKrw)}
            </Typography>
            <ExpandMoreRoundedIcon
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                color: "text.secondary",
              }}
            />
          </Stack>

          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
            sx={{ gridColumn: "1 / -1", mt: 1 }}
          >
            <Box
              sx={{
                mt: 0.5,
                p: 1.1,
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontWeight: 700 }}
                  >
                    {t("stats.grossSales")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.primary", fontWeight: 700 }}
                  >
                    {formatKrw(summary.grossSalesKrw)}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    {t("buyerMix.fundDeduction")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 600 }}
                  >
                    -{formatKrw(summary.fundTotalKrw)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
}

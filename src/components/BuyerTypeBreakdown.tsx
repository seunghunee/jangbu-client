import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { BuyerTypeMetric } from "../mockBuyerMix";
import { t } from "../i18n";

type BuyerTypeBreakdownProps = {
  rows: BuyerTypeMetric[];
  formatKrw: (value: number) => string;
  formatInteger: (value: number) => string;
  formatPercent: (value: number) => string;
};

function toBuyerTypeLabel(type: string): string {
  switch (type) {
    case "retailer":
      return t("buyerType.retailer");
    case "unregistered_individual":
      return t("buyerType.unregisteredIndividual");
    case "unregistered_institution":
      return t("buyerType.unregisteredInstitution");
    case "producer":
      return t("buyerType.producer");
    case "staff":
      return t("buyerType.staff");
    default:
      return type;
  }
}

export function BuyerTypeBreakdown({
  rows,
  formatKrw,
  formatInteger,
  formatPercent,
}: BuyerTypeBreakdownProps) {
  return (
    <>
      <Typography variant="subtitle1" color="text.secondary" sx={{ px: 0.9 }}>
        {t("buyerMix.buyerTypeBreakdown")}
      </Typography>
      <Box
        sx={{
          mt: 0.2,
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <TableContainer sx={{ px: 0.8, py: 0.6 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("buyerMix.buyerType")}</TableCell>
                <TableCell align="right">{t("stats.unitsSold")}</TableCell>
                <TableCell align="right">{t("stats.payoutAmount")}</TableCell>
                <TableCell align="right">{t("buyerMix.payoutRate")}</TableCell>
                <TableCell align="right">
                  {t("buyerMix.shareOfPayout")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.buyerType}>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {toBuyerTypeLabel(row.buyerType)}
                  </TableCell>
                  <TableCell align="right">
                    {formatInteger(row.soldQty)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ whiteSpace: "nowrap", color: "primary.main" }}
                  >
                    {formatKrw(row.payoutAmountKrw)}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatPercent(row.payoutRate * 100)}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {formatPercent(row.shareOfPayout * 100)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

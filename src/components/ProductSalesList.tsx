import {
  Card,
  CardContent,
  Collapse,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { ProducerSalesProduct } from "../api";
import { t } from "../i18n";

type ProductSalesListProps = {
  products: ProducerSalesProduct[];
  formatInteger: (value: number) => string;
  formatKrw: (value: number) => string;
};

export function ProductSalesList({
  products,
  formatInteger,
  formatKrw,
}: ProductSalesListProps) {
  const [expandedProductIds, setExpandedProductIds] = useState<Set<string>>(
    () => new Set(),
  );

  function toggleExpanded(productId: string | number) {
    const key = String(productId);
    setExpandedProductIds((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <>
      <Typography variant="subtitle1" color="text.secondary" sx={{ px: 0.5 }}>
        {t("product.itemsHeading")} ({formatInteger(products.length)})
      </Typography>

      {products.map((product) => {
        const expanded = expandedProductIds.has(String(product.productId));

        return (
          <Card key={product.productId}>
            <CardContent sx={{ py: 1.1, px: 1.5, "&:last-child": { pb: 1.1 } }}>
              <Stack
                role="button"
                tabIndex={0}
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                spacing={0.75}
                onClick={() => {
                  toggleExpanded(product.productId);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleExpanded(product.productId);
                  }
                }}
                sx={{
                  mb: expanded ? 1 : 0,
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mt: 0.25, fontWeight: 700, flex: 1, minWidth: 0 }}
                >
                  {product.productName}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.25}
                  alignItems="baseline"
                  sx={{ ml: "auto", flexShrink: 0 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatInteger(product.soldQty)} {t("product.sold")}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {formatKrw(product.grossSalesKrw)}
                  </Typography>
                </Stack>
              </Stack>

              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <TableContainer
                  sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    pt: 0.25,
                  }}
                >
                  <Table
                    size="small"
                    sx={{
                      width: "100%",
                      tableLayout: "fixed",
                      "& .MuiTableCell-root": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            py: 0.5,
                            fontSize: "0.7rem",
                            fontWeight: 400,
                            color: "text.secondary",
                            letterSpacing: 0.2,
                          }}
                        >
                          {t("table.variant")}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 0.5,
                            whiteSpace: "nowrap",
                            fontSize: "0.7rem",
                            fontWeight: 400,
                            color: "text.secondary",
                            letterSpacing: 0.2,
                          }}
                        >
                          {t("table.sold")}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            py: 0.5,
                            whiteSpace: "nowrap",
                            fontSize: "0.7rem",
                            fontWeight: 400,
                            color: "text.secondary",
                            letterSpacing: 0.2,
                          }}
                        >
                          {t("table.grossSales")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.items.map((item) => (
                        <TableRow key={item.productVariantId}>
                          <TableCell
                            sx={{
                              overflowWrap: "anywhere",
                              wordBreak: "break-word",
                            }}
                          >
                            {item.productVariantName}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {formatInteger(item.soldQty)}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {formatKrw(item.grossSalesKrw)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

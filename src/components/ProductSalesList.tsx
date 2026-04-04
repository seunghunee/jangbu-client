import {
  Box,
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
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
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
      <Typography variant="subtitle1" color="text.secondary" sx={{ px: 0.9 }}>
        {t("product.itemsHeading")} ({formatInteger(products.length)})
      </Typography>

      <Box
        sx={{
          mt: 0.2,
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {products.map((product, index) => {
          const expanded = expandedProductIds.has(String(product.productId));
          const showDivider = expanded || index < products.length - 1;

          return (
            <Box key={product.productId}>
              <Stack
                role="button"
                tabIndex={0}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
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
                  px: 1.4,
                  py: 1.68,
                  borderBottom: showDivider ? "1px solid" : "none",
                  borderColor: "divider",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ fontWeight: 700, flex: 1, minWidth: 0 }}>
                  {product.productName}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.45}
                  alignItems="center"
                  sx={{ ml: "auto", flexShrink: 0 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatInteger(product.soldQty)} {t("product.sold")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    {formatKrw(product.grossSalesKrw)}
                  </Typography>
                  <ExpandMoreRoundedIcon
                    sx={{
                      fontSize: "1.1rem",
                      color: "text.secondary",
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 180ms ease",
                    }}
                  />
                </Stack>
              </Stack>

              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <TableContainer
                  sx={{
                    px: 1.4,
                    pb: 1,
                    borderBottom:
                      index < products.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
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
                            py: 0.45,
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
                            py: 0.45,
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
                            py: 0.45,
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
                            sx={{
                              whiteSpace: "nowrap",
                              color: "secondary.main",
                            }}
                          >
                            {formatKrw(item.grossSalesKrw)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

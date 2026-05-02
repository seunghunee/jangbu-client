import {
  Box,
  Collapse,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { ItemRow } from "./ItemRow";
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
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);

  function toggleExpanded(productId: string | number) {
    const key = String(productId);
    setExpandedProductIds((current) =>
      current.includes(key)
        ? current.filter((id) => id !== key)
        : [...current, key],
    );
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
          const expanded = expandedProductIds.includes(
            String(product.productId),
          );
          const showDivider = expanded || index < products.length - 1;

          return (
            <Box key={product.productId}>
              <Stack
                role="button"
                tabIndex={0}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0.8}
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
                  px: 1.0,
                  py: 1.1,
                  borderBottom: showDivider ? "1px solid" : "none",
                  borderColor: "divider",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#eef0e5",
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  {product.imageUrl ? (
                    <Box
                      component="img"
                      src={product.imageUrl}
                      alt=""
                      aria-hidden="true"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scale(1.08)",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Inventory2RoundedIcon sx={{ fontSize: "1.65rem" }} />
                  )}
                </Box>

                <Stack spacing={0.2} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.productName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.15 }}
                  >
                    {formatInteger(product.soldQty)} {t("product.sold")}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.45}
                  alignItems="center"
                  sx={{ ml: "auto", flexShrink: 0 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {formatKrw(product.payoutAmountKrw)}
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
                    px: 1.0,
                    pb: 0.8,
                    borderBottom:
                      index < products.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Table
                    size="small"
                    sx={{
                      width: "100%",
                      tableLayout: "auto",
                      "& .MuiTableCell-root": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    {/* header removed for a cleaner list layout */}
                    <TableBody>
                      {product.items.map((item) => (
                        <ItemRow
                          key={item.productVariantId}
                          id={item.productVariantId}
                          name={item.productVariantName}
                          imageUrl={item.imageUrl}
                          soldQty={item.soldQty}
                          payoutAmountKrw={item.payoutAmountKrw}
                          formatInteger={formatInteger}
                          formatKrw={formatKrw}
                          asTableRow
                        />
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

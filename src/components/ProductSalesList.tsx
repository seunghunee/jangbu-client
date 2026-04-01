import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { ProducerSalesProduct } from "../api";

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
  return (
    <>
      <Typography variant="subtitle1" color="text.secondary" sx={{ px: 0.5 }}>
        Sales items ({formatInteger(products.length)})
      </Typography>

      {products.map((product) => (
        <Card key={product.productId}>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "flex-start" }}
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Product
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.25, fontWeight: 700 }}>
                  {product.productName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {formatInteger(product.soldQty)} sold
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {formatKrw(product.grossSalesKrw)}
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={1} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Chip
                  label={`Fund total ${formatKrw(product.fundTotalKrw)}`}
                  variant="outlined"
                  sx={{ width: "100%", justifyContent: "flex-start" }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Chip
                  label={`Payout ${formatKrw(product.payoutAmountKrw)}`}
                  variant="outlined"
                  sx={{ width: "100%", justifyContent: "flex-start" }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Chip
                  label={`Variants ${formatInteger(product.items.length)}`}
                  variant="outlined"
                  sx={{ width: "100%", justifyContent: "flex-start" }}
                />
              </Grid>
            </Grid>

            <TableContainer
              sx={{
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Variant</TableCell>
                    <TableCell>Sold</TableCell>
                    <TableCell>Gross sales</TableCell>
                    <TableCell>Fund total</TableCell>
                    <TableCell>Payout</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.items.map((item) => (
                    <TableRow key={item.productVariantId}>
                      <TableCell>{item.productVariantName}</TableCell>
                      <TableCell>{formatInteger(item.soldQty)}</TableCell>
                      <TableCell>{formatKrw(item.grossSalesKrw)}</TableCell>
                      <TableCell>{formatKrw(item.fundTotalKrw)}</TableCell>
                      <TableCell>{formatKrw(item.payoutAmountKrw)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

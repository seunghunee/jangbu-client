import { Box, Stack, TableCell, TableRow, Typography } from "@mui/material";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import type { ReactElement } from "react";
import { t } from "../i18n";

export function getItemIcon(productVariantName: string) {
  const normalizedName = productVariantName.toLowerCase();

  switch (true) {
    case normalizedName.includes("tomato"):
      return LocalFloristRoundedIcon;
    case normalizedName.includes("potato"):
      return RestaurantRoundedIcon;
    case normalizedName.includes("apple"):
      return SpaRoundedIcon;
    case normalizedName.includes("cabbage"):
      return LocalFloristRoundedIcon;
    case normalizedName.includes("cucumber"):
      return SpaRoundedIcon;
    default:
      return LocalFloristRoundedIcon;
  }
}

type ItemRowProps = {
  id?: string | number;
  name: string;
  soldQty: number;
  payoutAmountKrw: number;
  formatInteger: (v: number) => string;
  formatKrw: (v: number) => string;
  asTableRow?: boolean;
};

export function ItemRow({
  id,
  name,
  soldQty,
  payoutAmountKrw,
  formatInteger,
  formatKrw,
  asTableRow = false,
}: ItemRowProps): ReactElement {
  const Icon = getItemIcon(name);

  if (asTableRow) {
    return (
      <TableRow
        key={id}
        sx={{
          "& .MuiTableCell-root": { borderBottom: "none", py: 0.8, px: 0 },
        }}
      >
        <TableCell sx={{ px: 0 }}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                bgcolor: "#eef0e5",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: "1.2rem" }} />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.15 }}
              >
                {formatInteger(soldQty)} {t("table.sold")}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell align="right">
          <Typography
            variant="body1"
            sx={{ color: "primary.main", fontWeight: 700, flexShrink: 0 }}
          >
            {formatKrw(payoutAmountKrw)}
          </Typography>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <Stack
      key={id}
      direction="row"
      alignItems="center"
      spacing={1.2}
      sx={{ py: 0.8 }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          bgcolor: "#eef0e5",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: "1.2rem" }} />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.15 }}>
          {formatInteger(soldQty)} {t("table.sold")}
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{ color: "primary.main", fontWeight: 700, flexShrink: 0 }}
      >
        {formatKrw(payoutAmountKrw)}
      </Typography>
    </Stack>
  );
}

export default ItemRow;

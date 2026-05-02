import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { Box, Stack, TableCell, TableRow, Typography } from "@mui/material";
import type { ReactElement } from "react";
import { t } from "../i18n";

type ItemRowProps = {
  id?: string | number;
  name: string;
  iconUrl?: string;
  soldQty: number;
  payoutAmountKrw: number;
  formatInteger: (v: number) => string;
  formatKrw: (v: number) => string;
  asTableRow?: boolean;
};

export function ItemRow({
  id,
  name,
  iconUrl,
  soldQty,
  payoutAmountKrw,
  formatInteger,
  formatKrw,
  asTableRow = false,
}: ItemRowProps): ReactElement {
  const hasIconUrl = Boolean(iconUrl);

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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {hasIconUrl ? (
                <Box
                  component="img"
                  src={iconUrl}
                  alt=""
                  aria-hidden="true"
                  sx={{
                    width: 24,
                    height: 24,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <Inventory2RoundedIcon sx={{ fontSize: "1.25rem" }} />
              )}
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {hasIconUrl ? (
          <Box
            component="img"
            src={iconUrl}
            alt=""
            aria-hidden="true"
            sx={{
              width: 24,
              height: 24,
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <Inventory2RoundedIcon sx={{ fontSize: "1.25rem" }} />
        )}
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

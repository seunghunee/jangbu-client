import { useMemo, useState } from "react";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import {
  Box,
  Chip,
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
import type { BuyerSalesRow } from "../mockBuyerMix";
import { t } from "../i18n";

type BuyerSalesListProps = {
  buyers: BuyerSalesRow[];
  buyerTypeLabel: (type: string) => string;
  formatInteger: (value: number) => string;
  formatKrw: (value: number) => string;
};

type BuyerFilter = "all" | string;

function getBuyerTypeIcon(type: string) {
  switch (type) {
    case "retailer":
      return StorefrontRoundedIcon;
    case "unregistered_institution":
      return ApartmentRoundedIcon;
    case "unregistered_individual":
      return PersonRoundedIcon;
    case "producer":
      return AgricultureRoundedIcon;
    case "staff":
      return WorkRoundedIcon;
    default:
      return StorefrontRoundedIcon;
  }
}

export function BuyerSalesList({
  buyers,
  buyerTypeLabel,
  formatInteger,
  formatKrw,
}: BuyerSalesListProps) {
  const [activeFilter, setActiveFilter] = useState<BuyerFilter>("all");
  const [expandedBuyerId, setExpandedBuyerId] = useState<string | null>(null);

  const availableTypes = useMemo(
    () => [...new Set(buyers.map((buyer) => buyer.buyerType))],
    [buyers],
  );

  const visibleBuyers = useMemo(() => {
    if (activeFilter === "all") {
      return buyers;
    }
    return buyers.filter((buyer) => buyer.buyerType === activeFilter);
  }, [activeFilter, buyers]);

  return (
    <>
      <Typography variant="subtitle1" color="text.secondary" sx={{ px: 0.9 }}>
        {t("buyerMix.buyersHeading")} ({formatInteger(visibleBuyers.length)})
      </Typography>

      <Stack
        direction="row"
        spacing={0.6}
        useFlexGap
        flexWrap="wrap"
        sx={{ px: 0.7 }}
      >
        <Chip
          clickable
          size="small"
          label={t("buyerMix.allTypes")}
          color={activeFilter === "all" ? "primary" : "default"}
          icon={<StorefrontRoundedIcon sx={{ fontSize: "1rem" }} />}
          onClick={() => {
            setActiveFilter("all");
            setExpandedBuyerId(null);
          }}
        />
        {availableTypes.map((type) => {
          const BuyerTypeIcon = getBuyerTypeIcon(type);
          return (
            <Chip
              key={type}
              clickable
              size="small"
              label={buyerTypeLabel(type)}
              color={activeFilter === type ? "primary" : "default"}
              icon={<BuyerTypeIcon sx={{ fontSize: "1rem" }} />}
              onClick={() => {
                setActiveFilter(type);
                setExpandedBuyerId(null);
              }}
            />
          );
        })}
      </Stack>

      <Box
        sx={{
          mt: 0.5,
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {visibleBuyers.map((buyer, index) => {
          const expanded = expandedBuyerId === buyer.buyerId;
          const showDivider = expanded || index < visibleBuyers.length - 1;
          const BuyerTypeIcon = getBuyerTypeIcon(buyer.buyerType);

          return (
            <Box key={buyer.buyerId}>
              <Stack
                role="button"
                tabIndex={0}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={0.8}
                onClick={() => {
                  setExpandedBuyerId((current) =>
                    current === buyer.buyerId ? null : buyer.buyerId,
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpandedBuyerId((current) =>
                      current === buyer.buyerId ? null : buyer.buyerId,
                    );
                  }
                }}
                sx={{
                  px: 1.35,
                  py: 1.5,
                  borderBottom: showDivider ? "1px solid" : "none",
                  borderColor: "divider",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                >
                  <BuyerTypeIcon sx={{ fontSize: "1rem" }} />
                </Box>
                <Stack spacing={0.2} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {buyer.buyerName}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  spacing={1.45}
                  alignItems="center"
                  sx={{ ml: "auto", flexShrink: 0 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatInteger(buyer.soldQty)} {t("table.sold")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {formatKrw(buyer.payoutAmountKrw)}
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
                <Box
                  sx={{
                    px: 1.35,
                    pb: 1,
                    borderBottom:
                      index < visibleBuyers.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mt: 0.65, mb: 0.8 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("table.grossSales")}{" "}
                      <Box
                        component="span"
                        sx={{ color: "secondary.main", fontWeight: 600 }}
                      >
                        {formatKrw(buyer.grossSalesKrw)}
                      </Box>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "right" }}
                    >
                      {t("table.fundTotal")} -{formatKrw(buyer.fundTotalKrw)}
                    </Typography>
                  </Stack>
                  <TableContainer sx={{ mt: 0.4 }}>
                    <Table
                      size="small"
                      sx={{
                        width: "100%",
                        tableLayout: "fixed",
                        "& .MuiTableCell-root": { borderBottom: "none" },
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
                            {t("table.item")}
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
                          <TableCell align="right">
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                py: 0.45,
                                whiteSpace: "nowrap",
                                fontSize: "0.7rem",
                                fontWeight: 400,
                                color: "text.secondary",
                                letterSpacing: 0.2,
                              }}
                            >
                              {t("table.payout")}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {buyer.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell
                              sx={{
                                overflowWrap: "anywhere",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.itemName}
                            </TableCell>
                            <TableCell align="right">
                              {formatInteger(item.soldQty)}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ color: "primary.main", fontWeight: 600 }}
                            >
                              {formatKrw(item.payoutAmountKrw)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

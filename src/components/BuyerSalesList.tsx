import { useMemo, useState } from "react";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import { Box, Chip, Collapse, Stack, Typography } from "@mui/material";
import { ItemRow } from "./ItemRow";
import type { BuyerSalesRow } from "../mockSalesByBuyer";
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
  // allow multiple buyers to be expanded at once
  const [expandedBuyerIds, setExpandedBuyerIds] = useState<string[]>([]);

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
        {t("pages.sales.byBuyer.buyersHeading")} (
        {formatInteger(visibleBuyers.length)})
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
          label={t("pages.sales.byBuyer.allTypes")}
          color={activeFilter === "all" ? "primary" : "default"}
          onClick={() => {
            setActiveFilter("all");
            setExpandedBuyerIds([]);
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
              icon={<BuyerTypeIcon sx={{ fontSize: "1.25rem" }} />}
              onClick={() => {
                setActiveFilter(type);
                setExpandedBuyerIds([]);
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
          const expanded = expandedBuyerIds.includes(buyer.buyerId);
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
                  setExpandedBuyerIds((current) =>
                    current.includes(buyer.buyerId)
                      ? current.filter((id) => id !== buyer.buyerId)
                      : [...current, buyer.buyerId],
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpandedBuyerIds((current) =>
                      current.includes(buyer.buyerId)
                        ? current.filter((id) => id !== buyer.buyerId)
                        : [...current, buyer.buyerId],
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
                  <BuyerTypeIcon sx={{ fontSize: "1.25rem" }} />
                </Box>
                <Stack spacing={0.2} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {buyer.buyerName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.15 }}
                  >
                    {formatInteger(buyer.soldQty)} {t("table.sold")}
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
                    pb: 1.2,
                    borderBottom:
                      index < visibleBuyers.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <Stack spacing={0.2} sx={{ mt: 0.7 }}>
                    {buyer.items.map((item) => (
                      <ItemRow
                        key={item.productVariantId}
                        id={item.productVariantId}
                        name={item.productVariantName}
                        soldQty={item.soldQty}
                        payoutAmountKrw={item.payoutAmountKrw}
                        formatInteger={formatInteger}
                        formatKrw={formatKrw}
                      />
                    ))}
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </>
  );
}

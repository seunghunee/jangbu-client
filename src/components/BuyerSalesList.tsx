import { useMemo, useState } from "react";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import { Box, Chip, Collapse, Stack, Typography } from "@mui/material";
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

function getItemIcon(productVariantName: string) {
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

function getVariantBaseName(productVariantName: string) {
  const match = productVariantName.match(/^[A-Za-z]+(?: [A-Za-z]+)*/);
  if (!match) {
    return productVariantName;
  }

  return match[0];
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
              icon={<BuyerTypeIcon sx={{ fontSize: "1.25rem" }} />}
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
                  <Box
                    sx={{
                      mt: 0.7,
                      p: 1.2,
                      borderRadius: 1,
                      bgcolor: "background.paper",
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                        alignItems="center"
                      >
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: 700 }}
                        >
                          {t("table.grossSales")}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.primary", fontWeight: 700 }}
                        >
                          {formatKrw(buyer.grossSalesKrw)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
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
                          -{formatKrw(buyer.fundTotalKrw)}
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          borderTop: "1px solid",
                          borderColor: "divider",
                          opacity: 0.65,
                        }}
                      />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                        alignItems="center"
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800, color: "text.primary" }}
                        >
                          {t("buyerMix.totalNetSales")}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ color: "primary.main", fontWeight: 800 }}
                        >
                          {formatKrw(buyer.payoutAmountKrw)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>

                  <Stack spacing={0.2}>
                    {buyer.items.map((item) => {
                      const ItemIcon = getItemIcon(item.productVariantName);

                      return (
                        <Stack
                          key={item.productVariantId}
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
                            <ItemIcon sx={{ fontSize: "1.2rem" }} />
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              sx={{ fontWeight: 700, lineHeight: 1.2 }}
                            >
                              {item.productVariantName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.15 }}
                            >
                              {formatInteger(item.soldQty)} {t("table.sold")}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "primary.main",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {formatKrw(item.payoutAmountKrw)}
                          </Typography>
                        </Stack>
                      );
                    })}
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

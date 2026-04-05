import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { lazy, Suspense, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { getUILanguage, t } from "../i18n";

const loadLazyDatePickerDialog = () =>
  import("./LazyDatePickerDialog").then((module) => ({
    default: module.LazyDatePickerDialog,
  }));

const LazyDatePickerDialog = lazy(loadLazyDatePickerDialog);

type DateFilterCardProps = {
  selectedFromDate: string;
  selectedToDate: string;
  selectedDateLabel: string;
  rangeDays: number;
  isLoading: boolean;
  disableForwardShift: boolean;
  rangeOptions: ReadonlyArray<{ label: string; days: number }>;
  onShiftDate: (delta: number) => void;
  onSelectedRangeChange: (fromDate: string, toDate: string) => void;
  onSelectRange: (days: number) => void;
};

export function DateFilterCard({
  selectedFromDate,
  selectedToDate,
  selectedDateLabel,
  rangeDays,
  isLoading,
  disableForwardShift,
  rangeOptions,
  onShiftDate,
  onSelectedRangeChange,
  onSelectRange,
}: DateFilterCardProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const adapterLocale = getUILanguage() === "ko" ? "ko" : "en";

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function warmDatePickerChunk() {
    void loadLazyDatePickerDialog();
  }

  return (
    <Card sx={{ border: "none" }}>
      <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
        <Stack spacing={1.15}>
          <Box
            sx={(theme) => ({
              border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
              backgroundColor: alpha(theme.palette.background.default, 0.56),
              borderRadius: 3,
              px: 1,
              py: 0.85,
            })}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <IconButton
                size="small"
                onClick={() => onShiftDate(-1)}
                disabled={isLoading}
                aria-label={t("date.prevDay")}
                sx={{ width: 38, height: 38, color: "primary.main" }}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>
              <Button
                variant="text"
                fullWidth
                onClick={openDatePicker}
                onMouseEnter={warmDatePickerChunk}
                onFocus={warmDatePickerChunk}
                onTouchStart={warmDatePickerChunk}
                disabled={isLoading}
                sx={{
                  justifyContent: "center",
                  display: "grid",
                  minHeight: 42,
                  py: 0.45,
                  color: "text.primary",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.66rem",
                    fontWeight: 400,
                    color: "text.secondary",
                    lineHeight: 1.2,
                  }}
                >
                  {t("date.queryPeriod")}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: "1.08rem", sm: "1.14rem" },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selectedDateLabel}
                </Typography>
              </Button>
              <IconButton
                size="small"
                onClick={() => onShiftDate(1)}
                disabled={isLoading || disableForwardShift}
                aria-label={t("date.nextDay")}
                sx={{ width: 38, height: 38, color: "primary.main" }}
              >
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>
          </Box>

          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {rangeOptions.map((option) => (
              <Button
                key={option.days}
                variant={rangeDays === option.days ? "contained" : "outlined"}
                color={rangeDays === option.days ? "primary" : "inherit"}
                onClick={() => onSelectRange(option.days)}
                disabled={isLoading}
                sx={{ minHeight: 38, px: 1.55 }}
              >
                {option.label}
              </Button>
            ))}
          </Stack>

          {isDatePickerOpen ? (
            <Suspense fallback={null}>
              <LazyDatePickerDialog
                open={isDatePickerOpen}
                selectedFromDate={selectedFromDate}
                selectedToDate={selectedToDate}
                adapterLocale={adapterLocale}
                onClose={() => setIsDatePickerOpen(false)}
                onSelectRange={(fromDate, toDate) => {
                  onSelectedRangeChange(fromDate, toDate);
                  setIsDatePickerOpen(false);
                }}
              />
            </Suspense>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

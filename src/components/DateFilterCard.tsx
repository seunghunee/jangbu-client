import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { lazy, Suspense, useRef, useState } from "react";
import { Button, Card, CardContent, Stack } from "@mui/material";
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
  rangeOptions,
  onShiftDate,
  onSelectedRangeChange,
  onSelectRange,
}: DateFilterCardProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement | null>(null);
  const adapterLocale = getUILanguage() === "ko" ? "ko" : "en";

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function warmDatePickerChunk() {
    void loadLazyDatePickerDialog();
  }

  return (
    <Card>
      <CardContent sx={{ py: 1.25, px: 1.5, "&:last-child": { pb: 1.25 } }}>
        <Stack spacing={1.1}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => onShiftDate(-1)}
              disabled={isLoading}
              sx={{ minWidth: 42, px: 0 }}
              aria-label={t("date.prevDay")}
            >
              <ChevronLeftRoundedIcon />
            </Button>
            <Button
              ref={dateButtonRef}
              variant="outlined"
              fullWidth
              onClick={openDatePicker}
              onMouseEnter={warmDatePickerChunk}
              onFocus={warmDatePickerChunk}
              onTouchStart={warmDatePickerChunk}
              disabled={isLoading}
              sx={{ justifyContent: "center" }}
            >
              {selectedDateLabel}
            </Button>
            <Button
              variant="outlined"
              onClick={() => onShiftDate(1)}
              disabled={isLoading}
              sx={{ minWidth: 42, px: 0 }}
              aria-label={t("date.nextDay")}
            >
              <ChevronRightRoundedIcon />
            </Button>
          </Stack>

          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {rangeOptions.map((option) => (
              <Button
                key={option.days}
                variant={rangeDays === option.days ? "contained" : "outlined"}
                color={rangeDays === option.days ? "secondary" : "inherit"}
                onClick={() => onSelectRange(option.days)}
                disabled={isLoading}
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
                anchorEl={dateButtonRef.current}
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

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { t } from "../i18n";

type DateFilterCardProps = {
  selectedDate: string;
  selectedDateLabel: string;
  rangeDays: number;
  isLoading: boolean;
  rangeOptions: ReadonlyArray<{ label: string; days: number }>;
  onShiftDate: (delta: number) => void;
  onSelectedDateChange: (value: string) => void;
  onSelectRange: (days: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function DateFilterCard({
  selectedDate,
  selectedDateLabel,
  rangeDays,
  isLoading,
  rangeOptions,
  onShiftDate,
  onSelectedDateChange,
  onSelectRange,
  onSubmit,
}: DateFilterCardProps) {
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  function openDatePicker() {
    const picker = dateInputRef.current;
    if (!picker) {
      return;
    }
    if (picker.showPicker) {
      picker.showPicker();
      return;
    }
    picker.click();
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700 }}
          >
            {t("date.queryPeriod")}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => onShiftDate(-1)}
              sx={{ minWidth: 42, px: 0 }}
              aria-label={t("date.prevDay")}
            >
              <ChevronLeftRoundedIcon />
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={openDatePicker}
              sx={{ justifyContent: "center" }}
            >
              {selectedDateLabel}
            </Button>
            <Button
              variant="outlined"
              onClick={() => onShiftDate(1)}
              sx={{ minWidth: 42, px: 0 }}
              aria-label={t("date.nextDay")}
            >
              <ChevronRightRoundedIcon />
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {rangeOptions.map((option) => (
              <Button
                key={option.days}
                variant={rangeDays === option.days ? "contained" : "outlined"}
                color={rangeDays === option.days ? "secondary" : "inherit"}
                onClick={() => onSelectRange(option.days)}
              >
                {option.label}
              </Button>
            ))}
            <Button variant="outlined" onClick={openDatePicker}>
              {t("date.pickDate")}
            </Button>
          </Stack>

          <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
            onChange={(event) => {
              onSelectedDateChange(event.target.value);
            }}
          />

          <Box component="form" onSubmit={onSubmit}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isLoading}
            >
              {isLoading ? t("date.loadingReport") : t("date.loadSales")}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

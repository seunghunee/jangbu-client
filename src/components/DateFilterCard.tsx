import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

type DateFilterCardProps = {
  selectedDateLabel: string;
  rangeDays: number;
  isLoading: boolean;
  rangeOptions: ReadonlyArray<{ label: string; days: number }>;
  onShiftDate: (delta: number) => void;
  onOpenDatePicker: () => void;
  onSelectRange: (days: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function DateFilterCard({
  selectedDateLabel,
  rangeDays,
  isLoading,
  rangeOptions,
  onShiftDate,
  onOpenDatePicker,
  onSelectRange,
  onSubmit,
}: DateFilterCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ fontWeight: 700 }}
          >
            Query period
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => onShiftDate(-1)}
              sx={{ minWidth: 42, px: 0 }}
              aria-label="Previous day"
            >
              <ChevronLeftRoundedIcon />
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={onOpenDatePicker}
              sx={{ justifyContent: "center" }}
            >
              {selectedDateLabel}
            </Button>
            <Button
              variant="outlined"
              onClick={() => onShiftDate(1)}
              sx={{ minWidth: 42, px: 0 }}
              aria-label="Next day"
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
            <Button variant="outlined" onClick={onOpenDatePicker}>
              Pick date
            </Button>
          </Stack>

          <Box component="form" onSubmit={onSubmit}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isLoading}
            >
              {isLoading ? "Loading report..." : "Load sales"}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

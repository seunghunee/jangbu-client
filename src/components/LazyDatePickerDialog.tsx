import { useEffect, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { ClickAwayListener, Paper, Popper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type LazyDatePickerDialogProps = {
  open: boolean;
  selectedFromDate: string;
  selectedToDate: string;
  adapterLocale: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelectRange: (fromDate: string, toDate: string) => void;
};

export function LazyDatePickerDialog({
  open,
  selectedFromDate,
  selectedToDate,
  adapterLocale,
  anchorEl,
  onClose,
  onSelectRange,
}: LazyDatePickerDialogProps) {
  const [draftFrom, setDraftFrom] = useState<Dayjs | null>(null);
  const [draftTo, setDraftTo] = useState<Dayjs | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setDraftFrom(dayjs(selectedFromDate));
    setDraftTo(dayjs(selectedToDate));
    setHoveredDay(null);
  }, [open, selectedFromDate, selectedToDate]);

  const calendarValue = draftTo ?? draftFrom;

  const previewEnd =
    draftFrom &&
    !draftTo &&
    hoveredDay &&
    !hoveredDay.isBefore(draftFrom, "day")
      ? hoveredDay
      : draftTo;

  function handleSelectDate(value: Dayjs | null) {
    if (!value || !value.isValid()) {
      return;
    }

    if (!draftFrom || draftTo) {
      setDraftFrom(value);
      setDraftTo(null);
      setHoveredDay(null);
      return;
    }

    if (value.isBefore(draftFrom, "day")) {
      setDraftFrom(value);
      setDraftTo(null);
      setHoveredDay(null);
      return;
    }

    setDraftTo(value);
    onSelectRange(draftFrom.format("YYYY-MM-DD"), value.format("YYYY-MM-DD"));
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
    >
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Paper
            elevation={8}
            sx={{
              mt: 1,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              width: 340,
              maxWidth: "calc(100vw - 16px)",
              overflow: "hidden",
            }}
          >
            <DateCalendar
              value={calendarValue}
              onChange={handleSelectDate}
              sx={{
                px: 1,
                "& .MuiDayCalendar-weekContainer": {
                  gap: 0,
                },
                "& .MuiPickersDay-root": {
                  margin: 0,
                },
              }}
              slots={{ day: PickersDay }}
              slotProps={{
                day: (ownerState) => {
                  const day = ownerState.day as Dayjs;
                  const hasRange = Boolean(draftFrom && previewEnd);
                  const isStart = Boolean(
                    draftFrom && day.isSame(draftFrom, "day"),
                  );
                  const isEnd = Boolean(
                    previewEnd && day.isSame(previewEnd, "day"),
                  );
                  const isInRange = Boolean(
                    hasRange &&
                    draftFrom &&
                    previewEnd &&
                    (day.isAfter(draftFrom, "day") ||
                      day.isSame(draftFrom, "day")) &&
                    (day.isBefore(previewEnd, "day") ||
                      day.isSame(previewEnd, "day")),
                  );

                  return {
                    onMouseEnter: () => {
                      if (draftFrom && !draftTo) {
                        setHoveredDay(day);
                      }
                    },
                    onFocus: () => {
                      if (draftFrom && !draftTo) {
                        setHoveredDay(day);
                      }
                    },
                    sx: {
                      borderRadius: 0,
                      mx: 0,
                      ...(isInRange &&
                        !isStart &&
                        !isEnd && {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.14),
                        }),
                      ...(isStart && {
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        backgroundImage: !isEnd
                          ? (theme) =>
                              `linear-gradient(to right, transparent 50%, ${alpha(theme.palette.primary.main, 0.14)} 50%)`
                          : undefined,
                      }),
                      ...(isEnd && {
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        backgroundImage: !isStart
                          ? (theme) =>
                              `linear-gradient(to left, transparent 50%, ${alpha(theme.palette.primary.main, 0.14)} 50%)`
                          : undefined,
                      }),
                      "&:hover": {
                        ...(isInRange &&
                          !isStart &&
                          !isEnd && {
                            backgroundColor: (theme) =>
                              alpha(theme.palette.primary.main, 0.2),
                          }),
                        ...(isStart || isEnd
                          ? {
                              backgroundColor: "primary.dark",
                              ...(isStart && !isEnd
                                ? {
                                    backgroundImage: (theme) =>
                                      `linear-gradient(to right, transparent 50%, ${alpha(theme.palette.primary.main, 0.2)} 50%)`,
                                  }
                                : {}),
                              ...(isEnd && !isStart
                                ? {
                                    backgroundImage: (theme) =>
                                      `linear-gradient(to left, transparent 50%, ${alpha(theme.palette.primary.main, 0.2)} 50%)`,
                                  }
                                : {}),
                            }
                          : {}),
                      },
                    },
                  };
                },
              }}
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </LocalizationProvider>
  );
}

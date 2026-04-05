import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Dialog, DialogContent } from "@mui/material";
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
  onClose: () => void;
  onSelectRange: (fromDate: string, toDate: string) => void;
};

export function LazyDatePickerDialog({
  open,
  selectedFromDate,
  selectedToDate,
  adapterLocale,
  onClose,
  onSelectRange,
}: LazyDatePickerDialogProps) {
  const [draftFrom, setDraftFrom] = useState<Dayjs | null>(null);
  const [draftTo, setDraftTo] = useState<Dayjs | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Dayjs | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Dayjs | null>(null);
  const today = useMemo(() => dayjs().startOf("day"), []);

  function clampToToday(value: Dayjs | null): Dayjs | null {
    if (!value || !value.isValid()) {
      return null;
    }
    return value.isAfter(today, "day") ? today : value;
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    const clampedFrom = clampToToday(dayjs(selectedFromDate));
    const clampedTo = clampToToday(dayjs(selectedToDate));

    setDraftFrom(clampedFrom);
    setDraftTo(clampedTo);
    setVisibleMonth((clampedTo ?? clampedFrom ?? today).startOf("month"));
    setHoveredDay(null);
  }, [open, selectedFromDate, selectedToDate, today]);

  const monthAnchor = visibleMonth ?? today;
  const calendarValue =
    draftTo ??
    (draftFrom && draftFrom.isSame(monthAnchor, "month")
      ? draftFrom
      : monthAnchor);

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

    if (value.isAfter(today, "day")) {
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
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            width: 340,
            maxWidth: "calc(100vw - 16px)",
            overflow: "hidden",
            m: 1,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            "&:last-child": { pb: 0 },
          }}
        >
          <DateCalendar
            value={calendarValue}
            onChange={handleSelectDate}
            onMonthChange={(month) => {
              setVisibleMonth(month.startOf("month"));
            }}
            maxDate={today}
            showDaysOutsideCurrentMonth
            sx={{
              px: 1,
              "& .MuiDayCalendar-weekContainer": {
                gap: 0,
              },
              "& .MuiPickersDay-root": {
                margin: 0,
              },
              "& .MuiPickersDay-root.MuiPickersDay-dayOutsideMonth": {
                color: "text.disabled",
                opacity: 0.58,
              },
            }}
            slots={{ day: PickersDay }}
            slotProps={{
              day: (ownerState) => {
                const day = ownerState.day as Dayjs;
                const isDisabled = Boolean(
                  (ownerState as { disabled?: boolean }).disabled,
                );
                const isOutsideMonth = Boolean(
                  (ownerState as { outsideCurrentMonth?: boolean })
                    .outsideCurrentMonth ??
                  (calendarValue
                    ? day.month() !== calendarValue.month()
                    : false),
                );
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
                    ...(!isOutsideMonth &&
                      !isDisabled && {
                        color: "text.primary",
                        opacity: 1,
                      }),
                    ...(isOutsideMonth &&
                      !isDisabled &&
                      !isStart &&
                      !isEnd && {
                        color: "text.disabled",
                        opacity: 0.7,
                      }),
                    ...(isInRange &&
                      !isStart &&
                      !isEnd && {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.16),
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
                            alpha(theme.palette.primary.main, 0.22),
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
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}

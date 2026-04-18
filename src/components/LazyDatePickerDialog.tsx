import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Dialog, DialogContent, Box, Button, Typography } from "@mui/material";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { t, getUILocale } from "../i18n";

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
    if (!value || !value.isValid()) return null;
    return value.isAfter(today, "day") ? today : value;
  }

  useEffect(() => {
    if (!open) return;
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
    if (!value || !value.isValid()) return;
    if (value.isAfter(today, "day")) return;

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
  }

  const pillFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(getUILocale(), {
        month: "short",
        day: "numeric",
      });
    } catch {
      return new Intl.DateTimeFormat(undefined as any, {
        month: "short",
        day: "numeric",
      });
    }
  }, [adapterLocale]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
    >
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              width: 340,
              maxWidth: "calc(100vw - 16px)",
              overflow: "hidden",
              m: 1,
            },
          },
        }}
      >
        <DialogContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <DateCalendar
            value={calendarValue}
            onChange={(v) => handleSelectDate(v as Dayjs | null)}
            onMonthChange={(month: Dayjs) =>
              setVisibleMonth(month.startOf("month"))
            }
            maxDate={today}
            showDaysOutsideCurrentMonth
            slots={{ day: PickersDay }}
            slotProps={{
              day: (ownerState: any) => {
                try {
                  const raw = ownerState?.day;
                  if (!raw) return {};

                  const d = dayjs(raw).startOf("day");
                  const end = (draftTo ?? previewEnd) as Dayjs | null;

                  const isStart = !!(draftFrom && d.isSame(draftFrom, "day"));
                  const isEnd = !!(end && d.isSame(end, "day"));
                  const isBetween = !!(
                    draftFrom &&
                    end &&
                    d.isAfter(draftFrom, "day") &&
                    d.isBefore(end, "day")
                  );

                  const sx: any = { borderRadius: 1 };

                  // Preferred visual: start uses secondary, end/range use primary.
                  if (isStart) {
                    sx.bgcolor = "secondary.main";
                    sx.color = "secondary.contrastText";
                    sx["&.Mui-selected"] = {
                      bgcolor: "secondary.main",
                      color: "secondary.contrastText",
                    };
                    sx["&.Mui-selected:hover"] = {
                      bgcolor: "secondary.dark",
                    };
                  } else if (isEnd) {
                    sx.bgcolor = "primary.main";
                    sx.color = "primary.contrastText";
                    sx["&.Mui-selected"] = {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    };
                    sx["&.Mui-selected:hover"] = {
                      bgcolor: "primary.dark",
                    };
                  } else if (isBetween) {
                    sx.bgcolor = "primary.light";
                    sx.color = "primary.contrastText";
                    sx["&.Mui-selected"] = {
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    };
                  }

                  // Mark in-range days as selected so PickersDay applies
                  // appropriate selected styles and our sx overrides.
                  const selected = isStart || isEnd || isBetween;

                  return {
                    sx,
                    selected,
                    className: isStart ? "jb-start-day" : undefined,
                  };
                } catch {
                  return {};
                }
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              px: 2,
              py: 1,
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: draftFrom ? "secondary.light" : "action.hover",
                  color: draftFrom
                    ? "secondary.contrastText"
                    : "text.secondary",
                  minWidth: 70,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2">
                  {draftFrom
                    ? pillFormatter.format(draftFrom.toDate())
                    : t("date.start")}
                </Typography>
              </Box>

              <Typography color="text.secondary">→</Typography>

              <Box
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor:
                    draftTo || previewEnd ? "primary.main" : "action.hover",
                  color:
                    draftTo || previewEnd
                      ? "primary.contrastText"
                      : "text.secondary",
                  minWidth: 70,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2">
                  {draftTo
                    ? pillFormatter.format(draftTo.toDate())
                    : previewEnd && draftFrom
                      ? pillFormatter.format(previewEnd.toDate())
                      : t("date.end")}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                disabled={!(draftFrom && (draftTo || previewEnd))}
                onClick={() => {
                  const from = draftFrom;
                  const to = (draftTo ?? previewEnd) as Dayjs | null;
                  if (!from || !to) return;
                  onSelectRange(
                    from.format("YYYY-MM-DD"),
                    to.format("YYYY-MM-DD"),
                  );
                  onClose();
                }}
              >
                {t("date.apply")}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}

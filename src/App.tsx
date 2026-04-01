import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { fetchProducerSales, type ProducerSalesResponse } from "./api";
import {
  formatDateTimeLabel,
  formatInteger,
  formatKrw,
  getDefaultDateRange,
  getSalesTotals,
  sortProductsByGrossSales,
  toOffsetDateTime,
} from "./format";

type FormState = {
  selectedDate: string;
  rangeDays: number;
};

type IdentityState = {
  storeId: string;
  producerId: string;
};

const initialDateRange = getDefaultDateRange(new Date());
const IDENTITY_STORAGE_KEY = "jangbu.identity";
const RANGE_OPTIONS = [
  { label: "Today", days: 1 },
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 },
] as const;

const initialFormState: FormState = {
  selectedDate: initialDateRange.to.slice(0, 10),
  rangeDays: 1,
};

function loadStoredIdentity(): IdentityState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(IDENTITY_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<IdentityState>;
    const storeId = parsed.storeId?.trim() ?? "";
    const producerId = parsed.producerId?.trim() ?? "";
    if (!storeId || !producerId) {
      return null;
    }
    return { storeId, producerId };
  } catch {
    return null;
  }
}

function toDateTimeLocalValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function toDateDisplayLabel(dateValue: string): string {
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function shiftDateValue(dateValue: string, deltaDays: number): string {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + deltaDays);
  return toDateTimeLocalValue(date).slice(0, 10);
}

function getRequestDateRange(form: FormState): { from: string; to: string } {
  const end = new Date(`${form.selectedDate}T23:59:59`);
  const from = new Date(end);
  from.setDate(end.getDate() - (form.rangeDays - 1));
  from.setHours(0, 0, 0, 0);

  return {
    from: toDateTimeLocalValue(from),
    to: toDateTimeLocalValue(end),
  };
}

export function App() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [identity, setIdentity] = useState<IdentityState | null>(() =>
    loadStoredIdentity(),
  );
  const [identityDraft, setIdentityDraft] = useState<IdentityState>(() => {
    const stored = loadStoredIdentity();
    return {
      storeId: stored?.storeId ?? "",
      producerId: stored?.producerId ?? "",
    };
  });
  const [report, setReport] = useState<ProducerSalesResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = "Jangbu Client";
  }, []);

  const activeRange = useMemo(() => getRequestDateRange(form), [form]);

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

  function handleIdentitySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextIdentity = {
      storeId: identityDraft.storeId.trim(),
      producerId: identityDraft.producerId.trim(),
    };

    if (!nextIdentity.storeId || !nextIdentity.producerId) {
      setErrorMessage("Store ID and Producer ID are required.");
      return;
    }

    setIdentity(nextIdentity);
    setErrorMessage(null);
    setReport(null);
    window.localStorage.setItem(
      IDENTITY_STORAGE_KEY,
      JSON.stringify(nextIdentity),
    );
  }

  function handleIdentityReset() {
    setIdentity(null);
    setReport(null);
    setErrorMessage(null);
    setIdentityDraft({ storeId: "", producerId: "" });
    window.localStorage.removeItem(IDENTITY_STORAGE_KEY);
  }

  function applyQuickRange(days: number) {
    const today = toDateTimeLocalValue(new Date()).slice(0, 10);
    setForm((current) => ({
      ...current,
      selectedDate: today,
      rangeDays: days,
    }));
  }

  function shiftSelectedDate(deltaDays: number) {
    setForm((current) => ({
      ...current,
      selectedDate: shiftDateValue(current.selectedDate, deltaDays),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!identity) {
      setErrorMessage("Please log in first.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextReport = await fetchProducerSales({
        storeId: identity.storeId,
        producerId: identity.producerId,
        from: toOffsetDateTime(activeRange.from),
        to: toOffsetDateTime(activeRange.to),
      });
      setReport(nextReport);
    } catch (error) {
      setReport(null);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  const totals = report ? getSalesTotals(report) : null;
  const sortedProducts = report
    ? sortProductsByGrossSales(report.products)
    : [];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, sm: 3 },
        px: { xs: 1.5, sm: 2.5 },
        background:
          "radial-gradient(circle at top left, rgba(22,163,74,0.14), transparent 32%), radial-gradient(circle at top right, rgba(249,115,22,0.10), transparent 28%), linear-gradient(180deg, #f5f7fb 0%, #edf1f7 100%)",
      }}
    >
      <Container maxWidth="md" disableGutters>
        {!identity ? (
          <Card
            sx={{
              maxWidth: 460,
              mx: "auto",
              mt: { xs: 3, sm: 6 },
              borderRadius: 4,
              boxShadow: 6,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    mx: "auto",
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    background:
                      "linear-gradient(140deg, rgba(22,163,74,0.18), rgba(16,185,129,0.25))",
                    color: "primary.main",
                  }}
                >
                  <MenuBookRoundedIcon fontSize="large" />
                </Box>

                <Box textAlign="center">
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Jangbu Producer Portal
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Sign in once to use your sales dashboard.
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleIdentitySubmit}>
                  <Stack spacing={1.5}>
                    <TextField
                      required
                      label="Store code"
                      placeholder="Enter your store code"
                      value={identityDraft.storeId}
                      onChange={(event) => {
                        setIdentityDraft((current) => ({
                          ...current,
                          storeId: event.target.value,
                        }));
                      }}
                    />
                    <TextField
                      required
                      label="Account ID"
                      placeholder="Enter your account ID"
                      value={identityDraft.producerId}
                      onChange={(event) => {
                        setIdentityDraft((current) => ({
                          ...current,
                          producerId: event.target.value,
                        }));
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Log in
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1.5}>
            <Card>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={1.25}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Sales report
                  </Typography>
                  <Button variant="outlined" onClick={handleIdentityReset}>
                    Switch account
                  </Button>
                </Stack>
              </CardContent>
            </Card>

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
                      onClick={() => shiftSelectedDate(-1)}
                      sx={{ minWidth: 42, px: 0 }}
                      aria-label="Previous day"
                    >
                      <ChevronLeftRoundedIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={openDatePicker}
                      sx={{ justifyContent: "center" }}
                    >
                      {toDateDisplayLabel(form.selectedDate)}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => shiftSelectedDate(1)}
                      sx={{ minWidth: 42, px: 0 }}
                      aria-label="Next day"
                    >
                      <ChevronRightRoundedIcon />
                    </Button>
                  </Stack>

                  <input
                    ref={dateInputRef}
                    type="date"
                    value={form.selectedDate}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        selectedDate: event.target.value,
                      }));
                    }}
                  />

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {RANGE_OPTIONS.map((option) => (
                      <Button
                        key={option.days}
                        variant={
                          form.rangeDays === option.days
                            ? "contained"
                            : "outlined"
                        }
                        color={
                          form.rangeDays === option.days
                            ? "secondary"
                            : "inherit"
                        }
                        onClick={() => applyQuickRange(option.days)}
                      >
                        {option.label}
                      </Button>
                    ))}
                    <Button variant="outlined" onClick={openDatePicker}>
                      Pick date
                    </Button>
                  </Stack>

                  <Box component="form" onSubmit={handleSubmit}>
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
          </Stack>
        )}

        {errorMessage ? (
          <Alert severity="error" sx={{ mt: 1.5 }}>
            {errorMessage}
          </Alert>
        ) : null}

        {report && totals ? (
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <Grid container spacing={1.25}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Gross sales
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatKrw(totals.grossSalesKrw)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Fund total
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatKrw(totals.fundTotalKrw)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Payout amount
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatKrw(totals.payoutAmountKrw)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Units sold
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {formatInteger(totals.soldQty)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card>
              <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Box flex={1}>
                    <Typography variant="overline" color="text.secondary">
                      Report period
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatDateTimeLabel(report.from)} -{" "}
                      {formatDateTimeLabel(report.to)}
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="overline" color="text.secondary">
                      Products
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatInteger(report.products.length)} items
                    </Typography>
                  </Box>
                  <Box flex={1}>
                    <Typography variant="overline" color="text.secondary">
                      Session
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Temporary login active
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ px: 0.5 }}
            >
              Sales items ({formatInteger(sortedProducts.length)})
            </Typography>

            {sortedProducts.map((product) => (
              <Card key={product.productId}>
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "flex-start" }}
                    spacing={1}
                    sx={{ mb: 1.5 }}
                  >
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Product
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ mt: 0.25, fontWeight: 700 }}
                      >
                        {product.productName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatInteger(product.soldQty)} sold
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatKrw(product.grossSalesKrw)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Grid container spacing={1} sx={{ mb: 1.5 }}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Chip
                        label={`Fund total ${formatKrw(product.fundTotalKrw)}`}
                        variant="outlined"
                        sx={{ width: "100%", justifyContent: "flex-start" }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Chip
                        label={`Payout ${formatKrw(product.payoutAmountKrw)}`}
                        variant="outlined"
                        sx={{ width: "100%", justifyContent: "flex-start" }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Chip
                        label={`Variants ${formatInteger(product.items.length)}`}
                        variant="outlined"
                        sx={{ width: "100%", justifyContent: "flex-start" }}
                      />
                    </Grid>
                  </Grid>

                  <TableContainer
                    sx={{
                      borderRadius: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Table size="small" sx={{ minWidth: 560 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Variant</TableCell>
                          <TableCell>Sold</TableCell>
                          <TableCell>Gross sales</TableCell>
                          <TableCell>Fund total</TableCell>
                          <TableCell>Payout</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {product.items.map((item) => (
                          <TableRow key={item.productVariantId}>
                            <TableCell>{item.productVariantName}</TableCell>
                            <TableCell>{formatInteger(item.soldQty)}</TableCell>
                            <TableCell>
                              {formatKrw(item.grossSalesKrw)}
                            </TableCell>
                            <TableCell>
                              {formatKrw(item.fundTotalKrw)}
                            </TableCell>
                            <TableCell>
                              {formatKrw(item.payoutAmountKrw)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Card sx={{ mt: 1.5 }}>
            <CardContent>
              <Typography align="center" color="text.secondary">
                {identity
                  ? `Selected period: ${formatDateTimeLabel(activeRange.from)} - ${formatDateTimeLabel(activeRange.to)}`
                  : "Log in with Store ID and Producer ID to begin."}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

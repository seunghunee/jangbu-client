import { FormEvent, useEffect, useRef, useState } from "react";
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
      const requestRange = getRequestDateRange(form);
      const nextReport = await fetchProducerSales({
        storeId: identity.storeId,
        producerId: identity.producerId,
        from: toOffsetDateTime(requestRange.from),
        to: toOffsetDateTime(requestRange.to),
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
    <div className="app-shell">
      <main className="page">
        {!identity ? (
          <section className="login-shell">
            <article className="login-card">
              <div className="login-badge" aria-hidden="true">
                <span>JB</span>
              </div>
              <h1 className="login-title">Jangbu Producer Portal</h1>
              <p className="login-subtitle">
                Sign in once to use your sales dashboard.
              </p>

              <form className="login-form" onSubmit={handleIdentitySubmit}>
                <label>
                  <span>Store code</span>
                  <input
                    required
                    type="text"
                    placeholder="Enter your store code"
                    value={identityDraft.storeId}
                    onChange={(event) => {
                      setIdentityDraft((current) => ({
                        ...current,
                        storeId: event.target.value,
                      }));
                    }}
                  />
                </label>

                <label>
                  <span>Account ID</span>
                  <input
                    required
                    type="text"
                    placeholder="Enter your account ID"
                    value={identityDraft.producerId}
                    onChange={(event) => {
                      setIdentityDraft((current) => ({
                        ...current,
                        producerId: event.target.value,
                      }));
                    }}
                  />
                </label>

                <button type="submit" className="login-submit">
                  Log in
                </button>
              </form>
            </article>
          </section>
        ) : (
          <>
            <section className="page-header panel">
              <h1>Sales report</h1>
              <button type="button" onClick={handleIdentityReset}>
                Switch account
              </button>
            </section>

            <section className="panel date-panel">
              <p className="date-panel-label">Query period</p>
              <div className="date-nav">
                <button
                  type="button"
                  onClick={() => shiftSelectedDate(-1)}
                  aria-label="Previous day"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="date-display"
                  onClick={() => dateInputRef.current?.showPicker?.()}
                >
                  {toDateDisplayLabel(form.selectedDate)}
                </button>
                <button
                  type="button"
                  onClick={() => shiftSelectedDate(1)}
                  aria-label="Next day"
                >
                  &gt;
                </button>
              </div>

              <input
                ref={dateInputRef}
                className="date-native-input"
                type="date"
                value={form.selectedDate}
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    selectedDate: event.target.value,
                  }));
                }}
              />

              <div className="range-actions">
                <button
                  type="button"
                  className={form.rangeDays === 1 ? "is-active" : undefined}
                  onClick={() => applyQuickRange(1)}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={form.rangeDays === 7 ? "is-active" : undefined}
                  onClick={() => applyQuickRange(7)}
                >
                  1 week
                </button>
                <button
                  type="button"
                  className={form.rangeDays === 30 ? "is-active" : undefined}
                  onClick={() => applyQuickRange(30)}
                >
                  1 month
                </button>
                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker?.()}
                >
                  Pick date
                </button>
              </div>

              <form className="query-form" onSubmit={handleSubmit}>
                <div className="form-actions">
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading report..." : "Load sales"}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}

        {errorMessage ? (
          <section className="panel error-panel">
            <p>{errorMessage}</p>
          </section>
        ) : null}

        {report && totals ? (
          <>
            <section className="stats-grid">
              <article className="stat-card">
                <span className="stat-label">Gross sales</span>
                <strong>{formatKrw(totals.grossSalesKrw)}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-label">Fund total</span>
                <strong>{formatKrw(totals.fundTotalKrw)}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-label">Payout amount</span>
                <strong>{formatKrw(totals.payoutAmountKrw)}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-label">Units sold</span>
                <strong>{formatInteger(totals.soldQty)}</strong>
              </article>
            </section>

            <section className="panel report-meta">
              <div>
                <span className="meta-label">Report period</span>
                <strong>
                  {formatDateTimeLabel(report.from)} -{" "}
                  {formatDateTimeLabel(report.to)}
                </strong>
              </div>
              <div>
                <span className="meta-label">Products</span>
                <strong>{formatInteger(report.products.length)} items</strong>
              </div>
              <div>
                <span className="meta-label">Session</span>
                <strong>Temporary login active</strong>
              </div>
            </section>

            <section className="list-header">
              <h2>Sales items ({formatInteger(sortedProducts.length)})</h2>
            </section>

            <section className="product-list">
              {sortedProducts.map((product) => (
                <article className="panel product-card" key={product.productId}>
                  <div className="product-header">
                    <div>
                      <p className="eyebrow">Product</p>
                      <h2>{product.productName}</h2>
                    </div>
                    <div className="product-summary">
                      <span>{formatInteger(product.soldQty)} sold</span>
                      <strong>{formatKrw(product.grossSalesKrw)}</strong>
                    </div>
                  </div>

                  <dl className="product-metrics">
                    <div>
                      <dt>Fund total</dt>
                      <dd>{formatKrw(product.fundTotalKrw)}</dd>
                    </div>
                    <div>
                      <dt>Payout</dt>
                      <dd>{formatKrw(product.payoutAmountKrw)}</dd>
                    </div>
                    <div>
                      <dt>Variants</dt>
                      <dd>{formatInteger(product.items.length)}</dd>
                    </div>
                  </dl>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Variant</th>
                          <th>Sold</th>
                          <th>Gross sales</th>
                          <th>Fund total</th>
                          <th>Payout</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.items.map((item) => (
                          <tr key={item.productVariantId}>
                            <td>{item.productVariantName}</td>
                            <td>{formatInteger(item.soldQty)}</td>
                            <td>{formatKrw(item.grossSalesKrw)}</td>
                            <td>{formatKrw(item.fundTotalKrw)}</td>
                            <td>{formatKrw(item.payoutAmountKrw)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </section>
          </>
        ) : (
          <section className="panel empty-state">
            <p>
              {identity
                ? "Choose a date range to load the producer sales report."
                : "Log in with Store ID and Producer ID to begin."}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

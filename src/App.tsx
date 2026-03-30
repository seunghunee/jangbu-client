import { FormEvent, useEffect, useState } from "react";
import { API_BASE_URL, fetchProducerSales, type ProducerSalesResponse } from "./api";
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
  storeId: string;
  producerId: string;
  from: string;
  to: string;
};

const initialDateRange = getDefaultDateRange(new Date());

const initialFormState: FormState = {
  storeId: "",
  producerId: "",
  from: initialDateRange.from,
  to: initialDateRange.to,
};

export function App() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [report, setReport] = useState<ProducerSalesResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Jangbu Client";
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextReport = await fetchProducerSales({
        storeId: form.storeId.trim(),
        producerId: form.producerId.trim(),
        from: toOffsetDateTime(form.from),
        to: toOffsetDateTime(form.to),
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
  const sortedProducts = report ? sortProductsByGrossSales(report.products) : [];

  return (
    <div className="app-shell">
      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Read-only MVP</p>
            <h1>Producer sales, without the legacy client baggage.</h1>
            <p className="hero-text">
              Point the client at a store, producer, and date range. It reads the typed
              Jangbu server API and renders a settlement-oriented sales breakdown.
            </p>
          </div>
          <div className="hero-card">
            <div className="metric-label">API base URL</div>
            <div className="metric-value">{API_BASE_URL}</div>
            <p className="hero-card-note">
              Configure `VITE_API_BASE_URL` if your server is not running on
              `http://localhost:8080`.
            </p>
          </div>
        </section>

        <section className="panel">
          <form className="query-form" onSubmit={handleSubmit}>
            <label>
              <span>Store ID</span>
              <input
                required
                type="text"
                placeholder="11111111-1111-4111-8111-111111111111"
                value={form.storeId}
                onChange={(event) => {
                  setForm((current) => ({ ...current, storeId: event.target.value }));
                }}
              />
            </label>

            <label>
              <span>Producer ID</span>
              <input
                required
                type="text"
                placeholder="22222222-2222-4222-8222-222222222222"
                value={form.producerId}
                onChange={(event) => {
                  setForm((current) => ({ ...current, producerId: event.target.value }));
                }}
              />
            </label>

            <label>
              <span>From</span>
              <input
                required
                type="datetime-local"
                value={form.from}
                onChange={(event) => {
                  setForm((current) => ({ ...current, from: event.target.value }));
                }}
              />
            </label>

            <label>
              <span>To</span>
              <input
                required
                type="datetime-local"
                value={form.to}
                onChange={(event) => {
                  setForm((current) => ({ ...current, to: event.target.value }));
                }}
              />
            </label>

            <div className="form-actions">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Loading report..." : "Load sales"}
              </button>
            </div>
          </form>
        </section>

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
                <span className="meta-label">Store</span>
                <strong>{report.storeId}</strong>
              </div>
              <div>
                <span className="meta-label">Producer</span>
                <strong>{report.producerId}</strong>
              </div>
              <div>
                <span className="meta-label">Range</span>
                <strong>
                  {formatDateTimeLabel(report.from)} - {formatDateTimeLabel(report.to)}
                </strong>
              </div>
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
            <p>Enter IDs and a date range to load the producer sales report.</p>
          </section>
        )}
      </main>
    </div>
  );
}

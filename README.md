# Jangbu Client

Read-only MVP frontend for the producer sales API exposed by `jangbu-server`.

## Scope

- Fetch one producer sales report from `GET /stores/:store_id/producers/:producer_id/sales`
- Let an operator enter `storeId`, `producerId`, and an RFC3339-compatible date range
- Show top-line totals and product / variant breakdowns

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the API base URL:

   ```bash
   cp .env.example .env
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

The client defaults to `http://localhost:8080` when `VITE_API_BASE_URL` is not set.

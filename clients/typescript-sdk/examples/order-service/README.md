# order-service

End-to-end example of a FlowCatalyst SDK consumer app using the
transactional-outbox pattern.

## What it shows

The full slice from HTTP request to outbox row, in one Postgres transaction:

```
POST /orders                                          (HTTP handler)
  -> parse body, read X-Principal-ID                  (HTTP layer)
  -> placeOrder(pool, clientId, command)              (use case)
       BEGIN
       INSERT INTO orders ...                         (your aggregate)
       INSERT INTO outbox_messages (type='EVENT' ...) (OutboxManager)
       COMMIT
  -> 201 { orderId, eventId }
```

Key points:

- A fresh **`TxBoundOutboxDriver`** is constructed *per request* with the
  request's `PoolClient`, so the outbox INSERT participates in the same
  transaction as `INSERT INTO orders`. This is what makes the pattern
  atomic — either both rows land or neither does.
- `CreateEventDto` is built fluently (`.withSource`, `.withSubject`,
  `.withMessageGroup`, `.withCorrelationId`); call
  `outbox.createEvent(dto)` once you have the final shape.
- The platform's outbox processor (separate process; not part of this
  example) reads `outbox_messages` and POSTs to `/api/events/batch`. This
  service never talks to the platform directly.
- Errors are mapped to JSON `{ code, message }` with appropriate HTTP
  status codes — the same envelope shape the platform uses.

## Schema

```sql
-- (1) Outbox table — apply the SDK migration:
--     clients/typescript-sdk/migrations/postgresql/001_create_outbox_messages.sql

-- (2) Demo aggregate table:
CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  total_cents BIGINT NOT NULL,
  placed_at   TIMESTAMPTZ NOT NULL
);
```

## Run

First build the SDK:

```bash
pnpm --filter @flowcatalyst/sdk build
```

Then, from `clients/typescript-sdk/`:

```bash
FC_DATABASE_URL=postgres://localhost:5432/orders \
FC_CLIENT_ID=cli_01HZX1AB...                     \
pnpm tsx examples/order-service/main.ts
```

In another terminal:

```bash
curl -XPOST http://localhost:8080/orders \
  -H 'X-Principal-ID: prn_demo'          \
  -H 'Content-Type: application/json'    \
  -d '{"customerId":"cus_42","totalCents":1500}'
```

Expected response:

```json
{ "orderId": "ord_01HZX...", "eventId": "01HZX..." }
```

## Required env

| Var | Purpose |
|---|---|
| `FC_DATABASE_URL` | Postgres DSN. Defaults to `postgres://localhost:5432/orders`. |
| `FC_CLIENT_ID` | TSID of the FlowCatalyst client this service acts as. Stamped onto every outbox row so the processor can route it. |

# FlowCatalyst TypeScript SDK — Examples

Runnable example apps for the `@flowcatalyst/sdk` package. Each example is a
single `main.ts` so you can read top-to-bottom and copy what fits.

## Layout

| Directory | What it shows |
|---|---|
| `list-event-types/` | Smallest possible client — auth + a single GET. Two auth flavors (static access token and OIDC client credentials). |
| `order-service/` | End-to-end transactional-outbox flow. A POST endpoint writes an `orders` row and an `OrderPlaced` event in one Postgres transaction; the platform's outbox processor forwards the event from `outbox_messages`. |

## Running

The examples import from the published package name (`@flowcatalyst/sdk`),
so build the SDK once before running:

```bash
pnpm --filter @flowcatalyst/sdk build
```

Then run an example from the SDK directory:

```bash
cd clients/typescript-sdk
pnpm tsx examples/list-event-types/main.ts
```

Each example's `README.md` lists the environment variables it expects.

## Examples not yet ported from the Go SDK

The Go SDK ships three additional examples that depend on SDK primitives the
TypeScript SDK doesn't have yet:

- **`fc-sync`** — declarative reconciliation of roles / event types / dispatch
  pools / subscriptions / processes for one application. Needs a TS
  equivalent of the Go `sync.DefinitionSet` + `Synchronizer` that fans out
  to the per-category `.sync()` endpoints. The endpoints exist on the
  resource clients today; the orchestration layer doesn't.
- **`webhook-receiver`** — HMAC-SHA256 inbound webhook verification with
  sentinel error mapping. Needs a TS `webhook.Validator` matching the Rust
  SDK wire shape (mixed-case headers, Unix-second timestamps).
- **`scheduled-jobs-runner`** — long-running runner that accepts platform
  firings on a webhook URL, dispatches by job code, serialises via a
  distributed lock, and posts logs + completion back. The
  `ScheduledJobsResource` exposes the callback endpoints; the runner /
  lock / handler-registry layer on top is missing.

When those SDK modules land, mirror the matching Go example
(`/Users/andrewgraaff/Developer/flowcatalyst-go/pkg/fcsdk/examples/`) into
this directory.

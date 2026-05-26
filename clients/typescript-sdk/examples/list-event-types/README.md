# list-event-types

Smallest possible `@flowcatalyst/sdk` example — build a client, call one
endpoint, print the result. Use it to verify auth wiring before you build
anything else.

## What it shows

- Both auth flavors the SDK supports:
  - **Static access token** (`FlowCatalystClient` with `accessToken`).
  - **OIDC client credentials** (`FlowCatalystClient` with `clientId` /
    `clientSecret`) — the SDK manages the token lifecycle.
- `neverthrow` Result handling — `result.isErr()` discriminating on the
  `SdkError` tagged union.

## Run

First build the SDK (the example imports from the package name):

```bash
pnpm --filter @flowcatalyst/sdk build
```

Then, from `clients/typescript-sdk/`:

```bash
# Static access token
FC_BASE_URL=https://api.flowcatalyst.io \
FC_TOKEN=eyJ... \
pnpm tsx examples/list-event-types/main.ts

# Or with client credentials
FC_BASE_URL=https://api.flowcatalyst.io \
FC_CLIENT_ID=svc-app \
FC_CLIENT_SECRET=... \
pnpm tsx examples/list-event-types/main.ts
```

Optional:

- `FC_APP=orders` — filter to one application's event types.

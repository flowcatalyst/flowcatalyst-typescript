# Error Handling

The SDK has two surfaces and two error patterns. Pick the right one for
where you are in the call graph.

| Surface | API style | Failure mode | How to branch |
|---|---|---|---|
| HTTP control plane (`client.<resource>().*`) | `ResultAsync<T, SdkError>` (neverthrow) | Returned `Err`, never thrown | `.match` / `.isErr()` + `switch (err.type)` |
| Outbox data plane (`OutboxManager.*`) | `Promise<string>` (or `Promise<string[]>`) | Thrown `Error` | `try / catch` |

The control-plane surface never throws — `result.isErr()` is the only
failure path. The outbox surface throws because it runs inside the
caller's own transaction `try / catch`, where adding another `Result`
layer would just force unwrapping.

## Quick rules

- **Use `.match` or `.isErr()`** on every `ResultAsync` result —
  TypeScript can't force you to handle the error, but you should.
- **`switch` on `err.type`** to handle different `SdkError` variants
  exhaustively. Add `default:` so unknown variants surface as a
  TypeScript error if you ever forget to update the switch.
- **Wrap outbox calls in `try / catch`** alongside your `BEGIN` /
  `COMMIT` boundary — the SDK assumes you own the transaction.

## `SdkError` — tagged discriminated union

Every resource method returns `ResultAsync<T, SdkError>`. `SdkError` is
the union of these tagged variants (every variant carries a `type`
field plus a human-readable `message`):

| `type` | When it fires | Extra fields |
|---|---|---|
| `validation` | API returned 422 with structured field errors. | `errors: Record<string, string[]>` |
| `not_found` | API returned 404. | `resource?`, `id?` |
| `forbidden` | API returned 403. | — |
| `conflict` | API returned 409 (e.g. duplicate code, version conflict). | `code?` — platform error code if present |
| `rate_limited` | API returned 429. The SDK does **not** retry — wait this out and retry. | `retryAfterMs?` |
| `http_error` | Any non-2xx that doesn't match the above (incl. 5xx after retries). | `status: number`, `body?: unknown` |
| `network` | Fetch failed before getting a response (DNS / connect refused / TLS / abort). | `cause?: Error` |
| `timeout` | Request exceeded `timeout` (default 30 s). | `durationMs: number` |
| `missing_credentials` | Constructed without `accessToken` or `clientId`/`clientSecret`. | — |
| `invalid_credentials` | OAuth `/oauth/token` returned 400/401. | — |
| `token_expired` | 401 from API (after one auto-refresh attempt in credentials mode). | — |
| `token_fetch_failed` | `/oauth/token` round-trip failed (network / 5xx). | `cause?: Error` |

### Pattern: exhaustive switch

```ts
const result = await client.applications().get(id);
result.match(
  (app) => render(app),
  (err) => {
    switch (err.type) {
      case 'not_found':
        return notFound(err.id ?? id);
      case 'forbidden':
        return forbidden();
      case 'validation':
        return showFieldErrors(err.errors);
      case 'rate_limited':
        return scheduleRetry(err.retryAfterMs ?? 30_000);
      case 'token_expired':
      case 'invalid_credentials':
      case 'missing_credentials':
      case 'token_fetch_failed':
        return redirectToLogin();
      case 'timeout':
      case 'network':
      case 'http_error':
      case 'conflict':
        return showError(err.message);
    }
  },
);
```

### Pattern: chain results

```ts
const dispatchPoolId = await client
  .applications()
  .get(appId)
  .andThen((app) => client.dispatchPools().get(app.defaultDispatchPoolId))
  .map((pool) => pool.id);
```

If any step errs, the chain short-circuits and `dispatchPoolId` is the
`Err(SdkError)` from whichever step failed.

## HTTP-status -> error-type mapping

`mapHttpStatusToError(status, body, message)` is what the client uses
internally; the same table applies to anything you see:

| Status | `err.type` |
|---|---|
| 401 | `token_expired` |
| 403 | `forbidden` |
| 404 | `not_found` |
| 409 | `conflict` (with `code` if the platform sent one) |
| 422 | `validation` (with `errors` map if present) |
| 429 | `rate_limited` (with `retryAfterMs` if `retryAfter` is in body) |
| any other non-2xx | `http_error` with `status` + `body` |

Retries (`retryAttempts`, default 3) happen before this mapping for
`408 / 429 / 502 / 503 / 504` only — by the time you see the error,
the SDK has already retried with exponential backoff.

## Outbox layer

`OutboxManager.createEvent` / `createDispatchJob` / `createAuditLog`
(and their batch counterparts) throw on failure. There is one expected
synchronous throw — calling any method without a `clientId` set on the
manager:

```ts
const outbox = new OutboxManager(driver, ''); // bad
await outbox.createEvent(dto); // throws Error("clientId is required ...")
```

Everything else is whatever your `OutboxDriver` throws (typically `pg` /
`mysql2` errors from the driver's `INSERT`). Catch them alongside your
transaction:

```ts
const tx = await pool.connect();
try {
  await tx.query('BEGIN');
  await insertOrder(tx, order);
  await new OutboxManager(new TxDriver(tx), clientId).createEvent(dto);
  await tx.query('COMMIT');
} catch (err) {
  await tx.query('ROLLBACK').catch(() => undefined);
  throw err;
} finally {
  tx.release();
}
```

See `examples/order-service/main.ts` for the full pattern.

## Auth: `OidcTokenManager`

`OidcTokenManager.getAccessToken()` returns
`ResultAsync<string, AuthenticationError>` (a subset of `SdkError`).
You only need it directly if you're bypassing `FlowCatalystClient` —
in the normal flow, the client wires it for you and surfaces the
errors through whichever resource call failed.

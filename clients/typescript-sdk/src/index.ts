/**
 * FlowCatalyst SDK for TypeScript / JavaScript.
 *
 * Byte-for-byte wire-compatible with the Rust, Go, and Laravel SDKs: a
 * token, event payload, or TSID minted by any one is identical to the
 * same value minted by another.
 *
 * # Mental model
 *
 * Two surfaces, two patterns:
 *
 * 1. **HTTP control plane** — `FlowCatalystClient` and its resource
 *    families (`eventTypes()`, `subscriptions()`, `applications()`,
 *    `scheduledJobs()`, ...). Every call returns
 *    `ResultAsync<T, SdkError>` from `neverthrow` — no thrown errors;
 *    branch on the tagged `SdkError.type` field.
 *
 *    ```
 *    client.eventTypes().list()
 *      └─> ResultAsync<EventTypeListResponse, SdkError>
 *           ├─ .match(onOk, onErr)
 *           ├─ .isOk() / .isErr() type guards
 *           └─ .andThen(...) for chaining
 *    ```
 *
 * 2. **Outbox data plane** — `OutboxManager` + the `OutboxDriver`
 *    interface. Use cases write business rows and outbox rows in *one*
 *    user-managed transaction; the FlowCatalyst outbox processor picks
 *    them up out-of-band. These methods throw `Error` on failure
 *    (driver / DB errors) — they do not use neverthrow, because they
 *    run inside a try/catch that already owns transaction control.
 *
 *    ```
 *    business tx:  BEGIN
 *                   INSERT INTO orders     <- your aggregate write
 *                   INSERT INTO outbox_messages  <- OutboxManager.createEvent
 *                  COMMIT
 *    ```
 *
 * # Package map
 *
 * Client:
 *   - {@link FlowCatalystClient} — main HTTP client. Two auth modes:
 *     static `accessToken` ({@link UserTokenConfig}) or OAuth2 client
 *     credentials ({@link ClientCredentialsConfig}); retries transient
 *     5xx with exponential backoff; refreshes tokens on 401 in
 *     credentials mode.
 *
 * Resources (every method returns `ResultAsync<T, SdkError>`):
 *   - {@link EventTypesResource}, {@link SubscriptionsResource},
 *     {@link DispatchPoolsResource}, {@link ConnectionsResource},
 *     {@link RolesResource}, {@link PermissionsResource},
 *     {@link ApplicationsResource}, {@link ClientsResource},
 *     {@link PrincipalsResource}, {@link ScheduledJobsResource}.
 *
 * Auth:
 *   - {@link OidcTokenManager} — caches access tokens until ~60s before
 *     expiry, refreshes on demand. Wired automatically by
 *     `FlowCatalystClient` in credentials mode; exposed directly for
 *     advanced use cases.
 *
 * Outbox (transactional outbox pattern):
 *   - {@link OutboxManager} — writes {@link OutboxMessage} rows via a
 *     user-supplied {@link OutboxDriver}. Construct one per
 *     transaction so the INSERT participates in the caller's tx.
 *   - {@link CreateEventDto}, {@link CreateDispatchJobDto},
 *     {@link CreateAuditLogDto} — fluent builders for outbox payloads.
 *   - {@link generateTsid} / {@link isValidTsid} — 13-char Crockford
 *     Base32 TSID minting and validation.
 *
 * Errors:
 *   - {@link SdkError} — tagged discriminated union with `type` field
 *     ('validation' | 'not_found' | 'forbidden' | 'conflict' |
 *     'rate_limited' | 'http_error' | 'network' | 'timeout' |
 *     'token_expired' | ...). See {@link mapHttpStatusToError} for the
 *     HTTP-status -> error-type mapping.
 *
 * # See also
 *
 * - `examples/` — runnable example apps (start with
 *   `list-event-types/`, then `order-service/`).
 * - `ERRORS.md` — every `SdkError` variant, when it fires, and the
 *   idiom for branching on it.
 *
 * @example Quick start
 * ```typescript
 * import { FlowCatalystClient } from '@flowcatalyst/sdk';
 *
 * const client = new FlowCatalystClient({
 *   baseUrl: 'https://your-instance.flowcatalyst.io',
 *   clientId: 'your_client_id',
 *   clientSecret: 'your_client_secret',
 * });
 *
 * const result = await client.eventTypes().list();
 * result.match(
 *   (page) => console.log('event types:', page.eventTypes),
 *   (e) => {
 *     switch (e.type) {
 *       case 'validation':   return console.error('validation', e.errors);
 *       case 'not_found':    return console.error('not found', e.message);
 *       case 'token_expired':return console.error('refresh token');
 *       default:             return console.error(e.type, e.message);
 *     }
 *   },
 * );
 * ```
 *
 * @packageDocumentation
 */

// Main client
export {
	FlowCatalystClient,
	type FlowCatalystConfig,
	type ClientCredentialsConfig,
	type UserTokenConfig,
} from "./client";

// Authentication
export { OidcTokenManager, type TokenManagerConfig } from "./auth";

// Error types
export type {
	SdkError,
	AuthenticationError,
	HttpError,
	ValidationError,
	NotFoundError,
	ForbiddenError,
	ConflictError,
	RateLimitError,
} from "./errors";
export {
	authError,
	httpError,
	validationError,
	notFoundError,
	forbiddenError,
	conflictError,
	rateLimitError,
	mapHttpStatusToError,
} from "./errors";

// Resource classes
export {
	EventTypesResource,
	SubscriptionsResource,
	DispatchPoolsResource,
	ConnectionsResource,
	RolesResource,
	PermissionsResource,
	ApplicationsResource,
	ClientsResource,
	PrincipalsResource,
	ScheduledJobsResource,
} from "./resources";

// Re-export generated types for convenience
export type * from "./generated/types.gen";

// Outbox - transactional outbox pattern
export { OutboxManager, OutboxStatus } from "./outbox/index.js";
export type {
	OutboxDriver,
	OutboxMessage,
	OutboxStatusCode,
	MessageType,
} from "./outbox/index.js";
export { CreateEventDto } from "./outbox/index.js";
export { CreateDispatchJobDto } from "./outbox/index.js";
export { CreateAuditLogDto } from "./outbox/index.js";
export { generateTsid, isValidTsid } from "./outbox/index.js";

// Re-export neverthrow utilities for convenience
export { ok, err, Result, ResultAsync } from "neverthrow";

# Rust port session changes — apply to TS port

This doc captures every functional change made to the Rust port
(`../flowcatalyst-rust`) in one session, in the order they came up. Use it as
a TODO list for mirroring the same fixes here. Each section is independent —
you can land them as separate PRs.

Path conventions:
- `RUST:` — file in `../flowcatalyst-rust/`
- `TS:` — likely target file in this repo (verify before editing)

---

## 1. Role create/update API contract

### 1a. Create-role: frontend `name` → `roleName`

**Bug.** The role-create POST returned 422 with no useful detail. Frontend
was sending `{ applicationCode, name, displayName }`, backend expected
`{ applicationCode, roleName, displayName }`. Axum's `Json<T>` extractor 422s
on a missing field — the handler never ran.

**Fix.**
- `RUST: crates/fc-platform/src/role/api.rs` — `CreateRoleRequest.role_name`
  (camelCase wire: `roleName`).
- `RUST: frontend/src/types/bff/roles.ts` — `BffCreateRoleRequest.roleName`,
  and `displayName` made required (backend declares `String`, not
  `Option<String>`).
- `RUST: frontend/src/pages/authorization/RoleListPage.vue` — call site sends
  `roleName: form.name`; defaults `displayName` to `form.name` if blank so
  the backend's required-field check doesn't trip.

**Use-case detail worth knowing.** The platform's `CreateRoleUseCase`
prepends the app code to form the canonical role name:
`format!("{}:{}", app_code, role_name)`. So `roleName` should be the bare
short name (`"administrator"`), not the prefixed form
(`"integral:administrator"`) — passing the prefixed form yields a stored
code of `integral:integral:administrator`.

**TS action.** Audit the role-create call sites against the platform's
expected DTO. If the TS BFF accepts `name`, you may not need this — but the
frontend type should still match wire. Verify the prefix-prepend behavior
in TS too.

---

### 1b. Update-role: backend silently dropped `permissions`

**Bug.** `PUT /bff/roles/:name` looked like it accepted `permissions: string[]`
in the body (the frontend sent it; the use case supported it; the audit-event
diff was wired). But the HTTP DTO `UpdateRoleRequest` didn't declare a
`permissions` field. Serde silently dropped it. The handler then built
`UpdateRoleCommand { permissions: None, .. }`. Result: PUT returned 204 with
"Role updated successfully" toast, but the permission set never changed.

**Fix.**
- `RUST: crates/fc-platform/src/role/api.rs:48-62` — added
  `permissions: Option<Vec<String>>` to `UpdateRoleRequest`.
- `RUST: crates/fc-platform/src/role/api.rs:355-364` — handler now passes
  `req.permissions` into `UpdateRoleCommand` instead of hardcoded `None`.

**TS action.** Check the analogous `UpdateRoleRequest` DTO and the role-edit
PUT handler. If TS uses zod or a validation schema, the field must be
listed. There may also be a distinct `grant_permission` /
`revoke_permission` endpoint that's separately wired — leave those, the
fix is just to enable bulk replacement via PUT.

---

## 2. HTTP error response: prefer `message` over `error`

**Bug.** Platform error JSON is `{ error: "<MACHINE_CODE>", message: "<human text>" }`.
Both the frontend `bffFetch` wrapper and the TS SDK's `mapHttpStatusToError`
were picking `body.error || body.message || "Request failed"` for the
displayed text. Result: the user saw `ROLE_HAS_ASSIGNMENTS` instead of
"Cannot delete role 'integral:admin' — 2 principal(s) still hold it.".

**Fix.**
- `RUST: frontend/src/api/client.ts` — flipped precedence so `message` wins.
  Also map `error` (the field) to `ApiError.code`.
- `RUST: clients/typescript-sdk/src/errors.ts` — same flip in
  `mapHttpStatusToError`. Also fixed the 409 branch to use `errorBody.error`
  for the `ConflictError.code` (was reading `errorBody.code`, which the
  platform never emits).
- Added a small `summaryForStatus(status)` helper so the global toast says
  `Conflict` / `Validation Failed` / `Not Found` etc. instead of always
  `Request Failed`.

**TS action.** Apply the same precedence flip to whatever the TS app uses
to render error toasts and to whatever its SDK uses to map HTTP errors.
The platform JSON shape `{ error, message }` is shared.

---

## 3. AWS-style notification banners (replaces PrimeVue Toast)

**User pain.** Toasts were ephemeral and easy to miss; success and error
toasts were also being double-rendered (global handler in `bffFetch` plus
per-page `catch` block).

**What changed.**
- `RUST: frontend/src/components/NotificationBannerStack.vue` — new
  component. Sticky stack at top of viewport, color-coded by severity,
  per-banner × dismiss.
- `RUST: frontend/src/utils/errorBus.ts` — `error`/`warn` notifications no
  longer carry a `life` (sticky until dismissed); `success`/`info` keep
  3s/5s auto-dismiss.
- `RUST: frontend/src/App.vue` — replaced `<Toast />` + `<GlobalToast />`
  with `<NotificationBannerStack />`.
- `RUST: frontend/src/main.ts` — dropped `ToastService` registration.
- Migrated every `useToast().add({ severity, summary, detail, life })`
  caller in 38 files to `toast.<severity>(summary, detail)` from the
  errorBus. (Two codemods in `/tmp/migrate-toasts*.mjs` if you want to
  see the pattern.)
- Removed duplicate per-page error toasts inside `} catch { … }` blocks
  that fired right after `bffFetch` had already shown the global banner.
- `RUST: frontend/src/api/client.ts` — added a `suppressGlobalErrorToast?:
  boolean` option to `apiFetch`/`bffFetch` for pages that want to handle
  the error inline (form-level message etc.) without the global banner
  competing.

**Behaviour spec the user signed off on.**
- Success: 3s auto-dismiss, dismissable via ×.
- Info: 5s auto-dismiss, dismissable.
- Warn: sticky, dismissable.
- Error: sticky, dismissable.

**TS action.** This is mostly a frontend (Vue) change. If the TS frontend is
the same Vue app, it likely has identical patterns to migrate. If the TS
codebase predates this Vue frontend, the conceptual changes still apply
to whatever notification system it uses.

---

## 4. Static asset / `just run` migration cleanup

**Bug.** `just migrate` (psql against `migrations/*.sql`) was running
**every** file in the dir; the Rust runtime runs an **explicit subset** baked
into `crates/fc-platform/src/shared/database.rs::run_migrations`. The two
disagreed on three files:

| File | Issue |
|---|---|
| `012_optimize_event_dispatch_id_columns.sql` | Shrinks `msg_events.id` to VARCHAR(13). Canonical schema is now VARCHAR(17) for prefixed TSIDs. **Actively harmful** if it runs. |
| `013_move_endpoint_to_subscription.sql` | Tries `UPDATE … SET endpoint = c.endpoint` but `013_drop_connection_endpoint.sql` runs first (alphabetical) and drops the column. Always fails. |
| `014_fix_login_attempts_identifier.sql` | Redundant — `008_auth_tracking_tables.sql` already creates `identifier VARCHAR(255)`. |

**Fix.** Deleted all three from `RUST: migrations/`. The Rust runner already
ignored them. `just migrate` now runs cleanly because the dir matches
the Rust runner's allow-list.

**TS action.** Probably a Rust-only artefact. Check the TS migrations
folder for parallel orphans if any.

---

## 5. Duplicate `operation_id` in OpenAPI spec

**Bug.** Two endpoints both declared
`operation_id = "getApiAdminDispatchJobsFilterOptions"`:
- `RUST: crates/fc-platform/src/dispatch_job/api.rs` for `/bff/dispatch-jobs/filter-options`
- `RUST: crates/fc-platform/src/shared/filter_options_api.rs` for `/bff/filter-options/dispatch-jobs`

utoipa accepted both (OpenAPI 3.x doesn't strictly require globally unique
operationIds), but Jane PHP generated two methods with the same name —
fatal redeclaration when loading.

**Fix.** Renamed the shared one to `getApiAdminFilterOptionsDispatchJobs`,
matching its sibling pattern (`getApiAdminFilterOptionsClients` etc.).

**TS action.** If the TS app uses OpenAPI generators, audit for duplicate
operationIds. NestJS / Fastify swagger plugins often dedupe by URL, so this
may not surface — but it bit us with Jane.

---

## 6. SDK regeneration tooling (`just regen-sdks`)

**Bug.** No single command regen'd the SDKs. People copy-pasted curl
commands. The TS SDK's openapi-ts config pointed at `localhost:3000` (some
historical port), the platform actually serves on `8080`. The TS SDK and
frontend's openapi-ts configs read from yaml snapshots, but
`/q/openapi` serves JSON — the formats had drifted.

**Fix.** Added a `regen-sdks` recipe to `RUST: justfile`:

```make
regen-sdks:
    @curl -fsS http://localhost:{{ FC_API_PORT }}/q/openapi >/dev/null \
        || (echo "✗ Platform not reachable…"; exit 1)
    @curl -fsS http://localhost:{{ FC_API_PORT }}/q/openapi -o clients/typescript-sdk/openapi/openapi.json
    @curl -fsS http://localhost:{{ FC_API_PORT }}/q/openapi -o clients/laravel-sdk/openapi/openapi.json
    @curl -fsS http://localhost:{{ FC_API_PORT }}/q/openapi -o frontend/openapi/openapi.json
    cd clients/typescript-sdk && pnpm build
    cd clients/laravel-sdk && php scripts/prepare-openapi.php && vendor/bin/jane-openapi generate --config-file=jane-openapi.php
    cd frontend && pnpm api:generate
```

Also:
- `RUST: clients/typescript-sdk/openapi-ts.config.ts` — reads
  `./openapi/openapi.json` (was `.yaml`); honors `FC_API_PORT`.
- `RUST: frontend/openapi-ts.config.ts` — same change.
- Deleted stale `openapi/openapi.yaml` snapshots.

**TS action.** If the TS port has multiple SDKs, mirror the recipe. The
`/q/openapi` URL is a Quarkus convention — if the TS platform exposes
OpenAPI on a different path, adjust accordingly.

---

## 7. Dispatch jobs / Events list endpoints — multi-value filters + DB pagination

**Bug.** The frontend's dispatch-jobs and events list pages were sending a
rich query string (`page`, `size`, `sortField`, `sortOrder`, `clientIds`,
`statuses`, `applications`, `subdomains`, `aggregates`, `codes`, `types`,
`source`). The platform handlers declared a much smaller query type
(`pagination`, `eventId`, `correlationId`, `subscriptionId`, `clientId`
singular, `status` singular). All the rich params were silently dropped on
the URL — multi-select / sort / search filters in the UI were dead since
day 1. After SDK regen, vue-tsc surfaced this as a hard build break (the
generated query type wouldn't accept the page's payload).

**Fix shape (mirror this in TS).**

For both `DispatchJobsQuery` and `EventsQuery`:

```rust
pub struct DispatchJobsQuery {
    pub page: Option<u32>,
    pub size: Option<u32>,
    pub sort_field: Option<String>,
    pub sort_order: Option<String>,        // "asc" | "desc", default desc
    pub event_id: Option<String>,
    pub correlation_id: Option<String>,
    pub subscription_id: Option<String>,
    pub client_ids: Option<String>,        // CSV → split server-side
    pub statuses: Option<String>,
    pub applications: Option<String>,
    pub subdomains: Option<String>,
    pub aggregates: Option<String>,
    pub codes: Option<String>,
    pub source: Option<String>,            // free-text search
}
```

Repository method (per resource): query the **read projection table**
(`msg_dispatch_jobs_read` / `msg_events_read`), accept `&[String]` slices for
multi-value filters, return `(rows, total_count)`. Multi-value via
`column = ANY($1::text[])`. Sort field allow-listed (string → DB column)
to keep SQL injection-safe. Pagination at the DB level (LIMIT/OFFSET) so
the total count is accurate.

Auto-scope: when caller is non-anchor and `client_ids` is empty, narrow the
query to the caller's `accessible_clients`. If their accessible set is
empty, short-circuit to an empty page.

**Specific files to mirror.**
- `RUST: crates/fc-platform/src/dispatch_job/repository.rs` — new
  `find_read_with_filters` against `msg_dispatch_jobs_read`.
- `RUST: crates/fc-platform/src/dispatch_job/api.rs` — widened
  `DispatchJobsQuery`, rewrote `list_dispatch_jobs`. Added
  `application/subdomain/aggregate` to `DispatchJobReadResponse`.
- `RUST: crates/fc-platform/src/event/repository.rs` —
  `find_read_with_filters` rewritten to slice signature with sort.
- `RUST: crates/fc-platform/src/event/api.rs` — widened `EventsQuery`,
  rewrote `list_events`. Updated `admin_list_events` to use the new slice
  signature.
- `RUST: frontend/src/pages/dispatch-jobs/DispatchJobListPage.vue` and
  `frontend/src/pages/events/EventListPage.vue` — replaced hand-rolled
  list-row interfaces with imports from `@/api/generated`. Pass `page`/`size`
  as numbers, not stringified.

**Drift caveats worth knowing while you mirror.**

- Frontend's filter-options endpoint for events maps to the **shared**
  filter-options API (`/bff/filter-options/events`), which exposes
  `applications/clients/subdomains/eventTypes` but **not** `aggregates`. The
  resource-side endpoint (`admin_event_filter_options` at
  `/bff/admin-events/filter-options`) has aggregates but isn't OpenAPI-
  exposed. The events page therefore doesn't render aggregate options. Worth
  unifying — one filter-options shape per resource.
- For dispatch jobs, the resource-side filter-options (`/bff/dispatch-jobs/
  filter-options`) returns the full set including `aggregates` and `codes`
  — this is the one the page uses.
- Detail dialogs need a hybrid type `EventRead & Partial<EventResponse>`:
  the projection has `application/subdomain/aggregate/projectedAt`, the
  write entity (returned by `getApiAdminEventsById`) has
  `data/causationId/deduplicationId/contextData`. Neither alone is
  sufficient for the existing detail view. The Rust frontend now merges:
  `selectedEvent = { ...rowFromList, ...detailFetchedById }`.

---

## 8. Anchor user — what's in their tokens

While debugging, we walked through what an anchor user's ID/access token
contains. Documented here because the TS port should match exactly.

**Anchor tokens carry `clients: ["*"]`**, not the enumerated list of every
client.
`RUST: crates/fc-platform/src/auth/auth_service.rs::generate_id_token`:

```rust
let clients = match principal.scope {
    UserScope::Anchor  => vec!["*".to_string()],
    UserScope::Partner => /* "id:identifier" pairs from assigned_clients */,
    UserScope::Client  => /* the principal's own client_id */,
};
```

`roles` are enumerated literally (no wildcard); `applications` is derived by
splitting role names on `:` and taking the prefix. So a principal with roles
`["administrator", "integral:administrator"]` ends up with:

```json
{
  "roles": ["administrator", "integral:administrator"],
  "applications": ["integral"]
}
```

Authorization for anchors comes from `scope == ANCHOR` short-circuiting in
`require_anchor` / `is_admin` / `require_client_access`, not from any role
membership. A role-less anchor still passes those checks; a role-laden
client user still doesn't.

**TS action.** Verify the TS provider emits the same shape. The TS frontend
already assumes `clients: "*"` means anchor — keep that contract.

---

## 9. OIDC sign-up flow — auto-provisioning rules

Documented here because a customer asked. Behavior in Rust port:

After Entra (or any OIDC IDP) validates the user, `auth/oidc_login_api.rs`
runs through these gates:

1. **Email domain mapping.** The token's email domain must match a row in
   `iam_email_domain_mappings`. The mapping pins the user's `scope` (ANCHOR
   / PARTNER / CLIENT), an optional `primary_client_id`, an optional
   `allowed_role_ids` allow-list, and an optional `required_oidc_tenant_id`
   (Entra `tid` claim must match if set).
2. **Auto-create.** If `iam_principals` has no row for the email, a new
   user is inserted via `Principal::new_user(email, scope)`. The `sub` from
   the token is stored as `external_identity`. **Email is the join key**
   for repeat logins, not `sub`. So if a user's Entra email changes, you
   get a second principal — by design, matches TS behaviour.
3. **Role authorization.** Roles claimed by the IDP are intersected with
   `iam_idp_role_mappings` and (if set) the mapping's `allowed_role_ids`.
   Anything else is logged as a security warning and dropped.

If there's no email-domain mapping, login is rejected and **no user is
created**. The IDP credentials check passes but the platform refuses to
trust a domain it doesn't know.

**Identity provider issuer URL** — for Entra ID:
`https://login.microsoftonline.com/{TENANT_ID}/v2.0` (use the GUID, not the
verified-domain alias, so it matches the `iss` claim Entra emits).

**TS action.** The TS provider already implements this flow — verify the
Rust changes don't introduce subtle differences (e.g. the email-vs-sub
join key, the allowed-role-ids filter, the tenant-ID gate).

---

## Working order suggestion

If you're picking this up to mirror in TS, here's a reasonable order:

1. **Section 2** (error precedence) — small, isolates a class of UX
   regressions, easy win.
2. **Section 1** (role create/update DTO contracts) — small, fixes two
   real bugs.
3. **Section 7** (multi-value list filters) — bigger, but unlocks the
   list pages from the silent-drop state.
4. **Section 3** (banner notifications) — large but mostly mechanical;
   gate behind a feature flag if you want to roll incrementally.
5. **Section 6** (SDK regen tooling) — process improvement, do whenever
   convenient.
6. **Sections 4, 5, 8, 9** — Rust-port specific or already-correct in TS.
   Skim and confirm.

Each section is self-contained. The platform's compile-time UoW seal,
authorization checks, etc. are not touched by any of this.

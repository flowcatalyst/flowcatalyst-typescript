# TS vs Rust — Business-Rule Gaps

Tracking doc for handoff item 6. Each row below is a place where the
Rust platform (`../flowcatalyst-rust/crates/fc-platform/`) enforces a
business-rule check that the TypeScript port doesn't.

**Rules of engagement:**
- Each fix is its own PR.
- Each PR includes a test that reproduces the rule.
- The Rust file is the source of truth for *what* the check should do;
  port the spirit, not the line-by-line code.
- DO NOT bundle fixes — the handoff is explicit: one gap, one PR.

Audit scope: pass 1 covered 16 aggregate-operation pairs; pass 2
covered another ~14; **pass 3 (2026-05-30) covered the remaining ~60
pairs** across auth/oauth/idp/auth-config/webauthn, config-access, cors,
platform-config, anchor, email-domain-mapping, scheduled-job, the
remaining app/event-type/dispatch-pool/subscription/role/principal/
service-account/client/process operations, and all `sync-*` ops. Pass-3
findings are catalogued in their own section below. The audit is now
**complete** — there are no un-diffed aggregate pairs left.

## BLOCKERs (data corruption risk)

These let you delete an aggregate row while other rows still reference
it. The references become orphans; downstream queries and UI break.

| # | Operation | Rust source | What the check enforces |
|---|---|---|---|
| 1 | ~~**`application/delete`**~~ FIXED | `crates/fc-platform/src/application/operations/delete.rs:85-143` | Refuses delete when access grants, client configs, service accounts, application roles, or principal refs still reference the application. Ported + tested. |
| 2 | ~~**`role/delete`**~~ FIXED | `crates/fc-platform/src/role/operations/delete.rs:92-110` | Refuses delete when principals still hold this role. Ported + tested (rolled with MINOR #7). |
| 3 | ~~**`client/delete`** (a)~~ FIXED | `crates/fc-platform/src/client/operations/delete.rs:81-99` | Refuses delete when principals still have this as their *home* client. Ported + tested. |
| 4 | ~~**`client/delete`** (b)~~ FIXED | `crates/fc-platform/src/client/operations/delete.rs:104-136` | Refuses delete when access grants or application configs still reference the client. Ported + tested (bundled with (a)). |

**Current TS state for (1)-(4):**
- `application/delete-application.ts` — collapsed in commit `90d3adfd`; has no reference checks.
- `role/delete-role/use-case.ts` — checks `RoleSource.CODE` protection only; no assignment count.
- `client/delete-client/use-case.ts` — line 60 has the literal comment `// TODO: Check if client has any users or resources` followed by "For now, we allow deletion".

## MAJORs (business behaviour deviation)

| # | Operation | Issue |
|---|---|---|
| 5 | ~~**`dispatch-pool/delete`**~~ ACCEPTED DIVERGENCE | Rust hard-deletes; TS soft-deletes (`status = ARCHIVED`). **Decision (2026-05-29): keep TS soft-delete.** Both ports emit the same `DispatchPoolDeleted` wire event, so cross-port behaviour is identical; only the local DB outcome differs and no other port reads this DB. TS's ARCHIVED status is intentional and shared with `sync-pools` (archives pools dropped from config) and `update-pool` (refuses to mutate archived pools). Not a gap to fix — divergence documented in `delete-pool/use-case.ts`. If cross-port DB parity ever becomes a requirement, revisit by aligning Rust→TS (add soft-delete to Rust), not the reverse. |
| 6 | ~~**`principal/delete-user`**~~ FIXED | **Audit pass 1 was wrong** — the TS use case is NOT missing; it exists at `application/principal/delete-user/` and is in fact *stricter* than Rust (adds a `NOT_A_USER` type guard). The real gap was a single missing rule: "cannot delete your own account". Ported (`CANNOT_DELETE_SELF`, checked before the repo lookup) + tested. |

## MINORs (edge-case strictness)

| # | Operation | Issue |
|---|---|---|
| 7 | ~~**`role/delete`**~~ FIXED | TS blocks `RoleSource.CODE` only; Rust also blocks SDK-synced roles. Add the SDK-source check (`crates/fc-platform/src/role/operations/delete.rs:81-86`). Tightened to `!== DATABASE` while fixing BLOCKER #2. |
| 8 | ~~**`subscription/create`**~~ FIXED | Code pattern tightened to `^[a-z][a-z0-9-]*[a-z0-9]$` (min 2 chars); now matches Rust. |
| 9 | ~~**`client/create`**~~ FIXED | Identifier tightened to `^[a-z][a-z0-9-]*[a-z0-9]$`, length 2-50. **Caveat carried into the fix commit:** if any production client has an identifier with `_`, a leading digit, or a trailing hyphen, that row can't be re-created through this API after the fix. Existing rows aren't touched (this is the create path only). |
| 10 | ~~**`service-account/update`**~~ FIXED | Name 1-100, description max 500. Ported + tested. |

## Clean — no gaps found

These pairs were read and the TS use case already enforces every
business rule its Rust counterpart does (or is stricter):

**Pass 1:**
- `principal/assign-roles` (USER-type check + role-existence check both present)
- `event-type/archive` — TS is in fact *stricter* than Rust (TS requires all spec versions DEPRECATED before archive; Rust does not). No backwards gap.
- `event-type/finalise-schema` (auto-deprecate of existing CURRENT versions present)
- `role/create-role` (code uniqueness within scope present)
- `process/delete` (archived-only check present)
- `process/archive` (per audit; not deep-read)
- `event-type/delete` (per audit; not deep-read)
- `service-account/delete` (Rust has no business-rule checks beyond find/404; TS matches)
- `connection/delete` (subscription blocker present in TS)
- `subscription/create` apart from MINOR #8

**Pass 2:**
- `principal/create-user` (email uniqueness, password handling, email-domain resolution all present; TS adds PARTNER-scope merge logic on top)
- `principal/update-user` (scope validation, client_id rules, no-changes check all present)
- `principal/activate-user` ("already active" check present)
- `app/update-application` (name validation matches)
- `event-type/create-event-type` (4-segment code format check matches; TS decomposition differs but enforces the same rule)
- `process/create-process` (3-segment code format + uniqueness present)
- `subscription/update-subscription` (event-types ≥1, dispatch-pool + connection existence checks all present)
- `subscription/delete-subscription` (Rust has no business rules; TS matches)
- `role/update-role` (DATABASE-source-only check present)
- `dispatch-pool/update-pool` (rate-limit/concurrency ≥1 + archived check both present)
- `client/update-client` (name validation, no-changes return present)
- `connection/create-connection` (TS is *stricter* — adds client-existence + scoped uniqueness checks the Rust version lacks)
- `connection/update-connection` (status-enum check present)

## Audit pass 3 (2026-05-30)

~60 operation pairs diffed across 5 clusters. Headline: the identity/auth
cluster (oauth, idp, auth-config, webauthn, login/password-reset) is
**100% clean or TS-stricter — 0 gaps**. The real findings cluster in the
`sync-*` reconcile operations. New numbered gaps below continue the
pass-1/2 numbering.

### BLOCKER

| # | Operation | Rust source | What's missing |
|---|---|---|---|
| 11 | ~~**`role/sync-roles`**~~ FIXED | `crates/fc-platform/src/role/operations/sync.rs:194-215` | On `removeUnlisted`, the sync deleted unlisted SDK roles via `deleteById` with **no** assignment check, orphaning `iam_principal_roles` rows (the junction has no DB-level FK on `role_name`). `delete-role` already enforces this guard (BLOCKER #2); sync didn't. Fixed with a pre-flight `countAssignments` check that aborts the whole sync with `ROLE_HAS_ASSIGNMENTS` — mirrors Rust. Ported + tested (`__tests__/sync-roles.test.ts`). |
| 16b | ~~**`subscription/sync-subscriptions`** (cross-app delete)~~ FIXED | `crates/fc-platform/src/subscription/operations/sync.rs` | **Confirmed cross-application data loss.** The `removeUnlisted` sweep used `findAnchorLevel()` (filters only on `clientId: null`, **not** `applicationCode`) and deleted any unlisted API sub — so an app-A sync deleted app-B's anchor-level API subscriptions. Fixed by scoping the sweep to `sub.applicationCode === command.applicationCode`, matching Rust's `find_by_application_code`. Ported + tested (`__tests__/sync-subscriptions.test.ts`). The CODE-source half of this finding (#16a) remains open below. |

### MAJOR — sync/reconcile-semantics divergences (need a decision, like #5)

These are all behavioural deviations in `sync-*` ops. Per the #5
precedent, these are **maintainer decisions, not unilateral ports** — the
question each time is "align TS→Rust, accept the TS divergence, or align
Rust→TS." Listed with a recommendation; **none fixed yet.**

| # | Operation | Divergence | Recommendation |
|---|---|---|---|
| 12 | `scheduled-job/sync-scheduled-jobs` | Rust supports `archive_unlisted` (archives ACTIVE jobs absent from payload) and force-reactivates re-listed non-ACTIVE jobs; TS has neither (purely additive, never archives, leaves re-listed PAUSED/ARCHIVED jobs as-is). `sync.rs:108-251`. | Likely port — sync should reconcile, not just add. Confirm `archiveUnlisted` is wanted. |
| 13 | `app/attach-service-account-to-application` | Rust blocks attach if *any* SA already attached (`APPLICATION_HAS_SERVICE_ACCOUNT`); TS allows re-attaching the *same* SA (idempotent retry). `attach_service_account.rs:99-105`. | **Accept divergence** — TS relaxation is intentional and documented in the file header (idempotent retry path). Mark accepted. |
| 14 | `event-type/sync-event-types` | (a) Rust syncs `Api` OR `Code`-sourced types; TS only `API`. (b) Rust syncs each item's inline `schema` as SpecVersion "1.0"; the TS `SyncEventTypeItem` has no `schema` field, so schemas aren't synced here at all. `event_type/operations/sync.rs:89-242`. | Decision needed: is CODE-source mutate-by-sync wanted? Is inline-schema-on-sync wanted (TS uses a separate schema-sync path with different versioning)? |
| 15 | `dispatch-pool/sync-pools` | Rust matches/archives against ALL pools (`find_all`, any `client_id`); TS scopes strictly to anchor-level (`clientId: null`). So an anchor sync in Rust can mutate/archive client-scoped pools; TS creates a parallel anchor-level pool and never touches client-scoped ones. `dispatch_pool/operations/sync.rs:68-203`. | Likely **accept** — TS's anchor-scoping looks deliberate and safer (an anchor sync shouldn't clobber client pools). Confirm. |
| 16a | `subscription/sync-subscriptions` (source scope) | Rust syncs `Api` OR `Code`-sourced subs; TS only touches `API`, so CODE-sourced subs are never updated/removed by sync. (The cross-app delete half, #16b, was confirmed a BLOCKER and is fixed above.) `subscription/operations/sync.rs:80-287`. | Decision needed: should sync mutate CODE-sourced subs? (Same question as #14.) |
| 17 | `client/change-client-status` | TS collapses Rust's separate activate/suspend ops into one generic status setter guarded only by `STATUS_UNCHANGED`. Missing: `CANNOT_SUSPEND_INACTIVE` (Rust forbids INACTIVE→SUSPENDED) and suspend-reason required/≤500-char validation. `client/operations/suspend.rs:43-115`. | Port the two missing suspend guards (safe additive validation); keep the unified-op shape. |

### MINOR — edge-case strictness (safe additive ports)

| # | Operation | Gap | Rust source |
|---|---|---|---|
| 18 | `scheduled-job/create-scheduled-job` + `update-scheduled-job` | No bounds check on `deliveryMaxAttempts` (Rust enforces 1-20, `INVALID_DELIVERY_ATTEMPTS`); update also lacks Rust's `NO_CHANGES` no-op guard (TS bumps version on an empty patch). | `scheduled_job/operations/create.rs:85-90`, `update.rs:80-87,182-187` |
| 19 | `event-type/update-event-type` | No `CANNOT_UPDATE_ARCHIVED` guard (TS will update an archived event type) and no `NO_CHANGES` short-circuit (emits `EventTypeUpdated` on a no-op). | `event_type/operations/update.rs:101-135` |
| 20 | `process/update-process` | No up-front `PROCESS_ID_REQUIRED` check — empty id falls through to `PROCESS_NOT_FOUND`. Same net rejection, different code. Cosmetic. | `process/operations/update.rs:48-53` |
| 21 | `platform-config/set` | No use-case-level empty-field validation for appCode/section/property. **Unreachable via HTTP** (they're URL path params), so cosmetic. | `platform_config/operations/set_property.rs:51-68` |

### Cosmetic / accepted (no action)

- **Whitespace trim:** Rust `trim()`s domain/origin inputs before
  normalizing (cors, anchor, email-domain-mapping); TS lowercases but
  doesn't trim. Edge-case only (whitespace-padded inputs).
- **CORS origin case:** Rust preserves case; TS lowercases. Origins are
  conventionally lowercase; affects only mixed-case dup-detection.
- **`idp_role_mapping` `MAPPING_EXISTS` uniqueness** (Rust
  `create_idp_role_mapping.rs:68-80`): no TS *admin* CRUD path exists —
  TS only auto-syncs mappings via the OIDC sync service. Not a current
  gap; reproduce the guard *if* an admin create/delete path is ever added.

### Pass-3 clean / TS-stricter (no gaps)

oauth (all 6 ops), identity-provider (all), auth-config (all), webauthn
(all 3, enforced in the infra layer), config-access (grant/update/revoke),
cors/delete, email-domain-mapping (create/update/delete), platform-config/
delete, anchor (all 3), scheduled-job (archive/delete/pause/resume/fire),
app (activate/deactivate/enable-for-client/disable-for-client),
event-type (add-schema/deprecate-schema), dispatch-pool/create-pool,
principal (deactivate-user/sync-principals), service-account
(regenerate-token/regenerate-secret/assign-roles — all TS-stricter),
client (add-note/update-applications), process/sync-processes.

## Pending audit

**None.** All aggregate-operation pairs have been diffed across passes
1-3. Re-open only if new operations are added to the Rust platform.

## Suggested fix order

1. ~~**BLOCKER #1** (`application/delete`)~~ — fixed (commit `8c0ac93b`).
2. ~~**BLOCKER #2** (`role/delete`)~~ — fixed (commit `78402bbe`, bundled MINOR #7).
3. ~~**BLOCKER #3 (a)+(b)** (`client/delete`)~~ — fixed (commit `6fa96adb`).
4. ~~**MINOR #8** (`subscription/create` regex)~~ — fixed (commit `15847b74`).
5. ~~**MINOR #10** (`service-account/update` lengths)~~ — fixed.
6. ~~**MINOR #9** (`client/create` identifier)~~ — fixed.
7. ~~**Audit pass 3**~~ — done (2026-05-30). Findings in the pass-3 section.
8. ~~**MAJOR #5**~~ — resolved as accepted divergence (keep TS soft-delete).
9. ~~**MAJOR #6**~~ — fixed. Turned out to be a one-line guard, not a missing operation (audit pass 1 mis-classified it).
10. ~~**BLOCKER #11** (`role/sync-roles`)~~ — fixed (assignment-orphan guard + test).
11. ~~**BLOCKER #16b** (`subscription/sync-subscriptions`)~~ — fixed (per-application delete scoping + test).

All catalogued gaps from passes 1 & 2 are resolved, and the audit is now
complete (pass 3 closed every remaining aggregate pair). **Both pass-3
data-corruption BLOCKERs (#11, #16b) are fixed.** Outstanding item-6 work,
none of it data-loss:
- **MAJORs #12, #14, #15, #16a, #17** are reconcile-semantics decisions
  (the #5 pattern): align TS→Rust, accept, or align Rust→TS. **#13 and #15
  are recommended ACCEPTED** (intentional/safer TS behaviour).
- **MINORs #18-#21** are safe additive validation ports, one commit each.

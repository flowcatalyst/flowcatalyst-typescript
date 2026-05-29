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
covered another ~14. Aggregates still un-audited are listed under
**Pending audit** at the bottom — re-run the auditor to cover them.

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
| 6 | **`principal/delete-user`** | Operation entirely missing in TS. Rust enforces "cannot delete your own account" (`crates/fc-platform/src/principal/operations/delete.rs:64-69`). Note: porting this is more than a rule — it's a whole use case + API route + delete-user authorization. |

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

## Pending audit

Still uncovered after two passes. Re-run the audit before declaring
item 6 complete.

- `auth/operations/*` — login, refresh, logout, password reset, etc.
- `oauth/operations/*` — OAuth client lifecycle (create / activate / deactivate / etc.)
- `identity-provider/operations/*` — IDP CRUD + sync
- `email-domain-mapping/operations/*`
- `anchor/operations/*` — anchor-domain CRUD
- `config-access/operations/*` — grant / revoke / update
- `cors/operations/*` — add / delete CORS origins
- `auth-config/operations/*`
- `platform-config/operations/*`
- `scheduled-job/operations/*` — pause / resume / archive / fire / sync etc.
- `app/activate-application`, `app/deactivate-application`, `app/attach-service-account-to-application`, `app/enable-application-for-client`, `app/disable-application-for-client`
- `event-type/add-schema`, `event-type/deprecate-schema`, `event-type/sync-event-types`, `event-type/update-event-type`
- `role/sync-roles`
- `dispatch-pool/create-pool`, `dispatch-pool/sync-pools`
- `subscription/sync-subscriptions`
- `principal/deactivate-user`, `principal/sync-principals`
- `service-account/regenerate-auth-token`, `service-account/regenerate-signing-secret`, `service-account/assign-service-account-roles`
- `client/change-client-status`, `client/add-client-note`, `client/update-client-applications`
- `process/update-process`, `process/sync-processes`
- All the `sync-*` operations across aggregates (consistent shape; should be a batched audit)

## Suggested fix order

1. ~~**BLOCKER #1** (`application/delete`)~~ — fixed (commit `8c0ac93b`).
2. ~~**BLOCKER #2** (`role/delete`)~~ — fixed (commit `78402bbe`, bundled MINOR #7).
3. ~~**BLOCKER #3 (a)+(b)** (`client/delete`)~~ — fixed (commit `6fa96adb`).
4. ~~**MINOR #8** (`subscription/create` regex)~~ — fixed (commit `15847b74`).
5. ~~**MINOR #10** (`service-account/update` lengths)~~ — fixed.
6. ~~**MINOR #9** (`client/create` identifier)~~ — fixed.
7. **Audit pass 3** — cover the remaining aggregates in **Pending audit**.
8. ~~**MAJOR #5**~~ — resolved as accepted divergence (keep TS soft-delete).
9. **MAJOR #6** (`principal/delete-user`) — whole operation; needs use case + API route + auth. Decide intent before coding.

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

Audit scope: 16 aggregate-operation pairs covered in the first pass.
Aggregates not yet audited are listed under **Pending audit** at the
bottom — re-run the auditor to cover them.

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
| 5 | **`dispatch-pool/delete`** | Rust hard-deletes (`crates/fc-platform/src/dispatch_pool/operations/delete.rs`); TS soft-deletes (`status = ARCHIVED`). Decide which is canonical — and align Go/Laravel too if TS is right, since this is wire-adjacent behaviour. Out of scope for a single-gap PR; needs a cross-port alignment decision first. |
| 6 | **`principal/delete-user`** | Operation entirely missing in TS. Rust enforces "cannot delete your own account" (`crates/fc-platform/src/principal/operations/delete.rs:64-69`). Note: porting this is more than a rule — it's a whole use case + API route + delete-user authorization. |

## MINORs (edge-case strictness)

| # | Operation | Issue |
|---|---|---|
| 7 | ~~**`role/delete`**~~ FIXED | TS blocks `RoleSource.CODE` only; Rust also blocks SDK-synced roles. Add the SDK-source check (`crates/fc-platform/src/role/operations/delete.rs:81-86`). Tightened to `!== DATABASE` while fixing BLOCKER #2. |
| 8 | **`subscription/create`** | Code pattern in TS allows trailing hyphens (`^[a-z][a-z0-9-]*$`); Rust enforces ending alphanumeric (`^[a-z][a-z0-9-]*[a-z0-9]$`, min 2 chars). Tighten the TS regex to match (`crates/fc-platform/src/subscription/operations/create.rs:114-119`). |

## Clean — no gaps found in audit pass 1

These pairs were read and the TS use case already enforces every
business rule its Rust counterpart does:

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

## Pending audit

Item 6 was capped at ~30 pairs to avoid blowing through context. The
following aggregates have Rust operations files that haven't been
diffed against TS yet. Re-run the audit on these before declaring
item 6 complete:

- `auth/operations/*` — login, refresh, logout, password reset, etc.
- `oauth/operations/*` — OAuth client lifecycle (create/activate/deactivate/etc.)
- `identity-provider/operations/*` — IDP CRUD + sync
- `email-domain-mapping/operations/*`
- `anchor/operations/*` — anchor-domain CRUD
- `config-access/operations/*` — grant / revoke / update
- `cors/operations/*` — add / delete CORS origins
- `auth-config/operations/*`
- `platform-config/operations/*`
- `scheduled-job/operations/*` — pause / resume / archive / fire / sync etc.
- `app/activate-application`, `app/deactivate-application`, `app/update-application`, `app/attach-service-account-to-application`, `app/enable-application-for-client`, `app/disable-application-for-client`
- `event-type/add-schema`, `event-type/deprecate-schema`, `event-type/sync-event-types`, `event-type/update-event-type`, `event-type/create-event-type`
- `role/update-role`, `role/sync-roles`
- `dispatch-pool/create-pool`, `dispatch-pool/update-pool`, `dispatch-pool/sync-pools`
- `subscription/update-subscription`, `subscription/delete-subscription`, `subscription/sync-subscriptions`
- `principal/*` (everything except `assign-roles` and the missing `delete-user`)
- `service-account/regenerate-auth-token`, `service-account/regenerate-signing-secret`, `service-account/update-service-account`, `service-account/assign-service-account-roles`
- `client/update-client`, `client/create-client`, `client/change-client-status`, `client/add-client-note`, `client/update-client-applications`
- `process/create-process`, `process/update-process`, `process/sync-processes`
- `connection/create-connection`, `connection/update-connection`

## Suggested fix order

1. **BLOCKER #1** (`application/delete`) — handoff named this one explicitly. Smallest reference-count check to port; clean test case.
2. **BLOCKER #2** (`role/delete`) — analogous shape to #1.
3. **BLOCKER #3 (a)** (`client/delete` home-principal blocker) — highest user-visible impact.
4. **BLOCKER #3 (b)** (`client/delete` reference blockers) — bundle with (a) only if it fits in one PR.
5. **MINOR #7** (`role/delete` SDK-source check) — drop-in addition to the role-delete file; could ride with BLOCKER #2.
6. **MINOR #8** (`subscription/create` regex) — one-line tightening; could be its own PR or bundle with the next subscription fix.
7. **MAJOR #5, #6** — decide architectural intent before coding.

Re-run audit on the **Pending audit** list before #7.

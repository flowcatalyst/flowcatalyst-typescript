# FlowCatalyst TypeScript — Comprehension & DX Improvements

---

## ⚑ Progress (as of 2026-05-29)

> Added by the agent that worked the original brief below. The brief
> further down is the *original plan* — read this section first for
> current state. Source of truth is `git log`; commit hashes cited below.
> All commits are **local only — nothing has been pushed.**

### Status by item

| Item | State | Commits |
|---|---|---|
| 1. Ship `clients/typescript-sdk/examples/` | **Partial** — 2 of 5 apps shipped (`list-event-types`, `order-service`). The other 3 (`fc-sync`, `webhook-receiver`, `scheduled-jobs-runner`) were deferred: the TS SDK lacks the primitives (sync orchestrator, HMAC validator, scheduled-jobs runner). Documented in `clients/typescript-sdk/examples/README.md`. | `ad1caadd` |
| 2. Typed mediation errors | **Done** — string-matching replaced with undici `instanceof` + Node `.code`; then a full `MediationError` class hierarchy (`mediation-error.ts`) so callers never touch undici. | `a5207fd4`, `801f1bb0` |
| 3a. Split `queue-manager-service.ts` | **Done** — 1866 → 796 lines; 9 sub-modules under `services/queue-manager/`. `max-lines` lint rule added (error at 800). | `f7322473` |
| 3b. Split `applications.ts` | **Done** — 1033 → 7 files under `api/admin/applications/`. | `de5c8f1c` |
| 4. Collapse 3-file use-case pattern | **Pilot only** — 3 of 91 ops collapsed (`create-application`, `delete-application`, `create-role`). **88 remain — awaiting review of the pilot before sweep.** | `90d3adfd` |
| 5. SDK doc header + `ERRORS.md` | **Done** | `1797a122` |
| 6. Port missing Rust business rules | **Passes 1+2 fully resolved.** All 3 BLOCKERs, both MINORs in scope, both MAJORs done/decided. See `BUSINESS_RULE_GAPS.md` (committed) for the full ledger. | `bd8b294f`, `8c0ac93b`, `78402bbe`, `6fa96adb`, `15847b74`, `4bc1dde9`, `af0f7468`, `24c31617`, `ec7ee5d0`, `880367cd` |

### Also done (not in the original brief)

- **Stuck-message reaper** on the in-flight tracker (`01a12a1e`) — user-authored; mirrors Rust's `IN_PIPELINE_TTL`.
- **Env consolidation** (`de378b73`) — entrypoint's 41 scattered `process.env` reads collapsed into a validated `appEnv` (`apps/flowcatalyst/src/env.ts`) using the existing `@flowcatalyst/config` `parseEnv`. 9 direct reads remain on purpose (runtime writes + mutated `DATABASE_URL`).

### Remaining work

1. **Item 4 sweep** — collapse the other 88 three-file operations under `packages/platform/src/application/`. Pattern is proven by the pilot (`90d3adfd`); mechanical. Get pilot sign-off first.
2. **Item 6 — audit pass 3** — ~20 aggregate-pairs still un-diffed (auth, oauth, identity-provider, scheduled-job, all `sync-*` ops, etc.). Full list under "Pending audit" in `BUSINESS_RULE_GAPS.md`. Same method as passes 1-2 (delegate to an Explore agent).
3. **Item 1 remainder** — the 3 deferred SDK examples, each blocked on building a TS SDK primitive first (sync / webhook / runner).
4. **Flaky test** — `packages/message-router/src/__tests__/in-flight-tracker.test.ts` uses `setTimeout(r, 2)`; flakes under full-suite load. Bump to ~20ms.

### Test/lint baseline (so you can spot regressions)

- `pnpm test`: **31 failing / 472 passing** at last run. The **31 failures are pre-existing** (in `packages/tsid` and `packages/http`, unrelated to any of this work) — they were failing before the session started. Don't treat them as new.
- `pnpm typecheck`: **2 errors**, both in `apps/flowcatalyst/src/embedded-postgres.ts` (`LOCALAPPDATA` / `XDG_CACHE_HOME` need bracket access) — these are **uncommitted WIP from the human**, not agent work.
- `pnpm lint`: 7 warnings + 2 errors (`no-throw-literal`), all pre-existing.

### Uncommitted at handoff

Human's in-progress SEA/embedded-postgres work, left untouched by the agent:
`apps/flowcatalyst/src/embedded-postgres.ts`, `apps/flowcatalyst/tsup.config.ts`,
`apps/flowcatalyst/scripts/pack-postgres.js`. And `HANDOFF.md` itself is untracked.

---

## What this file is

A handoff brief for an AI agent (or human contributor) picking up work on the
TypeScript FlowCatalyst codebase. The goal is **comprehension and
developer-experience parity** with the Rust and Go ports of FlowCatalyst —
without changing wire contracts.

The Rust platform (`../flowcatalyst-rust/`) is the canonical spec for HTTP
shapes, signing, and TSID format. The Go port (`../flowcatalyst-go/`) is the
most recent and shows what "easy to read FlowCatalyst code" can look like.
Reference both when you need a tiebreaker.

## Context the agent needs

- The TS codebase lives at this repo root, with workspaces under `apps/`,
  `packages/`, and `clients/`.
- The TypeScript SDK consumers will use is at `clients/typescript-sdk/`.
- Sibling repos for cross-reference (read-only — do not edit):
  - **Rust:** `/Users/andrewgraaff/Developer/flowcatalyst-rust/` —
    canonical wire spec; richest business rules.
  - **Go:** `/Users/andrewgraaff/Developer/flowcatalyst-go/` — the
    template for "easy to comprehend FlowCatalyst code." See in particular
    `pkg/fcsdk/doc.go`, `pkg/fcsdk/examples/`, and
    `internal/platform/application/operations/` for the per-aggregate
    one-file-per-operation pattern.

## What's been observed

Measured against the Go and Rust ports of the same code:

- `packages/platform/src/api/admin/applications.ts` — **1033 lines**, one file.
  Go equivalent (`internal/platform/application/api/api.go`) is 286 lines.
- `packages/message-router/src/services/queue-manager-service.ts` — **1866
  lines**, one file. Past ~800 lines comprehension drops sharply.
- `packages/queue-core/src/mediation/http-mediator.ts` lines 395-418 — error
  detection works by string-matching on `error.message`
  (`message.includes("etimedout")`, `message.includes("econnrefused")`, etc.).
  The Go and Rust ports use typed errors and never grep error text.
- `clients/typescript-sdk/` has a `README.md` but **no `examples/` directory**.
  Both Go (`pkg/fcsdk/examples/`) and Rust
  (`crates/fc-sdk/examples/`) ship runnable example apps.
- Use cases are split across three files (`command.ts` / `use-case.ts` /
  `index.ts`) per operation — e.g.
  `packages/platform/src/application/app/delete-application/`. The Go and Rust
  ports keep each operation in a single file.
- Some Rust operations have business-rule checks the TS versions are missing.
  Confirmed example: `crates/fc-platform/src/application/operations/delete.rs`
  refuses delete when access grants / client configs / service accounts /
  roles / principal refs still reference the application
  (`crates/fc-platform/src/application/operations/delete.rs:85-143`). The TS
  `delete-application/use-case.ts` does not. Likely other aggregates have
  similar gaps.

## Prioritized work

Each item is a separate PR. Do **not** bundle. Open a tracking issue before
starting (3) or (4) — those touch many files and you should get a green light
on the file list before sweeping.

### 1. Ship `clients/typescript-sdk/examples/` *(highest ROI, lowest risk)*

Mirror the Go SDK examples at
`/Users/andrewgraaff/Developer/flowcatalyst-go/pkg/fcsdk/examples/`. Five apps:
- `order-service` — end-to-end UoW flow; the single best "how do I write a
  consumer app" reference.
- `fc-sync` — declarative reconciliation across roles, event types, dispatch
  pools, subscriptions.
- `webhook-receiver` — HMAC-validated inbound webhook handler with sentinel-based
  error mapping.
- `scheduled-jobs-runner` — webhook-driven runner with two handlers.
- `list-event-types` — minimal client + auth wiring.

Wire them so `pnpm tsx clients/typescript-sdk/examples/<name>/main.ts` runs them.
Each example gets its own `README.md` with `# Run` instructions.

### 2. Replace string-matching error detection with typed errors

File: `packages/queue-core/src/mediation/http-mediator.ts`.

- `isConnectionTimeout` (lines 395-406) and `isBodyTimeout` (lines 408-418)
  detect failures by `error.message.includes(...)` and `error.name === "..."`.
- Replace with branching on `error.name` only (undici exposes
  `ConnectTimeoutError`, `BodyTimeoutError`, `HeadersTimeoutError` as typed
  errors via the `.name` field, which is stable).
- Even better: introduce a `MediationFailure` discriminated union or
  `MediationError` subclass hierarchy and have `executeRequest` throw / return
  those instead of `Error`. Other callers stop having to know undici's
  internals.
- Reference shape: see the typed `MediationOutcome` constructors in
  `../flowcatalyst-go/internal/common/` and the Rust version in
  `../flowcatalyst-rust/crates/fc-common/src/`.

### 3. Split the mega-files

Two files, two PRs:

**3a.** `packages/message-router/src/services/queue-manager-service.ts` —
1866 lines → ideally 4-6 files of ~300 each. Suggested splits (verify by
reading the file): registration / dispatch / completion / lifecycle /
health-reporting. **Do not change behaviour.** Move methods, update imports,
keep test results identical.

**3b.** `packages/platform/src/api/admin/applications.ts` — 1033 lines →
split per route group:
- CRUD (list / get / create / update / delete)
- activation (activate / deactivate)
- provisioning (service-account attach, OAuth client create)
- client-config sub-aggregate (enable/disable for client, list configs)

**Add an ESLint `max-lines` rule** in the same PR as 3a (warn at 500, error at
800) so this doesn't regress.

### 4. Consolidate per-use-case three-file split

Pilot on three aggregates first (suggested:
`application/app/delete-application/`, `application/app/create-application/`,
`role/create-role/`). Collapse `command.ts` + `use-case.ts` + `index.ts` into
a single file named after the operation
(`delete-application.ts`, `create-application.ts`, `create-role.ts`).

Get review on the pilot, then sweep the rest of `packages/platform/src/application/`.

Reference: the Go port keeps each operation in one file — see
`../flowcatalyst-go/internal/platform/application/operations/delete.go` (58
lines, contains command + use case + interface assertion).

### 5. Add a top-level SDK doc

In `clients/typescript-sdk/src/index.ts`, add an extensive JSDoc header
matching the structure of `../flowcatalyst-go/pkg/fcsdk/doc.go`:
- Mental model (request → execution context → use case → UoW → outbox)
- Package map (one line per exported namespace, what's in it)
- Pointer to `examples/`
- Pointer to `ERRORS.md` (write this too — match
  `../flowcatalyst-go/pkg/fcsdk/ERRORS.md`)

The Go doc.go is the template. Don't invent new structure.

### 6. Port missing business-rule checks from Rust

Audit each file under `crates/fc-platform/src/*/operations/*.rs` against the
matching `packages/platform/src/application/*/use-case.ts`. Where Rust
performs a business-rule check the TS version doesn't:
- File a tracking issue listing every gap (don't try to fix in one PR).
- Each fix = its own PR with a test that reproduces the rule.

Confirmed first gap: `delete-application` is missing the reference-count
blocker. See `crates/fc-platform/src/application/operations/delete.rs:85-143`.

## What to skip / leave alone

- **`clients/typescript-sdk/src/generated/`** — OpenAPI-generated client code,
  regenerated from `openapi.yaml`. Any hand-edits will be lost on regen.
- **The Fastify plugin / DI registry layer.** It works; restructuring it is
  risk for no comprehension gain at the file level.
- **Request / response shapes.** The Rust platform is the wire spec; all four
  SDKs (Rust, TS, Laravel, Go) must serialize identically. DTO renames
  require coordinating all four — out of scope for this work.
- **Replacing TypeBox** with another validator. Doesn't help comprehension.
- **Renaming `MediationOutcome` / `ProcessingResult` / `QueueMessage`** etc.
  Wire types — see above.

## Working agreement

- One PR per top-level item. No bundling.
- Run `pnpm test` and `pnpm build` after every change.
- If a test that was passing before fails after your change, that's a real
  behavioural change — describe it in the PR; don't silently fix the test.
- Don't add new dependencies without checking `package.json` first. The SDK is
  intentionally light.
- Don't skip pre-commit hooks (no `--no-verify`).
- For items (3) and (4): file a tracking issue listing files first; get
  approval; then sweep.

## Verification checklist (before opening PR)

- [ ] `pnpm build` clean
- [ ] `pnpm test` green
- [ ] `pnpm lint` clean (after item 3a adds `max-lines`, this enforces)
- [ ] No new direct dependencies in `package.json` unless justified
- [ ] Behavioural diff explained in PR description if any
- [ ] Cross-language wire compatibility unchanged (DTO field names, signing
      format, TSID format)

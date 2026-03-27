# FlowCatalyst — System Architecture

## Context

FlowCatalyst is a distributed event-driven platform that provides Identity & Access Management (IAM), OAuth 2.0 / OIDC authentication, multi-tenant administration, and reliable event dispatch to customer webhook endpoints. It follows Domain-Driven Design with event sourcing, CQRS read models, and the transactional outbox pattern.

The system is built as a TypeScript monorepo and can run as a single unified process or as independent services. It supports pluggable message brokers (SQS, NATS, ActiveMQ, embedded SQLite) and hot primary/standby failover via Redis distributed locks.

---

## System Context (C4 Level 1)

```
                    ┌──────────────┐
                    │   Admin UI   │
                    │  (Vue 3 SPA) │
                    └──────┬───────┘
                           │ REST API
                           v
┌──────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Customer  │────>│    Platform     │────>│  Message Broker   │
│ App / SDK │     │ (IAM + OIDC +  │     │ (SQS/NATS/AMQ/   │
│           │<────│  Admin + Event  │     │  Embedded SQLite) │
└──────────┘     │  Dispatch)      │     └────────┬──────────┘
                  └────────┬────────┘              │
                           │                       v
                  ┌────────v────────┐     ┌────────────────┐
                  │   PostgreSQL    │     │ Message Router  │──── HTTP ────> Customer Webhook
                  │   (Primary DB)  │     │ (Queue Consumer │
                  └─────────────────┘     │  + HTTP Mediator)│
                                          └─────────────────┘
```

**External actors:**
- **Admin UI** — Vue 3 SPA for platform administration (users, clients, subscriptions, event types).
- **Customer App / SDK** — Applications integrating via TypeScript SDK, Laravel SDK, or direct API. Publishes events via the transactional outbox pattern.
- **Customer Webhook** — HTTP endpoints that receive dispatched events.

**Core services:**
- **Platform** — IAM, OIDC provider, Admin/SDK/BFF APIs, event dispatch pipeline, dispatch scheduler.
- **Message Router** — Consumes from broker, enforces per-pool concurrency and rate limits, mediates HTTP calls to webhooks.
- **Stream Processor** — CQRS read model projections from PostgreSQL feed tables.
- **Outbox Processor** — Polls customer outbox tables and POSTs batches to platform SDK endpoints.

**Infrastructure:**
- **PostgreSQL** — Primary data store for all aggregates, events, dispatch jobs, audit logs, and CQRS projections.
- **Message Broker** — SQS (production), NATS, ActiveMQ, or embedded SQLite. At-least-once delivery.
- **Redis** — Distributed lock for primary/standby HA (optional).
- **AWS ALB** — Load balancer integration for traffic management (optional).

---

## Container View (C4 Level 2)

All services run from a single unified application (`apps/flowcatalyst`) with feature flags, or independently.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         flowcatalyst (unified)                          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         Platform                                 │   │
│  │  ┌────────────┐ ┌──────────┐ ┌───────────┐ ┌────────────────┐  │   │
│  │  │ Admin API   │ │ SDK API  │ │ OIDC      │ │ Dispatch       │  │   │
│  │  │ (CRUD)      │ │ (Batch)  │ │ Provider  │ │ Scheduler      │  │   │
│  │  └────────────┘ └──────────┘ └───────────┘ └────────────────┘  │   │
│  │  ┌────────────┐ ┌──────────┐ ┌───────────┐ ┌────────────────┐  │   │
│  │  │ Domain     │ │ Use Cases│ │ Event      │ │ Connection     │  │   │
│  │  │ Model      │ │ (App)    │ │ Dispatch   │ │ Cache          │  │   │
│  │  └────────────┘ └──────────┘ │ Service    │ └────────────────┘  │   │
│  │                               └───────────┘                      │   │
│  └──────────────────────────────────┬──────────────────────────────┘   │
│                                     │ publishes                        │
│  ┌──────────────┐  ┌───────────────v───────────┐  ┌────────────────┐  │
│  │  Stream      │  │      Message Broker        │  │   Outbox       │  │
│  │  Processor   │  │  (SQS/NATS/AMQ/Embedded)   │  │   Processor    │  │
│  │  (CQRS)      │  └───────────────┬────────────┘  │  (Customer DB) │  │
│  └──────────────┘                  │ consumes       └────────────────┘  │
│                    ┌───────────────v────────────┐                       │
│                    │       Message Router        │                      │
│                    │  (Pools + HTTP Mediation)   │──> Customer Webhook  │
│                    └────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Feature flags** (environment variables):
| Flag | Default | Service |
|------|---------|---------|
| `PLATFORM_ENABLED` | true | Platform (IAM, OIDC, APIs) |
| `MESSAGE_ROUTER_ENABLED` | false | Message Router |
| `STREAM_PROCESSOR_ENABLED` | true | CQRS Projections |
| `OUTBOX_PROCESSOR_ENABLED` | false | Outbox Processor |
| `DISPATCH_SCHEDULER_ENABLED` | false | Dispatch Scheduler |
| `STANDBY_ENABLED` | false | Primary/Standby HA |

---

## Component View (C4 Level 3)

### 1. Platform

The Platform is the core service providing IAM, authentication, administration, and event dispatch.

#### Domain Model

The domain layer follows DDD with aggregates, entities, value objects, and domain events.

| Aggregate | Purpose | Key Status Values |
|-----------|---------|-------------------|
| **Principal** | User and service account identity | active/inactive |
| **Client** | Multi-tenant organization | active/inactive/archived |
| **Application** | Registered application | active/inactive |
| **Role** | RBAC role with permissions | — |
| **Event Type** | Event definition with versioned schemas | current/archived/deprecated |
| **Connection** | Named webhook endpoint | **active/paused** |
| **Subscription** | Routes event types to connections | active/inactive/archived |
| **Dispatch Pool** | Concurrency and rate limit config | active/inactive |
| **Service Account** | Machine identity with auth token + signing secret | active/inactive |
| **OAuth Client** | OAuth 2.0 client (public/confidential) | — |
| **Auth Config** | Client-scoped auth provider config | — |
| **Identity Provider** | OIDC identity provider | — |
| **Email Domain Mapping** | Maps email domains to IDPs and scopes | — |

**Multi-tenancy scoping:**
- All entities carry an optional `clientId`. When null, the entity is anchor-scoped (platform-level). When set, it belongs to a specific tenant.
- Principal scope controls access breadth: ANCHOR (all clients), PARTNER (assigned clients), CLIENT (home client only).

**Event format** (CloudEvents-compatible):
```
eventType:  {application}:{subdomain}:{aggregate}:{event}
            e.g. platform:iam:user:created

subject:    {application}.{aggregate}.{entityId}
            e.g. platform.user.0HZXEQ5Y8JY5Z

messageGroup: {application}:{aggregate}:{entityId}
              e.g. platform:user:0HZXEQ5Y8JY5Z
```

Each aggregate defines events in `domain/{aggregate}/events.ts`. All events carry `eventId`, `correlationId`, `causationId`, `principalId`, and `executionId` for full traceability.

#### Application Layer (Use Cases)

Every mutation follows the same pattern:

```
HTTP Request
  → Create Command DTO
  → Execute Use Case:
      1. Validate input (format, required fields)
      2. Check business rules (uniqueness, FK refs, state transitions)
      3. Create/update domain aggregate
      4. Create domain event
      5. unitOfWork.commit(aggregate, event, command)
         └── Inside transaction:
             a. Persist aggregate
             b. Write event to event store
             c. Find matching subscriptions → create dispatch jobs
             d. Write audit log entry
             e. Commit (all-or-nothing)
      6. Post-commit: publish QUEUED jobs to broker
  → Return Result<TEvent>
```

`Result.success()` can only be returned via `unitOfWork.commit()`. This guarantees that the aggregate state, event, dispatch jobs, and audit log are never separated.

**Use case inventory** (30+ use cases across domains):
- **IAM**: CreateUser, UpdateUser, Activate/Deactivate/DeleteUser, AssignRoles, GrantClientAccess, SyncPrincipals
- **Tenancy**: CreateClient, UpdateClient, ChangeStatus, DeleteClient, AddNote
- **Applications**: Create, Update, Activate/Deactivate, Delete, EnableForClient, DisableForClient
- **Messaging**: CreateSubscription, Update, Delete, SyncSubscriptions; CreateConnection, Update, Delete; CreateDispatchPool, Update, Delete, SyncPools; CreateEventType, Update, Delete, AddSchema, FinaliseSchema, DeprecateSchema, SyncEventTypes
- **Security**: CreateRole, Update, Delete, SyncRoles; CreateServiceAccount, Update, Delete, RegenerateAuthToken, RegenerateSigningSecret; CreateOAuthClient, Update, Delete, RegenerateSecret; CreateAuthConfig, Update, Delete; CreateIdentityProvider, Update, Delete

#### Event Dispatch Pipeline

When a domain event is committed, the `EventDispatchService` (called inside the UnitOfWork transaction) creates dispatch jobs:

```
Domain Event committed
  │ (inside transaction)
  ├── Query active subscriptions matching event type + client scope
  ├── Resolve connections from ConnectionCache (in-memory, sub-microsecond)
  ├── For each matching subscription:
  │   ├── Connection ACTIVE → create job with status QUEUED
  │   └── Connection PAUSED → create job with status PENDING (held)
  └── Insert dispatch job records + projection feed entries
      │
      │ (transaction commits)
      │
      └── Post-commit: publish QUEUED job notifications to broker
```

**ConnectionCache**: Full in-memory cache, background refresh every 5 minutes, immediate invalidation via `set()`/`remove()` on API mutations. Eliminates per-event DB queries on the hot path (targeting 10k events/sec).

#### Dispatch Scheduler

Polls for PENDING jobs that weren't published immediately (paused connections, retries, resets):

```
PendingJobPoller (every 5s)
  │
  ├── Query PENDING dispatch jobs (batch of 100)
  ├── Filter out jobs whose connection is PAUSED (via ConnectionCache)
  ├── Check BlockOnErrorChecker for FAILED jobs blocking groups
  ├── Filter by DispatchMode:
  │   ├── IMMEDIATE → always eligible
  │   ├── BLOCK_ON_ERROR → skip group if any FAILED job
  │   └── NEXT_ON_ERROR → skip group if FAILED jobs block
  ├── Group by messageGroup
  └── Submit to MessageGroupDispatcher
      ├── Semaphore-bounded concurrent groups (default 10)
      ├── Per-group FIFO queue (MessageGroupQueue)
      └── JobDispatcher → publish MessagePointer to broker
          └── Update job status to QUEUED

StaleQueuedJobPoller (every 60s)
  └── Reset QUEUED jobs older than 30 minutes back to PENDING
```

#### OIDC Provider

Full OAuth 2.0 / OpenID Connect provider built on `oidc-provider`:
- Authorization code flow, client credentials, refresh tokens
- RS256 JWT signing with zero-downtime key rotation
- Client adapter backed by database (OAuth clients table)
- Account adapter backed by principals table
- Session/interaction storage via Drizzle
- Federation endpoints for multi-IDP support
- Multi-client selection UI for users with access to multiple tenants

#### API Surface

| Audience | Base Path | Auth | Purpose |
|----------|-----------|------|---------|
| Admin | `/api/admin/*` | OIDC/JWT | Full CRUD for all aggregates |
| SDK | `/api/sdk/*` | Service account token | Batch endpoints for events, jobs, principals, audit |
| BFF | `/api/bff/*` | OIDC/JWT | Read models optimized for UI |
| Public | `/api/public/*` | None | Platform config (OIDC issuer URL, etc.) |
| OIDC | `/oidc/*` | Varies | OAuth/OIDC protocol endpoints |
| Auth | `/auth/*` | Session | Login, logout, password reset, interactions |

---

### 2. Message Router

Documented in detail in [`packages/message-router/ARCHITECTURE.md`](packages/message-router/ARCHITECTURE.md).

**Summary**: Consumes messages from the broker, routes through concurrency-managed process pools with per-group FIFO ordering (or concurrent processing for IMMEDIATE dispatch mode), and mediates HTTP calls to customer webhooks with circuit breakers and retry logic.

Key components: Consumers (SQS/NATS/AMQ/Embedded), QueueManagerService (three-phase routing), ProcessPool (concurrency + rate limiting), HttpMediator (circuit breakers + retries), Standby/HA (Redis locks), Traffic Management (ALB integration).

---

### 3. Stream Processor

PostgreSQL-based CQRS projection service. Polls feed tables and projects into read model tables.

**Two independent projections:**

| Projection | Source Table | Target Table | Purpose |
|-----------|-------------|-------------|---------|
| Event | `msg_event_projection_feed` | `msg_events_read` | Searchable event read model |
| Dispatch Job | `msg_dispatch_job_projection_feed` | `msg_dispatch_jobs_read` | Searchable job read model |

**Processing model:**
- Single writable CTE per poll cycle: SELECT batch → INSERT into read table → UPDATE processed flag
- All JSONB extraction happens in PostgreSQL (zero application-layer data transfer)
- Type hierarchy parsing: `orders:fulfillment:shipment:shipped` → extracts application, subdomain, aggregate
- Adaptive sleeping: 0ms (full batch), 100ms (partial), 1000ms (empty)

**Configuration:**
- `STREAM_PROCESSOR_EVENTS_BATCH_SIZE` (default 100)
- `STREAM_PROCESSOR_DISPATCH_JOBS_BATCH_SIZE` (default 100)
- Each projection can be independently enabled/disabled

---

### 4. Outbox Processor

Polls a customer's outbox table and POSTs batches to the platform SDK endpoints. Runs in the customer's environment.

```
Customer DB (outbox_messages table)
  │
  ├── OutboxPoller (interval-based, configurable)
  │   └── SELECT WHERE status = 'PENDING' LIMIT batchSize
  │
  ├── GlobalBuffer (bounded queue with backpressure)
  │
  ├── GroupDistributor (routes by type + messageGroup)
  │
  ├── MessageGroupProcessor (FIFO per group, batches of 100)
  │   └── POST to platform SDK endpoints:
  │       ├── /api/sdk/events/batch
  │       ├── /api/sdk/dispatch-jobs/batch
  │       └── /api/sdk/audit-logs/batch
  │
  └── Status Update → mark as PROCESSED
```

**Configuration:** `pollIntervalMs`, `pollBatchSize`, `apiBatchSize`, `maxConcurrentGroups`, `globalBufferSize`

---

## Supporting Packages

| Package | Purpose |
|---------|---------|
| `@flowcatalyst/domain` | Core domain types: Result, UseCaseError, ExecutionContext, DomainEvent, UnitOfWork interface, AuditLog |
| `@flowcatalyst/framework` | Application patterns: Command, UseCase interface, validation utilities |
| `@flowcatalyst/persistence` | Drizzle ORM layer: schema definitions, repositories, DrizzleUnitOfWork, migrations, secret providers |
| `@flowcatalyst/queue-core` | Queue abstraction: QueueConsumer/Publisher interfaces, ProcessPool, MessageGroupHandler, HttpMediator, CircuitBreaker, DynamicSemaphore |
| `@flowcatalyst/contracts` | Shared types: MessagePointer, QueueMessage, MessageBatch, DispatchMode, ProcessingResult |
| `@flowcatalyst/tsid` | Time-sorted ID generation (Crockford Base32) with entity type prefixes |
| `@flowcatalyst/crypto` | Password hashing (Argon2), AES-256-GCM encryption, JWT key management |
| `@flowcatalyst/logging` | Structured logging via Pino |
| `@flowcatalyst/config` | Environment variable parsing with Zod validation |
| `@flowcatalyst/http` | Fastify utilities and middleware |
| `@flowcatalyst/standby` | Redis-based primary/standby coordination |

---

## Client SDKs

### TypeScript SDK (`@flowcatalyst/sdk`)

Typed client library with `neverthrow` Result pattern for explicit error handling.

**Authentication:** OAuth 2.0 client credentials flow with automatic token caching, or user access token pass-through.

**Resources:** EventTypes, Subscriptions, DispatchPools, Connections, Roles, Permissions, Applications, Clients, Principals, Me.

**Outbox support:** `OutboxManager` for transactional outbox pattern — `createEvent()`, `createDispatchJob()`, `createAuditLog()` write to the customer's outbox table, which the Outbox Processor polls.

### Laravel SDK (`flowcatalyst/laravel-sdk`)

PHP/Laravel integration. Service provider, facades (`FlowCatalyst`, `Postbox`), Artisan commands, webhook handling middleware, OIDC authentication, outbox pattern support. Generated from OpenAPI spec via Jane.

### MCP Server (`@flowcatalyst/mcp-server`)

Model Context Protocol server for AI agents (Claude Code, Cursor). Provides read-only access to FlowCatalyst resources. Supports stdio and HTTP transports.

---

## Key Data Flows

### 1. Event Publication (End-to-End)

```
Customer App
  │ SDK.eventTypes.create(payload)
  │   or OutboxManager.createEvent(payload)
  v
Platform SDK API (/api/sdk/events/batch)
  │
  v
Use Case: receives event payload
  │
  ├── unitOfWork.commit() [single transaction]:
  │   ├── Write event to event store (msg_events)
  │   ├── Write to event projection feed
  │   ├── Find matching subscriptions
  │   ├── Resolve connections from cache
  │   ├── Create dispatch jobs (QUEUED or PENDING)
  │   ├── Write to dispatch job projection feed
  │   └── Write audit log
  │
  ├── Post-commit: publish QUEUED jobs to SQS
  │
  v
Message Router
  ├── Consume from SQS
  ├── Three-phase routing (dedup → capacity → group routing)
  ├── ProcessPool (concurrency + rate limit)
  ├── HttpMediator (circuit breaker + retries)
  └── POST to customer webhook endpoint
```

### 2. Connection Pause/Resume

```
Admin pauses connection via API
  │
  ├── UpdateConnectionUseCase → ConnectionUpdated event
  ├── connectionCache.set(updatedConnection)  ← immediate cache invalidation
  │
  └── Effect on dispatch pipeline:
      ├── New events: jobs created as PENDING (not published to queue)
      ├── Scheduler: skips PENDING jobs for paused connections
      └── In-flight messages: continue processing (already in router)

Admin resumes connection via API
  │
  ├── UpdateConnectionUseCase → ConnectionUpdated event
  ├── connectionCache.set(updatedConnection)
  │
  └── Effect:
      └── Scheduler picks up PENDING jobs on next poll (5s)
          └── Publishes to queue → Message Router processes
```

### 3. High Availability Failover

```
Instance A (PRIMARY)              Instance B (STANDBY)
  │                                  │
  ├── Holds Redis lock               ├── Consumers paused
  ├── Consumers active               ├── Registered with ALB (draining)
  ├── Registered with ALB            │
  │                                  │
  │ ── Instance A crashes ──         │
  │                                  │
  │                                  ├── Redis lock expires (30s TTL)
  │                                  ├── Acquires lock → becomes PRIMARY
  │                                  ├── Resumes consumers
  │                                  └── Registers with ALB
  │
  │ ── Instance A graceful shutdown ──
  │
  ├── Releases lock immediately      ├── Acquires lock instantly
  ├── Deregisters from ALB           ├── Becomes PRIMARY
  └── Drains in-flight messages      └── Resumes consumers
```

---

## Database Schema Overview

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `principals` | Users + service accounts | id, type, scope, clientId, email, active |
| `clients` | Tenants | id, identifier, name, status |
| `applications` | Registered apps | id, code, name, status |
| `roles` | RBAC roles | id, name, clientId |
| `permissions` | Permissions | id, code, roleId |
| `event_types` | Event definitions | id, code, status, clientScoped |
| `event_type_spec_versions` | Versioned schemas | eventTypeId, version, schema, status |
| `connections` | Webhook endpoints | id, code, endpoint, status, serviceAccountId |
| `subscriptions` | Event routing rules | id, code, connectionId, mode, dispatchPoolId |
| `dispatch_pools` | Rate limit + concurrency config | id, code, rateLimit, concurrency |
| `service_accounts` | Machine identities | id, code, authToken, signingSecret |
| `oauth_clients` | OAuth 2.0 clients | id, clientId, clientSecret, grantTypes |

### Event Sourcing Tables

| Table | Purpose |
|-------|---------|
| `msg_events` | Event store (all domain events) |
| `msg_event_projection_feed` | Feed for Stream Processor → read model |
| `msg_events_read` | CQRS read model (projected) |
| `msg_dispatch_jobs` | Dispatch job lifecycle tracking |
| `msg_dispatch_job_projection_feed` | Feed for Stream Processor |
| `msg_dispatch_jobs_read` | CQRS read model (projected) |
| `msg_audit_logs` | Immutable audit trail |

### Outbox Table (Customer DB)

| Table | Purpose |
|-------|---------|
| `outbox_messages` | Transactional outbox for reliable event publishing |

---

## Workspace Structure

```
flowcatalyst/
├── apps/
│   ├── flowcatalyst/                  # Unified service (Platform + Router + Processor)
│   │   ├── src/index.ts               # Entry point with feature flags
│   │   ├── Dockerfile                 # Multi-stage Docker build
│   │   └── entrypoint.sh
│   └── platform-frontend/            # Vue 3 + PrimeVue admin UI
│
├── clients/
│   ├── typescript-sdk/                # @flowcatalyst/sdk (neverthrow, OpenAPI-generated)
│   ├── laravel-sdk/                   # flowcatalyst/laravel-sdk (Jane OpenAPI)
│   └── mcp-server/                    # MCP server for AI agents
│
├── packages/
│   ├── platform/                      # IAM, OIDC, Admin API, Dispatch Scheduler
│   │   └── src/
│   │       ├── domain/                # DDD aggregates and events
│   │       ├── application/           # Use cases
│   │       ├── infrastructure/        # Persistence, dispatch, OIDC
│   │       ├── api/                   # REST routes (admin, sdk, bff, public)
│   │       ├── composition/           # Dependency injection
│   │       ├── dispatch-scheduler/    # Pending job poller + dispatcher
│   │       └── authorization/         # Permission system
│   │
│   ├── message-router/                # Queue consumer + HTTP mediation
│   ├── stream-processor/              # CQRS read model projections
│   ├── outbox-processor/              # Customer outbox → platform API
│   ├── queue-core/                    # ProcessPool, HttpMediator, CircuitBreaker
│   ├── persistence/                   # Drizzle ORM, UnitOfWork, migrations
│   ├── domain/                        # Result, DomainEvent, ExecutionContext
│   ├── framework/                     # UseCase interface, validation
│   ├── contracts/                     # MessagePointer, QueueMessage, DispatchMode
│   ├── tsid/                          # Time-sorted ID generation
│   ├── crypto/                        # Argon2, AES-256-GCM, JWT keys
│   ├── standby/                       # Redis-based HA coordination
│   ├── logging/                       # Pino structured logging
│   ├── config/                        # Zod env validation
│   ├── http/                          # Fastify utilities
│   └── schema-codegen/                # Code generation
│
├── .github/workflows/                 # CI/CD (Docker publish, SDK generation)
├── package.json                       # pnpm workspace root
├── pnpm-workspace.yaml                # Workspace packages
├── tsconfig.base.json                 # Shared TypeScript config
├── vitest.config.ts                   # Test configuration
└── Makefile                           # Build automation
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 24, TypeScript (ES2024, NodeNext modules) |
| HTTP | Fastify 5, undici (HTTP/1.1 + HTTP/2) |
| Database | PostgreSQL, Drizzle ORM |
| Authentication | oidc-provider, jose (JWT), Argon2 (passwords) |
| Messaging | AWS SQS, NATS JetStream, ActiveMQ (STOMP), sql.js (embedded) |
| Resilience | Cockatiel (circuit breakers), rate-limiter-flexible |
| Observability | Pino (logging), prom-client (Prometheus metrics) |
| Notifications | nodemailer (SMTP), Microsoft Teams (Adaptive Cards) |
| HA | Redis (ioredis) for distributed locks |
| Cloud | AWS (SQS, ALB, Secrets Manager, SSM) |
| Frontend | Vue 3, PrimeVue 4, Pinia, Vue Router, Vite |
| SDKs | TypeScript (neverthrow), PHP/Laravel (Jane OpenAPI) |
| Build | pnpm workspaces, tsup, Vite, Docker |
| Quality | Vitest, oxlint, oxfmt, vue-tsc |

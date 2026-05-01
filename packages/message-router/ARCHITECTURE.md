# Message Router — Architecture Documentation

## Context

The Message Router is a standalone service that consumes messages from a broker (SQS, NATS, ActiveMQ, or an embedded SQLite queue), routes them through concurrency-managed processing pools, and mediates HTTP calls to downstream webhook endpoints. It is a TypeScript port of the Java `QueueManager` and follows the same architectural patterns.

The router sits between the platform's dispatch scheduler (which publishes dispatch jobs to a queue) and customer webhook endpoints (which receive processed events). Its job is to dequeue messages reliably, enforce per-pool concurrency and rate limits, preserve FIFO ordering within message groups, and handle failures with circuit breakers and retry logic.

---

## System Context (C4 Level 1)

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   Platform    │────────>│  Message Broker   │────────>│  Message Router  │
│  (Scheduler)  │ publish │ (SQS/NATS/AMQ/   │ consume │                  │
│               │         │  Embedded SQLite) │         │                  │
└──────────────┘         └──────────────────┘         └────────┬─────────┘
                                                               │ HTTP mediation
                                                               v
                                                      ┌──────────────────┐
                                                      │    Customer      │
                                                      │  Webhook / API   │
                                                      └──────────────────┘
```

**Actors:**
- **Platform (Scheduler)** — Creates dispatch jobs and publishes message pointers to the broker. Stamps each message with `poolCode`, `messageGroupId`, `dispatchMode`, and `callbackUrl`.
- **Message Broker** — Durable queue (SQS FIFO, NATS JetStream, ActiveMQ, or embedded SQLite). Provides at-least-once delivery.
- **Message Router** — This service. Consumes, routes, mediates, and manages acknowledgement.
- **Customer Webhook** — The downstream HTTP endpoint that processes the event payload.

**Supporting systems:**
- **Redis** — Distributed lock for primary/standby HA (optional).
- **AWS ALB** — Load balancer registration/deregistration for traffic management (optional).
- **Platform Config API** — Provides queue and pool configuration for SQS mode.

---

## Container View (C4 Level 2)

The Message Router is a single Fastify HTTP service with the following internal subsystems:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Message Router                           │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Consumers   │  │ Queue Manager │  │   Process Pools       │  │
│  │  (SQS/NATS/  │─>│ (Orchestrator)│─>│   (per pool code)     │  │
│  │  AMQ/Embed.) │  │              │  │  ┌─────────────────┐  │  │
│  └─────────────┘  └──────────────┘  │  │ MessageGroup    │  │  │
│                                      │  │ Handlers (FIFO) │  │  │
│  ┌─────────────┐  ┌──────────────┐  │  └────────┬────────┘  │  │
│  │  Standby /   │  │   Traffic    │  │           │           │  │
│  │  HA Service  │  │   Manager    │  │  ┌────────v────────┐  │  │
│  └─────────────┘  └──────────────┘  │  │  HTTP Mediator   │  │  │
│                                      │  │  + Circuit       │  │  │
│  ┌─────────────┐  ┌──────────────┐  │  │    Breakers      │  │  │
│  │  Health &    │  │ Config Sync  │  │  └─────────────────┘  │  │
│  │  Monitoring  │  │ Service      │  └───────────────────────┘  │
│  └─────────────┘  └──────────────┘                              │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐                              │
│  │ Notification │  │  HTTP API    │                              │
│  │ Service      │  │  (Fastify)   │                              │
│  └─────────────┘  └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component View (C4 Level 3)

### Message Consumption

Four consumer implementations, all conforming to the `QueueConsumer` interface:

| Consumer | Broker | Polling Model | Batch Size | Deduplication |
|----------|--------|---------------|------------|---------------|
| `SqsConsumer` | AWS SQS | Long-poll (20s wait), N connections | 10 per poll | Within-batch + pending-delete tracking |
| `NatsConsumer` | NATS JetStream | Pull-based durable consumer | Configurable | Sequence-based (`pendingAckSequences`) |
| `ActiveMqConsumer` | ActiveMQ (STOMP) | Subscription-based push | 1 per message | Broker-managed |
| `EmbeddedQueueConsumer` | SQLite (sql.js) | Polling loop | Configurable | Unique constraint on `message_id` |

All consumers normalize messages into `MessageBatch` + `Map<string, MessageCallbackFns>` and pass them to the `QueueManagerService.handleBatch()` method.

**Consumer lifecycle:**
- Each consumer tracks `lastPollTimeMs` for health monitoring.
- A 60-second staleness timeout triggers automatic restart via `recreate()`.
- Metrics polling runs on a separate timer and is cancellable via `stop()`.
- The `consumeLoop` promise is stored and awaited during shutdown (NATS, Embedded).

**Adaptive polling (SQS only):**
- Empty batch → 1s delay (long-poll already waited 20s)
- Partial batch → 500ms delay (queue draining)
- Full batch → 0ms delay (immediate re-poll)

---

### Queue Manager Service

`QueueManagerService` is the central orchestrator (~1700 LOC). It owns consumers, process pools, in-flight message tracking, and the three-phase routing algorithm.

**Startup sequence** (varies by `QUEUE_TYPE`):
1. Register traffic mode change listener
2. Start traffic manager (ALB registration)
3. Start windowed stat reset timers (5min / 30min)
4. Initialize consumers for the configured broker
5. Create process pools (from config or defaults)
6. Start cleanup task (10s), health monitor (60s), leak detection (30s)
7. Pause consumers if standby mode is already active

**Three-phase routing algorithm** (`handleBatch`):

```
Phase 1: Deduplication
├── Physical redelivery (same broker message ID already in-flight)
│   └── Swap receipt handle, skip silently
├── Logical requeue (same app message ID, different broker ID)
│   └── ACK the duplicate
└── Track in inFlightMessages + appMessageIdToPipelineKey maps

Phase 2: Pool capacity pre-check
├── Group messages by resolved pool code
├── Check available capacity per pool
└── NACK entire sub-batch if pool cannot accept (parallel)

Phase 3: Per-group routing
├── Group messages by messageGroupId
├── Check dispatchMode from message pointer
├── IMMEDIATE groups → submitGroupConcurrent()
│   └── All messages submitted independently, no ordering dependency
│   └── Pool rejection NACKs only that message
└── Ordered groups (BLOCK_ON_ERROR / NEXT_ON_ERROR / default) → submitGroupFifo()
    └── Sequential submission, pool rejection triggers nackRemaining
    └── All subsequent messages in group are NACKed (parallel flush)
```

**In-flight tracking maps:**
- `inFlightMessages: Map<pipelineKey, InFlightMessageInfo>` — tracks all messages currently in the pipeline
- `messageCallbacks: Map<pipelineKey, MessageCallbackFns>` — broker ACK/NACK handles
- `appMessageIdToPipelineKey: Map<messageId, pipelineKey>` — detects logical requeues

**Leak detection** runs every 30s, warns when `inFlightMessages.size` exceeds total pool capacity.

**Configuration sync** (SQS mode):
- `ConfigSyncService` periodically fetches config from platform API
- `applyConfiguration()` is serialized via a chained-promise lock to prevent concurrent syncs
- Pools are updated in-place (concurrency, rate limit) or drained asynchronously if removed
- New consumers are started, removed consumers moved to draining state

**Shutdown sequence:**
1. Stop all scheduled tasks (intervals cleared)
2. Stop traffic manager (ALB deregistration)
3. Stop config sync service
4. Stop consumers with 25s timeout (`Promise.race`)
5. Drain all pools with 30s timeout, then force shutdown
6. NACK all remaining in-flight messages (parallel `Promise.allSettled`)
7. Clear tracking maps, close HTTP mediator

---

### Process Pool

`ProcessPool` (in `queue-core`) manages concurrency, rate limiting, and message group ordering for a single pool code.

**Configuration:**
- `concurrency` — max simultaneous workers (adjustable in-place via `DynamicSemaphore`)
- `rateLimitPerMinute` — token bucket rate limiting (leaky bucket via `RateLimiterQueue`)
- Queue capacity = `max(concurrency * 20, 50)`

**Message processing pipeline:**

```
submit(message, callback)
  │
  ├── Capacity check (reject if queue full)
  │
  ├── Get/create MessageGroupHandler for messageGroupId
  │   └── Enqueue (high-priority or regular queue)
  │
  └── MessageGroupHandler.processNext()
      │
      ├── Dequeue (high-priority first, then regular)
      ├── RateLimiterQueue.removeTokens(1)  ← rate limiting
      ├── DynamicSemaphore.acquire()        ← concurrency limiting
      ├── HttpMediator.mediate(message)     ← HTTP call
      │   └── Circuit breaker per URL
      │   └── Retry with exponential backoff (3 attempts)
      ├── Handle result:
      │   ├── SUCCESS → callback.ack()
      │   ├── ERROR_CONFIG (4xx) → callback.ack() (prevent infinite retry)
      │   ├── DEFERRED → callback.nack(delaySeconds)
      │   ├── ERROR_PROCESS (5xx/timeout) → callback.nack()
      │   └── BATCH_FAILED → callback.nack() (group already failed)
      ├── DynamicSemaphore.release()
      └── processNext() (loop)
```

**MessageGroupHandler** ensures strict FIFO within a group:
- Two internal queues: high-priority and regular
- Processes one message at a time per group
- 5-minute idle timeout triggers cleanup

**Statistics tracked per pool:**
- Total: processed, succeeded, failed, transient errors, rate-limited, deferred
- Windowed: 5-minute and 30-minute counters (reset on fixed intervals)
- Processing duration history

---

### HTTP Mediator

`HttpMediator` (in `queue-core`) handles downstream HTTP calls with resilience.

**Per-request flow:**
1. Resolve circuit breaker for target URL (created on first use)
2. Execute within circuit breaker
3. Retry on 5xx, timeouts, connection errors (up to 3 attempts, exponential backoff)
4. Parse response for `MediationResponse` JSON (`{ ack, defer, delaySeconds }`)

**Response mapping:**
| HTTP Status | Outcome | Action |
|-------------|---------|--------|
| 2xx | SUCCESS | ACK message |
| 2xx with `defer: true` | DEFERRED | NACK with delay |
| 4xx | ERROR_CONFIG | ACK (prevent infinite retry) |
| 429 | ERROR_PROCESS | NACK with `Retry-After` delay |
| 5xx | ERROR_PROCESS | Retry, then NACK |
| Connection timeout | ERROR_CONNECTION | Retry, then NACK |

**HTTP client:**
- Uses `undici` for HTTP/1.1 and HTTP/2
- HTTP/2 auto-enabled in production, HTTP/1.1 in development
- Timeouts: connect (5s), headers (30s), body (15min default)

**Circuit breaker** (per downstream URL, via Cockatiel):
- Sliding window of 100 calls
- Opens at 50% failure rate (after minimum 10 calls)
- Half-open after 5s, allows 3 test calls
- States: CLOSED → OPEN → HALF_OPEN → CLOSED

---

### High Availability

**Standby Service** provides hot primary/standby via Redis distributed lock:

```
Instance A                    Redis                    Instance B
    │                           │                           │
    ├── SET lock NX EX 30 ─────>│                           │
    │<── OK (acquired) ─────────│                           │
    │   → becomes PRIMARY       │                           │
    │                           │<── SET lock NX EX 30 ─────┤
    │                           │── nil (denied) ──────────>│
    │                           │       → stays STANDBY     │
    │                           │                           │
    │── refresh (Lua) ─────────>│   (every 10s)             │
    │                           │                           │
    │── RELEASE (Lua) ─────────>│   (shutdown)              │
    │                           │                           │
    │                           │<── SET lock NX EX 30 ─────┤
    │                           │── OK ────────────────────>│
    │                           │       → becomes PRIMARY   │
```

**Lock Manager** uses atomic Lua scripts:
- **Acquire:** `SET key instanceId EX ttl NX`
- **Refresh:** Lua: if owner matches, extend TTL; else return false
- **Release:** Lua: if owner matches, DEL key; else no-op
- **Watchdog:** refreshes at TTL/3 interval automatically

**Traffic Manager** reacts to mode changes:
- PRIMARY → register with ALB, resume consumers
- STANDBY → deregister from ALB (wait for drain), pause consumers
- Strategies: `AwsAlbStrategy` (production) or `NoOpStrategy` (disabled)

---

### Health & Monitoring

**Three-tier health model:**

| Probe | Path | Purpose | Checks |
|-------|------|---------|--------|
| Liveness | `/health/live` | Process alive? | Always 200 |
| Readiness | `/health/ready` | Accept traffic? | Service started, queue manager running, Redis available (if HA), broker connectivity |
| Startup | `/health/startup` | Finished init? | 1s startup delay |

**System health** (`/monitoring/health`) aggregates:
- DEGRADED: critical warnings > 0 OR open circuit breakers > 0
- WARNING: active warnings > 5 OR unhealthy queues/pools
- HEALTHY: all checks pass

**Broker health** — periodic connectivity checks per broker type:
- SQS: `ListQueuesCommand`
- NATS: connection test with timeout
- ActiveMQ: STOMP connection test
- Embedded: always healthy

**Queue health monitor** — watches queue depth and growth:
- Backlog warning: queue depth > threshold (default 1000)
- Growth warning: sustained growth for 3+ consecutive periods

**Consumer health** — 60s staleness detection:
- If `lastPollTimeMs` is older than 60s, consumer is unhealthy
- Unhealthy consumers are automatically restarted via `recreate()`

---

### Notifications

Warnings are collected by `WarningService` and dispatched via `BatchingNotificationService`:

```
Warning raised
  │
  ├── CRITICAL → sent immediately to all channels
  │
  └── WARNING/INFO → batched
      └── Every 5 minutes (configurable):
          ├── Deduplicate by category+message
          ├── Filter by minimum severity
          └── Send batch to:
              ├── Email (SMTP/nodemailer, HTML templates)
              └── Microsoft Teams (Adaptive Cards via webhook)
```

---

### Configuration

**SQS mode** — dynamic configuration from platform API:
- `PlatformConfigClient` fetches queue URLs, pool configs, connection count
- `ConfigSyncService` polls every 5 minutes, detects changes via deep compare
- `MultiConfigFetcher` merges from multiple config sources (union strategy)
- On change: sync pools (create/update/drain), sync consumers (start/stop)

**Other modes** — static configuration:
- NATS/ActiveMQ/Embedded use hardcoded pool configs (HIGH/MEDIUM/LOW)
- All configuration via environment variables (100+ parameters)

---

### Embedded Queue

SQLite-backed queue for development and single-instance deployments:

**Schema:**
- `queue_messages` — id, message_id (unique), message_group_id, message_json, visible_at, receipt_handle (unique), receive_count
- `message_deduplication` — 5-minute sliding window

**Dequeue algorithm:**
- Single query with `ROW_NUMBER() OVER (PARTITION BY message_group_id ORDER BY id)` selects one message per group
- Single UPDATE claims all selected messages atomically with per-row receipt handles
- Visibility timeout makes messages invisible to other consumers during processing

**Publisher:**
- Deduplication via `message_deduplication_id` with 5-minute window
- Periodic cleanup of expired dedup entries

---

### HTTP API

**Public (no auth):**
- `GET /health/live`, `/health/ready`, `/health/startup` — K8s probes
- `GET /metrics` — Prometheus metrics

**Protected (BASIC or OIDC auth):**
- `GET /api/config` — Current queue/pool configuration
- `POST /api/test/publish` — Publish test messages (embedded only)
- `POST /api/seed` — Seed test messages for load testing
- `POST /api/benchmark` — Run processing benchmarks
- `GET /monitoring/health` — System health overview
- `GET /monitoring/queue-stats` — Per-queue statistics
- `GET /monitoring/pool-stats` — Per-pool statistics
- `GET /monitoring/in-flight` — In-flight message listing
- `GET /monitoring/consumer-health` — Consumer health details
- `GET /monitoring/circuit-breakers` — Circuit breaker states
- `GET /monitoring/warnings` — Warning management
- `GET /monitoring/traffic` — Standby/traffic status

---

## Key Data Types

### MessagePointer (contracts)
The envelope on every message, set by the scheduler at publish time:

| Field | Type | Purpose |
|-------|------|---------|
| `messageId` | string | Application-level unique ID |
| `poolCode` | string | Routes to a ProcessPool |
| `messageGroupId` | string | Groups for FIFO ordering |
| `dispatchMode` | `"IMMEDIATE" \| "NEXT_ON_ERROR" \| "BLOCK_ON_ERROR"` | Controls group routing strategy |
| `payload` | unknown | Opaque payload for downstream |
| `callbackUrl` | string? | HTTP endpoint override |
| `authToken` | string? | Auth token for downstream call |
| `highPriority` | boolean? | Prioritized within group |
| `createdAt` | string? | Timestamp |

### QueueMessage (contracts)
Internal representation enriched by the consumer:

| Field | Type | Purpose |
|-------|------|---------|
| `brokerMessageId` | string | Broker-assigned ID (SQS MessageId, NATS sequence) |
| `messageId` | string | Application message ID from pointer |
| `receiptHandle` | string | Handle for ACK/NACK operations |
| `pointer` | MessagePointer | Parsed routing envelope |
| `receiveCount` | number | Delivery attempt count |
| `receivedAt` | Date | When consumed |
| `batchId` | string | Groups messages from same poll |
| `queueId` | string | Source queue identifier |

### ProcessingResult (contracts)
Outcome from HTTP mediation:

| Outcome | Meaning | Action |
|---------|---------|--------|
| `SUCCESS` | 2xx response | ACK |
| `ERROR_CONFIG` | 4xx response | ACK (prevent infinite retry) |
| `ERROR_PROCESS` | 5xx / timeout | NACK for retry |
| `ERROR_CONNECTION` | Connection failed | NACK for retry |
| `DEFERRED` | Downstream requested delay | NACK with visibility delay |
| `BATCH_FAILED` | Group already failed in batch | NACK without processing |

---

## Queue Statistics

Per-queue metrics tracked by `QueueManagerService`:

| Metric | Windows |
|--------|---------|
| `totalMessages` / `totalConsumed` / `totalFailed` | Lifetime, 5min, 30min |
| `successRate` | Computed: consumed / (consumed + failed) |
| `pendingMessages` / `messagesNotVisible` | Real-time from broker |
| `currentSize` | Current visible queue depth |
| `totalDeferred` | Messages deferred by downstream |

Per-pool metrics tracked by `ProcessPool`:

| Metric | Description |
|--------|-------------|
| `maxConcurrency` / `activeWorkers` | Concurrency utilization |
| `queueSize` / `maxQueueCapacity` | Buffer utilization |
| `totalProcessed` / `totalSucceeded` / `totalFailed` | Throughput |
| `totalTransient` / `totalRateLimited` / `totalDeferred` | Backpressure indicators |
| `successRate` / `successRate5min` / `successRate30min` | Windowed success rates |

---

## Scaling and Operating Topology

### Current model: single active instance

The router today is designed to run as a **single active instance** with optional standby replicas. Several pieces of state are in-process and not coordinated across instances:

| State | Implementation | Why it must be single-instance |
|---|---|---|
| Pool rate limiter (`TokenBucket`) | In-process | Token state is local; N instances = N× the configured rate |
| Logical-requeue dedup (`appMessageIdToPipelineKey`) | In-process Map, ~5min window | Redelivery to a different instance won't be deduped |
| Pool concurrency (`DynamicSemaphore`) | In-process | "concurrency: 50" with N replicas = 50N in-flight at downstream — silently changes during HPA |
| In-flight tracking (`inFlightMessages`, `messageCallbacks`) | In-process Maps | Each instance owns the messages it received from the broker; no cross-instance need |
| Circuit breakers | In-process per-URL | Each instance learns downstream health independently — generally desired |
| Standby leader lock | Redis | Already distributed |

**Multi-replica deployments are run today as primary/standby:** one instance holds the Redis lock and processes messages; others stand idle and pause their consumers. Throughput is bounded by what one Node.js process can do (≈3–5k msg/s sustained on c7i-class hardware for ALB-mediated workloads, see `docs/scaling.md` if added).

### What it would take to run active/active

Going beyond one active instance requires distributing the state above. The pieces, in increasing order of complexity:

#### 1. Distributed rate limiter (required)

Replace `TokenBucket` with `RateLimiterRedis` from `rate-limiter-flexible` (or the equivalent against your Redis client). The rate-limit check moves to the hot path with ~0.5–1ms added latency per message; in exchange the configured rate becomes fleet-wide.

The `TokenBucket` interface in `packages/queue-core/src/utils/token-bucket.ts` is the contract to satisfy: `acquire()`, `setRate()`, `dispose()`. A `RedisTokenBucket` implementing the same shape would be drop-in.

#### 2. Distributed dedup (required)

Replace the in-process `appMessageIdToPipelineKey` with Redis: `SET dedup:<messageId> 1 NX EX 300`. If `NX` returns nil, the message is a duplicate. Keep the in-process Map as a first-level cache — only check Redis on a local miss.

#### 3. Distributed concurrency (required)

This is the hardest. Three options, ranked by operational complexity:

**Option A — Fixed replicas, divided locally.** Operator sets per-instance `concurrency = ceil(target / replica_count)`. Zero new infrastructure, but breaks under HPA: when replica count changes, the effective fleet limit changes silently with it.

**Option B — Heartbeat-based local rebalance.** Each instance announces liveness via `SET router:alive:<instanceId> 1 EX 15` refreshed every 5s. Every 10s, each instance recalculates local permits from `KEYS router:alive:*` count. Most messages take the fast local-semaphore path; ±10–20% over-shoot during scale events is tolerated. Recommended for HPA topologies.

**Option C — Hard Redis semaphore.** Every acquire/release hits Redis (`INCR`/`DECR` with TTL on owner keys to handle crashed holders). Correct under arbitrary churn, but ~1.5ms/message round trip caps a single instance at ~1k msg/s. Use only when exact bounds matter more than throughput.

Implementations live or die on TTL handling — instances that crash mid-message must release their permits via TTL expiry, or the fleet leaks capacity.

#### 4. Drop the standby leader lock

Once 1–3 are in place, the leader lock no longer protects anything — its job was preventing the per-instance state above from being multi-active. Drop it; let every instance poll, mediate, and ack.

### Alternative escape hatches (no distributed coordination required)

If you need to scale past one instance but don't want to take on the distributed-state work, three options:

#### A. Switch to the Rust router (`flowcatalyst-rust/crates/fc-router`)

Different binary, same protocol. Rust's per-process throughput is ≈2–3× the Node.js router for ALB workloads, scaling linearly across cores via tokio. A single Rust instance on c7i.4xlarge handles workloads that would require ~6 Node.js replicas. The Rust router has the same in-process state limitations — you trade horizontal scaling for vertical headroom, but one Rust instance often replaces the whole Node fleet.

Tradeoff: smaller broker support (SQS only at present), and a separate binary to operate.

#### B. Multi-worker Node, single binary, single host (custom)

Fork N Node workers from one binary. One worker holds the rate limiter and concurrency semaphore; siblings call into it via Node IPC (`process.send` / `cluster.workers[i].send`) to acquire/release. Local message passing on a single host is sub-millisecond — comparable to or faster than Redis on the same network — and avoids the distributed-systems complexity entirely.

Constraints: scales only within one host's vCPU count; requires care around ack/nack ownership (which worker handles each message). Not implemented today.

#### C. Wait for Node.js shared memory primitives

Worker threads with `SharedArrayBuffer` + `Atomics` already give you fast cross-thread counters, but the broader ecosystem (HTTP clients, broker SDKs) is not designed for shared-memory coordination. A future Node where `Map` / `Set` / async primitives are natively shareable across threads would let the router scale across cores within one process without IPC. Not currently on the Node roadmap; mentioned for completeness.

### Recommended path

For most deployments, the single-instance ceiling is generous enough that the operational simplicity of primary/standby outweighs the gains from going active/active. The threshold to revisit is roughly:

- Sustained > 3k msg/s and growing: tune the existing knobs first (`connectionsPerOrigin`, `h2MaxConcurrentStreams`, pool concurrency)
- Sustained > 5k msg/s: evaluate the Rust router
- Sustained > 15k msg/s OR strict cross-region HA: implement distributed rate limit + dedup + concurrency (sections 1–4 above)

The current code is intentionally not built for active/active — adding the distributed pieces is an explicit decision, not an oversight.

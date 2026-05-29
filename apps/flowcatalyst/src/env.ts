/**
 * App-level environment configuration.
 *
 * Consolidates the entrypoint's env reads behind a single validated,
 * typed object built with the same `@flowcatalyst/config` `parseEnv`
 * helper the workspace packages already use. Importing this module also
 * loads `.env` (via `@flowcatalyst/config` -> `dotenv/config`).
 *
 * Behaviour is preserved exactly from the previous inline
 * `process.env[...]` reads in index.ts:
 *   - numbers use `Number(...)` (so a bad value yields NaN, as before —
 *     this pass intentionally does NOT add strict range validation),
 *   - booleans keep their original default polarity (some default on,
 *     some default off),
 *   - LOG_LEVEL / NODE_ENV stay free-form strings (no enum gate) so an
 *     unusual-but-valid value like `silent` can't break startup.
 *
 * NOT included here (deliberately) — values the entrypoint *mutates* at
 * runtime so downstream package schemas pick them up:
 *   DATABASE_URL, QUEUE_TYPE, EMBEDDED_DB_PATH, OIDC_ISSUER_URL,
 *   ROUTER_CONFIG_URL, and the STANDBY_ENABLED suppression write.
 * Those stay as direct `process.env` access in index.ts.
 */

import { parseEnv, z } from "@flowcatalyst/config";

/** `X !== "false"` — defaults ON; only the literal "false" disables. */
const flagOn = z
	.string()
	.transform((v) => v !== "false")
	.prefault("true");

/** `X === "true"` — defaults OFF; only the literal "true" enables. */
const flagOff = z
	.string()
	.transform((v) => v === "true")
	.prefault("false");

/** `Number(X ?? default)` — preserves the prior `Number()` coercion (NaN on junk). */
const numberFrom = (dflt: string) =>
	z
		.string()
		.transform((v) => Number(v))
		.prefault(dflt);

const schema = z.object({
	// Core
	NODE_ENV: z.string().prefault("development"),
	LOG_LEVEL: z.string().prefault("info"),
	PORT: z.string().optional(),
	PLATFORM_PORT: z.string().optional(),
	ROUTER_PORT: numberFrom("8080"),
	HOST: z.string().prefault("0.0.0.0"),
	JWT_KEY_DIR: z.string().prefault(".jwt-keys"),

	// Feature flags
	PLATFORM_ENABLED: flagOn,
	MESSAGE_ROUTER_ENABLED: flagOff,
	STREAM_PROCESSOR_ENABLED: flagOn,
	OUTBOX_PROCESSOR_ENABLED: flagOff,
	DISPATCH_SCHEDULER_ENABLED: flagOff,
	STANDBY_ENABLED: flagOff,

	// Standby
	REDIS_URL: z.string().optional(),
	STANDBY_INSTANCE_ID: z.string().optional(),
	HOSTNAME: z.string().optional(),
	STANDBY_LOCK_KEY: z.string().prefault("flowcatalyst-primary-lock"),
	STANDBY_LOCK_TTL_SECONDS: numberFrom("30"),

	// Database
	AUTO_MIGRATE: z.string().optional(),
	DATABASE_URL: z.string().optional(),
	DB_SECRET_REFRESH_INTERVAL_MS: numberFrom("300000"),

	// Embedded Postgres
	EMBEDDED_POSTGRES_ENABLED: z.string().optional(),
	EMBEDDED_POSTGRES_PORT: numberFrom("15432"),
	EMBEDDED_POSTGRES_HOST: z.string().prefault("127.0.0.1"),
	EMBEDDED_POSTGRES_DATA_DIR: z.string().prefault(".fc-data/pg"),

	// Frontend
	FRONTEND_DIR: z.string().optional(),

	// Dispatch scheduler (standalone mode)
	DISPATCH_QUEUE_URL: z.string().prefault(""),
	DISPATCH_QUEUE_REGION: z.string().prefault("eu-west-1"),
	SQS_ENDPOINT: z.string().optional(),
	DISPATCH_SCHEDULER_PROCESSING_ENDPOINT: z
		.string()
		.prefault("http://localhost:8080/api/dispatch/process"),
});

const raw = parseEnv(schema);

const isDev = raw.NODE_ENV === "development";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Resolved, typed app configuration. A few fields need a dynamic
 * default the schema can't express statically (two-key fallback,
 * instance-id timestamp, isDev-driven defaults) — those are computed
 * here, once, at module load.
 */
export const appEnv = {
	NODE_ENV: raw.NODE_ENV,
	isDev,
	// Cast preserves prior behaviour (the old code cast without validating).
	LOG_LEVEL: raw.LOG_LEVEL as LogLevel,
	// `PORT ?? PLATFORM_PORT ?? 3000`, then Number() — as before.
	PLATFORM_PORT: Number(raw.PORT ?? raw.PLATFORM_PORT ?? "3000"),
	ROUTER_PORT: raw.ROUTER_PORT,
	HOST: raw.HOST,
	JWT_KEY_DIR: raw.JWT_KEY_DIR,

	PLATFORM_ENABLED: raw.PLATFORM_ENABLED,
	MESSAGE_ROUTER_ENABLED: raw.MESSAGE_ROUTER_ENABLED,
	STREAM_PROCESSOR_ENABLED: raw.STREAM_PROCESSOR_ENABLED,
	OUTBOX_PROCESSOR_ENABLED: raw.OUTBOX_PROCESSOR_ENABLED,
	DISPATCH_SCHEDULER_ENABLED: raw.DISPATCH_SCHEDULER_ENABLED,
	STANDBY_ENABLED: raw.STANDBY_ENABLED,

	STANDBY_REDIS_URL: raw.REDIS_URL,
	STANDBY_INSTANCE_ID:
		raw.STANDBY_INSTANCE_ID ?? raw.HOSTNAME ?? `instance-${Date.now()}`,
	STANDBY_LOCK_KEY: raw.STANDBY_LOCK_KEY,
	STANDBY_LOCK_TTL_SECONDS: raw.STANDBY_LOCK_TTL_SECONDS,

	// `AUTO_MIGRATE` defaults to isDev when unset, else strict "true" check.
	AUTO_MIGRATE:
		raw.AUTO_MIGRATE !== undefined ? raw.AUTO_MIGRATE === "true" : isDev,
	DB_SECRET_REFRESH_INTERVAL_MS: raw.DB_SECRET_REFRESH_INTERVAL_MS,

	// Embedded Postgres defaults ON in dev when DATABASE_URL isn't set.
	EMBEDDED_POSTGRES_ENABLED: (() => {
		const explicit = raw.EMBEDDED_POSTGRES_ENABLED;
		if (explicit === "true") return true;
		if (explicit === "false") return false;
		return isDev && !raw.DATABASE_URL;
	})(),
	EMBEDDED_POSTGRES_PORT: raw.EMBEDDED_POSTGRES_PORT,
	EMBEDDED_POSTGRES_HOST: raw.EMBEDDED_POSTGRES_HOST,
	EMBEDDED_POSTGRES_DATA_DIR: raw.EMBEDDED_POSTGRES_DATA_DIR,

	FRONTEND_DIR: raw.FRONTEND_DIR,

	DISPATCH_QUEUE_URL: raw.DISPATCH_QUEUE_URL,
	DISPATCH_QUEUE_REGION: raw.DISPATCH_QUEUE_REGION,
	SQS_ENDPOINT: raw.SQS_ENDPOINT,
	DISPATCH_SCHEDULER_PROCESSING_ENDPOINT:
		raw.DISPATCH_SCHEDULER_PROCESSING_ENDPOINT,
} as const;

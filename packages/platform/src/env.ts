/**
 * Environment Configuration
 *
 * Loads and validates environment variables for the platform service.
 */

import { z } from "zod/v4";

const envSchema = z.object({
	// Server
	PORT: z.coerce.number().default(3000),
	HOST: z.string().default("0.0.0.0"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),

	// Database
	DATABASE_URL: z.string().default("postgres://localhost:5432/flowcatalyst"),

	// Logging
	LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),
	LOG_PRETTY: z
		.string()
		.transform((v) => v === "true")
		.prefault("true"),

	// Auth / OIDC
	JWT_SECRET: z.string().optional(),
	JWT_ISSUER: z.string().default("flowcatalyst"),
	JWT_AUDIENCE: z.string().default("flowcatalyst"),

	// External base URL (for OAuth callbacks behind a proxy)
	EXTERNAL_BASE_URL: z.string().optional(),

	// OIDC Provider configuration
	OIDC_ISSUER: z.string().optional(), // Defaults to EXTERNAL_BASE_URL or http://localhost:PORT
	OIDC_COOKIES_KEYS: z
		.string()
		.optional()
		.transform((v) => (v ? v.split(",") : undefined)), // Comma-separated cookie signing keys

	// JWT RS256 keys — base64-encoded PEM content (containers/cloud, highest priority)
	FLOWCATALYST_JWT_PRIVATE_KEY: z.string().optional(),
	FLOWCATALYST_JWT_PUBLIC_KEY: z.string().optional(),
	FLOWCATALYST_JWT_PREVIOUS_PUBLIC_KEY: z.string().optional(),

	// JWT RS256 key paths (production)
	JWT_PRIVATE_KEY_PATH: z.string().optional(),
	JWT_PUBLIC_KEY_PATH: z.string().optional(),
	JWT_DEV_KEY_DIR: z.string().default(".jwt-keys"),
	/** Directory for key pairs (rotation-capable). Takes priority over single-file paths. */
	JWT_KEY_DIR: z.string().optional(),

	// Encryption key for secrets (Base64-encoded 32-byte key)
	FLOWCATALYST_APP_KEY: z.string().optional(),

	// OIDC token expiry (in seconds)
	OIDC_ACCESS_TOKEN_TTL: z.coerce.number().default(3600), // 1 hour
	OIDC_ID_TOKEN_TTL: z.coerce.number().default(3600), // 1 hour
	OIDC_REFRESH_TOKEN_TTL: z.coerce.number().default(2592000), // 30 days
	OIDC_SESSION_TTL: z.coerce.number().default(86400), // 24 hours
	OIDC_AUTH_CODE_TTL: z.coerce.number().default(600), // 10 minutes

	// Bootstrap admin (first-run setup)
	FLOWCATALYST_BOOTSTRAP_ADMIN_EMAIL: z.string().optional(),
	FLOWCATALYST_BOOTSTRAP_ADMIN_PASSWORD: z.string().optional(),
	FLOWCATALYST_BOOTSTRAP_ADMIN_NAME: z.string().default("Bootstrap Admin"),

	// Dispatch queue (post-commit push of MessagePointers)
	DISPATCH_QUEUE_TYPE: z
		.enum(["SQS", "NATS", "ACTIVEMQ", "EMBEDDED", "NONE"])
		.default("NONE"),
	DISPATCH_QUEUE_URL: z.string().optional(), // SQS queue URL
	DISPATCH_QUEUE_REGION: z.string().default("eu-west-1"),
	SQS_ENDPOINT: z.string().optional(), // For LocalStack

	// SMTP — for transactional emails (password reset, etc.)
	// All fields are optional; if SMTP_HOST is absent, email sending is disabled.
	SMTP_HOST: z.string().optional(),
	SMTP_PORT: z.coerce.number().default(587),
	SMTP_SECURE: z
		.string()
		.transform((v) => v === "true")
		.prefault("false"),
	SMTP_USERNAME: z.string().optional(),
	SMTP_PASSWORD: z.string().optional(),
	SMTP_FROM: z.string().optional(),

	// Dispatch Scheduler (polls PENDING dispatch jobs → queue)
	// Auto-enabled when messaging is enabled (platform config: messagingEnabled)
	DISPATCH_SCHEDULER_POLL_INTERVAL_MS: z.coerce.number().default(5000),
	DISPATCH_SCHEDULER_BATCH_SIZE: z.coerce.number().default(20),
	DISPATCH_SCHEDULER_MAX_CONCURRENT_GROUPS: z.coerce.number().default(10),
	DISPATCH_SCHEDULER_PROCESSING_ENDPOINT: z
		.string()
		.default("http://localhost:8080/api/dispatch/process"),
	DISPATCH_SCHEDULER_DEFAULT_POOL_CODE: z.string().default("DISPATCH-POOL"),
	DISPATCH_SCHEDULER_STALE_THRESHOLD_MINUTES: z.coerce.number().default(15),
	DISPATCH_SCHEDULER_STALE_POLL_INTERVAL_MS: z.coerce.number().default(60000),

	// Scheduled-Job Scheduler (cron-driven webhook firing).
	// Enabled by default; runs alongside the platform. Set to "false" to disable.
	FC_SCHEDULED_JOB_SCHEDULER_ENABLED: z
		.string()
		.transform((v) => v !== "false")
		.prefault("true"),
	FC_SCHEDULED_JOB_POLL_SECONDS: z.coerce.number().default(30),
	FC_SCHEDULED_JOB_DISPATCH_SECONDS: z.coerce.number().default(5),
	FC_SCHEDULED_JOB_DISPATCH_BATCH: z.coerce.number().default(32),
	FC_SCHEDULED_JOB_HTTP_TIMEOUT_SECONDS: z.coerce.number().default(10),

	// Login rate limiting (layered model — see login-rate-limit-service.ts)
	LOGIN_RATE_LIMIT_DISABLED: z
		.string()
		.transform((v) => v === "true")
		.prefault("false"),
	/**
	 * Number of trusted appending proxies between the client and the app.
	 * MUST match deployment topology — see client-ip.ts for guidance.
	 * Default 0 means "use socket address only" (no proxy).
	 */
	TRUSTED_PROXY_HOPS: z.coerce.number().default(0),
	// Layer A — per-(email, IP) exponential backoff
	LOGIN_BACKOFF_FREE_ATTEMPTS: z.coerce.number().default(3),
	LOGIN_BACKOFF_BASE_DELAY_MS: z.coerce.number().default(2000),
	LOGIN_BACKOFF_FACTOR: z.coerce.number().default(2),
	LOGIN_BACKOFF_MAX_DELAY_MS: z.coerce.number().default(300_000), // 5 min
	// Layer C — per-email global lockout
	LOGIN_LOCKOUT_MAX_FAILURES: z.coerce.number().default(10),
	LOGIN_LOCKOUT_WINDOW_MINUTES: z.coerce.number().default(15),
	LOGIN_LOCKOUT_DURATION_MINUTES: z.coerce.number().default(15),
	// Layer B — per-IP burst limit on auth + token endpoints
	AUTH_IP_REQUESTS_PER_MINUTE: z.coerce.number().default(60),
	TOKEN_IP_REQUESTS_PER_MINUTE: z.coerce.number().default(120),

	// WebAuthn / passkeys (only available for non-federated users)
	/**
	 * RP ID — typically the registrable domain (e.g. "example.com").
	 * Defaults to the hostname of EXTERNAL_BASE_URL if unset.
	 */
	WEBAUTHN_RP_ID: z.string().optional(),
	/**
	 * Allowed origin(s) the browser will report. Comma-separated.
	 * Defaults to EXTERNAL_BASE_URL if unset.
	 */
	WEBAUTHN_ORIGINS: z
		.string()
		.optional()
		.transform((v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : undefined)),
	WEBAUTHN_RP_NAME: z.string().default("FlowCatalyst"),
	/**
	 * Base64 32-byte HMAC key for the deterministic-fake authentication
	 * challenge (enumeration defense). Set this in production for stable
	 * fake responses across instances. Defaults to a per-instance random
	 * key — still defends, just non-deterministic across restarts.
	 */
	WEBAUTHN_ENUMERATION_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
	if (!cachedEnv) {
		cachedEnv = envSchema.parse(process.env);
	}
	return cachedEnv;
}

export function isDevelopment(): boolean {
	return getEnv().NODE_ENV === "development";
}

export function isProduction(): boolean {
	return getEnv().NODE_ENV === "production";
}

export function isTest(): boolean {
	return getEnv().NODE_ENV === "test";
}

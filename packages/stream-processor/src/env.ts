import { parseEnv, z } from "@flowcatalyst/config";

export const envSchema = z.object({
	// Database
	DATABASE_URL: z.string(),

	// General
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),

	// Event Projection Service
	STREAM_PROCESSOR_EVENTS_ENABLED: z
		.string()
		.transform((v) => v === "true")
		.prefault("true"),
	STREAM_PROCESSOR_EVENTS_BATCH_SIZE: z
		.string()
		.transform((v) => Number.parseInt(v, 10))
		.prefault("100"),

	// Dispatch Job Projection Service
	STREAM_PROCESSOR_DISPATCH_JOBS_ENABLED: z
		.string()
		.transform((v) => v === "true")
		.prefault("true"),
	STREAM_PROCESSOR_DISPATCH_JOBS_BATCH_SIZE: z
		.string()
		.transform((v) => Number.parseInt(v, 10))
		.prefault("100"),

	// Partition Manager — daily tick that maintains forward partitions and
	// drops past the retention window. Auto-bails on unpartitioned schemas
	// (e.g. PGlite), so it's safe to leave on; turn off here if you want to
	// skip even the detection.
	STREAM_PROCESSOR_PARTITION_MANAGER_ENABLED: z
		.string()
		.transform((v) => v === "true")
		.prefault("true"),
	STREAM_PROCESSOR_PARTITION_MONTHS_FORWARD: z
		.string()
		.transform((v) => Number.parseInt(v, 10))
		.prefault("3"),
	STREAM_PROCESSOR_PARTITION_RETENTION_DAYS: z
		.string()
		.transform((v) => Number.parseInt(v, 10))
		.prefault("90"),

	// Event Fan-Out Service — opt-in. When enabled, replaces the in-UoW
	// fan-out path. Both must NOT be enabled simultaneously or you'll get
	// duplicate dispatch jobs. See event-fan-out-service.ts for cutover steps.
	STREAM_PROCESSOR_FAN_OUT_ENABLED: z
		.string()
		.transform((v) => v === "true")
		.prefault("false"),
	STREAM_PROCESSOR_FAN_OUT_BATCH_SIZE: z
		.string()
		.transform((v) => Number.parseInt(v, 10))
		.prefault("200"),
	STREAM_PROCESSOR_FAN_OUT_SUBSCRIPTION_REFRESH_MS: z
		.string()
		.transform((v) => Number.parseInt(v, 10))
		.prefault("5000"),
});

export type Env = z.infer<typeof envSchema>;

export const env = parseEnv(envSchema);

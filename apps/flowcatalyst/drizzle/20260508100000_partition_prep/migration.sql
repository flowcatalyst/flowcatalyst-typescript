-- Prepare the messaging tables for partitioning by `created_at`.
--
-- This runs on every profile, including the embedded PGlite dev DB. It puts
-- the tables into the shape Drizzle now declares (composite primary key on
-- (id, created_at), composite UNIQUE on deduplication_id, fanned_out_at on
-- events). The actual `PARTITION BY RANGE (created_at)` only happens in the
-- production-only migration; on embedded the tables remain regular tables
-- with the new shape.

-- ─── msg_events ───────────────────────────────────────────────────────────

ALTER TABLE msg_events ADD COLUMN IF NOT EXISTS fanned_out_at TIMESTAMPTZ;
--> statement-breakpoint

-- Drop whatever PK currently sits on msg_events. The constraint may still be
-- named `events_pkey` from before the namespace rename (Postgres doesn't
-- rename associated constraints when a table is renamed).
DO $$
DECLARE pk_name text;
BEGIN
	SELECT conname INTO pk_name FROM pg_constraint
	WHERE conrelid = 'msg_events'::regclass AND contype = 'p';
	IF pk_name IS NOT NULL THEN
		EXECUTE format('ALTER TABLE msg_events DROP CONSTRAINT %I', pk_name);
	END IF;
END $$;
--> statement-breakpoint

ALTER TABLE msg_events ALTER COLUMN created_at SET NOT NULL;
--> statement-breakpoint

ALTER TABLE msg_events ADD CONSTRAINT msg_events_pkey PRIMARY KEY (id, created_at);
--> statement-breakpoint

DROP INDEX IF EXISTS idx_msg_events_type;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_events_client_type;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_events_time;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_events_correlation;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_events_deduplication;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS idx_msg_events_client_id ON msg_events (client_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_msg_events_created_at ON msg_events (created_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_msg_events_unfanned ON msg_events (created_at) WHERE fanned_out_at IS NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS idx_msg_events_deduplication ON msg_events (deduplication_id, created_at);
--> statement-breakpoint

-- ─── msg_events_read ──────────────────────────────────────────────────────

ALTER TABLE msg_events_read ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
--> statement-breakpoint

DO $$
DECLARE pk_name text;
BEGIN
	SELECT conname INTO pk_name FROM pg_constraint
	WHERE conrelid = 'msg_events_read'::regclass AND contype = 'p';
	IF pk_name IS NOT NULL THEN
		EXECUTE format('ALTER TABLE msg_events_read DROP CONSTRAINT %I', pk_name);
	END IF;
END $$;
--> statement-breakpoint

ALTER TABLE msg_events_read ADD CONSTRAINT msg_events_read_pkey PRIMARY KEY (id, created_at);
--> statement-breakpoint

-- ─── msg_dispatch_jobs ────────────────────────────────────────────────────

DO $$
DECLARE pk_name text;
BEGIN
	SELECT conname INTO pk_name FROM pg_constraint
	WHERE conrelid = 'msg_dispatch_jobs'::regclass AND contype = 'p';
	IF pk_name IS NOT NULL THEN
		EXECUTE format('ALTER TABLE msg_dispatch_jobs DROP CONSTRAINT %I', pk_name);
	END IF;
END $$;
--> statement-breakpoint

ALTER TABLE msg_dispatch_jobs ALTER COLUMN created_at SET NOT NULL;
--> statement-breakpoint

ALTER TABLE msg_dispatch_jobs ADD CONSTRAINT msg_dispatch_jobs_pkey PRIMARY KEY (id, created_at);
--> statement-breakpoint

DROP INDEX IF EXISTS idx_msg_dispatch_jobs_status;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_dispatch_jobs_client_id;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_dispatch_jobs_message_group;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_dispatch_jobs_subscription_id;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_dispatch_jobs_connection_id;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_dispatch_jobs_created_at;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_msg_dispatch_jobs_scheduled_for;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS idx_dispatch_jobs_pending_poll
    ON msg_dispatch_jobs (message_group NULLS LAST, sequence, created_at)
    WHERE status = 'PENDING';
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_dispatch_jobs_blocked_groups
    ON msg_dispatch_jobs (message_group, status)
    WHERE status IN ('FAILED', 'ERROR');
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS idx_dispatch_jobs_stale_queued
    ON msg_dispatch_jobs (queued_at)
    WHERE status = 'QUEUED';
--> statement-breakpoint

-- ─── msg_dispatch_jobs_read ───────────────────────────────────────────────

DO $$
DECLARE pk_name text;
BEGIN
	SELECT conname INTO pk_name FROM pg_constraint
	WHERE conrelid = 'msg_dispatch_jobs_read'::regclass AND contype = 'p';
	IF pk_name IS NOT NULL THEN
		EXECUTE format('ALTER TABLE msg_dispatch_jobs_read DROP CONSTRAINT %I', pk_name);
	END IF;
END $$;
--> statement-breakpoint

ALTER TABLE msg_dispatch_jobs_read ALTER COLUMN created_at SET NOT NULL;
--> statement-breakpoint

ALTER TABLE msg_dispatch_jobs_read ADD CONSTRAINT msg_dispatch_jobs_read_pkey PRIMARY KEY (id, created_at);
--> statement-breakpoint

-- ─── msg_dispatch_job_attempts ────────────────────────────────────────────

DO $$
DECLARE pk_name text;
BEGIN
	SELECT conname INTO pk_name FROM pg_constraint
	WHERE conrelid = 'msg_dispatch_job_attempts'::regclass AND contype = 'p';
	IF pk_name IS NOT NULL THEN
		EXECUTE format('ALTER TABLE msg_dispatch_job_attempts DROP CONSTRAINT %I', pk_name);
	END IF;
END $$;
--> statement-breakpoint

ALTER TABLE msg_dispatch_job_attempts ALTER COLUMN created_at SET DEFAULT NOW();
--> statement-breakpoint

UPDATE msg_dispatch_job_attempts SET created_at = NOW() WHERE created_at IS NULL;
--> statement-breakpoint

ALTER TABLE msg_dispatch_job_attempts ALTER COLUMN created_at SET NOT NULL;
--> statement-breakpoint

ALTER TABLE msg_dispatch_job_attempts ADD CONSTRAINT msg_dispatch_job_attempts_pkey PRIMARY KEY (id, created_at);
--> statement-breakpoint

DROP INDEX IF EXISTS idx_msg_dispatch_job_attempts_job_number;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS idx_msg_dispatch_job_attempts_job_number
    ON msg_dispatch_job_attempts (dispatch_job_id, attempt_number, created_at);

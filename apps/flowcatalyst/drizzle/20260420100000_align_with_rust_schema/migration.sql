-- ============================================================================
-- Align schema with flowcatalyst-rust migrations 012 and 015
--
-- These fields exist in the Rust DB after its own migrations run; this
-- migration makes the TS-managed DB look the same so either backend can
-- point at a DB the other one migrated.
--
-- 1. msg_events.projected_at / msg_dispatch_jobs.projected_at — stamped by
--    the Rust projector. The TS projector leaves them NULL and continues to
--    drive off the projection-feed tables, so this is purely additive.
-- 2. msg_dispatch_jobs.queued_at — stamped by the Rust scheduler when a job
--    is published onto the queue. Used by the stale-queued recovery path.
-- 3. msg_dispatch_job_attempts.id — Rust narrowed to VARCHAR(13); TS code
--    already writes 13-char raw TSIDs (generateRaw()) so the narrower column
--    matches both codebases' actual data.
-- ============================================================================

ALTER TABLE msg_events ADD COLUMN IF NOT EXISTS projected_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_msg_events_unprojected ON msg_events (created_at) WHERE projected_at IS NULL;
--> statement-breakpoint

ALTER TABLE msg_dispatch_jobs ADD COLUMN IF NOT EXISTS projected_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_msg_dispatch_jobs_unprojected ON msg_dispatch_jobs (created_at) WHERE projected_at IS NULL;
--> statement-breakpoint

ALTER TABLE msg_dispatch_jobs ADD COLUMN IF NOT EXISTS queued_at TIMESTAMPTZ;
--> statement-breakpoint

ALTER TABLE msg_dispatch_job_attempts ALTER COLUMN id TYPE VARCHAR(13);

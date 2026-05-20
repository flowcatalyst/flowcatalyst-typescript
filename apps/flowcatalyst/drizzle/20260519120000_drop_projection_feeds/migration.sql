-- Drop the projection-feed tables. The stream processor now projects
-- msg_events / msg_dispatch_jobs into their read models directly via
-- the `projected_at` column on each write-model row (matches the Rust
-- stream crate). No producer writes to these tables anymore.
--
-- The CASCADE clause drops the partial indexes attached to each table.

DROP TABLE IF EXISTS msg_dispatch_job_projection_feed CASCADE;
DROP TABLE IF EXISTS msg_event_projection_feed CASCADE;

-- Make dispatch pool rate_limit opt-in: a pool can run on concurrency only.
-- Mirrors Rust migration 017. Existing rows keep their stored value;
-- new rows and updates may set NULL to mean "no rate limit".

ALTER TABLE "msg_dispatch_pools"
    ALTER COLUMN "rate_limit" DROP NOT NULL;

ALTER TABLE "msg_dispatch_pools"
    ALTER COLUMN "rate_limit" DROP DEFAULT;

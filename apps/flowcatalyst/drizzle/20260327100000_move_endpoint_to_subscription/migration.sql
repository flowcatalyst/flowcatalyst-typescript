-- ============================================================================
-- Move endpoint from Connection to Subscription
--
-- Connection becomes auth/pause group only (no endpoint).
-- Subscription owns its webhook endpoint URL.
-- connectionId on Subscription becomes optional (nullable).
-- ============================================================================

-- 1. Add endpoint column to msg_subscriptions
ALTER TABLE msg_subscriptions ADD COLUMN IF NOT EXISTS endpoint varchar(2048) NOT NULL DEFAULT '';

-- 2. Copy endpoint from connection to subscription (for existing rows)
UPDATE msg_subscriptions s
SET endpoint = c.endpoint
FROM msg_connections c
WHERE s.connection_id = c.id
  AND s.endpoint = '';

-- 3. Make connection_id nullable on msg_subscriptions
ALTER TABLE msg_subscriptions ALTER COLUMN connection_id DROP NOT NULL;

-- 4. Drop endpoint from msg_connections
ALTER TABLE msg_connections DROP COLUMN IF EXISTS endpoint;

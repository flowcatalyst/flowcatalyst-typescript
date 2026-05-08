-- Add iam_webauthn_credentials table for passkey support.
-- Only available for non-federated (INTERNAL idpType) users; the
-- federation gate is enforced at the application layer in
-- packages/platform/src/infrastructure/webauthn/webauthn-gate.ts.
--
-- All fields are non-secret by spec — the private key never leaves the
-- authenticator (Secure Enclave / TPM / YubiKey). No application-layer
-- encryption is applied.
--
-- credential_id is denormalised out of credential_data so the lookup at
-- authentication time is indexed. credential_data is rewritten on each
-- successful authentication to record the new sign-count and backup state.

CREATE TABLE IF NOT EXISTS "iam_webauthn_credentials" (
    "id"              varchar(17)  PRIMARY KEY,
    "principal_id"    varchar(17)  NOT NULL,
    "credential_id"   bytea        NOT NULL UNIQUE,
    "credential_data" jsonb        NOT NULL,
    "name"            varchar(120),
    "created_at"      timestamptz  NOT NULL DEFAULT NOW(),
    "last_used_at"    timestamptz
);

CREATE INDEX IF NOT EXISTS "idx_iam_webauthn_credentials_principal"
    ON "iam_webauthn_credentials" ("principal_id");

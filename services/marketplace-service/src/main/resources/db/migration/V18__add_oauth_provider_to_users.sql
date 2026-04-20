-- V18: Add OAuth provider fields to the users table
-- These columns store which external identity provider was used (google / microsoft)
-- and the stable user identifier returned by that provider.
-- NULL means the account was created with email+password only.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS oauth_provider    VARCHAR(50)  DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS oauth_provider_id VARCHAR(255) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_users_oauth_provider
    ON users (oauth_provider, oauth_provider_id);

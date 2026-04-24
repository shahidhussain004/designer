-- =====================================================
-- V19: Create Newsletter Subscribers Table
-- Description: Stores newsletter subscriptions with
--              tokenized unsubscribe support.
--              Standalone table — not tied to user accounts
--              so anyone (guest or member) can subscribe.
-- =====================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id                  BIGSERIAL PRIMARY KEY,
    email               VARCHAR(255)  NOT NULL,
    unsubscribe_token   VARCHAR(36)   NOT NULL,          -- UUID used for one-click unsubscribe
    subscribed          BOOLEAN       NOT NULL DEFAULT TRUE,
    subscribed_at       TIMESTAMP(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at     TIMESTAMP(6),
    ip_address          VARCHAR(45),                     -- IPv4 or IPv6 at subscription time
    source              VARCHAR(50)   NOT NULL DEFAULT 'footer',  -- where the signup came from

    CONSTRAINT uq_newsletter_email              UNIQUE (email),
    CONSTRAINT uq_newsletter_unsubscribe_token  UNIQUE (unsubscribe_token)
);

-- Fast lookup by email on subscribe / duplicate check
CREATE INDEX idx_newsletter_email       ON newsletter_subscribers (email);
-- Fast lookup by token on unsubscribe
CREATE INDEX idx_newsletter_token       ON newsletter_subscribers (unsubscribe_token);
-- Filter active subscribers for marketing sends
CREATE INDEX idx_newsletter_subscribed  ON newsletter_subscribers (subscribed) WHERE subscribed = TRUE;

CREATE TABLE IF NOT EXISTS USERS (
    id SERIAL PRIMARY KEY,
    public_key varchar(64) NOT NULL,
    owns_usdc boolean NOT NULL DEFAULT FALSE,
    nonce BIGINT NOT NULL,
    refresh_token varchar(500),
    coupon varchar(10)
);

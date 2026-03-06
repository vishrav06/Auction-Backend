exports.up = (pgm) => {
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  pgm.sql(`
    CREATE TABLE users (
      id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      username      VARCHAR(50)  UNIQUE NOT NULL,
      email         VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT         NOT NULL,
      role          VARCHAR(20)  NOT NULL DEFAULT 'user',
      avatar_url    TEXT,
      is_suspended  BOOLEAN      NOT NULL DEFAULT FALSE,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      CONSTRAINT role_check CHECK (role IN ('user', 'admin')),
      CONSTRAINT email_lowercase_check CHECK (email = LOWER(email))
    )
  `);

  pgm.sql(`
    CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at()
  `);

};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS users CASCADE`);
  pgm.sql(`DROP FUNCTION IF EXISTS update_updated_at CASCADE`);
};
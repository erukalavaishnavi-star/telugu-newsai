-- ════════════════════════════════════════════════════════════════
-- Telugu NewsAI — PostgreSQL Database Schema v1.0
-- Run: psql -U postgres -d telugu_newsai -f schema.sql
-- ════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─── ENUMS ────────────────────────────────────────────────────────────────
CREATE TYPE user_role  AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE user_plan  AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE sentiment  AS ENUM ('positive', 'neutral', 'negative');

-- ─── USERS ────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hash
  name        VARCHAR(100),
  org_name    VARCHAR(150),
  role        user_role   DEFAULT 'editor',
  plan        user_plan   DEFAULT 'free',
  api_key     VARCHAR(64) UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ─── ARTICLES ─────────────────────────────────────────────────────────────
CREATE TABLE articles (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(500),
  body        TEXT        NOT NULL,
  category    VARCHAR(50) DEFAULT 'general',
  char_count  INTEGER     NOT NULL DEFAULT 0,
  sentiment   sentiment,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_user_id    ON articles(user_id);
CREATE INDEX idx_articles_category   ON articles(category);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
-- Full-text search on title
CREATE INDEX idx_articles_title_gin  ON articles USING gin(title gin_trgm_ops);

-- ─── GENERATED_POSTS ──────────────────────────────────────────────────────
CREATE TABLE generated_posts (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id        UUID        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id           UUID        NOT NULL REFERENCES users(id),
  headline          VARCHAR(500),
  key_facts         JSONB,
  summary           TEXT,
  caption_variations JSONB,
  facebook_post     TEXT,
  instagram_caption TEXT,
  twitter_post      VARCHAR(280),
  whatsapp_text     TEXT,
  youtube_post      TEXT,
  breaking_alert    VARCHAR(120),
  generation_ms     INTEGER     NOT NULL DEFAULT 0,
  ai_model          VARCHAR(50) DEFAULT 'gemini-1.5-flash',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id    ON generated_posts(user_id);
CREATE INDEX idx_posts_article_id ON generated_posts(article_id);
CREATE INDEX idx_posts_created_at ON generated_posts(created_at DESC);

-- ─── HASHTAGS ─────────────────────────────────────────────────────────────
CREATE TABLE hashtags (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID        NOT NULL REFERENCES generated_posts(id) ON DELETE CASCADE,
  tag         VARCHAR(100) NOT NULL,
  usage_count INTEGER     DEFAULT 1
);

CREATE INDEX idx_hashtags_post_id ON hashtags(post_id);
CREATE INDEX idx_hashtags_tag     ON hashtags(tag);

-- ─── SEO_KEYWORDS ─────────────────────────────────────────────────────────
CREATE TABLE seo_keywords (
  id      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID        NOT NULL REFERENCES generated_posts(id) ON DELETE CASCADE,
  keyword VARCHAR(150) NOT NULL
);

CREATE INDEX idx_seo_post_id ON seo_keywords(post_id);

-- ─── GENERATION_HISTORY ───────────────────────────────────────────────────
CREATE TABLE generation_history (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES users(id),
  post_id    UUID        NOT NULL REFERENCES generated_posts(id),
  action     VARCHAR(50) DEFAULT 'generate', -- generate|copy|export|delete
  platform   VARCHAR(30),                    -- facebook|instagram|twitter|etc
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_history_user_id    ON generation_history(user_id);
CREATE INDEX idx_history_post_id    ON generation_history(post_id);
CREATE INDEX idx_history_created_at ON generation_history(created_at DESC);

-- ─── MATERIALIZED VIEW — Daily Stats ─────────────────────────────────────
CREATE MATERIALIZED VIEW daily_user_stats AS
SELECT
  user_id,
  DATE(created_at)           AS stat_date,
  COUNT(*)                   AS articles_processed,
  SUM(generation_ms)         AS total_gen_ms,
  AVG(generation_ms)::INT    AS avg_gen_ms
FROM generated_posts
GROUP BY user_id, DATE(created_at);

CREATE UNIQUE INDEX ON daily_user_stats(user_id, stat_date);

-- Refresh daily via cron: SELECT refresh_materialized_view_concurrently('daily_user_stats');

-- ─── UPDATED_AT trigger ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

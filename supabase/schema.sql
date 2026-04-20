-- Wingate Content Planner — Supabase schema
-- Run this whole file in Supabase SQL editor. Idempotent: safe to re-run.

-- ========== content_items ==========
CREATE TABLE IF NOT EXISTS content_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date        DATE,                                -- NULL means "Date TBC"
  channel     TEXT NOT NULL,
  content_type TEXT NOT NULL,
  topic       TEXT NOT NULL,
  campaign    TEXT NOT NULL DEFAULT '',
  owner       TEXT NOT NULL DEFAULT 'Matt',
  status      TEXT NOT NULL DEFAULT 'Planned',     -- Planned | Draft | Ready | Published
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_items_date_idx     ON content_items (date);
CREATE INDEX IF NOT EXISTS content_items_channel_idx  ON content_items (channel);
CREATE INDEX IF NOT EXISTS content_items_campaign_idx ON content_items (campaign);

-- ========== comments (polymorphic on item OR campaign) ==========
CREATE TABLE IF NOT EXISTS comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('item', 'campaign')),
  target_id   TEXT NOT NULL,                       -- item UUID (as text) OR campaign name
  author      TEXT NOT NULL DEFAULT 'Matt',
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_target_idx ON comments (target_type, target_id);

-- ========== updated_at trigger ==========
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS t_content_items_updated_at ON content_items;
CREATE TRIGGER t_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ========== Realtime publication ==========
-- Add tables to the default realtime publication. If they're already added, ignore.
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE content_items;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE comments;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END$$;

-- ========== Row-level security — open policy (internal tool, no auth) ==========
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments      ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "open access" ON content_items;
CREATE POLICY "open access" ON content_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open access" ON comments;
CREATE POLICY "open access" ON comments FOR ALL USING (true) WITH CHECK (true);

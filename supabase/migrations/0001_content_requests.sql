-- v3 migration: content request intake
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run (idempotent).

CREATE TABLE IF NOT EXISTS content_requests (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name        TEXT NOT NULL,
  requester_department  TEXT NOT NULL DEFAULT 'Other',
  requested_date        DATE,
  channel_preferences   TEXT[] DEFAULT ARRAY[]::TEXT[],
  description           TEXT NOT NULL,
  notes                 TEXT NOT NULL DEFAULT '',
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'approved', 'ignored')),
  ignored_reason        TEXT,
  reviewed_by           TEXT,
  reviewed_at           TIMESTAMPTZ,
  linked_item_id        UUID REFERENCES content_items(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_requests_status_idx ON content_requests (status);
CREATE INDEX IF NOT EXISTS content_requests_created_idx ON content_requests (created_at DESC);

-- touch_updated_at already exists from the original schema
DROP TRIGGER IF EXISTS t_content_requests_updated_at ON content_requests;
CREATE TRIGGER t_content_requests_updated_at
  BEFORE UPDATE ON content_requests
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Realtime
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE content_requests;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END$$;

-- RLS open policy (internal tool, no auth)
ALTER TABLE content_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "open access" ON content_requests;
CREATE POLICY "open access" ON content_requests FOR ALL USING (true) WITH CHECK (true);

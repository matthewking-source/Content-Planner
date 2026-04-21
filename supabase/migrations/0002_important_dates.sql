-- v4 migration: important dates (awareness days, term dates, bank holidays, internal milestones)
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.

CREATE TABLE IF NOT EXISTS important_dates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date        DATE NOT NULL,
  end_date    DATE,                                    -- NULL = single day; set for ranges (e.g. Half Term Mon–Fri)
  label       TEXT NOT NULL,                           -- "Mental Health Awareness Week"
  category    TEXT NOT NULL DEFAULT 'Other'
                CHECK (category IN ('Awareness', 'School', 'Bank holiday', 'Internal', 'Charity event', 'Other')),
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS important_dates_date_idx ON important_dates (date);

-- touch_updated_at already exists from v1 schema
DROP TRIGGER IF EXISTS t_important_dates_updated_at ON important_dates;
CREATE TRIGGER t_important_dates_updated_at
  BEFORE UPDATE ON important_dates
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Realtime
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE important_dates;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END$$;

-- RLS open policy (internal tool, no auth)
ALTER TABLE important_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "open access" ON important_dates;
CREATE POLICY "open access" ON important_dates FOR ALL USING (true) WITH CHECK (true);

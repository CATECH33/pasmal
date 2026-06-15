-- ── Favorites ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id text NOT NULL,
  listing_title text,
  listing_location text,
  listing_price text,
  listing_image text,
  listing_rooms integer,
  listing_surface integer,
  listing_type text DEFAULT 'acheter',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_listing ON favorites(user_id, listing_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- ── Alerts ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  criteria jsonb DEFAULT '{}',
  frequency text DEFAULT 'daily',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own alerts" ON alerts FOR ALL USING (auth.uid() = user_id);

-- ── Alert notifications ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alert_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_id uuid REFERENCES alerts(id) ON DELETE CASCADE,
  type text DEFAULT 'match',
  title text NOT NULL,
  body text,
  listing_id text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alert_notifs_user ON alert_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifs_unread ON alert_notifications(user_id, is_read) WHERE NOT is_read;

ALTER TABLE alert_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notifications" ON alert_notifications FOR ALL USING (auth.uid() = user_id);

-- ── Saved searches ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  params jsonb DEFAULT '{}',
  result_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);

ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own searches" ON saved_searches FOR ALL USING (auth.uid() = user_id);

-- ── Add profile fields if missing ─────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS project_type text DEFAULT 'Acheter';

-- Add premium_alerts flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS premium_alerts boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  type text NOT NULL DEFAULT 'premium_alerts',
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  price_amount integer NOT NULL DEFAULT 750,
  price_currency text NOT NULL DEFAULT 'eur',
  price_interval text NOT NULL DEFAULT 'month',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update (via Edge Functions)
CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_subscriptions_updated_at();

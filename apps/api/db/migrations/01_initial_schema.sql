-- users: writers who've signed up
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscription_tier TEXT DEFAULT 'free', -- 'free' | 'pro' | 'team'
  analyses_used INT DEFAULT 0,           -- rolling counter for this month
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups during authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- analyses: each time user checks a draft
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,             -- original draft
  output_text TEXT,                     -- cleaned version (if user saves)
  cliches_found INT NOT NULL,           -- count of clichés detected
  health_score INT,                     -- 0-100 originality score
  cliche_list JSONB NOT NULL,           -- array of {phrase, count, alternatives}
  status TEXT DEFAULT 'analyzed',       -- 'analyzed' | 'saved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyses_user ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created ON analyses(created_at DESC);

-- api_keys: for extension + third-party API access
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key TEXT UNIQUE NOT NULL,             -- random 32-char string
  name TEXT,                            -- "Chrome Extension" or user's label
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- usage_log: track API calls for rate limiting + analytics
CREATE TABLE IF NOT EXISTS usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  ip_address INET,
  endpoint TEXT,
  status_code INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_log_user_date ON usage_log(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'users_self') THEN
        CREATE POLICY "users_self" ON users FOR ALL USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'analyses_owned') THEN
        CREATE POLICY "analyses_owned" ON analyses FOR ALL USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'api_keys_owned') THEN
        CREATE POLICY "api_keys_owned" ON api_keys FOR ALL USING (user_id = auth.uid());
    END IF;
END
$$;

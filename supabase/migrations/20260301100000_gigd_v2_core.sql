-- Extend profiles with plan and Stripe subscription metadata
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_status TEXT,
  ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_plan_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_plan_check
      CHECK (plan IN ('free', 'debutant', 'investisseur', 'avance'));
  END IF;
END $$;

-- V2 analyses table
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  inputs_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  strategy TEXT NOT NULL CHECK (strategy IN ('nue', 'meuble', 'colocation', 'lcd')),
  ia_mode TEXT NOT NULL CHECK (ia_mode IN ('courte', 'complete')),
  listing_json JSONB,
  dvf_json JSONB,
  analysis_text TEXT,
  cache_hit BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analyses_user_created ON public.analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_canonical ON public.analyses(canonical_url);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users CRUD own analyses v2'
  ) THEN
    CREATE POLICY "Users CRUD own analyses v2"
      ON public.analyses
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- IA cache table
CREATE TABLE IF NOT EXISTS public.ai_cache (
  cache_key TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  canonical_url TEXT NOT NULL,
  inputs_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  mode TEXT NOT NULL CHECK (mode IN ('courte', 'complete')),
  ai_text TEXT NOT NULL,
  tokens INTEGER,
  cost NUMERIC(12, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_created ON public.ai_cache(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_cache_url_mode ON public.ai_cache(canonical_url, mode);

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users view own cache'
  ) THEN
    CREATE POLICY "Users view own cache"
      ON public.ai_cache
      FOR SELECT
      USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- Usage tracking (monthly)
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL, -- YYYY-MM
  analyses_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_key)
);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period ON public.usage_tracking(user_id, period_key);

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users CRUD own usage tracking'
  ) THEN
    CREATE POLICY "Users CRUD own usage tracking"
      ON public.usage_tracking
      FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Updated at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ai_cache_updated_at') THEN
    CREATE TRIGGER update_ai_cache_updated_at
      BEFORE UPDATE ON public.ai_cache
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_usage_tracking_updated_at') THEN
    CREATE TRIGGER update_usage_tracking_updated_at
      BEFORE UPDATE ON public.usage_tracking
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

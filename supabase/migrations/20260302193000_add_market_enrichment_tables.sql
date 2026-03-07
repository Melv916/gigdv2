-- Market enrichment registry/cache/snapshots for MCP data.gouv.fr integration

CREATE TABLE IF NOT EXISTS public.market_dataset_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('DVF', 'INSEE', 'LOYER', 'AUTRE')),
  query TEXT NOT NULL,
  dataset_id TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  source_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ttl_until TIMESTAMPTZ NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  UNIQUE(kind, query)
);

CREATE INDEX IF NOT EXISTS idx_market_dataset_registry_kind_ttl
  ON public.market_dataset_registry(kind, ttl_until DESC);

ALTER TABLE public.market_dataset_registry ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users read market dataset registry'
  ) THEN
    CREATE POLICY "Authenticated users read market dataset registry"
      ON public.market_dataset_registry
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.market_geo_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  geo_key TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('DVF', 'INSEE', 'LOYER', 'AUTRE')),
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  dataset_id TEXT,
  resource_id TEXT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ttl_until TIMESTAMPTZ NOT NULL,
  UNIQUE(geo_key, kind)
);

CREATE INDEX IF NOT EXISTS idx_market_geo_cache_geo_kind_ttl
  ON public.market_geo_cache(geo_key, kind, ttl_until DESC);

ALTER TABLE public.market_geo_cache ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users read market geo cache'
  ) THEN
    CREATE POLICY "Authenticated users read market geo cache"
      ON public.market_geo_cache
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.analysis_market_snapshot (
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('DVF', 'INSEE', 'LOYER', 'AUTRE')),
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  dataset_id TEXT,
  resource_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (analysis_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_analysis_market_snapshot_created
  ON public.analysis_market_snapshot(created_at DESC);

ALTER TABLE public.analysis_market_snapshot ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users view own market snapshots'
  ) THEN
    CREATE POLICY "Users view own market snapshots"
      ON public.analysis_market_snapshot
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.analyses a
          WHERE a.id = analysis_market_snapshot.analysis_id
            AND a.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Lightweight async queue for heavy enrichment runs
CREATE TABLE IF NOT EXISTS public.market_enrichment_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'done', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(analysis_id)
);

CREATE INDEX IF NOT EXISTS idx_market_enrichment_jobs_status_created
  ON public.market_enrichment_jobs(status, created_at ASC);

ALTER TABLE public.market_enrichment_jobs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users read own market enrichment jobs'
  ) THEN
    CREATE POLICY "Users read own market enrichment jobs"
      ON public.market_enrichment_jobs
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_market_enrichment_jobs_updated_at') THEN
    CREATE TRIGGER update_market_enrichment_jobs_updated_at
      BEFORE UPDATE ON public.market_enrichment_jobs
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

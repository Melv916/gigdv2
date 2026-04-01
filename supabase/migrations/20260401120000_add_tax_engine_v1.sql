ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS default_ownership_mode TEXT,
  ADD COLUMN IF NOT EXISTS default_tax_regime TEXT,
  ADD COLUMN IF NOT EXISTS tmi NUMERIC DEFAULT 0.30,
  ADD COLUMN IF NOT EXISTS social_rate NUMERIC DEFAULT 0.172,
  ADD COLUMN IF NOT EXISTS corporate_tax_rate NUMERIC DEFAULT 0.25,
  ADD COLUMN IF NOT EXISTS reduced_is_eligible BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS investor_objective TEXT;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS exploitation_mode TEXT,
  ADD COLUMN IF NOT EXISTS ownership_mode TEXT,
  ADD COLUMN IF NOT EXISTS default_tax_regime TEXT,
  ADD COLUMN IF NOT EXISTS investor_objective TEXT,
  ADD COLUMN IF NOT EXISTS tmi NUMERIC DEFAULT 0.30,
  ADD COLUMN IF NOT EXISTS social_rate NUMERIC DEFAULT 0.172,
  ADD COLUMN IF NOT EXISTS corporate_tax_rate NUMERIC DEFAULT 0.25,
  ADD COLUMN IF NOT EXISTS reduced_is_eligible BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS dividend_distribution_rate NUMERIC DEFAULT 1,
  ADD COLUMN IF NOT EXISTS mother_daughter_rate NUMERIC DEFAULT 0.95,
  ADD COLUMN IF NOT EXISTS accounting_fees NUMERIC DEFAULT 600,
  ADD COLUMN IF NOT EXISTS furniture_amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS management_fees NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS property_insurance NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS amortization_settings_json JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.project_analyses
  ADD COLUMN IF NOT EXISTS exploitation_mode TEXT,
  ADD COLUMN IF NOT EXISTS ownership_mode TEXT,
  ADD COLUMN IF NOT EXISTS tax_regime TEXT,
  ADD COLUMN IF NOT EXISTS investor_objective TEXT,
  ADD COLUMN IF NOT EXISTS tmi NUMERIC,
  ADD COLUMN IF NOT EXISTS social_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS corporate_tax_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS reduced_is_eligible BOOLEAN,
  ADD COLUMN IF NOT EXISTS dividend_distribution_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS mother_daughter_rate NUMERIC,
  ADD COLUMN IF NOT EXISTS amortization_settings_json JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS tax_settings_json JSONB,
  ADD COLUMN IF NOT EXISTS tax_analysis_json JSONB,
  ADD COLUMN IF NOT EXISTS tax_comparison_json JSONB,
  ADD COLUMN IF NOT EXISTS canonical_input_json JSONB,
  ADD COLUMN IF NOT EXISTS economic_result_json JSONB,
  ADD COLUMN IF NOT EXISTS patrimonial_result_json JSONB,
  ADD COLUMN IF NOT EXISTS core_calc_version TEXT,
  ADD COLUMN IF NOT EXISTS tax_calc_version TEXT;

CREATE TABLE IF NOT EXISTS public.analysis_tax_results (
  analysis_id UUID NOT NULL REFERENCES public.project_analyses(id) ON DELETE CASCADE,
  regime TEXT NOT NULL,
  result_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  assumptions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  warnings_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (analysis_id, regime)
);

ALTER TABLE public.analysis_tax_results ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users CRUD own analysis tax results'
  ) THEN
    CREATE POLICY "Users CRUD own analysis tax results"
      ON public.analysis_tax_results
      FOR ALL
      USING (
        EXISTS (
          SELECT 1
          FROM public.project_analyses pa
          WHERE pa.id = analysis_tax_results.analysis_id
            AND pa.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.project_analyses pa
          WHERE pa.id = analysis_tax_results.analysis_id
            AND pa.user_id = auth.uid()
        )
      );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.analysis_tax_comparisons (
  analysis_id UUID PRIMARY KEY REFERENCES public.project_analyses(id) ON DELETE CASCADE,
  compared_regimes_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  comparison_table_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analysis_tax_comparisons ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users CRUD own analysis tax comparisons'
  ) THEN
    CREATE POLICY "Users CRUD own analysis tax comparisons"
      ON public.analysis_tax_comparisons
      FOR ALL
      USING (
        EXISTS (
          SELECT 1
          FROM public.project_analyses pa
          WHERE pa.id = analysis_tax_comparisons.analysis_id
            AND pa.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1
          FROM public.project_analyses pa
          WHERE pa.id = analysis_tax_comparisons.analysis_id
            AND pa.user_id = auth.uid()
        )
      );
  END IF;
END $$;

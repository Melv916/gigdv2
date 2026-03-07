CREATE TABLE IF NOT EXISTS public.city_market_prices (
  insee_code TEXT PRIMARY KEY,
  commune TEXT,
  departement_code TEXT,
  rent_m2_app_all NUMERIC(10, 2),
  rent_m2_app_t1t2 NUMERIC(10, 2),
  rent_m2_app_t3plus NUMERIC(10, 2),
  rent_m2_house NUMERIC(10, 2),
  rent_source TEXT,
  rent_year SMALLINT,
  sale_m2_all NUMERIC(10, 2),
  sale_m2_apartment NUMERIC(10, 2),
  sale_m2_house NUMERIC(10, 2),
  sale_tx_count INTEGER,
  sale_period_from DATE,
  sale_period_to DATE,
  sale_source TEXT NOT NULL DEFAULT 'DVF',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_city_market_prices_dept
  ON public.city_market_prices (departement_code);

ALTER TABLE public.city_market_prices ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'city_market_prices'
      AND policyname = 'city_market_prices_public_read'
  ) THEN
    CREATE POLICY "city_market_prices_public_read"
      ON public.city_market_prices
      FOR SELECT
      USING (true);
  END IF;
END $$;

WITH latest_rent AS (
  SELECT DISTINCT ON (insee_code)
    insee_code,
    commune,
    departement_code,
    loyer_m2_cc_app_all,
    loyer_m2_cc_app_t1t2,
    loyer_m2_cc_app_t3plus,
    loyer_m2_cc_house,
    source,
    year
  FROM public.loyers_commune
  WHERE insee_code IS NOT NULL
  ORDER BY insee_code, year DESC, updated_at DESC
),
dvf_base AS (
  SELECT
    code_commune AS insee_code,
    MAX(nom_commune) AS commune,
    MAX(code_departement) AS departement_code,
    date_mutation,
    type_local,
    (valeur_fonciere / NULLIF(surface_reelle_bati, 0))::NUMERIC AS prix_m2
  FROM public.dvf_transactions
  WHERE code_commune IS NOT NULL
    AND valeur_fonciere > 0
    AND surface_reelle_bati > 0
    AND date_mutation >= (CURRENT_DATE - INTERVAL '36 months')
  GROUP BY code_commune, date_mutation, type_local, valeur_fonciere, surface_reelle_bati
),
dvf_agg AS (
  SELECT
    insee_code,
    MAX(commune) AS commune,
    MAX(departement_code) AS departement_code,
    COUNT(*)::INT AS sale_tx_count,
    MIN(date_mutation) AS sale_period_from,
    MAX(date_mutation) AS sale_period_to,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY prix_m2)::NUMERIC(10, 2) AS sale_m2_all,
    PERCENTILE_CONT(0.5) WITHIN GROUP (
      ORDER BY CASE WHEN type_local = 'Appartement' THEN prix_m2 END
    )::NUMERIC(10, 2) AS sale_m2_apartment,
    PERCENTILE_CONT(0.5) WITHIN GROUP (
      ORDER BY CASE WHEN type_local = 'Maison' THEN prix_m2 END
    )::NUMERIC(10, 2) AS sale_m2_house
  FROM dvf_base
  GROUP BY insee_code
),
joined AS (
  SELECT
    COALESCE(r.insee_code, d.insee_code) AS insee_code,
    COALESCE(r.commune, d.commune) AS commune,
    COALESCE(r.departement_code, d.departement_code) AS departement_code,
    r.loyer_m2_cc_app_all AS rent_m2_app_all,
    r.loyer_m2_cc_app_t1t2 AS rent_m2_app_t1t2,
    r.loyer_m2_cc_app_t3plus AS rent_m2_app_t3plus,
    r.loyer_m2_cc_house AS rent_m2_house,
    r.source AS rent_source,
    r.year AS rent_year,
    d.sale_m2_all,
    d.sale_m2_apartment,
    d.sale_m2_house,
    d.sale_tx_count,
    d.sale_period_from,
    d.sale_period_to
  FROM latest_rent r
  FULL OUTER JOIN dvf_agg d
    ON d.insee_code = r.insee_code
)
INSERT INTO public.city_market_prices (
  insee_code,
  commune,
  departement_code,
  rent_m2_app_all,
  rent_m2_app_t1t2,
  rent_m2_app_t3plus,
  rent_m2_house,
  rent_source,
  rent_year,
  sale_m2_all,
  sale_m2_apartment,
  sale_m2_house,
  sale_tx_count,
  sale_period_from,
  sale_period_to,
  sale_source,
  updated_at
)
SELECT
  insee_code,
  commune,
  departement_code,
  rent_m2_app_all,
  rent_m2_app_t1t2,
  rent_m2_app_t3plus,
  rent_m2_house,
  rent_source,
  rent_year,
  sale_m2_all,
  sale_m2_apartment,
  sale_m2_house,
  sale_tx_count,
  sale_period_from,
  sale_period_to,
  'DVF',
  now()
FROM joined
WHERE insee_code IS NOT NULL
ON CONFLICT (insee_code) DO UPDATE SET
  commune = EXCLUDED.commune,
  departement_code = EXCLUDED.departement_code,
  rent_m2_app_all = EXCLUDED.rent_m2_app_all,
  rent_m2_app_t1t2 = EXCLUDED.rent_m2_app_t1t2,
  rent_m2_app_t3plus = EXCLUDED.rent_m2_app_t3plus,
  rent_m2_house = EXCLUDED.rent_m2_house,
  rent_source = EXCLUDED.rent_source,
  rent_year = EXCLUDED.rent_year,
  sale_m2_all = EXCLUDED.sale_m2_all,
  sale_m2_apartment = EXCLUDED.sale_m2_apartment,
  sale_m2_house = EXCLUDED.sale_m2_house,
  sale_tx_count = EXCLUDED.sale_tx_count,
  sale_period_from = EXCLUDED.sale_period_from,
  sale_period_to = EXCLUDED.sale_period_to,
  sale_source = EXCLUDED.sale_source,
  updated_at = now();

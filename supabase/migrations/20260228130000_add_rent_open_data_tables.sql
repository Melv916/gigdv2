CREATE TABLE IF NOT EXISTS public.loyers_commune (
  insee_code TEXT PRIMARY KEY,
  commune TEXT,
  departement_code TEXT,
  region_code TEXT,
  source TEXT NOT NULL,
  year SMALLINT NOT NULL,
  quarter TEXT,
  loyer_m2_cc_app_all NUMERIC(10, 2),
  loyer_m2_cc_app_t1t2 NUMERIC(10, 2),
  loyer_m2_cc_app_t3plus NUMERIC(10, 2),
  loyer_m2_cc_house NUMERIC(10, 2),
  r2_app_all NUMERIC(4, 2),
  r2_app_t1t2 NUMERIC(4, 2),
  r2_app_t3plus NUMERIC(4, 2),
  r2_house NUMERIC(4, 2),
  n_obs_app_all INTEGER,
  n_obs_app_t1t2 INTEGER,
  n_obs_app_t3plus INTEGER,
  n_obs_house INTEGER,
  pred_int_low_app_all NUMERIC(10, 2),
  pred_int_high_app_all NUMERIC(10, 2),
  pred_int_low_house NUMERIC(10, 2),
  pred_int_high_house NUMERIC(10, 2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.loyers_oll (
  id BIGSERIAL PRIMARY KEY,
  zone TEXT,
  typologie TEXT,
  epoque TEXT,
  loyer_m2 NUMERIC(10, 2),
  source TEXT NOT NULL DEFAULT 'OLL',
  year SMALLINT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.encadrement_paris (
  id BIGSERIAL PRIMARY KEY,
  secteur TEXT,
  arrondissement TEXT,
  pieces SMALLINT,
  epoque TEXT,
  meuble BOOLEAN NOT NULL DEFAULT false,
  loyer_reference NUMERIC(10, 2),
  loyer_reference_minore NUMERIC(10, 2),
  loyer_reference_majore NUMERIC(10, 2),
  source TEXT NOT NULL DEFAULT 'PARIS_ENCADREMENT',
  year SMALLINT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_loyers_commune_dept ON public.loyers_commune (departement_code);
CREATE INDEX IF NOT EXISTS idx_loyers_commune_region ON public.loyers_commune (region_code);
CREATE INDEX IF NOT EXISTS idx_loyers_oll_zone_typo ON public.loyers_oll (zone, typologie);
CREATE INDEX IF NOT EXISTS idx_encadrement_paris_lookup
  ON public.encadrement_paris (arrondissement, pieces, meuble, epoque);

ALTER TABLE public.loyers_commune ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyers_oll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encadrement_paris ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loyers_commune_public_read"
  ON public.loyers_commune FOR SELECT USING (true);
CREATE POLICY "loyers_oll_public_read"
  ON public.loyers_oll FOR SELECT USING (true);
CREATE POLICY "encadrement_paris_public_read"
  ON public.encadrement_paris FOR SELECT USING (true);

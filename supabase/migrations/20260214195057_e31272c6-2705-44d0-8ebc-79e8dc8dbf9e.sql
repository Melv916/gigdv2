
-- Create DVF transactions table
CREATE TABLE public.dvf_transactions (
  id BIGSERIAL PRIMARY KEY,
  id_mutation TEXT,
  date_mutation DATE,
  nature_mutation TEXT,
  valeur_fonciere NUMERIC,
  adresse_numero TEXT,
  adresse_nom_voie TEXT,
  code_postal TEXT,
  code_commune TEXT,
  nom_commune TEXT,
  code_departement TEXT,
  id_parcelle TEXT,
  type_local TEXT,
  surface_reelle_bati NUMERIC,
  nombre_pieces_principales INTEGER,
  surface_terrain NUMERIC,
  longitude NUMERIC,
  latitude NUMERIC
);

-- Indexes for fast lookups
CREATE INDEX idx_dvf_code_postal ON public.dvf_transactions (code_postal);
CREATE INDEX idx_dvf_code_commune ON public.dvf_transactions (code_commune);
CREATE INDEX idx_dvf_type_local ON public.dvf_transactions (type_local);
CREATE INDEX idx_dvf_date_mutation ON public.dvf_transactions (date_mutation);
CREATE INDEX idx_dvf_geo ON public.dvf_transactions (latitude, longitude);

-- RLS: public read access (DVF is open data)
ALTER TABLE public.dvf_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "DVF data is publicly readable"
  ON public.dvf_transactions
  FOR SELECT
  USING (true);

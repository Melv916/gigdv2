
-- Profiles table (auto-created on signup)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objectif TEXT NOT NULL DEFAULT 'locatif',
  strategie TEXT NOT NULL DEFAULT 'meuble',
  financement TEXT NOT NULL DEFAULT 'credit',
  apport NUMERIC DEFAULT 0,
  duree_credit INTEGER DEFAULT 20,
  taux_interet NUMERIC DEFAULT 3.5,
  assurance_emprunteur NUMERIC DEFAULT 0.34,
  frais_notaire_pct NUMERIC DEFAULT 8,
  vacance_locative INTEGER DEFAULT 1,
  charges_non_recup NUMERIC DEFAULT 0,
  budget_travaux NUMERIC DEFAULT 0,
  croissance_valeur NUMERIC DEFAULT 2,
  croissance_loyers NUMERIC DEFAULT 2,
  inflation_charges NUMERIC DEFAULT 2,
  status TEXT DEFAULT 'actif',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own projects" ON public.projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Project analyses table
CREATE TABLE public.project_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT,
  prix NUMERIC,
  surface NUMERIC,
  code_postal TEXT,
  ville TEXT,
  type_local TEXT,
  pieces INTEGER,
  dpe TEXT,
  charges_mensuelles NUMERIC DEFAULT 0,
  taxe_fonciere NUMERIC DEFAULT 0,
  travaux_estimes NUMERIC DEFAULT 0,
  loyer_estime NUMERIC DEFAULT 0,
  adr NUMERIC,
  occupation_cible NUMERIC,
  autres_couts NUMERIC DEFAULT 0,
  listing_data JSONB,
  dvf_summary JSONB,
  analysis_result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.project_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own analyses" ON public.project_analyses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

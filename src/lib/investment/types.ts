export type DealRegime =
  | "nu_micro"
  | "nu_reel"
  | "lmnp_micro"
  | "lmnp_reel"
  | "sci_ir"
  | "sci_is";

export type RentType = "apartment" | "house";
export type RentTypology = "all" | "t1t2" | "t3plus";

export interface DealInput {
  acquisition: {
    prix_achat: number;
    frais_notaire: number;
    frais_agence: number;
    travaux: number;
    mobilier: number;
    frais_dossier_garantie: number;
  };
  location: {
    loyer_hc: number;
    charges_locatives: number;
    vacance_mois_par_an: number;
    gestion_pct: number;
    glis_pct: number;
    assurance_pno_an: number;
    entretien_pct: number;
    charges_copro_nonrecup_an: number;
    taxe_fonciere_an: number;
  };
  financement: {
    apport: number;
    montant_pret: number;
    taux_nominal: number;
    assurance_pct: number;
    duree_annees: number;
    differe_mois: number;
  };
  fiscalite: {
    regime: DealRegime;
    tranche_ir: number;
    prelevements_sociaux: number;
    cfe: number;
    compta_an: number;
    amortissement_params?: {
      immeuble_hors_terrain_pct?: number;
      duree_amortissement_immeuble_ans?: number;
      duree_amortissement_mobilier_ans?: number;
    };
  };
  hypotheses: {
    croissance_loyer_an: number;
    croissance_valeur_an: number;
    inflation_charges_an: number;
    horizon_annees: number;
    taux_actualisation: number;
    frais_vente_pct?: number;
    fiscalite_revente_pct?: number;
  };
}

export interface RentEstimateInput {
  insee?: string;
  departement_code?: string;
  arrondissement_paris?: string;
  type?: RentType;
  typology?: RentTypology;
  surface?: number;
  pieces?: number;
  meuble?: boolean;
  epoque?: string;
}

export interface RentEstimateOutput {
  loyer_m2: number;
  loyer_total_estime?: number;
  source: "PARIS_ENCADREMENT" | "CITY_MARKET" | "ANIL" | "OLL" | "DEPARTEMENT_FALLBACK";
  score_confiance: number;
  intervalle?: { low?: number; high?: number };
}

export interface DealOutput {
  cout_total: number;
  rendement_brut: number;
  rendement_net: number;
  rendement_net_net: number;
  mensualite_totale: number;
  cashflows: {
    brut: number;
    net: number;
    net_net: number;
  };
  dscr: number;
  impots_annuels: number;
  tri: number | null;
  van: number;
  detail_charges: Record<string, number>;
  detail_fiscalite: Record<string, number | string>;
  hypotheses_utilisees: DealInput["hypotheses"] & {
    taux_micro_foncier: number;
    taux_micro_bic: number;
    is_reduit_taux: number;
    is_normal_taux: number;
    is_reduit_plafond: number;
  };
  flags: {
    autofinancement: boolean;
    risque_vacance: boolean;
    confiance_loyer?: number;
  };
}

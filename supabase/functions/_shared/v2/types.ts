export type Plan = "free" | "debutant" | "investisseur" | "avance";
export type IAMode = "courte" | "complete";
export type Strategy = "nue" | "meuble" | "colocation" | "lcd";

export interface AnalysisInputs {
  travaux?: number;
  charges?: number;
  taxe_fonciere?: number;
  assurance_pno?: number;
  vacance_mois?: number;
  strategy: Strategy;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ImportedListing {
  titre?: string;
  prix?: number;
  surface?: number;
  pieces?: number;
  typeLocal?: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  insee?: string;
  dpe?: string | null;
  charges?: number | null;
  description?: string;
  vendeur?: "agence" | "particulier" | "inconnu";
}

export interface AnalysisCreatePayload {
  url: string;
  strategy: Strategy;
  mode?: IAMode;
  inputs: AnalysisInputs;
  importData?: {
    listing: ImportedListing;
    dvfSummary?: Record<string, unknown>;
  };
}

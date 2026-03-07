export interface TaxRulesConfig {
  abattement_micro_foncier: number;
  abattement_micro_bic: number;
  is_reduit_taux: number;
  is_normal_taux: number;
  is_reduit_plafond: number;
  endettement_ratio_loyer_banque: number;
  endettement_seuil: number;
}

export const defaultTaxRules: TaxRulesConfig = {
  abattement_micro_foncier: 0.3,
  abattement_micro_bic: 0.5,
  is_reduit_taux: 0.15,
  is_normal_taux: 0.25,
  is_reduit_plafond: 42500,
  endettement_ratio_loyer_banque: 0.7,
  endettement_seuil: 0.35,
};

export function pctToRate(value: number): number {
  return value > 1 ? value / 100 : value;
}

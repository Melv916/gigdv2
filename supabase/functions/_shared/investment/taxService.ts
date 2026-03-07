import { defaultTaxRules, pctToRate, type TaxRulesConfig } from "./config.ts";
import type { DealInput } from "./types.ts";

export interface TaxComputation {
  regime: DealInput["fiscalite"]["regime"];
  base_imposable: number;
  impots_locatifs_annuels: number;
}

function computeIS(resultat: number, rules: TaxRulesConfig): number {
  if (resultat <= 0) return 0;
  const reducedPart = Math.min(resultat, rules.is_reduit_plafond);
  const normalPart = Math.max(0, resultat - rules.is_reduit_plafond);
  return reducedPart * rules.is_reduit_taux + normalPart * rules.is_normal_taux;
}

export function computeTaxes(
  input: DealInput,
  args: {
    loyers_hc_annuels: number;
    loyers_annuels_effectifs: number;
    charges_deductibles: number;
    interets_emprunt: number;
    travaux_deductibles: number;
    amortissements: number;
  },
  customRules?: Partial<TaxRulesConfig>
): TaxComputation {
  const rules = { ...defaultTaxRules, ...customRules };
  const regime = input.fiscalite.regime;
  const tmi = pctToRate(input.fiscalite.tranche_ir);
  const ps = pctToRate(input.fiscalite.prelevements_sociaux);
  const cfe = input.fiscalite.cfe || 0;
  let base = 0;
  let impots = 0;

  if (regime === "nu_micro") {
    base = Math.max(0, args.loyers_hc_annuels * (1 - rules.abattement_micro_foncier));
    impots = base * (tmi + ps);
  } else if (regime === "nu_reel" || regime === "sci_ir") {
    base = Math.max(
      0,
      args.loyers_hc_annuels - args.charges_deductibles - args.interets_emprunt - args.travaux_deductibles
    );
    impots = base * (tmi + ps);
  } else if (regime === "lmnp_micro") {
    base = Math.max(0, args.loyers_annuels_effectifs * (1 - rules.abattement_micro_bic));
    impots = base * (tmi + ps) + cfe;
  } else if (regime === "lmnp_reel") {
    base = Math.max(
      0,
      args.loyers_annuels_effectifs - args.charges_deductibles - args.interets_emprunt - args.amortissements
    );
    impots = base * (tmi + ps) + cfe;
  } else {
    base = Math.max(
      0,
      args.loyers_annuels_effectifs - args.charges_deductibles - args.interets_emprunt - args.amortissements
    );
    impots = computeIS(base, rules);
  }

  return { regime, base_imposable: base, impots_locatifs_annuels: impots };
}

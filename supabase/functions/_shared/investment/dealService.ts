import { defaultTaxRules, pctToRate, type TaxRulesConfig } from "./config.ts";
import { irr, npv } from "./irrService.ts";
import { computeMonthlyPayment, remainingPrincipal } from "./loanService.ts";
import { computeTaxes } from "./taxService.ts";
import type { DealInput } from "./types.ts";
import {
  computeAcquisitionCost,
  computeOwnerCharges,
  computeRentFigures,
  computeYields,
} from "./yieldService.ts";

function yearlyInterestApprox(
  principalStart: number,
  monthlyRate: number,
  mensualiteHorsAss: number,
  months: number
): { interests: number } {
  let remaining = principalStart;
  let interests = 0;
  for (let m = 0; m < months; m += 1) {
    if (remaining <= 0) break;
    const interest = remaining * monthlyRate;
    const principal = Math.max(0, Math.min(remaining, mensualiteHorsAss - interest));
    interests += interest;
    remaining -= principal;
  }
  return { interests };
}

export function analyzeDeal(input: DealInput, customRules?: Partial<TaxRulesConfig>) {
  const rules = { ...defaultTaxRules, ...customRules };
  const cout_total = computeAcquisitionCost(input.acquisition);
  const rent = computeRentFigures(
    input.location.loyer_hc,
    input.location.charges_locatives,
    input.location.vacance_mois_par_an
  );

  const ownerCharges = computeOwnerCharges({
    loyer_hc: input.location.loyer_hc,
    gestion_pct: input.location.gestion_pct,
    glis_pct: input.location.glis_pct,
    entretien_pct: input.location.entretien_pct,
    taxe_fonciere_an: input.location.taxe_fonciere_an,
    assurance_pno_an: input.location.assurance_pno_an,
    charges_copro_nonrecup_an: input.location.charges_copro_nonrecup_an,
    compta_an: input.fiscalite.compta_an,
  });

  const loan = computeMonthlyPayment(
    input.financement.montant_pret,
    input.financement.taux_nominal,
    input.financement.assurance_pct,
    input.financement.duree_annees
  );

  const iMonthly = pctToRate(input.financement.taux_nominal) / 12;
  const firstYearInterest = yearlyInterestApprox(
    input.financement.montant_pret,
    iMonthly,
    loan.mensualite_hors_ass,
    12
  ).interests;

  const amortParams = input.fiscalite.amortissement_params ?? {};
  const amortImmeuble =
    ((input.acquisition.prix_achat * (amortParams.immeuble_hors_terrain_pct ?? 0.85)) /
      (amortParams.duree_amortissement_immeuble_ans ?? 30)) || 0;
  const amortMobilier =
    (input.acquisition.mobilier / (amortParams.duree_amortissement_mobilier_ans ?? 7)) || 0;
  const amortissements = amortImmeuble + amortMobilier;

  const tax = computeTaxes(
    input,
    {
      loyers_hc_annuels: input.location.loyer_hc * 12,
      loyers_annuels_effectifs: rent.loyers_annuels_effectifs,
      charges_deductibles: ownerCharges.charges_total,
      interets_emprunt: firstYearInterest,
      travaux_deductibles: input.acquisition.travaux,
      amortissements,
    },
    rules
  );

  const yields = computeYields(
    input.location.loyer_hc * 12,
    cout_total,
    ownerCharges.charges_total,
    tax.impots_locatifs_annuels
  );

  const cashflow_mens_brut = input.location.loyer_hc + input.location.charges_locatives - loan.mensualite_totale;
  const cashflow_mens_net =
    (rent.loyers_annuels_effectifs - ownerCharges.charges_total) / 12 - loan.mensualite_totale;
  const cashflow_mens_net_net =
    (rent.loyers_annuels_effectifs - ownerCharges.charges_total - tax.impots_locatifs_annuels) / 12 -
    loan.mensualite_totale;

  const revenu_net_exploitation = rent.loyers_annuels_effectifs - ownerCharges.charges_total;
  const service_dette = loan.mensualite_totale * 12;
  const dscr = service_dette > 0 ? revenu_net_exploitation / service_dette : 999;

  const horizon = Math.max(1, Math.round(input.hypotheses.horizon_annees));
  const flows: number[] = [];
  const initialOut =
    -input.financement.apport -
    (input.acquisition.frais_notaire +
      input.acquisition.frais_agence +
      input.acquisition.travaux +
      input.acquisition.mobilier +
      input.acquisition.frais_dossier_garantie);
  flows.push(initialOut);

  for (let year = 1; year <= horizon; year += 1) {
    const rentGrowth = (1 + pctToRate(input.hypotheses.croissance_loyer_an)) ** (year - 1);
    const chargesGrowth = (1 + pctToRate(input.hypotheses.inflation_charges_an)) ** (year - 1);
    const annualFlow =
      (rent.loyers_annuels_effectifs * rentGrowth -
        ownerCharges.charges_total * chargesGrowth -
        tax.impots_locatifs_annuels * chargesGrowth) -
      service_dette;
    flows.push(annualFlow);
  }

  const salePrice =
    input.acquisition.prix_achat *
    (1 + pctToRate(input.hypotheses.croissance_valeur_an)) ** horizon;
  const remaining = remainingPrincipal(
    input.financement.montant_pret,
    input.financement.taux_nominal,
    input.financement.duree_annees,
    loan.mensualite_hors_ass,
    horizon * 12
  );
  const fraisVente = salePrice * pctToRate(input.hypotheses.frais_vente_pct ?? 0.06);
  const fiscaliteRevente = salePrice * pctToRate(input.hypotheses.fiscalite_revente_pct ?? 0);
  flows[flows.length - 1] += salePrice - remaining - fraisVente - fiscaliteRevente;

  return {
    cout_total,
    rendement_brut: yields.rendement_brut,
    rendement_net: yields.rendement_net,
    rendement_net_net: yields.rendement_net_net,
    mensualite_totale: loan.mensualite_totale,
    cashflows: {
      brut: cashflow_mens_brut,
      net: cashflow_mens_net,
      net_net: cashflow_mens_net_net,
    },
    dscr,
    impots_annuels: tax.impots_locatifs_annuels,
    tri: irr(flows),
    van: npv(pctToRate(input.hypotheses.taux_actualisation), flows),
    flags: {
      autofinancement: cashflow_mens_net_net >= 0,
      risque_vacance: input.location.vacance_mois_par_an >= 2,
    },
  };
}

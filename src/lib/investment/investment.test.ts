import { describe, expect, it } from "vitest";
import { analyzeDeal } from "./dealService";
import { irr } from "./irrService";
import { computeMonthlyPayment } from "./loanService";

describe("loanService", () => {
  it("computes constant annuity with insurance", () => {
    const payment = computeMonthlyPayment(200000, 0.04, 0.0036, 20);
    expect(payment.mensualite_hors_ass).toBeCloseTo(1211.96, 2);
    expect(payment.assurance_mens).toBeCloseTo(60, 2);
    expect(payment.mensualite_totale).toBeCloseTo(1271.96, 2);
  });
});

describe("dealService", () => {
  it("computes yields and cashflows", () => {
    const output = analyzeDeal({
      acquisition: {
        prix_achat: 150000,
        frais_notaire: 12000,
        frais_agence: 5000,
        travaux: 10000,
        mobilier: 3000,
        frais_dossier_garantie: 1500,
      },
      location: {
        loyer_hc: 850,
        charges_locatives: 80,
        vacance_mois_par_an: 1,
        gestion_pct: 0.06,
        glis_pct: 0.02,
        assurance_pno_an: 180,
        entretien_pct: 0.05,
        charges_copro_nonrecup_an: 700,
        taxe_fonciere_an: 900,
      },
      financement: {
        apport: 35000,
        montant_pret: 146500,
        taux_nominal: 0.038,
        assurance_pct: 0.0034,
        duree_annees: 20,
        differe_mois: 0,
      },
      fiscalite: {
        regime: "nu_micro",
        tranche_ir: 0.3,
        prelevements_sociaux: 0.172,
        cfe: 0,
        compta_an: 0,
      },
      hypotheses: {
        croissance_loyer_an: 0.015,
        croissance_valeur_an: 0.02,
        inflation_charges_an: 0.02,
        horizon_annees: 10,
        taux_actualisation: 0.06,
      },
    });

    expect(output.cout_total).toBe(181500);
    expect(output.rendement_brut).toBeCloseTo(0.0562, 3);
    expect(output.cashflows.net_net).toBeLessThan(0);
    expect(output.impots_annuels).toBeGreaterThan(0);
    expect(output.dscr).toBeGreaterThan(0);
  });
});

describe("irrService", () => {
  it("solves IRR numerically", () => {
    const value = irr([-10000, 3000, 4200, 6800]);
    expect(value).not.toBeNull();
    expect(value as number).toBeCloseTo(0.1634, 3);
  });
});

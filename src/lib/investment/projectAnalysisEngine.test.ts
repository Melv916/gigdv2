import { describe, expect, it } from "vitest";
import { computeProjectAnalysis, type ProjectAnalysisEngineInput } from "./projectAnalysisEngine";

function makeInput(
  overrides: Partial<ProjectAnalysisEngineInput> = {},
): ProjectAnalysisEngineInput {
  return {
    acquisition: {
      purchasePrice: 100000,
      notaryRate: 0.08,
      works: 10000,
      acquisitionFeesOther: 2000,
      furnishing: 0,
      ...(overrides.acquisition || {}),
    },
    financing: {
      downPayment: 20000,
      interestRate: 0.04,
      insuranceRate: 0.0036,
      durationYears: 20,
      ...(overrides.financing || {}),
    },
    rental: {
      strategy: "nue",
      marketRentMonthly: 980,
      currentRentMonthly: 0,
      selectedRentMonthly: 1000,
      vacancyRate: 0.05,
      ...(overrides.rental || {}),
    },
    operating: {
      condoChargesAnnualNonRecoverable: 1200,
      propertyTaxAnnual: 900,
      pnoAnnual: 120,
      managementAnnual: 0,
      accountingAnnual: 0,
      maintenanceAnnual: 300,
      otherAnnual: 480,
      ...(overrides.operating || {}),
    },
    tax: {
      holdingMode: "nom_propre",
      taxRegime: "micro_foncier",
      tmi: 0.3,
      socialTaxRate: 0.172,
      corporateTaxRate: 0.25,
      annualTaxAmount: 500,
      ...(overrides.tax || {}),
    },
    sources: {
      purchasePrice: "issue_annonce",
      selectedRentMonthly: "estimation_moteur",
      vacancyRate: "saisie_utilisateur",
      propertyTaxAnnual: "saisie_utilisateur",
      condoChargesAnnualNonRecoverable: "saisie_utilisateur",
      operatingChargesAnnual: "saisie_utilisateur",
      strategy: "saisie_utilisateur",
      interestRate: "saisie_utilisateur",
      durationYears: "saisie_utilisateur",
      taxRegime: "saisie_utilisateur",
      ...(overrides.sources || {}),
    },
    targetGrossYieldActInHand: 0.08,
  };
}

describe("projectAnalysisEngine", () => {
  it("computes acquisition, financing and exploitation from annualized inputs", () => {
    const result = computeProjectAnalysis(makeInput());

    expect(result.acquisition.notaryFees).toBe(8000);
    expect(result.acquisition.totalProjectCost).toBe(120000);
    expect(result.financing.loanAmount).toBe(100000);
    expect(result.financing.monthlyPaymentExcludingInsurance).toBe(606);
    expect(result.financing.monthlyInsurance).toBe(30);
    expect(result.financing.annualDebtService).toBe(7632);
    expect(result.exploitation.grossAnnualRent).toBe(12000);
    expect(result.exploitation.collectedAnnualRent).toBe(11400);
    expect(result.exploitation.operatingChargesAnnual).toBe(3000);
    expect(result.exploitation.cashflowBeforeTaxAnnual).toBe(768);
    expect(result.exploitation.cashflowBeforeTaxMonthly).toBe(64);
  });

  it("computes yields, break-even rent and maximum compatible price", () => {
    const result = computeProjectAnalysis(makeInput());

    expect(result.exploitation.grossYieldExcludingFees).toBeCloseTo(0.12, 4);
    expect(result.exploitation.grossYieldActInHand).toBeCloseTo(0.1, 4);
    expect(result.exploitation.netOperatingYield).toBeCloseTo(0.07, 4);
    expect(result.taxation.netNetYield).toBeCloseTo((11400 - 3000 - 500) / 120000, 4);
    expect(result.exploitation.breakEvenRentMonthly).toBe(933);
    expect(result.pricing.totalCostMaxCompatible).toBe(150000);
    expect(result.pricing.purchasePriceMaxCompatible).toBe(127778);
    expect(result.pricing.isPriceCompatible).toBe(true);
  });

  it("returns a favorable verdict when the target yield and cash-flow are both met", () => {
    const result = computeProjectAnalysis(makeInput());

    expect(result.verdict.status).toBe("favorable");
    expect(result.warnings.some((warning) => warning.blockingForVerdict)).toBe(false);
  });

  it("returns a mitigated verdict when the yield is good but exploitation is tense", () => {
    const result = computeProjectAnalysis(
      makeInput({
        financing: {
          downPayment: 20000,
          interestRate: 0.04,
          insuranceRate: 0.0036,
          durationYears: 20,
          monthlyPaymentManual: 900,
        },
      }),
    );

    expect(result.exploitation.grossYieldActInHand).toBeGreaterThanOrEqual(0.08);
    expect(result.exploitation.cashflowBeforeTaxAnnual).toBeLessThan(0);
    expect(result.verdict.status).toBe("mitige");
  });

  it("returns an insufficient verdict when both yield and cash-flow are below target", () => {
    const result = computeProjectAnalysis(
      makeInput({
        rental: {
          strategy: "nue",
          marketRentMonthly: 700,
          currentRentMonthly: 0,
          selectedRentMonthly: 700,
          vacancyRate: 0.08,
        },
      }),
    );

    expect(result.exploitation.grossYieldActInHand).toBeLessThan(0.08);
    expect(result.exploitation.cashflowBeforeTaxAnnual).toBeLessThan(0);
    expect(result.verdict.status).toBe("insuffisant");
  });

  it("returns blocking warnings and an incomplete verdict when structural data are missing", () => {
    const result = computeProjectAnalysis(
      makeInput({
        operating: {
          condoChargesAnnualNonRecoverable: 0,
          propertyTaxAnnual: 0,
          pnoAnnual: 0,
          managementAnnual: 0,
          accountingAnnual: 0,
          maintenanceAnnual: 0,
          otherAnnual: 0,
        },
        tax: {
          holdingMode: "nom_propre",
          taxRegime: "micro_foncier",
          tmi: 0.3,
          socialTaxRate: 0.172,
          corporateTaxRate: 0.25,
          annualTaxAmount: null,
        },
        sources: {
          purchasePrice: "issue_annonce",
          selectedRentMonthly: "saisie_utilisateur",
          vacancyRate: "saisie_utilisateur",
          propertyTaxAnnual: "valeur_par_defaut",
          condoChargesAnnualNonRecoverable: "valeur_par_defaut",
          operatingChargesAnnual: "valeur_par_defaut",
          strategy: "saisie_utilisateur",
          interestRate: "saisie_utilisateur",
          durationYears: "saisie_utilisateur",
          taxRegime: "saisie_utilisateur",
        },
      }),
    );

    expect(result.verdict.status).toBe("incomplet");
    expect(result.warnings.some((warning) => warning.code === "property-tax-missing")).toBe(true);
    expect(result.warnings.some((warning) => warning.code === "owner-charges-missing")).toBe(true);
    expect(result.warnings.some((warning) => warning.code === "tax-incomplete")).toBe(true);
  });

  it("exposes prudent, central and optimized scenarios", () => {
    const result = computeProjectAnalysis(makeInput());

    expect(result.exploitation.scenarios.map((scenario) => scenario.key)).toEqual([
      "prudent",
      "central",
      "optimise",
    ]);
    expect(result.exploitation.scenarios[0].cashflowBeforeTaxMonthly).toBeLessThan(
      result.exploitation.scenarios[1].cashflowBeforeTaxMonthly,
    );
    expect(result.exploitation.scenarios[2].cashflowBeforeTaxMonthly).toBeGreaterThanOrEqual(
      result.exploitation.scenarios[1].cashflowBeforeTaxMonthly,
    );
  });
});

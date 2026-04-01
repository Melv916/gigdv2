import { describe, expect, it } from "vitest";
import { analyzeInvestment } from "./analysisService";
import { makeCanonicalInput } from "./testUtils";

describe("microFoncierEngine", () => {
  it("computes taxable base and post-tax cashflow", () => {
    const result = analyzeInvestment(
      makeCanonicalInput({
        operation: {
          exploitationMode: "location_nue",
          furnished: false,
          shortTerm: false,
          coliving: false,
        },
        ownership: {
          ownershipMode: "nom_propre",
          taxRegime: "micro_foncier",
        },
        furnitureAmount: 0,
        accountingFees: 0,
        assetProfile: {
          propertyType: "residential",
          landValueRatio: 0.15,
          buildingValueRatio: 0.85,
          amortizationPeriods: { buildingYears: 30, furnitureYears: 7 },
          amortizationEnabled: false,
        },
      }),
    );

    expect(result.fiscal.taxableIncome).toBeGreaterThan(0);
    expect(result.fiscal.deductibleCharges).toBe(0);
    expect(result.fiscal.postTaxCashflow).toBeLessThan(result.economic.cashflowBeforeTax);
  });
});

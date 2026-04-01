import { describe, expect, it } from "vitest";
import { analyzeInvestment } from "./analysisService";
import { makeCanonicalInput } from "./testUtils";

describe("reelFoncierEngine", () => {
  it("deducts charges, interest and works", () => {
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
          taxRegime: "reel_foncier",
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

    expect(result.fiscal.deductibleCharges).toBeGreaterThan(result.economic.annualInterest);
    expect(result.fiscal.taxableIncome).toBeGreaterThanOrEqual(0);
    expect(result.fiscal.warnings[0]).toMatch(/deficit foncier/i);
  });
});

import { describe, expect, it } from "vitest";
import { analyzeInvestment } from "./analysisService";
import { makeCanonicalInput } from "./testUtils";

describe("sciIrEngine", () => {
  it("simulates a transparent SCI regime", () => {
    const result = analyzeInvestment(
      makeCanonicalInput({
        operation: {
          exploitationMode: "location_nue",
          furnished: false,
          shortTerm: false,
          coliving: false,
        },
        ownership: {
          ownershipMode: "sci",
          taxRegime: "sci_ir",
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

    expect(result.fiscal.corporateTax).toBe(0);
    expect(result.fiscal.socialContributions).toBeGreaterThanOrEqual(0);
    expect(result.fiscal.notes[0]).toMatch(/SCI translucide/i);
  });
});

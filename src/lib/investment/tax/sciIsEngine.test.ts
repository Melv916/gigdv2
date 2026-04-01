import { describe, expect, it } from "vitest";
import { analyzeInvestment } from "./analysisService";
import { makeCanonicalInput } from "./testUtils";

describe("sciIsEngine", () => {
  it("computes corporate tax and net-net yield", () => {
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
          taxRegime: "sci_is",
        },
        furnitureAmount: 0,
        assetProfile: {
          propertyType: "residential",
          landValueRatio: 0.15,
          buildingValueRatio: 0.85,
          amortizationPeriods: { buildingYears: 30, furnitureYears: 7 },
          amortizationEnabled: true,
        },
      }),
    );

    expect(result.fiscal.corporateTax).toBeGreaterThanOrEqual(0);
    expect(result.fiscal.taxAmount).toBe(result.fiscal.corporateTax);
    expect(result.fiscal.netNetYield).toBeTypeOf("number");
  });
});

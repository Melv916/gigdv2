import { describe, expect, it } from "vitest";
import { analyzeInvestment } from "./analysisService";
import { makeCanonicalInput } from "./testUtils";

describe("lmnpReelEngine", () => {
  it("includes amortization in the tax result", () => {
    const result = analyzeInvestment(
      makeCanonicalInput({
        ownership: {
          ownershipMode: "nom_propre",
          taxRegime: "lmnp_reel",
        },
      }),
    );

    expect(result.fiscal.amortization).toBeGreaterThan(0);
    expect(result.fiscal.taxableIncome).toBeGreaterThanOrEqual(0);
    expect(result.fiscal.postTaxCashflow).toBeLessThanOrEqual(result.economic.cashflowBeforeTax);
  });
});

import { describe, expect, it } from "vitest";
import { resolveAvailableTaxRegimes, resolveTaxCompatibilityDiagnostics } from "./compatibility";

describe("holding compatibility", () => {
  it("hides advanced regimes for free users", () => {
    expect(resolveAvailableTaxRegimes("free", "holding", "location_nue")).toEqual([]);
    expect(
      resolveTaxCompatibilityDiagnostics("free", "holding", "location_nue").warnings.join(" "),
    ).toMatch(/reservee|reserves/i);
  });

  it("exposes advanced holding regimes for advanced users", () => {
    expect(resolveAvailableTaxRegimes("avance", "holding", "location_nue")).toContain(
      "holding_is_remontee_dividendes",
    );
    expect(resolveAvailableTaxRegimes("avance", "sci_avec_holding", "location_nue")).toContain(
      "sci_is_holding_mere_fille",
    );
  });
});

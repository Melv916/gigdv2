import { describe, expect, it } from "vitest";
import { compareTaxRegimes } from "./analysisService";
import { makeCanonicalInput } from "./testUtils";

describe("tax comparison integration", () => {
  it("lets an investisseur compare standard regimes", () => {
    const rows = compareTaxRegimes(
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
      ["micro_foncier", "reel_foncier"],
    );

    expect(rows).toHaveLength(2);
    expect(rows).toMatchInlineSnapshot(`
      [
        {
          "cashflowAfterTax": -3860,
          "cashflowBeforeTax": -3860,
          "coherenceWithObjective": "Coherent si l'objectif est de maximiser le cash-flow apres impot rapidement.",
          "complexity": "standard",
          "netNetYield": -0.0187015503875969,
          "notes": [
            "Charges reelles, interets d'emprunt et travaux deductibles retenus.",
          ],
          "regime": "reel_foncier",
          "taxAmount": 0,
          "warnings": [
            "Le traitement precis du deficit foncier n'est pas detaille dans cette simulation.",
          ],
        },
        {
          "cashflowAfterTax": -7858,
          "cashflowBeforeTax": -3860,
          "coherenceWithObjective": "Coherent si l'objectif est de maximiser le cash-flow apres impot rapidement.",
          "complexity": "standard",
          "netNetYield": -0.03807093023255814,
          "notes": [
            "Abattement forfaitaire de 30% applique sur les loyers encaisses.",
          ],
          "regime": "micro_foncier",
          "taxAmount": 3998,
          "warnings": [
            "Simulation indicative a valider avec un expert-comptable ou un fiscaliste.",
          ],
        },
      ]
    `);
  });
});

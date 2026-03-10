import { describe, expect, it } from "vitest";
import { buildAnalysisKpiModel } from "./kpiModel";

describe("buildAnalysisKpiModel", () => {
  it("computes yield and negotiation metrics from consistent inputs", () => {
    const result = buildAnalysisKpiModel({
      aiResult: {
        prixAnnonce: "115000EUR",
        loyerEstime: "1208EUR/mois",
        cashFlow: "150EUR/mois",
        prixM2Dvf: "2400EUR/m2",
      },
      loyerEstime: 1208,
      coutGlobal: 124200,
      activePrix: 115000,
      activeSurface: 68,
      marketData: {
        marketPricePerSqm: 2437,
        marketRentPerSqm: 17.76,
        priceMinPerSqm: null,
        priceMaxPerSqm: null,
        rentMinPerSqm: null,
        rentMaxPerSqm: null,
        scoreFiabilite: null,
        sourcePrixM2: "excel",
        sourceLoyerM2: "excel",
        dateReferenceSource: null,
        commentaire: null,
      },
      marketStatus: "ok",
      travaux: 0,
      autresCouts: 0,
      fraisNotairePct: 8,
    });

    expect(result.hasRentForYield).toBe(true);
    expect(result.rendementBrutCalc).toBeCloseTo((1208 * 12 * 100) / 115000, 4);
    expect(result.prixCibleRendement8).toBeCloseTo((1208 * 12) / 0.08, 2);
    expect(result.marketPossibleRentMonthly).toBe(Math.round(17.76 * 68));
    expect(result.marketDataMissing).toBe(false);
  });

  it("never returns NaN when rent is missing", () => {
    const result = buildAnalysisKpiModel({
      aiResult: {
        prixAnnonce: "99500EUR",
        loyerEstime: "n/a",
        cashFlow: "-521EUR/mois",
        prixM2Dvf: "n/a",
      },
      loyerEstime: 0,
      coutGlobal: 107460,
      activePrix: 99500,
      activeSurface: 41,
      marketData: null,
      marketStatus: "indisponible",
      travaux: 0,
      autresCouts: 0,
      fraisNotairePct: 8,
    });

    expect(result.hasRentForYield).toBe(false);
    expect(result.rendementBrutCalc).toBeNull();
    expect(result.minRent8).toBeGreaterThan(0);
    expect(Number.isFinite(result.ecartNego)).toBe(true);
    expect(Number.isFinite(result.ecartNegoPct)).toBe(true);
  });
});

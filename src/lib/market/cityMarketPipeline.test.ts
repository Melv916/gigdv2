import { describe, expect, it } from "vitest";
import { buildMarketData, normalizePropertyData } from "./cityMarketPipeline";

describe("cityMarketPipeline", () => {
  it("normalizes property data from scraped listing", () => {
    const property = normalizePropertyData({
      prix: "120 000 €",
      surface: "45,5 m2",
      ville: "Lyon",
      codePostal: "69003",
      insee: "69383",
      adresse: "Rue test",
      pieces: "2",
    });

    expect(property.purchasePrice).toBe(120000);
    expect(property.surface).toBe(45.5);
    expect(property.city).toBe("Lyon");
    expect(property.postalCode).toBe("69003");
    expect(property.inseeCode).toBe("69383");
    expect(property.rooms).toBe(2);
  });

  it("normalizes alternative keys from scraper payload", () => {
    const property = normalizePropertyData({
      purchasePrice: "245000",
      livingArea: "52",
      city: "Nantes",
      postalCode: "44000",
      inseeCode: "44109",
    });

    expect(property.purchasePrice).toBe(245000);
    expect(property.surface).toBe(52);
    expect(property.city).toBe("Nantes");
    expect(property.postalCode).toBe("44000");
    expect(property.inseeCode).toBe("44109");
  });

  it("builds market data from city_market_prices row (apartment t1t2)", () => {
    const market = buildMarketData(
      {
        sale_m2_all: 4100,
        rent_m2_app_t1t2: 21,
        rent_m2_app_all: 19,
        prix_m2_min_si_disponible: 3600,
        prix_m2_max_si_disponible: 4800,
        loyer_m2_min: 16,
        loyer_m2_max: 24,
        score_fiabilite: 4,
        source_prix_m2: "Excel",
        source_loyer_m2: "Excel",
      },
      { type: "apartment", typology: "t1t2" },
    );

    expect(market.marketPricePerSqm).toBe(4100);
    expect(market.marketRentPerSqm).toBe(21);
    expect(market.priceMinPerSqm).toBe(3600);
    expect(market.priceMaxPerSqm).toBe(4800);
    expect(market.scoreFiabilite).toBe(4);
  });

  it("uses generic rent when house-specific rent is missing", () => {
    const market = buildMarketData(
      {
        sale_m2_all: 2500,
        rent_m2_app_all: 11.4,
      },
      { type: "house", typology: "all" },
    );

    expect(market.marketRentPerSqm).toBe(11.4);
  });
});

import { describe, expect, it } from "vitest";
import {
  aggregateDvf,
  computeTtl,
  isExpired,
  selectBestDataset,
} from "../../../supabase/functions/_shared/v2/marketEnrichmentCore";

describe("marketEnrichmentCore", () => {
  it("selects the best DVF dataset candidate", () => {
    const best = selectBestDataset([
      { id: "a", title: "Population communale", organization: "INSEE", tags: ["insee"] },
      { id: "b", title: "Demande de valeurs foncières (DVF)", organization: "Etalab", tags: ["dvf", "mutation"] },
      { id: "c", title: "Loyers mediants", organization: "ANIL", tags: ["loyer"] },
    ]);
    expect(best?.id).toBe("b");
  });

  it("aggregates DVF comparables and computes quantiles + delta", () => {
    const rows = [
      { date_mutation: "2025-03-01", valeur_fonciere: 95000, surface_reelle_bati: 40, type_local: "Appartement", code_postal: "91150", code_commune: "91223" },
      { date_mutation: "2025-05-10", valeur_fonciere: 100000, surface_reelle_bati: 41, type_local: "Appartement", code_postal: "91150", code_commune: "91223" },
      { date_mutation: "2025-09-12", valeur_fonciere: 110000, surface_reelle_bati: 42, type_local: "Appartement", code_postal: "91150", code_commune: "91223" },
      { date_mutation: "2025-11-02", valeur_fonciere: 120000, surface_reelle_bati: 43, type_local: "Appartement", code_postal: "91150", code_commune: "91223" },
    ];

    const agg = aggregateDvf({
      rows,
      surface: 41,
      askPrice: 99500,
      typeLocal: "Appartement",
      periodMonths: 24,
    });

    expect(agg.samples_count).toBe(4);
    expect(agg.median_eur_m2).toBeGreaterThan(2300);
    expect(agg.q25_eur_m2).not.toBeNull();
    expect(agg.q75_eur_m2).not.toBeNull();
    expect(agg.estimated_price_range).not.toBeNull();
    expect(agg.delta_vs_ask).not.toBeNull();
    expect(typeof agg.delta_pct).toBe("number");
  });

  it("returns empty-safe output when comparables are unavailable (fallback)", () => {
    const agg = aggregateDvf({
      rows: [],
      surface: 41,
      askPrice: 99500,
      typeLocal: "Appartement",
      periodMonths: 24,
    });

    expect(agg.samples_count).toBe(0);
    expect(agg.median_eur_m2).toBeNull();
    expect(agg.estimated_price_range).toBeNull();
    expect(agg.delta_vs_ask).toBeNull();
  });

  it("respects TTL helpers", () => {
    const now = new Date("2026-03-02T10:00:00.000Z");
    const ttl = computeTtl(7, now);
    expect(isExpired(ttl, now)).toBe(false);
    expect(isExpired("2026-02-01T00:00:00.000Z", now)).toBe(true);
  });
});

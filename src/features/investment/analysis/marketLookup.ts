import { supabase } from "@/integrations/supabase/client";

export type CityMarketPriceRow = {
  insee_code: string | null;
  commune: string | null;
  departement_code: string | null;
  rent_m2_app_all: number | null;
  rent_m2_app_t1t2: number | null;
  rent_m2_app_t3plus: number | null;
  rent_m2_house: number | null;
  sale_m2_all: number | null;
  prix_m2_moyen?: number | null;
  loyer_m2_moyen?: number | null;
  prix_m2_min_si_disponible?: number | null;
  prix_m2_max_si_disponible?: number | null;
  loyer_m2_min_si_disponible?: number | null;
  loyer_m2_max_si_disponible?: number | null;
  score_fiabilite?: number | null;
  source_prix_m2?: string | null;
  source_loyer_m2?: string | null;
  date_reference_source?: string | null;
  commentaire?: string | null;
};

function normalizeCity(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

export function normalizeInsee(value: string): string {
  const raw = String(value || "").trim().toUpperCase().replace(/\s/g, "");
  if (!raw) return "";
  if (/^\d+$/.test(raw)) return raw.padStart(5, "0");
  if (/^(2A|2B)\d{1,3}$/.test(raw)) return raw.slice(0, 2) + raw.slice(2).padStart(3, "0");
  return raw;
}

export function normalizePostalCode(value: string): string {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

export function cleanCityForLookup(value: string): string {
  return String(value || "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b\d{5}\b/g, " ")
    .replace(/\b\d{2,3}\b/g, " ")
    .replace(/\b\d+(?:er|e|eme)?\s*arr(?:ondissement)?\b/gi, " ")
    .replace(/\barr(?:ondissement)?\b/gi, " ")
    .replace(/\bcedex\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cityLookupCandidates(value: string): string[] {
  const cleaned = cleanCityForLookup(value);
  if (!cleaned) return [];
  const parts = cleaned.split(/[-/]/).map((p) => p.trim()).filter(Boolean);
  return Array.from(new Set([cleaned, ...parts]));
}

function median(values: number[]): number | null {
  const sorted = values
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

export function parseSelogerLocationFromUrl(rawUrl: string): { city: string | null; departementCode: string | null } {
  try {
    const u = new URL(rawUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    const slug = parts.find((p) => /-\d{2,3}$/.test(p)) || null;
    if (!slug) return { city: null, departementCode: null };
    const match = slug.match(/^(.*)-(\d{2,3})$/);
    if (!match) return { city: null, departementCode: null };
    const citySlug = match[1] || "";
    const dept = match[2] || null;
    const city = citySlug
      .split("-")
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    return { city: city || null, departementCode: dept };
  } catch {
    return { city: null, departementCode: null };
  }
}

export function isValidCityValue(value: string | null | undefined): boolean {
  const cleaned = cleanCityForLookup(String(value || ""));
  if (!cleaned) return false;
  if (/\d/.test(cleaned)) return false;
  return cleaned.length >= 2;
}

export function inferDepartementCode(args: {
  postalCode?: string | null;
  insee?: string | null;
  departementCode?: string | null;
}): string {
  const postalCode = normalizePostalCode(String(args.postalCode || "").trim());
  if (postalCode.length >= 2) {
    if (postalCode.startsWith("97") && postalCode.length >= 3) return postalCode.slice(0, 3);
    return postalCode.slice(0, 2);
  }

  const departementCode = String(args.departementCode || "").trim().toUpperCase();
  if (departementCode) {
    if (/^\d{3}$/.test(departementCode) && departementCode.startsWith("97")) return departementCode;
    if (/^\d{2}$/.test(departementCode)) return departementCode;
    if (/^(2A|2B)$/.test(departementCode)) return departementCode;
  }

  const insee = normalizeInsee(String(args.insee || "").trim());
  if (insee) {
    if (/^97\d/.test(insee)) return insee.slice(0, 3);
    return insee.slice(0, 2);
  }
  return "";
}

function warnLookupError(step: string, error: unknown, context: Record<string, unknown>) {
  if (!error) return;
  console.warn("[city_market_prices] lookup error", {
    step,
    error: String((error as { message?: string })?.message || error),
    ...context,
  });
}

export async function fetchCityMarketReference(args: {
  insee?: string;
  ville?: string;
  postalCode?: string;
  departementCode?: string;
}): Promise<CityMarketPriceRow | null> {
  const insee = normalizeInsee(String(args.insee || "").trim());
  const ville = cleanCityForLookup(String(args.ville || "").trim());
  const cityCandidates = cityLookupCandidates(ville);
  const postalCode = normalizePostalCode(String(args.postalCode || "").trim());
  const departementCode = String(args.departementCode || "").trim();

  if (insee) {
    const { data, error } = await supabase
      .from("city_market_prices")
      .select("*")
      .eq("insee_code", insee)
      .maybeSingle();
    warnLookupError("insee", error, { insee });
    if (data) return data as CityMarketPriceRow;
  }

  if (departementCode && cityCandidates.length > 0) {
    const primaryCity = cityCandidates[0];
    const { data, error } = await supabase
      .from("city_market_prices")
      .select("*")
      .eq("departement_code", departementCode)
      .ilike("commune", `%${primaryCity}%`)
      .limit(100);
    warnLookupError("city+departement", error, { primaryCity, departementCode });
    if (data && data.length > 0) {
      const expected = normalizeCity(primaryCity);
      const exact = data.find((row: unknown) => normalizeCity(String((row as CityMarketPriceRow).commune || "")) === expected);
      const starts = data.find((row: unknown) => normalizeCity(String((row as CityMarketPriceRow).commune || "")).startsWith(expected));
      return (exact || starts || data[0]) as CityMarketPriceRow;
    }
  }

  if (cityCandidates.length > 0 || departementCode) {
    let query = supabase.from("city_market_prices").select("*");
    if (departementCode) {
      query = query.eq("departement_code", departementCode).limit(5000);
    } else if (cityCandidates.length > 0) {
      query = query.limit(5000);
    } else {
      query = query.limit(200);
    }

    const { data, error } = await query;
    warnLookupError("ranked-scan", error, { departementCode, candidates: cityCandidates });

    if (data && data.length > 0) {
      const expectedList = cityCandidates.map((city) => normalizeCity(city)).filter(Boolean);
      const ranked = data
        .map((row: unknown) => {
          const typed = row as CityMarketPriceRow;
          const communeNorm = normalizeCity(String(typed.commune || ""));
          let score = 0;
          for (const expected of expectedList) {
            if (expected && communeNorm === expected) score = Math.max(score, 100);
            else if (expected && communeNorm.startsWith(expected)) score = Math.max(score, 70);
            else if (expected && communeNorm.includes(expected)) score = Math.max(score, 50);
          }
          if (postalCode && typed.departement_code && postalCode.startsWith(String(typed.departement_code))) score += 20;
          if (Number(typed.rent_m2_app_all || typed.loyer_m2_moyen || 0) > 0) score += 10;
          if (Number(typed.sale_m2_all || typed.prix_m2_moyen || 0) > 0) score += 10;
          return { row: typed, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

      const selected = ranked[0]?.row || null;
      if (selected) return selected;
    }
  }

  if (departementCode) {
    const { data, error } = await supabase
      .from("city_market_prices")
      .select("*")
      .eq("departement_code", departementCode)
      .limit(5000);
    warnLookupError("departement-median", error, { departementCode });
    if (data && data.length > 0) {
      const m = (key: keyof CityMarketPriceRow) =>
        median(
          data
            .map((row: unknown) => Number((row as CityMarketPriceRow)?.[key] || 0))
            .filter((n) => Number.isFinite(n) && n > 0),
        );
      return {
        insee_code: null,
        commune: null,
        departement_code: departementCode,
        rent_m2_app_all: m("rent_m2_app_all"),
        rent_m2_app_t1t2: m("rent_m2_app_t1t2"),
        rent_m2_app_t3plus: m("rent_m2_app_t3plus"),
        rent_m2_house: m("rent_m2_house"),
        sale_m2_all: m("sale_m2_all"),
        commentaire: "fallback_departement_median_city_market_prices",
      } as CityMarketPriceRow;
    }
  }

  return null;
}

export function pickRentM2(
  row: CityMarketPriceRow | null,
  type: "house" | "apartment",
  typology: "all" | "t1t2" | "t3plus",
): number {
  if (!row) return 0;
  if (type === "house") return Number(row.rent_m2_house || row.rent_m2_app_all || row.loyer_m2_moyen || 0);
  if (typology === "t1t2") return Number(row.rent_m2_app_t1t2 || row.rent_m2_app_all || row.loyer_m2_moyen || 0);
  if (typology === "t3plus") return Number(row.rent_m2_app_t3plus || row.rent_m2_app_all || row.loyer_m2_moyen || 0);
  return Number(row.rent_m2_app_all || row.loyer_m2_moyen || 0);
}

import type { RentEstimateInput, RentEstimateOutput } from "./types.ts";

type CommuneRow = {
  insee_code: string;
  departement_code?: string | null;
  source_hint?: "CITY_MARKET" | "ANIL";
  loyer_m2_cc_app_all?: number | null;
  loyer_m2_cc_app_t1t2?: number | null;
  loyer_m2_cc_app_t3plus?: number | null;
  loyer_m2_cc_house?: number | null;
  n_obs_app_all?: number | null;
  n_obs_app_t1t2?: number | null;
  n_obs_app_t3plus?: number | null;
  n_obs_house?: number | null;
  pred_int_low_app_all?: number | null;
  pred_int_high_app_all?: number | null;
  pred_int_low_house?: number | null;
  pred_int_high_house?: number | null;
};

type OLLRow = { loyer_m2?: number | null };
type ParisRow = {
  loyer_reference_majore?: number | null;
  loyer_reference_minore?: number | null;
};

export interface RentDataProvider {
  getParisEncadrement(input: RentEstimateInput): Promise<ParisRow | null>;
  getCommuneRent(insee: string): Promise<CommuneRow | null>;
  getDepartmentFallback(departementCode: string, input: RentEstimateInput): Promise<number | null>;
  getOLLFallback(input: RentEstimateInput): Promise<OLLRow | null>;
}

function pickCommuneValue(row: CommuneRow, input: RentEstimateInput): number | null {
  if ((input.type ?? "apartment") === "house") return row.loyer_m2_cc_house ?? null;
  if ((input.typology ?? "all") === "t1t2") return row.loyer_m2_cc_app_t1t2 ?? null;
  if ((input.typology ?? "all") === "t3plus") return row.loyer_m2_cc_app_t3plus ?? null;
  return row.loyer_m2_cc_app_all ?? null;
}

function communeConfidence(row: CommuneRow, input: RentEstimateInput): number {
  const typeHouse = (input.type ?? "apartment") === "house";
  const obs = typeHouse
    ? row.n_obs_house ?? 0
    : input.typology === "t1t2"
      ? row.n_obs_app_t1t2 ?? 0
      : input.typology === "t3plus"
        ? row.n_obs_app_t3plus ?? 0
        : row.n_obs_app_all ?? 0;
  if (obs >= 100) return 90;
  if (obs >= 30) return 75;
  if (obs >= 10) return 60;
  return 45;
}

export async function getRentM2(
  provider: RentDataProvider,
  input: RentEstimateInput
): Promise<RentEstimateOutput | null> {
  const surface = input.surface ?? 0;
  const fallbackTotal = (m2: number): RentEstimateOutput => ({
    loyer_m2: m2,
    loyer_total_estime: surface > 0 ? m2 * surface : undefined,
    source: "DEPARTEMENT_FALLBACK",
    score_confiance: 40,
  });

  const paris = await provider.getParisEncadrement(input);
  if (paris?.loyer_reference_majore && paris.loyer_reference_majore > 0) {
    return {
      loyer_m2: paris.loyer_reference_majore,
      loyer_total_estime: surface > 0 ? paris.loyer_reference_majore * surface : undefined,
      source: "PARIS_ENCADREMENT",
      score_confiance: 95,
      intervalle: {
        low: paris.loyer_reference_minore ?? undefined,
        high: paris.loyer_reference_majore ?? undefined,
      },
    };
  }

  if (input.insee) {
    const commune = await provider.getCommuneRent(input.insee);
    if (commune) {
      const m2 = pickCommuneValue(commune, input);
      if (m2 && m2 > 0) {
        return {
          loyer_m2: m2,
          loyer_total_estime: surface > 0 ? m2 * surface : undefined,
          source: commune.source_hint ?? "ANIL",
          score_confiance: communeConfidence(commune, input),
          intervalle: {
            low:
              (input.type ?? "apartment") === "house"
                ? commune.pred_int_low_house ?? undefined
                : commune.pred_int_low_app_all ?? undefined,
            high:
              (input.type ?? "apartment") === "house"
                ? commune.pred_int_high_house ?? undefined
                : commune.pred_int_high_app_all ?? undefined,
          },
        };
      }
      if (commune.departement_code) {
        const dept = await provider.getDepartmentFallback(commune.departement_code, input);
        if (dept && dept > 0) return fallbackTotal(dept);
      }
    }
  }

  const oll = await provider.getOLLFallback(input);
  if (oll?.loyer_m2 && oll.loyer_m2 > 0) {
    return {
      loyer_m2: oll.loyer_m2,
      loyer_total_estime: surface > 0 ? oll.loyer_m2 * surface : undefined,
      source: "OLL",
      score_confiance: 55,
    };
  }

  if (input.departement_code) {
    const dept = await provider.getDepartmentFallback(input.departement_code, input);
    if (dept && dept > 0) return fallbackTotal(dept);
  }

  return null;
}

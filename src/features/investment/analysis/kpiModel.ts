import { calcCoutGlobal, calcFraisNotaire } from "@/lib/calculations";
import type { MarketData } from "@/lib/market/cityMarketPipeline";

type AnalysisResultLike = {
  prixAnnonce?: string;
  loyerEstime?: string;
  cashFlow?: string;
  prixM2Dvf?: string;
};

function numFromText(value: unknown): number {
  const cleaned = String(value ?? "").replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export type AnalysisKpiModelInput = {
  aiResult: AnalysisResultLike | null;
  loyerEstime: number;
  coutGlobal: number;
  activePrix: number;
  activeSurface: number;
  marketData: MarketData | null;
  marketStatus: "ok" | "processing" | "failed" | "indisponible";
  travaux: number;
  autresCouts: number;
  fraisNotairePct: number;
};

export type AnalysisKpiModel = {
  prixAnnonceNum: number;
  loyerEstimeNum: number;
  basePrixRendement: number;
  hasRentForYield: boolean;
  rendementBrutCalc: number | null;
  minRent8: number;
  rendementTargetReached: boolean;
  prixCibleRendement8: number;
  ecartNego: number;
  ecartNegoPct: number;
  coutGlobalPrixCible: number;
  rendementAbove10: boolean;
  projectionBase: number;
  marketPriceRef: number;
  marketRentRef: number;
  displayedDvf: string;
  marketSourceLine: string | null;
  marketPossibleRentMonthly: number;
  cashFlowMensuelNum: number;
  priceM2Annonce: number;
  dvfMedianRef: number;
  marketDataMissing: boolean;
};

export function computeGrossYield(loyerMensuel: number, basePrix: number): number {
  if (!Number.isFinite(loyerMensuel) || !Number.isFinite(basePrix) || loyerMensuel <= 0 || basePrix <= 0) return 0;
  return (loyerMensuel * 12 * 100) / basePrix;
}

export function computeMinRentForTargetYield(basePrix: number, target = 0.08): number {
  if (!Number.isFinite(basePrix) || basePrix <= 0) return 0;
  return Math.ceil((target * basePrix) / 12);
}

export function buildAnalysisKpiModel(input: AnalysisKpiModelInput): AnalysisKpiModel {
  const prixAnnonceNum = input.aiResult ? numFromText(input.aiResult.prixAnnonce) : 0;
  const loyerEstimeNum = input.loyerEstime > 0 ? input.loyerEstime : numFromText(input.aiResult?.loyerEstime || 0);
  const basePrixRendement = prixAnnonceNum > 0 ? prixAnnonceNum : input.coutGlobal;
  const hasRentForYield = loyerEstimeNum > 0 && basePrixRendement > 0;
  const rendementBrutCalc = hasRentForYield ? computeGrossYield(loyerEstimeNum, basePrixRendement) : null;
  const minRent8 = computeMinRentForTargetYield(basePrixRendement, 0.08);
  const rendementTargetReached = rendementBrutCalc !== null && rendementBrutCalc >= 8;
  const prixCibleRendement8 = hasRentForYield ? (loyerEstimeNum * 12) / 0.08 : 0;
  const ecartNego =
    hasRentForYield && !rendementTargetReached && basePrixRendement > 0 && prixCibleRendement8 > 0
      ? Math.max(0, basePrixRendement - prixCibleRendement8)
      : 0;
  const ecartNegoPct = basePrixRendement > 0 && ecartNego > 0 ? (ecartNego / basePrixRendement) * 100 : 0;
  const fraisNotairePrixCible =
    prixCibleRendement8 > 0 ? calcFraisNotaire(prixCibleRendement8, input.fraisNotairePct) : 0;
  const coutGlobalPrixCible =
    prixCibleRendement8 > 0 ? calcCoutGlobal(prixCibleRendement8, fraisNotairePrixCible, input.travaux, input.autresCouts) : 0;
  const rendementAbove10 = rendementBrutCalc !== null && rendementBrutCalc > 10;
  const projectionBase = basePrixRendement > 0 ? basePrixRendement : 0;

  const marketPriceRef = Number(input.marketData?.marketPricePerSqm || 0);
  const marketRentRef = Number(input.marketData?.marketRentPerSqm || 0);
  const displayedDvf =
    marketPriceRef > 0
      ? `${Math.round(marketPriceRef).toLocaleString("fr-FR")} EUR/m2`
      : input.aiResult?.prixM2Dvf || "n/a";
  const marketSourceLine = input.marketData?.sourcePrixM2 || input.marketData?.sourceLoyerM2
    ? `Source prix: ${input.marketData?.sourcePrixM2 || "n/a"} | Source loyer: ${input.marketData?.sourceLoyerM2 || "n/a"}`
    : null;
  const marketPossibleRentMonthly =
    marketRentRef > 0 && input.activeSurface > 0 ? Math.round(marketRentRef * input.activeSurface) : 0;

  const cashFlowMensuelNum = input.aiResult ? numFromText(input.aiResult.cashFlow || 0) : 0;
  const priceM2Annonce = input.activePrix > 0 && input.activeSurface > 0 ? input.activePrix / input.activeSurface : 0;
  const dvfMedianRef = marketPriceRef > 0 ? marketPriceRef : numFromText(input.aiResult?.prixM2Dvf || 0);

  return {
    prixAnnonceNum,
    loyerEstimeNum,
    basePrixRendement,
    hasRentForYield,
    rendementBrutCalc,
    minRent8,
    rendementTargetReached,
    prixCibleRendement8,
    ecartNego,
    ecartNegoPct,
    coutGlobalPrixCible,
    rendementAbove10,
    projectionBase,
    marketPriceRef,
    marketRentRef,
    displayedDvf,
    marketSourceLine,
    marketPossibleRentMonthly,
    cashFlowMensuelNum,
    priceM2Annonce,
    dvfMedianRef,
    marketDataMissing: input.marketStatus !== "ok",
  };
}

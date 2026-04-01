import { lmnpMicroBicEngine } from "./lmnpMicroBicEngine";
import { lmnpReelEngine } from "./lmnpReelEngine";
import { microFoncierEngine } from "./microFoncierEngine";
import { reelFoncierEngine } from "./reelFoncierEngine";
import { sciIrEngine } from "./sciIrEngine";
import { sciIsEngine } from "./sciIsEngine";
import type { TaxEngine } from "./baseTaxEngine";
import type { TaxRegime } from "./types";

const ENGINES: Record<string, TaxEngine> = {
  micro_foncier: microFoncierEngine,
  reel_foncier: reelFoncierEngine,
  lmnp_micro_bic: lmnpMicroBicEngine,
  lmnp_reel: lmnpReelEngine,
  sci_ir: sciIrEngine,
  sci_is: sciIsEngine,
};

export function getTaxEngine(regime: TaxRegime): TaxEngine | null {
  return ENGINES[regime] ?? null;
}

export function isImplementedTaxRegime(regime: TaxRegime): boolean {
  return Boolean(getTaxEngine(regime));
}

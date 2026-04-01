import { DEFAULT_WARNING_NOTE } from "./constants";
import { buildCommonAssumptions, describeObjective } from "./assumptions";
import { roundCurrency, totalAcquisitionCost } from "./helpers";
import type { CanonicalInvestmentInput, EconomicResult, TaxResult } from "./types";

export interface TaxCalculationContext {
  input: CanonicalInvestmentInput;
  economic: EconomicResult;
}

export interface TaxEngine {
  regime: CanonicalInvestmentInput["ownership"]["taxRegime"];
  calculate(context: TaxCalculationContext): TaxResult;
}

export function finalizeTaxResult(
  context: TaxCalculationContext,
  payload: Omit<TaxResult, "assumptions" | "coherenceWithObjective"> & { assumptions: string[] },
): TaxResult {
  const assumptions = [...buildCommonAssumptions(context.input), ...payload.assumptions];
  return {
    ...payload,
    assumptions,
    warnings: payload.warnings.length > 0 ? payload.warnings : [DEFAULT_WARNING_NOTE],
    coherenceWithObjective: describeObjective(context.input.investorObjective),
  };
}

export function computeNetNetYield(postTaxCashflow: number, input: CanonicalInvestmentInput): number {
  const totalCost = totalAcquisitionCost(input);
  if (totalCost <= 0) return 0;
  return postTaxCashflow / totalCost;
}

export function roundTaxResult(value: number): number {
  return roundCurrency(value);
}

import { DEFAULT_MICRO_FONCIER_ALLOWANCE } from "./constants";
import { computeNetNetYield, finalizeTaxResult, roundTaxResult, type TaxEngine } from "./baseTaxEngine";
import { clampRate } from "./helpers";

export const microFoncierEngine: TaxEngine = {
  regime: "micro_foncier",
  calculate(context) {
    const collectedRent = context.economic.effectiveAnnualRent;
    const taxableIncome = Math.max(0, collectedRent * (1 - DEFAULT_MICRO_FONCIER_ALLOWANCE));
    const incomeTax = taxableIncome * clampRate(context.input.taxProfile.tmi);
    const socialContributions = taxableIncome * clampRate(context.input.taxProfile.socialRate);
    const postTaxCashflow = context.economic.cashflowBeforeTax - incomeTax - socialContributions;

    return finalizeTaxResult(context, {
      regime: "micro_foncier",
      taxableIncome: roundTaxResult(taxableIncome),
      deductibleCharges: 0,
      amortization: 0,
      taxAmount: roundTaxResult(incomeTax),
      socialContributions: roundTaxResult(socialContributions),
      corporateTax: 0,
      dividendsTax: 0,
      postTaxCashflow: roundTaxResult(postTaxCashflow),
      netNetYield: computeNetNetYield(postTaxCashflow, context.input),
      notes: ["Abattement forfaitaire de 30% applique sur les loyers encaisses."],
      warnings: [],
      assumptions: ["Les charges reelles ne sont pas deduites en micro-foncier."],
      complexity: "standard",
    });
  },
};

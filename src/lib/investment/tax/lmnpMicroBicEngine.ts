import { DEFAULT_MICRO_BIC_ALLOWANCE } from "./constants";
import { computeNetNetYield, finalizeTaxResult, roundTaxResult, type TaxEngine } from "./baseTaxEngine";
import { clampRate } from "./helpers";

export const lmnpMicroBicEngine: TaxEngine = {
  regime: "lmnp_micro_bic",
  calculate(context) {
    const taxableIncome = Math.max(
      0,
      context.economic.effectiveAnnualRent * (1 - DEFAULT_MICRO_BIC_ALLOWANCE),
    );
    const incomeTax = taxableIncome * clampRate(context.input.taxProfile.tmi);
    const socialContributions = taxableIncome * clampRate(context.input.taxProfile.socialRate);
    const postTaxCashflow = context.economic.cashflowBeforeTax - incomeTax - socialContributions;

    return finalizeTaxResult(context, {
      regime: "lmnp_micro_bic",
      taxableIncome: roundTaxResult(taxableIncome),
      deductibleCharges: 0,
      amortization: 0,
      taxAmount: roundTaxResult(incomeTax),
      socialContributions: roundTaxResult(socialContributions),
      corporateTax: 0,
      dividendsTax: 0,
      postTaxCashflow: roundTaxResult(postTaxCashflow),
      netNetYield: computeNetNetYield(postTaxCashflow, context.input),
      notes: ["Abattement forfaitaire de 50% applique sur les loyers encaisses en meuble."],
      warnings: ["Le CFE et les cas sociaux specifiques au meuble ne sont pas modelises."],
      assumptions: ["Le regime LMNP micro-BIC est traite ici comme une simulation simplifiee."],
      complexity: "standard",
    });
  },
};

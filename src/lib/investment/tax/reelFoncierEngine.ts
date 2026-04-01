import { computeNetNetYield, finalizeTaxResult, roundTaxResult, type TaxEngine } from "./baseTaxEngine";
import { clampRate } from "./helpers";

export const reelFoncierEngine: TaxEngine = {
  regime: "reel_foncier",
  calculate(context) {
    const deductibleCharges =
      context.economic.annualCharges + context.economic.annualInterest + context.input.worksAmount;
    const taxableIncome = Math.max(0, context.economic.effectiveAnnualRent - deductibleCharges);
    const incomeTax = taxableIncome * clampRate(context.input.taxProfile.tmi);
    const socialContributions = taxableIncome * clampRate(context.input.taxProfile.socialRate);
    const postTaxCashflow = context.economic.cashflowBeforeTax - incomeTax - socialContributions;

    return finalizeTaxResult(context, {
      regime: "reel_foncier",
      taxableIncome: roundTaxResult(taxableIncome),
      deductibleCharges: roundTaxResult(deductibleCharges),
      amortization: 0,
      taxAmount: roundTaxResult(incomeTax),
      socialContributions: roundTaxResult(socialContributions),
      corporateTax: 0,
      dividendsTax: 0,
      postTaxCashflow: roundTaxResult(postTaxCashflow),
      netNetYield: computeNetNetYield(postTaxCashflow, context.input),
      notes: ["Charges reelles, interets d'emprunt et travaux deductibles retenus."],
      warnings: ["Le traitement precis du deficit foncier n'est pas detaille dans cette simulation."],
      assumptions: ["Les travaux sont integres integralement sur l'exercice simule."],
      complexity: "standard",
    });
  },
};

import { computeNetNetYield, finalizeTaxResult, roundTaxResult, type TaxEngine } from "./baseTaxEngine";
import { clampRate, computeTotalAmortization } from "./helpers";

export const lmnpReelEngine: TaxEngine = {
  regime: "lmnp_reel",
  calculate(context) {
    const amortization = computeTotalAmortization(context.input);
    const deductibleCharges = context.economic.annualCharges + context.economic.annualInterest;
    const taxableIncome = Math.max(
      0,
      context.economic.effectiveAnnualRent - deductibleCharges - amortization,
    );
    const incomeTax = taxableIncome * clampRate(context.input.taxProfile.tmi);
    const socialContributions = taxableIncome * clampRate(context.input.taxProfile.socialRate);
    const postTaxCashflow = context.economic.cashflowBeforeTax - incomeTax - socialContributions;

    return finalizeTaxResult(context, {
      regime: "lmnp_reel",
      taxableIncome: roundTaxResult(taxableIncome),
      deductibleCharges: roundTaxResult(deductibleCharges),
      amortization: roundTaxResult(amortization),
      taxAmount: roundTaxResult(incomeTax),
      socialContributions: roundTaxResult(socialContributions),
      corporateTax: 0,
      dividendsTax: 0,
      postTaxCashflow: roundTaxResult(postTaxCashflow),
      netNetYield: computeNetNetYield(postTaxCashflow, context.input),
      notes: ["Charges reelles et amortissements retenus pour la simulation LMNP reel."],
      warnings: ["Les plafonds et retraitements comptables d'amortissement restent simplifies."],
      assumptions: ["La valeur terrain n'est pas amortie."],
      complexity: "standard",
    });
  },
};

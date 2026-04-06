import { computeNetNetYield, finalizeTaxResult, roundTaxResult, type TaxEngine } from "./baseTaxEngine";
import { clampRate } from "./helpers";

export const sciIrEngine: TaxEngine = {
  regime: "sci_ir",
  calculate(context) {
    const deductibleCharges =
      context.economic.annualCharges + context.economic.annualInterest + context.input.worksAmount;
    const taxableIncome = Math.max(0, context.economic.effectiveAnnualRent - deductibleCharges);
    const incomeTax = taxableIncome * clampRate(context.input.taxProfile.tmi);
    const socialContributions = taxableIncome * clampRate(context.input.taxProfile.socialRate);
    const postTaxCashflow = context.economic.cashflowBeforeTax - incomeTax - socialContributions;

    return finalizeTaxResult(context, {
      regime: "sci_ir",
      taxableIncome: roundTaxResult(taxableIncome),
      deductibleCharges: roundTaxResult(deductibleCharges),
      amortization: 0,
      taxAmount: roundTaxResult(incomeTax),
      socialContributions: roundTaxResult(socialContributions),
      corporateTax: 0,
      dividendsTax: 0,
      postTaxCashflow: roundTaxResult(postTaxCashflow),
      netNetYield: computeNetNetYield(
        context.economic.effectiveAnnualRent,
        context.economic.annualCharges,
        incomeTax + socialContributions,
        context.input,
      ),
      notes: ["Simulation d'une SCI translucide avec remontée du resultat chez l'associe."],
      warnings: ["La repartition entre associes et les cas de holding ne sont pas modelises ici."],
      assumptions: ["Les prelevements sociaux sont appliques au niveau de l'investisseur."],
      complexity: "standard",
    });
  },
};

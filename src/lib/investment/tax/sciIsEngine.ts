import { computeNetNetYield, finalizeTaxResult, roundTaxResult, type TaxEngine } from "./baseTaxEngine";
import { computeCorporateTax, computeTotalAmortization } from "./helpers";

export const sciIsEngine: TaxEngine = {
  regime: "sci_is",
  calculate(context) {
    const amortization = computeTotalAmortization(context.input);
    const deductibleCharges = context.economic.annualCharges + context.economic.annualInterest;
    const taxableIncome = Math.max(
      0,
      context.economic.effectiveAnnualRent - deductibleCharges - amortization,
    );
    const corporateTax = computeCorporateTax(
      taxableIncome,
      context.input.taxProfile.corporateTaxRate,
      context.input.taxProfile.reducedCorporateTaxEligible,
    );
    const postTaxCashflow = context.economic.cashflowBeforeTax - corporateTax;

    return finalizeTaxResult(context, {
      regime: "sci_is",
      taxableIncome: roundTaxResult(taxableIncome),
      deductibleCharges: roundTaxResult(deductibleCharges),
      amortization: roundTaxResult(amortization),
      taxAmount: roundTaxResult(corporateTax),
      socialContributions: 0,
      corporateTax: roundTaxResult(corporateTax),
      dividendsTax: 0,
      postTaxCashflow: roundTaxResult(postTaxCashflow),
      netNetYield: computeNetNetYield(postTaxCashflow, context.input),
      notes: ["Simulation a l'IS avec amortissements de l'immeuble et du mobilier quand applicable."],
      warnings: ["La fiscalite de revente et la distribution future de dividendes sont simplifiees."],
      assumptions: ["Le taux reduit d'IS est applique si l'option est activee."],
      complexity: "standard",
    });
  },
};

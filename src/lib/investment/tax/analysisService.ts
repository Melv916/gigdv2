import { CORE_CALC_VERSION, TAX_CALC_VERSION } from "./constants";
import { buildEconomicResult, buildProjection, clampRate, computeAnnualLoanBreakdown } from "./helpers";
import { getTaxEngine } from "./registry";
import type {
  CanonicalInvestmentInput,
  InvestmentAnalysis,
  PatrimonialResult,
  TaxComparisonRow,
  TaxRegime,
} from "./types";

function buildPatrimonialResult(input: CanonicalInvestmentInput, primaryAnalysis: InvestmentAnalysis): PatrimonialResult {
  const horizons = [5, 10, 20];
  const annualRentGrowth = clampRate(input.assumptions.annualRentGrowthRate);
  const valueGrowth = clampRate(input.assumptions.annualValueGrowthRate);
  const chargeGrowth = clampRate(input.assumptions.annualChargeGrowthRate);
  const yearlyNetAfterTax = primaryAnalysis.fiscal.postTaxCashflow;
  const startingPrincipal = input.financing.loanAmount;
  const annualDebtService = input.financing.annualDebtService;
  let remainingPrincipal = startingPrincipal;
  let cumulativePrincipal = 0;
  let cumulativeTreasury = -(primaryAnalysis.economic.totalCost - startingPrincipal);

  const projections = horizons.map((year) => {
    const growthFactor = (1 + annualRentGrowth) ** year;
    const chargeFactor = (1 + chargeGrowth) ** year;
    const loanBreakdown = computeAnnualLoanBreakdown(
      remainingPrincipal,
      input.financing.interestRate,
      Math.max(1, input.financing.durationYears - (year - 1)),
      annualDebtService,
      input.financing.borrowerInsurance,
    );
    remainingPrincipal = Math.max(0, remainingPrincipal - loanBreakdown.principal);
    cumulativePrincipal += loanBreakdown.principal;
    cumulativeTreasury += yearlyNetAfterTax * growthFactor - primaryAnalysis.fiscal.taxAmount * (chargeFactor - 1);
    const propertyValue = input.purchasePrice * (1 + valueGrowth) ** year;
    return buildProjection(year, propertyValue, remainingPrincipal, cumulativePrincipal, cumulativeTreasury);
  });

  const finalProjection = projections[projections.length - 1];

  return {
    capitalRepaid: finalProjection?.principalRepaid ?? 0,
    cumulativePostTaxTreasury: finalProjection?.cumulativePostTaxTreasury ?? 0,
    netValueCreated: finalProjection?.netValueCreated ?? 0,
    potentialExitValue: finalProjection?.propertyValue ?? 0,
    objectiveFit: primaryAnalysis.fiscal.coherenceWithObjective,
    projections,
    assumptions: [
      "Les projections patrimoniales reprennent les hypotheses economiques du projet.",
      "Le cash-flow apres impot est projete selon une croissance simplifiee des loyers et charges.",
    ],
  };
}

export function analyzeInvestment(input: CanonicalInvestmentInput): InvestmentAnalysis {
  const economic = buildEconomicResult(input);
  const engine = getTaxEngine(input.ownership.taxRegime);
  if (!engine) {
    throw new Error(`Regime fiscal non implemente: ${input.ownership.taxRegime}`);
  }
  const fiscal = engine.calculate({ input, economic });
  const analysis: InvestmentAnalysis = {
    versions: {
      coreCalcVersion: CORE_CALC_VERSION,
      taxCalcVersion: TAX_CALC_VERSION,
    },
    economic,
    fiscal,
    patrimonial: {} as InvestmentAnalysis["patrimonial"],
  };
  analysis.patrimonial = buildPatrimonialResult(input, analysis);
  return analysis;
}

export function compareTaxRegimes(
  input: CanonicalInvestmentInput,
  regimes: TaxRegime[],
): TaxComparisonRow[] {
  return regimes
    .map((regime) => {
      const analysis = analyzeInvestment({
        ...input,
        ownership: {
          ...input.ownership,
          taxRegime: regime,
        },
      });
      return {
        regime,
        cashflowBeforeTax: analysis.economic.cashflowBeforeTax,
        taxAmount: analysis.fiscal.taxAmount + analysis.fiscal.socialContributions + analysis.fiscal.dividendsTax,
        cashflowAfterTax: analysis.fiscal.postTaxCashflow,
        netNetYield: analysis.fiscal.netNetYield,
        complexity: analysis.fiscal.complexity,
        notes: analysis.fiscal.notes,
        warnings: analysis.fiscal.warnings,
        coherenceWithObjective: analysis.fiscal.coherenceWithObjective,
      };
    })
    .sort((left, right) => right.cashflowAfterTax - left.cashflowAfterTax);
}

import type { CanonicalInvestmentInput } from "./types";

export function makeCanonicalInput(
  overrides: Partial<CanonicalInvestmentInput> = {},
): CanonicalInvestmentInput {
  return {
    purchasePrice: 180000,
    notaryFees: 14400,
    agencyFees: 0,
    worksAmount: 12000,
    furnitureAmount: 6000,
    annualRent: 13200,
    annualCharges: 1800,
    propertyTax: 1200,
    insurance: 240,
    accountingFees: 600,
    managementFees: 0,
    vacancyRate: 1 / 12,
    financing: {
      loanAmount: 170000,
      interestRate: 0.038,
      durationYears: 20,
      annualDebtService: 12720,
      borrowerInsurance: 720,
    },
    operation: {
      exploitationMode: "location_meublee",
      furnished: true,
      shortTerm: false,
      coliving: false,
    },
    ownership: {
      ownershipMode: "nom_propre",
      taxRegime: "lmnp_reel",
    },
    taxProfile: {
      tmi: 0.3,
      socialRate: 0.172,
      corporateTaxRate: 0.25,
      reducedCorporateTaxEligible: true,
      dividendDistributionRate: 1,
      motherDaughterRate: 0.95,
      reinvestInsteadOfDistribute: false,
    },
    assetProfile: {
      propertyType: "residential",
      landValueRatio: 0.15,
      buildingValueRatio: 0.85,
      amortizationPeriods: {
        buildingYears: 30,
        furnitureYears: 7,
      },
      amortizationEnabled: true,
    },
    assumptions: {
      annualRentGrowthRate: 0.02,
      annualValueGrowthRate: 0.02,
      annualChargeGrowthRate: 0.02,
      discountRate: 0.08,
      exitCostRate: 0.06,
    },
    investorObjective: "cashflow_immediat",
    ...overrides,
  };
}

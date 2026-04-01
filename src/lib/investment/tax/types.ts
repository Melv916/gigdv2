export type ExploitationMode =
  | "location_nue"
  | "location_meublee"
  | "colocation"
  | "location_courte_duree";

export type OwnershipMode = "nom_propre" | "sci" | "holding" | "sci_avec_holding";

export type TaxRegime =
  | "micro_foncier"
  | "reel_foncier"
  | "lmnp_micro_bic"
  | "lmnp_reel"
  | "lmp_micro_bic"
  | "lmp_reel"
  | "sci_ir"
  | "sci_is"
  | "sci_is_holding_mere_fille"
  | "holding_is_remontee_dividendes";

export type InvestorObjective =
  | "cashflow_immediat"
  | "patrimoine_long_terme"
  | "reinvestissement_societe"
  | "optimisation_fiscale"
  | "remontee_tresorerie";

export type AppPlan = "free" | "debutant" | "investisseur" | "avance";

export interface CanonicalInvestmentInput {
  purchasePrice: number;
  notaryFees: number;
  agencyFees: number;
  worksAmount: number;
  furnitureAmount: number;
  annualRent: number;
  annualCharges: number;
  propertyTax: number;
  insurance: number;
  accountingFees: number;
  managementFees: number;
  vacancyRate: number;
  financing: {
    loanAmount: number;
    interestRate: number;
    durationYears: number;
    annualDebtService: number;
    borrowerInsurance: number;
  };
  operation: {
    exploitationMode: ExploitationMode;
    furnished: boolean;
    shortTerm: boolean;
    coliving: boolean;
  };
  ownership: {
    ownershipMode: OwnershipMode;
    taxRegime: TaxRegime;
  };
  taxProfile: {
    tmi: number;
    socialRate: number;
    corporateTaxRate: number;
    reducedCorporateTaxEligible: boolean;
    dividendDistributionRate: number;
    motherDaughterRate: number;
    reinvestInsteadOfDistribute: boolean;
  };
  assetProfile: {
    propertyType: string;
    landValueRatio: number;
    buildingValueRatio: number;
    amortizationPeriods: {
      buildingYears: number;
      furnitureYears: number;
    };
    amortizationEnabled: boolean;
  };
  assumptions: {
    annualRentGrowthRate: number;
    annualValueGrowthRate: number;
    annualChargeGrowthRate: number;
    discountRate: number;
    exitCostRate: number;
  };
  investorObjective: InvestorObjective;
}

export interface EconomicResult {
  purchasePrice: number;
  totalCost: number;
  annualRent: number;
  effectiveAnnualRent: number;
  annualCharges: number;
  annualDebtService: number;
  annualInterest: number;
  annualPrincipalRepaid: number;
  cashflowBeforeTax: number;
  grossYield: number;
  netYieldBeforeTax: number;
  dscr: number | null;
  tri: number | null;
  van: number;
  assumptions: string[];
}

export interface TaxResult {
  regime: TaxRegime;
  taxableIncome: number;
  deductibleCharges: number;
  amortization: number;
  taxAmount: number;
  socialContributions: number;
  corporateTax: number;
  dividendsTax: number;
  postTaxCashflow: number;
  netNetYield: number;
  notes: string[];
  warnings: string[];
  assumptions: string[];
  complexity: "standard" | "avance";
  coherenceWithObjective: string;
}

export interface PatrimonialProjection {
  year: number;
  propertyValue: number;
  remainingLoanPrincipal: number;
  principalRepaid: number;
  cumulativePostTaxTreasury: number;
  netValueCreated: number;
}

export interface PatrimonialResult {
  capitalRepaid: number;
  cumulativePostTaxTreasury: number;
  netValueCreated: number;
  potentialExitValue: number;
  objectiveFit: string;
  projections: PatrimonialProjection[];
  assumptions: string[];
}

export interface InvestmentAnalysis {
  versions: {
    coreCalcVersion: string;
    taxCalcVersion: string;
  };
  economic: EconomicResult;
  fiscal: TaxResult;
  patrimonial: PatrimonialResult;
}

export interface TaxComparisonRow {
  regime: TaxRegime;
  cashflowBeforeTax: number;
  taxAmount: number;
  cashflowAfterTax: number;
  netNetYield: number;
  complexity: "standard" | "avance";
  notes: string[];
  warnings: string[];
  coherenceWithObjective: string;
}

export interface TaxRegimeOption {
  regime: TaxRegime;
  label: string;
  shortDescription: string;
  longDescription: string;
  vigilance: string[];
  complexity: "standard" | "avance";
  advancedOnly?: boolean;
  notYetImplemented?: boolean;
}

export interface CompatibilityDiagnostics {
  regimes: TaxRegime[];
  warnings: string[];
  paywallRequired: boolean;
}

import {
  DEFAULT_CORPORATE_TAX_RATE,
  DEFAULT_SOCIAL_RATE,
  DEFAULT_TMI,
} from "./constants";
import { defaultCanonicalAssumptions } from "./assumptions";
import type {
  AppPlan,
  CanonicalInvestmentInput,
  ExploitationMode,
  InvestorObjective,
  OwnershipMode,
  TaxRegime,
} from "./types";

export interface ProjectTaxSettingsInput {
  exploitationMode: ExploitationMode;
  ownershipMode: OwnershipMode;
  taxRegime: TaxRegime;
  investorObjective: InvestorObjective;
  tmi: number;
  socialRate: number;
  corporateTaxRate: number;
  reducedCorporateTaxEligible: boolean;
  dividendDistributionRate: number;
  motherDaughterRate: number;
  reinvestInsteadOfDistribute: boolean;
  accountingFees: number;
  furnitureAmount: number;
  managementFees: number;
  insurance: number;
  amortizationEnabled: boolean;
  landValueRatio: number;
  buildingAmortizationYears: number;
  furnitureAmortizationYears: number;
}

export interface BuildCanonicalInputArgs {
  price: number;
  notaryFees: number;
  worksAmount: number;
  annualRent: number;
  annualCharges: number;
  propertyTax: number;
  vacancyRate: number;
  loanAmount: number;
  annualDebtService: number;
  annualBorrowerInsurance: number;
  interestRate: number;
  durationYears: number;
  annualRentGrowthRate: number;
  annualValueGrowthRate: number;
  annualChargeGrowthRate: number;
  taxSettings: ProjectTaxSettingsInput;
}

export function normalizeAppPlan(value: string | undefined | null): AppPlan {
  if (value === "debutant" || value === "investisseur" || value === "avance") return value;
  return "free";
}

export function mapProjectStrategyToExploitationMode(strategy: string): ExploitationMode {
  if (strategy === "ld-nue") return "location_nue";
  if (strategy === "coloc") return "colocation";
  if (strategy === "lcd") return "location_courte_duree";
  return "location_meublee";
}

export function defaultTaxSettings(exploitationMode: ExploitationMode): ProjectTaxSettingsInput {
  const defaults = defaultCanonicalAssumptions(exploitationMode, "nom_propre");
  return {
    exploitationMode,
    ownershipMode: "nom_propre",
    taxRegime: exploitationMode === "location_nue" ? "micro_foncier" : "lmnp_micro_bic",
    investorObjective: "cashflow_immediat",
    tmi: DEFAULT_TMI,
    socialRate: DEFAULT_SOCIAL_RATE,
    corporateTaxRate: DEFAULT_CORPORATE_TAX_RATE,
    reducedCorporateTaxEligible: true,
    dividendDistributionRate: 1,
    motherDaughterRate: 0.95,
    reinvestInsteadOfDistribute: false,
    accountingFees: defaults.accountingFees,
    furnitureAmount: exploitationMode === "location_nue" ? 0 : 5000,
    managementFees: 0,
    insurance: 0,
    amortizationEnabled: exploitationMode !== "location_nue",
    landValueRatio: defaults.landValueRatio,
    buildingAmortizationYears: defaults.buildingYears,
    furnitureAmortizationYears: defaults.furnitureYears,
  };
}

export function buildCanonicalInvestmentInput(args: BuildCanonicalInputArgs): CanonicalInvestmentInput {
  const buildingValueRatio = Math.max(0, 1 - args.taxSettings.landValueRatio);

  return {
    purchasePrice: args.price,
    notaryFees: args.notaryFees,
    agencyFees: 0,
    worksAmount: args.worksAmount,
    furnitureAmount: args.taxSettings.furnitureAmount,
    annualRent: args.annualRent,
    annualCharges: args.annualCharges,
    propertyTax: args.propertyTax,
    insurance: args.taxSettings.insurance,
    accountingFees: args.taxSettings.accountingFees,
    managementFees: args.taxSettings.managementFees,
    vacancyRate: args.vacancyRate,
    financing: {
      loanAmount: args.loanAmount,
      interestRate: args.interestRate,
      durationYears: args.durationYears,
      annualDebtService: args.annualDebtService,
      borrowerInsurance: args.annualBorrowerInsurance,
    },
    operation: {
      exploitationMode: args.taxSettings.exploitationMode,
      furnished: args.taxSettings.exploitationMode !== "location_nue",
      shortTerm: args.taxSettings.exploitationMode === "location_courte_duree",
      coliving: args.taxSettings.exploitationMode === "colocation",
    },
    ownership: {
      ownershipMode: args.taxSettings.ownershipMode,
      taxRegime: args.taxSettings.taxRegime,
    },
    taxProfile: {
      tmi: args.taxSettings.tmi,
      socialRate: args.taxSettings.socialRate,
      corporateTaxRate: args.taxSettings.corporateTaxRate,
      reducedCorporateTaxEligible: args.taxSettings.reducedCorporateTaxEligible,
      dividendDistributionRate: args.taxSettings.dividendDistributionRate,
      motherDaughterRate: args.taxSettings.motherDaughterRate,
      reinvestInsteadOfDistribute: args.taxSettings.reinvestInsteadOfDistribute,
    },
    assetProfile: {
      propertyType: "residential",
      landValueRatio: args.taxSettings.landValueRatio,
      buildingValueRatio,
      amortizationPeriods: {
        buildingYears: args.taxSettings.buildingAmortizationYears,
        furnitureYears: args.taxSettings.furnitureAmortizationYears,
      },
      amortizationEnabled: args.taxSettings.amortizationEnabled,
    },
    assumptions: {
      annualRentGrowthRate: args.annualRentGrowthRate,
      annualValueGrowthRate: args.annualValueGrowthRate,
      annualChargeGrowthRate: args.annualChargeGrowthRate,
      discountRate: 0.08,
      exitCostRate: 0.06,
    },
    investorObjective: args.taxSettings.investorObjective,
  };
}

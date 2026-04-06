import type { InvestmentAnalysis, PatrimonialResult } from "./tax";

export type RentalStrategy = "nue" | "meublee" | "coloc" | "lcd";
export type HoldingMode = "nom_propre" | "sci" | "holding" | "sci_avec_holding";
export type DataSource = "issue_annonce" | "saisie_utilisateur" | "estimation_moteur" | "valeur_par_defaut";
export type ReliabilityStatus =
  | "donnees_completes"
  | "donnees_partielles"
  | "estimation_prudente"
  | "estimation_marche"
  | "donnees_a_confirmer";
export type WarningSeverity = "info" | "warning" | "blocking";
export type VerdictStatus = "favorable" | "mitige" | "insuffisant" | "incomplet";

export interface AcquisitionInputs {
  purchasePrice: number;
  notaryRate: number;
  works: number;
  acquisitionFeesOther: number;
  furnishing: number;
}

export interface FinancingInputs {
  downPayment: number;
  loanAmount?: number;
  interestRate: number;
  insuranceRate: number;
  durationYears: number;
  monthlyPaymentManual?: number;
}

export interface RentalInputs {
  strategy: RentalStrategy;
  marketRentMonthly: number;
  currentRentMonthly: number;
  selectedRentMonthly: number;
  vacancyRate: number;
}

export interface OperatingInputs {
  condoChargesAnnualNonRecoverable: number;
  propertyTaxAnnual: number;
  pnoAnnual: number;
  managementAnnual: number;
  accountingAnnual: number;
  maintenanceAnnual: number;
  otherAnnual: number;
}

export interface TaxInputs {
  holdingMode: HoldingMode;
  taxRegime: string;
  tmi: number;
  socialTaxRate: number;
  corporateTaxRate: number;
  annualTaxAmount?: number | null;
  investmentAnalysis?: InvestmentAnalysis | null;
}

export interface AnalysisSourceMap {
  purchasePrice: DataSource;
  selectedRentMonthly: DataSource;
  vacancyRate: DataSource;
  propertyTaxAnnual: DataSource;
  condoChargesAnnualNonRecoverable: DataSource;
  operatingChargesAnnual: DataSource;
  strategy: DataSource;
  interestRate: DataSource;
  durationYears: DataSource;
  taxRegime: DataSource;
}

export interface AnalysisAssumption {
  key: keyof AnalysisSourceMap | string;
  label: string;
  value: string;
  source: DataSource;
  reliability: ReliabilityStatus;
}

export interface AnalysisWarning {
  code: string;
  severity: WarningSeverity;
  message: string;
  blockingForVerdict: boolean;
}

export interface ProjectAnalysisEngineInput {
  acquisition: AcquisitionInputs;
  financing: FinancingInputs;
  rental: RentalInputs;
  operating: OperatingInputs;
  tax: TaxInputs;
  sources: AnalysisSourceMap;
  targetGrossYieldActInHand: number;
}

export interface ProjectAnalysisAcquisitionOutput {
  purchasePrice: number;
  notaryRate: number;
  notaryFees: number;
  works: number;
  acquisitionFeesOther: number;
  furnishing: number;
  totalProjectCost: number;
}

export interface ProjectAnalysisFinancingOutput {
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  insuranceRate: number;
  durationYears: number;
  monthlyPaymentExcludingInsurance: number;
  monthlyInsurance: number;
  monthlyPaymentTotal: number;
  annualDebtService: number;
  usedManualMonthlyPayment: boolean;
}

export interface ProjectAnalysisExploitationOutput {
  strategy: RentalStrategy;
  marketRentMonthly: number;
  currentRentMonthly: number;
  selectedRentMonthly: number;
  vacancyRate: number;
  grossAnnualRent: number;
  collectedAnnualRent: number;
  operatingChargesAnnual: number;
  operatingChargesBreakdown: OperatingInputs;
  operatingResultBeforeDebtAnnual: number;
  cashflowBeforeTaxAnnual: number;
  cashflowBeforeTaxMonthly: number;
  breakEvenRentMonthly: number;
  grossYieldExcludingFees: number;
  grossYieldActInHand: number;
  netOperatingYield: number;
  scenarios: ProjectScenario[];
}

export interface ProjectAnalysisTaxationOutput {
  holdingMode: HoldingMode;
  taxRegime: string;
  tmi: number;
  socialTaxRate: number;
  corporateTaxRate: number;
  annualTaxAmount: number | null;
  monthlyTaxAmount: number | null;
  cashflowAfterTaxAnnual: number | null;
  cashflowAfterTaxMonthly: number | null;
  netNetYield: number | null;
  definitionNetNetYield: string;
  notes: string[];
}

export interface ProjectAnalysisPatrimonialOutput {
  capitalRepaid: number | null;
  cumulativePostTaxTreasury: number | null;
  netValueCreated: number | null;
  potentialExitValue: number | null;
  projections: PatrimonialResult["projections"];
}

export interface ProjectAnalysisPricingOutput {
  targetGrossYieldActInHand: number;
  totalCostMaxCompatible: number;
  purchasePriceMaxCompatible: number;
  displayedPriceGap: number;
  isPriceCompatible: boolean;
}

export interface ProjectScenario {
  key: "prudent" | "central" | "optimise";
  label: string;
  selectedRentMonthly: number;
  vacancyRate: number;
  operatingChargesAnnual: number;
  annualTaxAmount: number | null;
  cashflowBeforeTaxMonthly: number;
  cashflowAfterTaxMonthly: number | null;
}

export interface ProjectAnalysisVerdict {
  status: VerdictStatus;
  label: string;
  summary: string;
}

export interface ProjectAnalysisOutput {
  acquisition: ProjectAnalysisAcquisitionOutput;
  financing: ProjectAnalysisFinancingOutput;
  exploitation: ProjectAnalysisExploitationOutput;
  taxation: ProjectAnalysisTaxationOutput;
  patrimonial: ProjectAnalysisPatrimonialOutput;
  pricing: ProjectAnalysisPricingOutput;
  assumptions: AnalysisAssumption[];
  warnings: AnalysisWarning[];
  reliability: ReliabilityStatus;
  verdict: ProjectAnalysisVerdict;
}

function normalizeRate(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return value > 1 ? value / 100 : value;
}

function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

function monthlyLoanPayment(capital: number, interestRate: number, durationYears: number): number {
  if (capital <= 0 || durationYears <= 0) return 0;
  const annualRate = normalizeRate(interestRate);
  const monthlyRate = annualRate / 12;
  const months = Math.max(1, Math.round(durationYears * 12));
  if (monthlyRate === 0) return capital / months;
  return (capital * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function sourceLabel(source: DataSource): string {
  if (source === "issue_annonce") return "Issue de l'annonce";
  if (source === "estimation_moteur") return "Estimation moteur";
  if (source === "valeur_par_defaut") return "Valeur par defaut";
  return "Saisie utilisateur";
}

function reliabilityFromSource(source: DataSource): ReliabilityStatus {
  if (source === "estimation_moteur") return "estimation_marche";
  if (source === "valeur_par_defaut") return "estimation_prudente";
  return "donnees_completes";
}

function verdictLabel(status: VerdictStatus): string {
  if (status === "favorable") return "Favorable";
  if (status === "mitige") return "Mitige";
  if (status === "insuffisant") return "Insuffisant";
  return "Incomplet";
}

function verdictSummary(status: VerdictStatus): string {
  if (status === "favorable") {
    return "Le bien respecte l'objectif de rendement retenu et reste au moins a l'equilibre en exploitation. Analyse favorable sous reserve de validation de l'etat reel du bien et des donnees declaratives.";
  }
  if (status === "mitige") {
    return "Le bien tient globalement en rendement brut, mais reste tendu en exploitation. Une negociation, une optimisation du loyer ou une meilleure maitrise des charges est recommandee.";
  }
  if (status === "insuffisant") {
    return "Le bien ne respecte pas les criteres de rentabilite retenus dans cette configuration. Une baisse du prix ou un autre mode d'exploitation est necessaire pour ameliorer le dossier.";
  }
  return "Analyse partielle : certaines donnees structurantes ne sont pas renseignees. Les indicateurs affiches peuvent etre surestimes et doivent etre confirmes.";
}

function buildScenario(
  key: ProjectScenario["key"],
  base: {
    selectedRentMonthly: number;
    vacancyRate: number;
    operatingChargesAnnual: number;
    annualDebtService: number;
    annualTaxAmount: number | null;
  },
): ProjectScenario {
  const profile =
    key === "prudent"
      ? { label: "Prudent", rentFactor: 0.95, vacancyDelta: 0.02, chargesFactor: 1.1, taxFactor: 1.05 }
      : key === "optimise"
        ? { label: "Optimise", rentFactor: 1.02, vacancyDelta: -0.01, chargesFactor: 0.95, taxFactor: 0.97 }
        : { label: "Central", rentFactor: 1, vacancyDelta: 0, chargesFactor: 1, taxFactor: 1 };

  const rent = base.selectedRentMonthly * profile.rentFactor;
  const vacancyRate = Math.min(0.35, Math.max(0, base.vacancyRate + profile.vacancyDelta));
  const collectedAnnualRent = rent * 12 * (1 - vacancyRate);
  const operatingChargesAnnual = base.operatingChargesAnnual * profile.chargesFactor;
  const cashflowBeforeTaxAnnual = collectedAnnualRent - operatingChargesAnnual - base.annualDebtService;
  const annualTaxAmount =
    base.annualTaxAmount === null ? null : Math.max(0, base.annualTaxAmount * profile.taxFactor);
  const cashflowAfterTaxAnnual =
    annualTaxAmount === null ? null : cashflowBeforeTaxAnnual - annualTaxAmount;

  return {
    key,
    label: profile.label,
    selectedRentMonthly: roundCurrency(rent),
    vacancyRate,
    operatingChargesAnnual: roundCurrency(operatingChargesAnnual),
    annualTaxAmount: annualTaxAmount === null ? null : roundCurrency(annualTaxAmount),
    cashflowBeforeTaxMonthly: roundCurrency(cashflowBeforeTaxAnnual / 12),
    cashflowAfterTaxMonthly: cashflowAfterTaxAnnual === null ? null : roundCurrency(cashflowAfterTaxAnnual / 12),
  };
}

export function computeProjectAnalysis(input: ProjectAnalysisEngineInput): ProjectAnalysisOutput {
  const notaryRate = normalizeRate(input.acquisition.notaryRate);
  const totalProjectCost =
    input.acquisition.purchasePrice +
    input.acquisition.purchasePrice * notaryRate +
    input.acquisition.works +
    input.acquisition.acquisitionFeesOther +
    input.acquisition.furnishing;
  const notaryFees = input.acquisition.purchasePrice * notaryRate;

  const resolvedLoanAmount =
    input.financing.loanAmount && input.financing.loanAmount > 0
      ? input.financing.loanAmount
      : Math.max(0, totalProjectCost - input.financing.downPayment);
  const monthlyPaymentExcludingInsurance =
    input.financing.monthlyPaymentManual && input.financing.monthlyPaymentManual > 0
      ? input.financing.monthlyPaymentManual
      : monthlyLoanPayment(resolvedLoanAmount, input.financing.interestRate, input.financing.durationYears);
  const monthlyInsurance =
    resolvedLoanAmount > 0 ? (resolvedLoanAmount * normalizeRate(input.financing.insuranceRate)) / 12 : 0;
  const monthlyPaymentTotal = monthlyPaymentExcludingInsurance + monthlyInsurance;
  const annualDebtService = roundCurrency(monthlyPaymentTotal * 12);

  const grossAnnualRent = input.rental.selectedRentMonthly * 12;
  const vacancyRate = Math.min(0.95, Math.max(0, input.rental.vacancyRate));
  const collectedAnnualRent = grossAnnualRent * (1 - vacancyRate);
  const operatingChargesAnnual =
    input.operating.condoChargesAnnualNonRecoverable +
    input.operating.propertyTaxAnnual +
    input.operating.pnoAnnual +
    input.operating.managementAnnual +
    input.operating.accountingAnnual +
    input.operating.maintenanceAnnual +
    input.operating.otherAnnual;
  const operatingResultBeforeDebtAnnual = collectedAnnualRent - operatingChargesAnnual;
  const cashflowBeforeTaxAnnual = operatingResultBeforeDebtAnnual - annualDebtService;
  const targetYield = normalizeRate(input.targetGrossYieldActInHand);
  const annualTaxAmount =
    typeof input.tax.annualTaxAmount === "number" && Number.isFinite(input.tax.annualTaxAmount)
      ? Math.max(0, input.tax.annualTaxAmount)
      : null;
  const cashflowAfterTaxAnnual =
    annualTaxAmount === null ? null : cashflowBeforeTaxAnnual - annualTaxAmount;
  const netNetYield =
    annualTaxAmount === null || totalProjectCost <= 0
      ? null
      : (collectedAnnualRent - operatingChargesAnnual - annualTaxAmount) / totalProjectCost;
  const totalCostMaxCompatible = targetYield > 0 ? grossAnnualRent / targetYield : 0;
  const purchasePriceMaxCompatible =
    targetYield > 0
      ? Math.max(
          0,
          (
            totalCostMaxCompatible -
            input.acquisition.works -
            input.acquisition.acquisitionFeesOther -
            input.acquisition.furnishing
          ) /
            (1 + notaryRate),
        )
      : 0;

  const warnings: AnalysisWarning[] = [];
  const pushWarning = (
    code: string,
    severity: WarningSeverity,
    message: string,
    blockingForVerdict = false,
  ) => warnings.push({ code, severity, message, blockingForVerdict });

  if (input.acquisition.purchasePrice <= 0) {
    pushWarning("purchase-price-missing", "blocking", "Prix d'achat non renseigne : analyse impossible a fiabiliser.", true);
  }
  if (input.rental.selectedRentMonthly <= 0) {
    pushWarning("rent-missing", "blocking", "Loyer retenu non renseigne : rendement et cash-flow ne sont pas concluables.", true);
  }
  if (input.operating.propertyTaxAnnual <= 0) {
    pushWarning("property-tax-missing", "blocking", "Taxe fonciere non renseignee : cash-flow probablement surestime.", true);
  }
  if (input.operating.condoChargesAnnualNonRecoverable <= 0 && input.operating.otherAnnual <= 0) {
    pushWarning(
      "owner-charges-missing",
      "blocking",
      "Charges non recuperables non isolees : analyse a confirmer avant toute conclusion.",
      true,
    );
  }
  if (resolvedLoanAmount > 0 && input.financing.durationYears <= 0) {
    pushWarning("loan-duration-missing", "blocking", "Duree du credit absente : annuite impossible a fiabiliser.", true);
  }
  if (resolvedLoanAmount > 0 && normalizeRate(input.financing.interestRate) <= 0) {
    pushWarning("loan-rate-missing", "blocking", "Taux du credit absent : annuite impossible a fiabiliser.", true);
  }
  if (input.rental.vacancyRate <= 0) {
    pushWarning("vacancy-optimistic", "warning", "Vacance retenue nulle : scenario d'exploitation optimiste.");
  }
  if (
    input.rental.marketRentMonthly > 0 &&
    input.rental.selectedRentMonthly > input.rental.marketRentMonthly * 1.05
  ) {
    pushWarning(
      "rent-optimistic",
      "warning",
      "Loyer retenu au-dessus du marche estime : scenario optimiste a confirmer.",
    );
  }
  if (input.sources.propertyTaxAnnual === "valeur_par_defaut") {
    pushWarning(
      "property-tax-default",
      "warning",
      "Taxe fonciere issue d'une valeur par defaut : la lecture d'exploitation reste prudente.",
    );
  }
  if (annualTaxAmount === null) {
    pushWarning(
      "tax-incomplete",
      "blocking",
      "Fiscalite non simulee : cash-flow apres impot et rendement net-net a confirmer.",
      true,
    );
  }

  const assumptions: AnalysisAssumption[] = [
    {
      key: "selectedRentMonthly",
      label: "Loyer retenu",
      value: `${roundCurrency(input.rental.selectedRentMonthly).toLocaleString("fr-FR")} EUR/mois`,
      source: input.sources.selectedRentMonthly,
      reliability: reliabilityFromSource(input.sources.selectedRentMonthly),
    },
    {
      key: "vacancyRate",
      label: "Vacance retenue",
      value: `${(vacancyRate * 100).toFixed(1)} %`,
      source: input.sources.vacancyRate,
      reliability: reliabilityFromSource(input.sources.vacancyRate),
    },
    {
      key: "propertyTaxAnnual",
      label: "Taxe fonciere retenue",
      value:
        input.operating.propertyTaxAnnual > 0
          ? `${roundCurrency(input.operating.propertyTaxAnnual).toLocaleString("fr-FR")} EUR/an`
          : "A confirmer",
      source: input.sources.propertyTaxAnnual,
      reliability:
        input.operating.propertyTaxAnnual > 0
          ? reliabilityFromSource(input.sources.propertyTaxAnnual)
          : "donnees_a_confirmer",
    },
    {
      key: "operatingChargesAnnual",
      label: "Charges non recuperables retenues",
      value:
        operatingChargesAnnual > 0
          ? `${roundCurrency(operatingChargesAnnual).toLocaleString("fr-FR")} EUR/an`
          : "A confirmer",
      source: input.sources.operatingChargesAnnual,
      reliability:
        operatingChargesAnnual > 0
          ? reliabilityFromSource(input.sources.operatingChargesAnnual)
          : "donnees_a_confirmer",
    },
    {
      key: "strategy",
      label: "Type d'exploitation",
      value: input.rental.strategy,
      source: input.sources.strategy,
      reliability: reliabilityFromSource(input.sources.strategy),
    },
    {
      key: "durationYears",
      label: "Duree du credit",
      value:
        resolvedLoanAmount > 0 && input.financing.durationYears > 0
          ? `${roundCurrency(input.financing.durationYears)} ans`
          : "Sans credit",
      source: input.sources.durationYears,
      reliability: reliabilityFromSource(input.sources.durationYears),
    },
    {
      key: "interestRate",
      label: "Taux du credit",
      value:
        resolvedLoanAmount > 0
          ? `${(normalizeRate(input.financing.interestRate) * 100).toFixed(2)} %`
          : "Sans credit",
      source: input.sources.interestRate,
      reliability: reliabilityFromSource(input.sources.interestRate),
    },
    {
      key: "taxRegime",
      label: "Regime fiscal",
      value: input.tax.taxRegime,
      source: input.sources.taxRegime,
      reliability:
        annualTaxAmount === null ? "donnees_a_confirmer" : reliabilityFromSource(input.sources.taxRegime),
    },
  ];

  const blockingWarnings = warnings.filter((warning) => warning.blockingForVerdict);
  const hasSensitiveAssumptions = warnings.some((warning) => warning.severity !== "info");
  let reliability: ReliabilityStatus = "donnees_completes";
  if (blockingWarnings.length > 0) {
    reliability = "donnees_a_confirmer";
  } else if (assumptions.some((assumption) => assumption.source === "valeur_par_defaut")) {
    reliability = "estimation_prudente";
  } else if (assumptions.some((assumption) => assumption.source === "estimation_moteur")) {
    reliability = "estimation_marche";
  } else if (hasSensitiveAssumptions) {
    reliability = "donnees_partielles";
  }

  let verdictStatus: VerdictStatus;
  if (blockingWarnings.length > 0) {
    verdictStatus = "incomplet";
  } else if (
    totalProjectCost > 0 &&
    targetYield > 0 &&
    grossAnnualRent / totalProjectCost >= targetYield &&
    cashflowBeforeTaxAnnual >= 0
  ) {
    verdictStatus = "favorable";
  } else if (
    totalProjectCost > 0 &&
    targetYield > 0 &&
    grossAnnualRent / totalProjectCost < targetYield &&
    cashflowBeforeTaxAnnual < 0
  ) {
    verdictStatus = "insuffisant";
  } else {
    verdictStatus = "mitige";
  }

  const scenariosBase = {
    selectedRentMonthly: input.rental.selectedRentMonthly,
    vacancyRate,
    operatingChargesAnnual,
    annualDebtService,
    annualTaxAmount,
  };

  return {
    acquisition: {
      purchasePrice: roundCurrency(input.acquisition.purchasePrice),
      notaryRate,
      notaryFees: roundCurrency(notaryFees),
      works: roundCurrency(input.acquisition.works),
      acquisitionFeesOther: roundCurrency(input.acquisition.acquisitionFeesOther),
      furnishing: roundCurrency(input.acquisition.furnishing),
      totalProjectCost: roundCurrency(totalProjectCost),
    },
    financing: {
      downPayment: roundCurrency(input.financing.downPayment),
      loanAmount: roundCurrency(resolvedLoanAmount),
      interestRate: normalizeRate(input.financing.interestRate),
      insuranceRate: normalizeRate(input.financing.insuranceRate),
      durationYears: roundCurrency(input.financing.durationYears),
      monthlyPaymentExcludingInsurance: roundCurrency(monthlyPaymentExcludingInsurance),
      monthlyInsurance: roundCurrency(monthlyInsurance),
      monthlyPaymentTotal: roundCurrency(monthlyPaymentTotal),
      annualDebtService,
      usedManualMonthlyPayment: Boolean(
        input.financing.monthlyPaymentManual && input.financing.monthlyPaymentManual > 0,
      ),
    },
    exploitation: {
      strategy: input.rental.strategy,
      marketRentMonthly: roundCurrency(input.rental.marketRentMonthly),
      currentRentMonthly: roundCurrency(input.rental.currentRentMonthly),
      selectedRentMonthly: roundCurrency(input.rental.selectedRentMonthly),
      vacancyRate,
      grossAnnualRent: roundCurrency(grossAnnualRent),
      collectedAnnualRent: roundCurrency(collectedAnnualRent),
      operatingChargesAnnual: roundCurrency(operatingChargesAnnual),
      operatingChargesBreakdown: {
        condoChargesAnnualNonRecoverable: roundCurrency(input.operating.condoChargesAnnualNonRecoverable),
        propertyTaxAnnual: roundCurrency(input.operating.propertyTaxAnnual),
        pnoAnnual: roundCurrency(input.operating.pnoAnnual),
        managementAnnual: roundCurrency(input.operating.managementAnnual),
        accountingAnnual: roundCurrency(input.operating.accountingAnnual),
        maintenanceAnnual: roundCurrency(input.operating.maintenanceAnnual),
        otherAnnual: roundCurrency(input.operating.otherAnnual),
      },
      operatingResultBeforeDebtAnnual: roundCurrency(operatingResultBeforeDebtAnnual),
      cashflowBeforeTaxAnnual: roundCurrency(cashflowBeforeTaxAnnual),
      cashflowBeforeTaxMonthly: roundCurrency(cashflowBeforeTaxAnnual / 12),
      breakEvenRentMonthly:
        1 - vacancyRate <= 0
          ? 0
          : roundCurrency((annualDebtService + operatingChargesAnnual) / (12 * (1 - vacancyRate))),
      grossYieldExcludingFees:
        input.acquisition.purchasePrice > 0 ? grossAnnualRent / input.acquisition.purchasePrice : 0,
      grossYieldActInHand: totalProjectCost > 0 ? grossAnnualRent / totalProjectCost : 0,
      netOperatingYield:
        totalProjectCost > 0 ? (collectedAnnualRent - operatingChargesAnnual) / totalProjectCost : 0,
      scenarios: [
        buildScenario("prudent", scenariosBase),
        buildScenario("central", scenariosBase),
        buildScenario("optimise", scenariosBase),
      ],
    },
    taxation: {
      holdingMode: input.tax.holdingMode,
      taxRegime: input.tax.taxRegime,
      tmi: normalizeRate(input.tax.tmi),
      socialTaxRate: normalizeRate(input.tax.socialTaxRate),
      corporateTaxRate: normalizeRate(input.tax.corporateTaxRate),
      annualTaxAmount: annualTaxAmount === null ? null : roundCurrency(annualTaxAmount),
      monthlyTaxAmount: annualTaxAmount === null ? null : roundCurrency(annualTaxAmount / 12),
      cashflowAfterTaxAnnual: cashflowAfterTaxAnnual === null ? null : roundCurrency(cashflowAfterTaxAnnual),
      cashflowAfterTaxMonthly:
        cashflowAfterTaxAnnual === null ? null : roundCurrency(cashflowAfterTaxAnnual / 12),
      netNetYield,
      definitionNetNetYield:
        "Rendement net-net = (loyers encaisses - charges d'exploitation - fiscalite) / cout total projet. Il exclut le financement pour rester comparable d'un dossier a l'autre.",
      notes: input.tax.investmentAnalysis?.fiscal.notes || [],
    },
    patrimonial: {
      capitalRepaid: input.tax.investmentAnalysis?.patrimonial.capitalRepaid ?? null,
      cumulativePostTaxTreasury: input.tax.investmentAnalysis?.patrimonial.cumulativePostTaxTreasury ?? null,
      netValueCreated: input.tax.investmentAnalysis?.patrimonial.netValueCreated ?? null,
      potentialExitValue: input.tax.investmentAnalysis?.patrimonial.potentialExitValue ?? null,
      projections: input.tax.investmentAnalysis?.patrimonial.projections || [],
    },
    pricing: {
      targetGrossYieldActInHand: targetYield,
      totalCostMaxCompatible: roundCurrency(totalCostMaxCompatible),
      purchasePriceMaxCompatible: roundCurrency(purchasePriceMaxCompatible),
      displayedPriceGap: roundCurrency(purchasePriceMaxCompatible - input.acquisition.purchasePrice),
      isPriceCompatible: purchasePriceMaxCompatible >= input.acquisition.purchasePrice,
    },
    assumptions: assumptions.map((assumption) => ({
      ...assumption,
      label: `${assumption.label} · ${sourceLabel(assumption.source)}`,
    })),
    warnings,
    reliability,
    verdict: {
      status: verdictStatus,
      label: verdictLabel(verdictStatus),
      summary: verdictSummary(verdictStatus),
    },
  };
}

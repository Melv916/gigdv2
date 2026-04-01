import {
  DEFAULT_ACCOUNTING_FEES,
  DEFAULT_BUILDING_AMORTIZATION_YEARS,
  DEFAULT_FURNITURE_AMORTIZATION_YEARS,
  DEFAULT_LAND_VALUE_RATIO,
  DEFAULT_WARNING_NOTE,
} from "./constants";
import type {
  CanonicalInvestmentInput,
  ExploitationMode,
  InvestorObjective,
  OwnershipMode,
  TaxRegime,
  TaxRegimeOption,
} from "./types";

export const TAX_REGIME_OPTIONS: Record<TaxRegime, TaxRegimeOption> = {
  micro_foncier: {
    regime: "micro_foncier",
    label: "Micro-foncier",
    shortDescription: "Simple, abattement forfaitaire, peu de charges deductibles.",
    longDescription: "Regime simplifie adapte aux revenus fonciers avec peu de charges reelles.",
    vigilance: ["Non pertinent si les travaux, interets et charges sont importants."],
    complexity: "standard",
  },
  reel_foncier: {
    regime: "reel_foncier",
    label: "Reel foncier",
    shortDescription: "Plus adapte si charges, interets et travaux sont importants.",
    longDescription: "Deduit les charges reelles, la taxe fonciere, les interets et les travaux eligibles.",
    vigilance: ["Le deficit foncier et les cas complexes doivent etre verifies par un professionnel."],
    complexity: "standard",
  },
  lmnp_micro_bic: {
    regime: "lmnp_micro_bic",
    label: "LMNP micro-BIC",
    shortDescription: "Abattement forfaitaire, gestion simple, peu de deduction reelle.",
    longDescription: "Regime simplifie du meuble non professionnel avec abattement standard.",
    vigilance: ["Le CFE n'est pas modelise dans cette version."],
    complexity: "standard",
  },
  lmnp_reel: {
    regime: "lmnp_reel",
    label: "LMNP reel",
    shortDescription: "Souvent pertinent si les amortissements sont significatifs.",
    longDescription: "Deduit les charges et amortissements sur l'immeuble et le mobilier.",
    vigilance: ["Les regles d'amortissement sont simplifiees et doivent etre validees."],
    complexity: "standard",
  },
  lmp_micro_bic: {
    regime: "lmp_micro_bic",
    label: "LMP micro-BIC",
    shortDescription: "Version avancee du micro-BIC en location meublee professionnelle.",
    longDescription: "Prevue pour la phase avancee avec contraintes sociales et statutaires specifiques.",
    vigilance: ["Regime non encore implemente dans le moteur de calcul."],
    complexity: "avance",
    advancedOnly: true,
    notYetImplemented: true,
  },
  lmp_reel: {
    regime: "lmp_reel",
    label: "LMP reel",
    shortDescription: "Meuble professionnel avec logique de reel et amortissements.",
    longDescription: "Prevue pour la phase avancee avec impacts sociaux et patrimoniaux specifiques.",
    vigilance: ["Regime non encore implemente dans le moteur de calcul."],
    complexity: "avance",
    advancedOnly: true,
    notYetImplemented: true,
  },
  sci_ir: {
    regime: "sci_ir",
    label: "SCI a l'IR",
    shortDescription: "Logique de transparence fiscale proche du reel foncier.",
    longDescription: "La SCI reste fiscalement translucide et remonte le resultat aux associes.",
    vigilance: ["La repartition entre associes n'est pas modelisee dans cette version."],
    complexity: "standard",
  },
  sci_is: {
    regime: "sci_is",
    label: "SCI a l'IS",
    shortDescription: "Logique societe, fiscalite differente, attention a la revente.",
    longDescription: "La societe paie l'IS sur le resultat imposable, avec amortissements possibles.",
    vigilance: ["L'impact de la revente est simplifie et doit etre revu avec un professionnel."],
    complexity: "standard",
  },
  sci_is_holding_mere_fille: {
    regime: "sci_is_holding_mere_fille",
    label: "SCI IS + mere-fille",
    shortDescription: "Montage avance de remontee de tresorerie.",
    longDescription: "Scenario avance avec quote-part mere-fille et logique de groupe.",
    vigilance: ["Montage non encore implemente dans le moteur de calcul."],
    complexity: "avance",
    advancedOnly: true,
    notYetImplemented: true,
  },
  holding_is_remontee_dividendes: {
    regime: "holding_is_remontee_dividendes",
    label: "Holding IS / remontee de dividendes",
    shortDescription: "Remontee de cash societaire reservee au plan Avance.",
    longDescription: "Scenario de distribution et de reinvestissement a travers une holding.",
    vigilance: ["Montage non encore implemente dans le moteur de calcul."],
    complexity: "avance",
    advancedOnly: true,
    notYetImplemented: true,
  },
};

export function describeObjective(objective: InvestorObjective): string {
  switch (objective) {
    case "cashflow_immediat":
      return "Coherent si l'objectif est de maximiser le cash-flow apres impot rapidement.";
    case "patrimoine_long_terme":
      return "Coherent si la priorite est la creation de valeur nette sur la duree.";
    case "reinvestissement_societe":
      return "Coherent si la tresorerie doit etre recyclee dans une structure societaire.";
    case "optimisation_fiscale":
      return "Coherent si l'investisseur cherche a lisser la pression fiscale par le montage.";
    case "remontee_tresorerie":
      return "Coherent si l'objectif principal est la remontee de cash vers une structure mere.";
    default:
      return DEFAULT_WARNING_NOTE;
  }
}

export function buildCommonAssumptions(input: CanonicalInvestmentInput): string[] {
  return [
    `Vacance retenue: ${(input.vacancyRate * 100).toFixed(1)}%.`,
    `TMI retenue: ${(input.taxProfile.tmi * 100).toFixed(1)}%.`,
    `Prelevements sociaux retenus: ${(input.taxProfile.socialRate * 100).toFixed(1)}%.`,
    `Taux IS retenu: ${(input.taxProfile.corporateTaxRate * 100).toFixed(1)}%.`,
    `Quote-part terrain retenue: ${(input.assetProfile.landValueRatio * 100).toFixed(0)}%.`,
    `Amortissement immeuble: ${input.assetProfile.amortizationPeriods.buildingYears} ans.`,
    `Amortissement mobilier: ${input.assetProfile.amortizationPeriods.furnitureYears} ans.`,
    `Frais de comptabilite retenus: ${Math.round(input.accountingFees || DEFAULT_ACCOUNTING_FEES)} EUR/an.`,
  ];
}

export function defaultCanonicalAssumptions(exploitationMode: ExploitationMode, ownershipMode: OwnershipMode) {
  return {
    accountingFees: exploitationMode === "location_nue" && ownershipMode === "nom_propre" ? 0 : DEFAULT_ACCOUNTING_FEES,
    landValueRatio: DEFAULT_LAND_VALUE_RATIO,
    buildingYears: DEFAULT_BUILDING_AMORTIZATION_YEARS,
    furnitureYears: DEFAULT_FURNITURE_AMORTIZATION_YEARS,
  };
}

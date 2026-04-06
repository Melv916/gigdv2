import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { FileText, Home, Loader2 } from "lucide-react";
import {
  calcFraisNotaire,
  calcProjections,
  type ProjectParams,
  type Projection,
} from "@/lib/calculations";
import { getMe, importAnalysisUrl } from "@/lib/v2/api";
import { fetchRentEstimate } from "@/lib/investment/api";
import {
  computeProjectAnalysis,
  TAX_REGIME_OPTIONS,
  analyzeInvestment,
  buildCanonicalInvestmentInput,
  compareTaxRegimes,
  defaultTaxSettings,
  mapProjectStrategyToExploitationMode,
  normalizeAppPlan,
  resolveTaxCompatibilityDiagnostics,
  type AppPlan,
  type ProjectAnalysisOutput,
  type InvestmentAnalysis,
  type InvestorObjective,
  type OwnershipMode,
  type ProjectTaxSettingsInput,
  type TaxComparisonRow,
  type TaxRegime,
} from "@/lib/investment/tax";
import {
  buildMarketData,
  normalizePropertyData,
  type MarketData,
  type PropertyData,
} from "@/lib/market/cityMarketPipeline";
import { AnalysisResultsCard } from "@/features/investment/analysis/components/AnalysisResultsCard";
import { TaxSimulationCard } from "@/features/investment/analysis/components/TaxSimulationCard";
import {
  AnalysisInputCard,
  FinancialSummaryCards,
  ListingInfoCard,
  ProjectHeaderBar,
  ProjectSettingsPanel,
} from "@/features/investment/analysis/components/ProjectDetailTopSections";
import {
  cleanCityForLookup,
  fetchCityMarketReference,
  inferDepartementCode,
  isValidCityValue,
  normalizePostalCode,
  parseSelogerLocationFromUrl,
  pickRentM2,
  type CityMarketPriceRow,
} from "@/features/investment/analysis/marketLookup";
import "./project-detail-cockpit.css";

interface Project {
  id: string;
  name: string;
  objectif: string;
  strategie: string;
  financement: string;
  apport: number;
  duree_credit: number;
  taux_interet: number;
  assurance_emprunteur: number;
  frais_notaire_pct: number;
  vacance_locative: number;
  charges_non_recup: number;
  budget_travaux: number;
  croissance_valeur: number;
  croissance_loyers: number;
  inflation_charges: number;
  status: string;
  exploitation_mode?: string | null;
  ownership_mode?: OwnershipMode | null;
  default_tax_regime?: TaxRegime | null;
  investor_objective?: InvestorObjective | null;
  tmi?: number | null;
  social_rate?: number | null;
  corporate_tax_rate?: number | null;
  reduced_is_eligible?: boolean | null;
  dividend_distribution_rate?: number | null;
  mother_daughter_rate?: number | null;
  accounting_fees?: number | null;
  furniture_amount?: number | null;
  management_fees?: number | null;
  property_insurance?: number | null;
  amortization_settings_json?: {
    amortizationEnabled?: boolean;
    landValueRatio?: number;
    buildingAmortizationYears?: number;
    furnitureAmortizationYears?: number;
  } | null;
}

interface AnalysisResult {
  decision: string;
  prixAnnonce: string;
  prixMax: string;
  prixM2: string;
  prixM2Dvf: string;
  score: string;
  rendement: string;
  loyerEstime: string;
  cashFlow: string;
  seuilLoyer: string;
  occupationMin: string;
  redFlags: { flag: string; impact: string }[];
  goodPoints?: { point: string; impact: string }[];
  scriptParticulier: string[];
  scriptAgence: string[];
}

const objectifLabels: Record<string, string> = { rp: "RP", locatif: "Locatif", marchand: "Marchand" };
const strategieLabels: Record<string, string> = { "ld-nue": "LD nue", meuble: "Meublé", coloc: "Coloc", lcd: "LCD" };

function formatEur(value: number): string {
  return `${Math.round(value).toLocaleString("fr-FR")}€`;
}

function formatEUR(value: number): string {
  return `${Math.round(value).toLocaleString("fr-FR")}€`;
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`;
}

function readNum(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined) return 0;
  const raw = String(value).trim();
  if (!raw) return 0;
  const compact = raw.replace(/\s/g, "").replace(/'/g, "");
  const cleaned = compact.replace(/[^\d,.-]/g, "");
  if (!cleaned) return 0;
  let normalized = cleaned;
  if (cleaned.includes(",") && cleaned.includes(".")) {
    normalized =
      cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (cleaned.includes(",")) {
    normalized = cleaned.replace(",", ".");
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function mapStrategyToRentalStrategy(strategy: string): "nue" | "meublee" | "coloc" | "lcd" {
  if (strategy === "ld-nue") return "nue";
  if (strategy === "coloc") return "coloc";
  if (strategy === "lcd") return "lcd";
  return "meublee";
}

function buildFallbackAnalysisResult(args: {
  analysis: ProjectAnalysisOutput;
  prix: number;
  surface: number;
  dvfMedian: number | null;
}): AnalysisResult {
  const prixM2 = args.surface > 0 ? Math.round(args.prix / args.surface) : 0;
  const redFlags = args.analysis.warnings
    .filter((warning) => warning.severity !== "info")
    .map((warning) => ({
      flag: warning.message,
      impact: warning.blockingForVerdict ? "Avertissement bloquant" : "Point de vigilance",
    }));
  const goodPoints: { point: string; impact: string }[] = [];

  if (args.analysis.verdict.status === "favorable") {
    goodPoints.push({
      point: "Objectif de rendement respecté",
      impact: `${formatPct(args.analysis.exploitation.grossYieldActInHand * 100)} acte en main`,
    });
  }
  if (args.analysis.exploitation.cashflowBeforeTaxMonthly >= 0) {
    goodPoints.push({
      point: "Exploitation au moins à l'équilibre",
      impact: `${formatEUR(args.analysis.exploitation.cashflowBeforeTaxMonthly)}/mois avant impôt`,
    });
  }
  if (args.dvfMedian && prixM2 > args.dvfMedian) {
    redFlags.push({
      flag: "Prix au m² supérieur à la médiane DVF",
      impact: `+${Math.round(((prixM2 - args.dvfMedian) / args.dvfMedian) * 100)}%`,
    });
  }

  return {
    decision: args.analysis.verdict.label.toUpperCase(),
    prixAnnonce: formatEur(args.prix),
    prixMax: formatEur(args.analysis.pricing.purchasePriceMaxCompatible),
    prixM2: `${prixM2.toLocaleString("fr-FR")}€/m²`,
    prixM2Dvf: args.dvfMedian ? `${Math.round(args.dvfMedian).toLocaleString("fr-FR")}€/m²` : "n/a",
    score: "n/a",
    rendement: `${(args.analysis.exploitation.grossYieldActInHand * 100).toFixed(2)}%`,
    loyerEstime: `${Math.round(args.analysis.exploitation.selectedRentMonthly).toLocaleString("fr-FR")}€/mois`,
    cashFlow: `${Math.round(args.analysis.exploitation.cashflowBeforeTaxMonthly).toLocaleString("fr-FR")}€/mois`,
    seuilLoyer: `${Math.round(args.analysis.exploitation.breakEvenRentMonthly).toLocaleString("fr-FR")}€/mois`,
    occupationMin: "n/a",
    redFlags,
    goodPoints,
    scriptParticulier: [
      "Mon offre tient compte du coût acte en main et des charges réellement supportées.",
      "Je peux avancer rapidement si les données structurantes sont confirmées.",
    ],
    scriptAgence: [
      "Je me base sur un coût global complet, un loyer crédible et un cash-flow prudent.",
      "Je peux avancer si le prix s'aligne avec le rendement cible acte en main.",
    ],
  };
}

function inferTypology(surface: number, pieces?: number | null): "all" | "t1t2" | "t3plus" {
  if (typeof pieces === "number" && pieces > 0) return pieces <= 2 ? "t1t2" : "t3plus";
  if (surface > 0) return surface <= 45 ? "t1t2" : "t3plus";
  return "all";
}

function normalizeOwnershipMode(mode: OwnershipMode | null | undefined): OwnershipMode {
  if (mode === "holding" || mode === "sci_avec_holding") return "sci";
  return mode || "nom_propre";
}

function sanitizeTaxSettings(input: ProjectTaxSettingsInput): ProjectTaxSettingsInput {
  return {
    ...input,
    ownershipMode: normalizeOwnershipMode(input.ownershipMode),
  };
}

function hydrateTaxSettings(project: Project | null): ProjectTaxSettingsInput {
  const exploitationMode = mapProjectStrategyToExploitationMode(project?.strategie || "meuble");
  const defaults = defaultTaxSettings(exploitationMode);
  const amortization = project?.amortization_settings_json || {};

  return sanitizeTaxSettings({
    ...defaults,
    exploitationMode: (project?.exploitation_mode as ProjectTaxSettingsInput["exploitationMode"]) || defaults.exploitationMode,
    ownershipMode: normalizeOwnershipMode(project?.ownership_mode || defaults.ownershipMode),
    taxRegime: project?.default_tax_regime || defaults.taxRegime,
    investorObjective: project?.investor_objective || defaults.investorObjective,
    tmi: Number(project?.tmi ?? defaults.tmi),
    socialRate: Number(project?.social_rate ?? defaults.socialRate),
    corporateTaxRate: Number(project?.corporate_tax_rate ?? defaults.corporateTaxRate),
    reducedCorporateTaxEligible:
      typeof project?.reduced_is_eligible === "boolean"
        ? project.reduced_is_eligible
        : defaults.reducedCorporateTaxEligible,
    dividendDistributionRate: Number(project?.dividend_distribution_rate ?? defaults.dividendDistributionRate),
    motherDaughterRate: Number(project?.mother_daughter_rate ?? defaults.motherDaughterRate),
    accountingFees: Number(project?.accounting_fees ?? defaults.accountingFees),
    furnitureAmount: Number(project?.furniture_amount ?? defaults.furnitureAmount),
    managementFees: Number(project?.management_fees ?? defaults.managementFees),
    insurance: Number(project?.property_insurance ?? defaults.insurance),
    amortizationEnabled:
      typeof amortization?.amortizationEnabled === "boolean"
        ? amortization.amortizationEnabled
        : defaults.amortizationEnabled,
    landValueRatio: Number(amortization?.landValueRatio ?? defaults.landValueRatio),
    buildingAmortizationYears: Number(
      amortization?.buildingAmortizationYears ?? defaults.buildingAmortizationYears,
    ),
    furnitureAmortizationYears: Number(
      amortization?.furnitureAmortizationYears ?? defaults.furnitureAmortizationYears,
    ),
  });
}

type ProjectDraft = {
  url: string;
  manualPrix: number;
  manualSurface: number;
  manualCity: string;
  travaux: number;
  chargesMensuelles: number;
  taxeFonciere: number;
  loyerEstime: number;
  autresCouts: number;
  adr: number;
  occupationCible: number;
  updatedAt: string;
};

function getProjectDraftStorageKey(userId: string, projectId: string) {
  return `gigd:project-draft:${userId}:${projectId}`;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Analysis state
  const [url, setUrl] = useState("");
  const [manualPrix, setManualPrix] = useState<number>(0);
  const [manualSurface, setManualSurface] = useState<number>(0);
  const [manualCity, setManualCity] = useState("");
  const [travaux, setTravaux] = useState<number>(0);
  const [chargesMensuelles, setChargesMensuelles] = useState<number>(0);
  const [taxeFonciere, setTaxeFonciere] = useState<number>(0);
  const [loyerEstime, setLoyerEstime] = useState<number>(0);
  const [autresCouts, setAutresCouts] = useState<number>(0);
  const [adr, setAdr] = useState<number>(0);
  const [occupationCible, setOccupationCible] = useState<number>(70);

  const [listing, setListing] = useState<any>(null);
  const [aiResult, setAiResult] = useState<AnalysisResult | null>(null);
  const [analysisStep, setAnalysisStep] = useState<"idle" | "scraping" | "analyzing" | "done">("idle");
  const [marketStatus, setMarketStatus] = useState<"ok" | "processing" | "failed" | "indisponible">("indisponible");
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [plan, setPlan] = useState<AppPlan>("free");
  const [taxSettings, setTaxSettings] = useState<ProjectTaxSettingsInput>(
    defaultTaxSettings(mapProjectStrategyToExploitationMode("meuble")),
  );
  const [taxAnalysis, setTaxAnalysis] = useState<InvestmentAnalysis | null>(null);
  const [taxComparisonRows, setTaxComparisonRows] = useState<TaxComparisonRow[]>([]);
  const [comparisonRegimes, setComparisonRegimes] = useState<TaxRegime[]>([]);

  // Projections
  const [projections, setProjections] = useState<Projection[]>([]);

  // Saved analyses history
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);
  const requestedAnalysisId = searchParams.get("analysis");
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const taxSettingsTouchedRef = useRef(false);

  const applyHydratedTaxSettings = (nextSettings: ProjectTaxSettingsInput) => {
    taxSettingsTouchedRef.current = false;
    setTaxSettings(sanitizeTaxSettings(nextSettings));
  };

  const loadSavedAnalysis = (analysis: any) => {
    const result = analysis.analysis_result as AnalysisResult | null;
    const savedListing = analysis.listing_data as any;
    const savedTaxSettings = analysis.tax_settings_json
      ? sanitizeTaxSettings(analysis.tax_settings_json as ProjectTaxSettingsInput)
      : null;

    if (savedListing) setListing(savedListing);
    if (savedTaxSettings) {
      applyHydratedTaxSettings(savedTaxSettings);
    }
    if (analysis.tax_analysis_json) {
      setTaxAnalysis(analysis.tax_analysis_json as InvestmentAnalysis);
    } else {
      setTaxAnalysis(null);
    }
    if (analysis.tax_comparison_json) {
      setTaxComparisonRows(analysis.tax_comparison_json as TaxComparisonRow[]);
      setComparisonRegimes(
        ((analysis.tax_comparison_json as TaxComparisonRow[]) || [])
          .map((row) => row.regime)
          .filter((regime) => regime !== savedTaxSettings?.taxRegime)
          .slice(0, 3),
      );
    } else {
      setTaxComparisonRows([]);
      setComparisonRegimes([]);
    }
    if (result) {
      setAiResult(result);
      setAnalysisStep("done");
      setMarketStatus("indisponible");
      const loyerRaw = String(result.loyerEstime || "0");
      const loyerMatch = loyerRaw.match(/(\d[\d\s]*)/);
      const loyerParsed = loyerMatch ? parseFloat(loyerMatch[1].replace(/\s/g, "")) : 0;
      const lp = Number(analysis.loyer_estime) || loyerParsed || 0;
      if (params) {
        setProjections(
          calcProjections(
            params,
            Number(analysis.prix),
            lp,
            Number(analysis.charges_mensuelles),
            Number(analysis.taxe_fonciere),
            Number(analysis.travaux_estimes),
            Number(analysis.autres_couts),
          ),
        );
      }
    }
    setUrl(analysis.url || "");
    setTravaux(Number(analysis.travaux_estimes) || 0);
    setChargesMensuelles(Number(analysis.charges_mensuelles) || 0);
    setTaxeFonciere(Number(analysis.taxe_fonciere) || 0);
    setLoyerEstime(Number(analysis.loyer_estime) || 0);
    setAutresCouts(Number(analysis.autres_couts) || 0);
  };

  const clearDraft = () => {
    if (!user || !id) return;
    localStorage.removeItem(getProjectDraftStorageKey(user.id, id));
    setUrl("");
    setManualPrix(0);
    setManualSurface(0);
    setManualCity("");
    setTravaux(0);
    setChargesMensuelles(0);
    setTaxeFonciere(0);
    setLoyerEstime(0);
    setAutresCouts(0);
    setAdr(0);
    setOccupationCible(70);
    setDraftMessage("Brouillon effacé pour ce projet.");
  };

  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          const typedProject = data as unknown as Project;
          setProject(typedProject);
          if (!taxSettingsTouchedRef.current) {
            applyHydratedTaxSettings(hydrateTaxSettings(typedProject));
          }
        }
        setLoading(false);
      });
  }, [user, id]);

  useEffect(() => {
    if (!user) return;
    getMe()
      .then((data) => setPlan(normalizeAppPlan(data?.plan)))
      .catch(() => setPlan("free"));
  }, [user]);

  // Load saved analyses
  useEffect(() => {
    if (!user || !id) return;
    setLoadingAnalyses(true);
    supabase
      .from("project_analyses")
      .select("*")
      .eq("project_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSavedAnalyses(data || []);
        setLoadingAnalyses(false);
      });
  }, [user, id]);

  useEffect(() => {
    setDraftHydrated(false);
    setDraftMessage("");
    taxSettingsTouchedRef.current = false;
  }, [id, requestedAnalysisId, user?.id]);

  useEffect(() => {
    if (!user || !id || requestedAnalysisId || draftHydrated) return;
    const rawDraft = localStorage.getItem(getProjectDraftStorageKey(user.id, id));
    if (!rawDraft) {
      setDraftHydrated(true);
      return;
    }

    try {
      const draft = JSON.parse(rawDraft) as Partial<ProjectDraft>;
      setUrl(typeof draft.url === "string" ? draft.url : "");
      setManualPrix(Number(draft.manualPrix) || 0);
      setManualSurface(Number(draft.manualSurface) || 0);
      setManualCity(typeof draft.manualCity === "string" ? draft.manualCity : "");
      setTravaux(Number(draft.travaux) || 0);
      setChargesMensuelles(Number(draft.chargesMensuelles) || 0);
      setTaxeFonciere(Number(draft.taxeFonciere) || 0);
      setLoyerEstime(Number(draft.loyerEstime) || 0);
      setAutresCouts(Number(draft.autresCouts) || 0);
      setAdr(Number(draft.adr) || 0);
      setOccupationCible(Number(draft.occupationCible) || 70);

      const formattedDate =
        typeof draft.updatedAt === "string" && draft.updatedAt
          ? new Date(draft.updatedAt).toLocaleString("fr-FR")
          : null;
      setDraftMessage(
        formattedDate
          ? `Brouillon restauré automatiquement, dernière sauvegarde le ${formattedDate}.`
          : "Brouillon restauré automatiquement pour ce projet.",
      );
    } catch {
      localStorage.removeItem(getProjectDraftStorageKey(user.id, id));
    } finally {
      setDraftHydrated(true);
    }
  }, [draftHydrated, id, requestedAnalysisId, user]);

  useEffect(() => {
    if (!user || !id || !draftHydrated || requestedAnalysisId) return;
    const hasMeaningfulInput = Boolean(
      url ||
        manualPrix ||
        manualSurface ||
        manualCity ||
        travaux ||
        chargesMensuelles ||
        taxeFonciere ||
        loyerEstime ||
        autresCouts ||
        adr ||
        (occupationCible && occupationCible !== 70),
    );

    if (!hasMeaningfulInput) {
      localStorage.removeItem(getProjectDraftStorageKey(user.id, id));
      return;
    }

    const draft: ProjectDraft = {
      url,
      manualPrix,
      manualSurface,
      manualCity,
      travaux,
      chargesMensuelles,
      taxeFonciere,
      loyerEstime,
      autresCouts,
      adr,
      occupationCible,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(getProjectDraftStorageKey(user.id, id), JSON.stringify(draft));
    if (!draftMessage) {
      setDraftMessage("Brouillon sauvegardé automatiquement dans ce projet.");
    }
  }, [
    adr,
    autresCouts,
    chargesMensuelles,
    draftHydrated,
    draftMessage,
    id,
    loyerEstime,
    manualCity,
    manualPrix,
    manualSurface,
    occupationCible,
    requestedAnalysisId,
    taxeFonciere,
    travaux,
    url,
    user,
  ]);

  useEffect(() => {
    if (!requestedAnalysisId || savedAnalyses.length === 0) return;
    const requestedAnalysis = savedAnalyses.find((analysis) => analysis.id === requestedAnalysisId);
    if (requestedAnalysis) {
      loadSavedAnalysis(requestedAnalysis);
    }
  }, [requestedAnalysisId, savedAnalyses]);

  const params: ProjectParams | null = useMemo(
    () =>
      project
        ? {
            financement: project.financement,
            apport: Number(project.apport),
            duree_credit: project.duree_credit,
            taux_interet: Number(project.taux_interet),
            assurance_emprunteur: Number(project.assurance_emprunteur),
            frais_notaire_pct: Number(project.frais_notaire_pct),
            vacance_locative: project.vacance_locative,
            charges_non_recup: Number(project.charges_non_recup),
            budget_travaux: Number(project.budget_travaux),
            croissance_valeur: Number(project.croissance_valeur),
            croissance_loyers: Number(project.croissance_loyers),
            inflation_charges: Number(project.inflation_charges),
          }
        : null,
    [project],
  );

  const buildProjectAnalysisInput = (args: {
    price: number;
    selectedRentMonthly: number;
    marketRentMonthly: number;
    annualTaxAmount?: number | null;
    investmentAnalysis?: InvestmentAnalysis | null;
  }) => {
    if (!project || !params) return null;

    const recurringOwnerChargesAnnual = Math.max(0, chargesMensuelles) * 12;
    const condoChargesAnnualNonRecoverable = Math.max(0, Number(params.charges_non_recup)) * 12;
    const propertyTaxSource = taxeFonciere > 0 ? "saisie_utilisateur" : "valeur_par_defaut";
    const operatingChargesSource =
      recurringOwnerChargesAnnual > 0 || condoChargesAnnualNonRecoverable > 0
        ? "saisie_utilisateur"
        : "valeur_par_defaut";
    const purchasePriceSource = listing?.prix ? "issue_annonce" : manualPrix > 0 ? "saisie_utilisateur" : "valeur_par_defaut";
    const selectedRentSource =
      project.strategie === "lcd"
        ? adr > 0
          ? "saisie_utilisateur"
          : "valeur_par_defaut"
        : args.marketRentMonthly > 0 && Math.abs(args.marketRentMonthly - args.selectedRentMonthly) <= 1
          ? "estimation_moteur"
          : args.selectedRentMonthly > 0
            ? "saisie_utilisateur"
            : "valeur_par_defaut";

    return {
      acquisition: {
        purchasePrice: args.price,
        notaryRate: Number(params.frais_notaire_pct) / 100,
        works: travaux,
        acquisitionFeesOther: autresCouts,
        furnishing: taxSettings.furnitureAmount,
      },
      financing: {
        downPayment: params.financement === "credit" ? Math.max(0, Number(params.apport)) : 0,
        interestRate: Number(params.taux_interet) / 100,
        insuranceRate: Number(params.assurance_emprunteur) / 100,
        durationYears: params.financement === "credit" ? Number(params.duree_credit) : 0,
      },
      rental: {
        strategy: mapStrategyToRentalStrategy(project.strategie),
        marketRentMonthly: args.marketRentMonthly,
        currentRentMonthly: 0,
        selectedRentMonthly: args.selectedRentMonthly,
        vacancyRate: Math.max(0, Number(params.vacance_locative) / 12),
      },
      operating: {
        condoChargesAnnualNonRecoverable,
        propertyTaxAnnual: Math.max(0, taxeFonciere),
        pnoAnnual: Math.max(0, taxSettings.insurance),
        managementAnnual: Math.max(0, taxSettings.managementFees),
        accountingAnnual: Math.max(0, taxSettings.accountingFees),
        maintenanceAnnual: 0,
        otherAnnual: recurringOwnerChargesAnnual,
      },
      tax: {
        holdingMode: taxSettings.ownershipMode,
        taxRegime: taxSettings.taxRegime,
        tmi: taxSettings.tmi,
        socialTaxRate: taxSettings.socialRate,
        corporateTaxRate: taxSettings.corporateTaxRate,
        annualTaxAmount: args.annualTaxAmount ?? null,
        investmentAnalysis: args.investmentAnalysis ?? null,
      },
      sources: {
        purchasePrice: purchasePriceSource,
        selectedRentMonthly: selectedRentSource,
        vacancyRate: "saisie_utilisateur",
        propertyTaxAnnual: propertyTaxSource,
        condoChargesAnnualNonRecoverable:
          condoChargesAnnualNonRecoverable > 0 ? "saisie_utilisateur" : "valeur_par_defaut",
        operatingChargesAnnual: operatingChargesSource,
        strategy: "saisie_utilisateur",
        interestRate: params.financement === "credit" ? "saisie_utilisateur" : "valeur_par_defaut",
        durationYears: params.financement === "credit" ? "saisie_utilisateur" : "valeur_par_defaut",
        taxRegime: "saisie_utilisateur",
      },
      targetGrossYieldActInHand: 0.08,
    } as const;
  };

  const updateTaxSettings = <K extends keyof ProjectTaxSettingsInput>(
    key: K,
    value: ProjectTaxSettingsInput[K],
  ) => {
    taxSettingsTouchedRef.current = true;
    setTaxSettings((current) => sanitizeTaxSettings({ ...current, [key]: value } as ProjectTaxSettingsInput));
  };

  const taxDiagnostics = useMemo(
    () =>
      resolveTaxCompatibilityDiagnostics(
        plan,
        taxSettings.ownershipMode,
        taxSettings.exploitationMode,
      ),
    [plan, taxSettings.ownershipMode, taxSettings.exploitationMode],
  );

  const availableRegimeOptions = useMemo(() => {
    const hiddenNotImplemented: string[] = [];
    const options = taxDiagnostics.regimes
      .map((regime) => TAX_REGIME_OPTIONS[regime])
      .filter((option) => {
        if (!option) return false;
        if (option.notYetImplemented) {
          hiddenNotImplemented.push(option.label);
          return false;
        }
        return true;
      });
    return {
      options,
      warnings:
        hiddenNotImplemented.length > 0
          ? [`Regimes avances detectes mais non encore implementes: ${hiddenNotImplemented.join(", ")}.`]
          : [],
    };
  }, [taxDiagnostics.regimes]);

  const taxUiWarnings = useMemo(
    () => [...taxDiagnostics.warnings, ...availableRegimeOptions.warnings],
    [availableRegimeOptions.warnings, taxDiagnostics.warnings],
  );

  const selectedRegimeOption =
    availableRegimeOptions.options.find((option) => option.regime === taxSettings.taxRegime) || null;

  useEffect(() => {
    const availableRegimes = availableRegimeOptions.options.map((option) => option.regime);
    if (availableRegimes.length === 0) {
      setComparisonRegimes([]);
      return;
    }

    if (!availableRegimes.includes(taxSettings.taxRegime)) {
      setTaxSettings((current) => sanitizeTaxSettings({ ...current, taxRegime: availableRegimes[0] }));
    }

    setComparisonRegimes((current) =>
      current.filter((regime) => regime !== taxSettings.taxRegime && availableRegimes.includes(regime)).slice(0, 3),
    );
  }, [availableRegimeOptions.options, taxSettings.taxRegime]);

  const handleAnalyse = async () => {
    if (!project || !params) return;
    setAnalysisStep("scraping");
    setAiResult(null);
    setMarketStatus("indisponible");
    setMarketData(null);
    setPropertyData(null);
    setListing(null);
    setProjections([]);
    setTaxAnalysis(null);
    setTaxComparisonRows([]);

    try {
      let listingData: any = null;
      let marketSummary: any = null;
      let importErrorMessage: string | null = null;
      let prix = manualPrix;
      let surface = manualSurface;
      let cityMarketRef: CityMarketPriceRow | null = null;
      let normalizedProperty: PropertyData | null = null;

      if (url) {
        try {
          const imported = await importAnalysisUrl(url);
          listingData = imported?.listing || null;
          marketSummary = imported?.dvfSummary || null;
        } catch (e: any) {
          listingData = null;
          marketSummary = null;
          importErrorMessage = String(e?.message || "").trim() || "Import annonce indisponible";
        }
        if (listingData) {
          normalizedProperty = normalizePropertyData(listingData as Record<string, unknown>);
          const inferredFromUrl = parseSelogerLocationFromUrl(url);
          const listingCityCandidate = cleanCityForLookup(String(normalizedProperty.city || listingData?.ville || ""));
          const inferredCityCandidate = cleanCityForLookup(String(inferredFromUrl.city || ""));
          const cleanedCity = isValidCityValue(listingCityCandidate)
            ? listingCityCandidate
            : inferredCityCandidate;
          prix = normalizedProperty.purchasePrice || prix;
          surface = normalizedProperty.surface || surface;
          listingData = {
            ...listingData,
            prix: normalizedProperty.purchasePrice || readNum(listingData?.prix) || listingData?.prix,
            surface: normalizedProperty.surface || readNum(listingData?.surface) || listingData?.surface,
            pieces: readNum(listingData?.pieces) || listingData?.pieces,
            ville: cleanedCity,
            codePostal: normalizedProperty.postalCode || listingData?.codePostal,
            insee: normalizedProperty.inseeCode || listingData?.insee,
            adresse: normalizedProperty.address || listingData?.adresse,
            departementCode: (listingData as any)?.departementCode || inferredFromUrl.departementCode || null,
          };
          setListing(listingData);
        }
      }

      const listingCodePostal = normalizePostalCode(String(listingData?.codePostal || "").trim());
      const inferredFromUrl = parseSelogerLocationFromUrl(url);
      const isSelogerUrl = /seloger\.com/i.test(String(url || ""));
      const listingCityRaw = cleanCityForLookup(String(listingData?.ville || "").trim());
      const manualCityClean = cleanCityForLookup(String(manualCity || "").trim());
      const inferredCityClean = cleanCityForLookup(String(inferredFromUrl.city || "").trim());
      const listingCity = isValidCityValue(listingCityRaw) ? listingCityRaw : "";
      const cityForLookup =
        isSelogerUrl && isValidCityValue(inferredCityClean)
          ? inferredCityClean
          : (listingCity || (isValidCityValue(manualCityClean) ? manualCityClean : "") || inferredCityClean || "");
      const inferredDeptFromUrl = isSelogerUrl ? String(inferredFromUrl.departementCode || "").trim() : "";
      const listingInseeRaw = String((listingData as any)?.insee || "").trim();
      const listingInseeDept = inferDepartementCode({ insee: listingInseeRaw });
      const postalCodeForLookup =
        inferredDeptFromUrl && listingCodePostal && !listingCodePostal.startsWith(inferredDeptFromUrl)
          ? ""
          : listingCodePostal;
      const inseeForLookup =
        inferredDeptFromUrl && listingInseeDept && listingInseeDept !== inferredDeptFromUrl
          ? ""
          : listingInseeRaw;
      const listingDepartementCode = inferDepartementCode({
        postalCode: postalCodeForLookup,
        insee: inseeForLookup,
        departementCode: String((listingData as any)?.departementCode || inferredDeptFromUrl || "").trim(),
      });
      cityMarketRef = await fetchCityMarketReference({
        insee: inseeForLookup,
        ville: cityForLookup,
        postalCode: postalCodeForLookup,
        departementCode: listingDepartementCode,
      });
      console.log("[analysis] city_market_prices lookup", {
        insee: inseeForLookup || null,
        ville: cityForLookup || null,
        postalCode: postalCodeForLookup || null,
        departementCode: listingDepartementCode || null,
        found: Boolean(cityMarketRef),
      });

      if (!normalizedProperty) {
        normalizedProperty = normalizePropertyData({
          prix,
          surface,
          ville: listingData?.ville || cityForLookup || null,
          codePostal: listingCodePostal || null,
          insee: (listingData as any)?.insee || null,
          adresse: listingData?.adresse || null,
          pieces: listingData?.pieces || null,
        });
      }

      const type = /maison/i.test(String(listingData?.typeLocal || "")) ? "house" : "apartment";
      const typology = inferTypology(Number(surface), Number(listingData?.pieces || 0) || undefined);
      const normalizedMarket = buildMarketData(cityMarketRef as Record<string, unknown> | null, { type, typology });
      setPropertyData(normalizedProperty);
      setMarketData(normalizedMarket);
      setMarketStatus(cityMarketRef ? "ok" : "indisponible");
      marketSummary = {
        ...(marketSummary || {}),
        marketPricePerSqm: normalizedMarket.marketPricePerSqm,
        marketRentPerSqm: normalizedMarket.marketRentPerSqm,
        scoreFiabilite: normalizedMarket.scoreFiabilite,
        sourcePrixM2: normalizedMarket.sourcePrixM2,
        sourceLoyerM2: normalizedMarket.sourceLoyerM2,
      };

      console.log("[analysis] property data (SeLoger)", normalizedProperty);
      console.log("[analysis] market data (city_market_prices)", normalizedMarket);

      if (!prix || !surface) {
        const hasUrl = Boolean(url);
        const missing: string[] = [];
        if (!prix) missing.push("prix");
        if (!surface) missing.push("surface");
        toast({
          title: hasUrl ? "Données annonce incomplètes" : "Données requises",
          description: hasUrl
            ? (importErrorMessage || `${missing.join(" et ")} manquant(s) sur l'annonce importée.`)
            : "Renseigne le prix et la surface.",
          variant: "destructive",
        });
        setAnalysisStep("idle");
        return;
      }

      setAnalysisStep("analyzing");

      const rentM2FromCityTable =
        type === "house"
          ? Number(
              cityMarketRef?.rent_m2_house ||
              cityMarketRef?.rent_m2_app_all ||
              normalizedMarket.marketRentPerSqm ||
              pickRentM2(cityMarketRef, type, typology) ||
              0,
            )
          : Number(
              cityMarketRef?.rent_m2_app_all ||
              normalizedMarket.marketRentPerSqm ||
              pickRentM2(cityMarketRef, type, typology) ||
              0,
            );
      const marketRentMonthly =
        rentM2FromCityTable > 0 && surface > 0 ? Math.round(rentM2FromCityTable * Number(surface)) : 0;
      console.log("[analysis] market rent computation", {
        rentM2FromCityTable,
        surface,
        marketRentMonthly,
      });

      const lcdRevenueMonthly =
        project.strategie === "lcd" && adr > 0
          ? Math.round(adr * 30 * (Math.max(0, occupationCible) / 100))
          : 0;

      // Always prioritize the explicit LCD hypothesis, then market rent, then manual rent.
      let loyerPourCalc =
        project.strategie === "lcd"
          ? lcdRevenueMonthly
          : marketRentMonthly > 0
            ? marketRentMonthly
            : (loyerEstime || 0);
      if (project.strategie !== "lcd" && marketRentMonthly > 0) {
        setLoyerEstime(marketRentMonthly);
      }

      if (project.strategie !== "lcd" && !loyerPourCalc && Number(surface) > 0) {
        try {
          const rent = await fetchRentEstimate({
            insee: String((listingData as any)?.insee || "").trim() || undefined,
            city: cityForLookup || undefined,
            departement_code: listingDepartementCode || undefined,
            type,
            typology,
            surface: Number(surface),
          });
          const estimate = Number((rent as any)?.loyer_total_estime || 0);
          if (Number.isFinite(estimate) && estimate > 0) {
            loyerPourCalc = Math.round(estimate);
            setLoyerEstime(loyerPourCalc);
          }
        } catch {
          // Server-side lookup failed; handled by strict validation below.
        }
      }

      if (!loyerPourCalc) {
        toast({
          title: project.strategie === "lcd" ? "ADR requis" : "Loyer requis",
          description:
            project.strategie === "lcd"
              ? "Renseigne un ADR et une occupation cible réalistes pour lancer l'analyse LCD."
              : "Loyer de marché introuvable. Renseigne un loyer estimé réel pour lancer l'analyse.",
          variant: "destructive",
        });
        setAnalysisStep("idle");
        return;
      }

      const baseProjectAnalysisInput = buildProjectAnalysisInput({
        price: prix,
        selectedRentMonthly: loyerPourCalc,
        marketRentMonthly: project.strategie === "lcd" ? 0 : marketRentMonthly,
      });
      if (!baseProjectAnalysisInput) {
        setAnalysisStep("idle");
        return;
      }
      const baseProjectAnalysis = computeProjectAnalysis(baseProjectAnalysisInput);

      // Calculate projections locally
      const projs = calcProjections(params, prix, loyerPourCalc, chargesMensuelles, taxeFonciere, travaux, autresCouts);
      setProjections(projs);
      let taxAnalysisForSave: InvestmentAnalysis | null = null;
      let taxComparisonForSave: TaxComparisonRow[] = [];
      let canonicalInputForSave: ReturnType<typeof buildCanonicalInvestmentInput> | null = null;

      if (!taxDiagnostics.paywallRequired && availableRegimeOptions.options.length > 0) {
        try {
          canonicalInputForSave = buildCanonicalInvestmentInput({
            price: prix,
            notaryFees: baseProjectAnalysis.acquisition.notaryFees,
            worksAmount: travaux,
            annualRent: loyerPourCalc * 12,
            annualCharges:
              baseProjectAnalysisInput.operating.condoChargesAnnualNonRecoverable +
              baseProjectAnalysisInput.operating.maintenanceAnnual +
              baseProjectAnalysisInput.operating.otherAnnual,
            propertyTax: taxeFonciere,
            vacancyRate: baseProjectAnalysis.exploitation.vacancyRate,
            loanAmount: baseProjectAnalysis.financing.loanAmount,
            annualDebtService: baseProjectAnalysis.financing.annualDebtService,
            annualBorrowerInsurance: baseProjectAnalysis.financing.monthlyInsurance * 12,
            interestRate: baseProjectAnalysis.financing.interestRate,
            durationYears: baseProjectAnalysis.financing.durationYears,
            annualRentGrowthRate: params.croissance_loyers / 100,
            annualValueGrowthRate: params.croissance_valeur / 100,
            annualChargeGrowthRate: params.inflation_charges / 100,
            taxSettings,
          });
          taxAnalysisForSave = analyzeInvestment(canonicalInputForSave);
          const regimesToCompare = [
            taxSettings.taxRegime,
            ...comparisonRegimes.filter((regime) =>
              availableRegimeOptions.options.some((option) => option.regime === regime),
            ),
          ].slice(0, 4);
          taxComparisonForSave = compareTaxRegimes(canonicalInputForSave, Array.from(new Set(regimesToCompare)));
          setTaxAnalysis(taxAnalysisForSave);
          setTaxComparisonRows(taxComparisonForSave);
        } catch (taxError) {
          console.warn("[analysis] tax simulation failed", taxError);
          setTaxAnalysis(null);
          setTaxComparisonRows([]);
        }
      } else {
        setTaxAnalysis(null);
        setTaxComparisonRows([]);
      }
      console.log("[analysis] final payload for calculation", {
        propertyData: normalizedProperty,
        marketData: normalizedMarket,
        calcInputs: {
          prix,
          surface,
          loyerPourCalc,
          annualDebtService: baseProjectAnalysis.financing.annualDebtService,
          coutTotalProjet: baseProjectAnalysis.acquisition.totalProjectCost,
        },
      });

      const annualTaxAmountForSave = taxAnalysisForSave
        ? taxAnalysisForSave.fiscal.taxAmount +
          taxAnalysisForSave.fiscal.socialContributions +
          taxAnalysisForSave.fiscal.dividendsTax
        : null;
      const finalProjectAnalysis = computeProjectAnalysis({
        ...baseProjectAnalysisInput,
        tax: {
          ...baseProjectAnalysisInput.tax,
          annualTaxAmount: annualTaxAmountForSave,
          investmentAnalysis: taxAnalysisForSave,
        },
      });
      const finalFallbackAnalysis = buildFallbackAnalysisResult({
        analysis: finalProjectAnalysis,
        prix,
        surface,
        dvfMedian: Number(normalizedMarket.marketPricePerSqm || 0) || null,
      });
      setAiResult(finalFallbackAnalysis);

      // Save analysis to database
      if (user && project) {
        const analysisRecord = {
          project_id: project.id,
          user_id: user.id,
          url: url || null,
          prix,
          surface,
          pieces: listingData?.pieces || null,
          type_local: listingData?.typeLocal || null,
          code_postal: listingData?.codePostal || null,
          ville: listingData?.ville || manualCity || null,
          dpe: listingData?.dpe || null,
          charges_mensuelles: chargesMensuelles,
          taxe_fonciere: taxeFonciere,
          travaux_estimes: travaux,
          loyer_estime: loyerPourCalc,
          adr: adr || null,
          occupation_cible: occupationCible || null,
          autres_couts: autresCouts,
          exploitation_mode: taxSettings.exploitationMode,
          ownership_mode: taxSettings.ownershipMode,
          tax_regime: taxSettings.taxRegime,
          investor_objective: taxSettings.investorObjective,
          tmi: taxSettings.tmi,
          social_rate: taxSettings.socialRate,
          corporate_tax_rate: taxSettings.corporateTaxRate,
          reduced_is_eligible: taxSettings.reducedCorporateTaxEligible,
          dividend_distribution_rate: taxSettings.dividendDistributionRate,
          mother_daughter_rate: taxSettings.motherDaughterRate,
          amortization_settings_json: {
            amortizationEnabled: taxSettings.amortizationEnabled,
            landValueRatio: taxSettings.landValueRatio,
            buildingAmortizationYears: taxSettings.buildingAmortizationYears,
            furnitureAmortizationYears: taxSettings.furnitureAmortizationYears,
          },
          listing_data: listingData,
          dvf_summary: marketSummary,
          analysis_result: finalFallbackAnalysis,
          tax_settings_json: taxSettings,
          tax_analysis_json: taxAnalysisForSave,
          tax_comparison_json: taxComparisonForSave,
          canonical_input_json: canonicalInputForSave,
          economic_result_json: taxAnalysisForSave?.economic || null,
          patrimonial_result_json: taxAnalysisForSave?.patrimonial || null,
          core_calc_version: taxAnalysisForSave?.versions.coreCalcVersion || null,
          tax_calc_version: taxAnalysisForSave?.versions.taxCalcVersion || null,
        };
        const { data: saved } = await supabase.from("project_analyses").insert(analysisRecord as any).select().single();
        if (saved) {
          setSavedAnalyses((prev) => [saved, ...prev]);
          if (taxAnalysisForSave) {
            await supabase.from("analysis_tax_results").upsert(
              taxComparisonForSave.map((row) => ({
                analysis_id: saved.id,
                regime: row.regime,
                result_json: row,
                assumptions_json:
                  row.regime === taxAnalysisForSave?.fiscal.regime ? taxAnalysisForSave.fiscal.assumptions : [],
                warnings_json:
                  row.regime === taxAnalysisForSave?.fiscal.regime ? taxAnalysisForSave.fiscal.warnings : row.warnings,
              })),
              { onConflict: "analysis_id,regime" },
            );
            await supabase.from("analysis_tax_comparisons").upsert({
              analysis_id: saved.id,
              compared_regimes_json: taxComparisonForSave.map((row) => row.regime),
              comparison_table_json: taxComparisonForSave,
            });
          }
        }
        await supabase
          .from("projects")
          .update({
            exploitation_mode: taxSettings.exploitationMode,
            ownership_mode: taxSettings.ownershipMode,
            default_tax_regime: taxSettings.taxRegime,
            investor_objective: taxSettings.investorObjective,
            tmi: taxSettings.tmi,
            social_rate: taxSettings.socialRate,
            corporate_tax_rate: taxSettings.corporateTaxRate,
            reduced_is_eligible: taxSettings.reducedCorporateTaxEligible,
            dividend_distribution_rate: taxSettings.dividendDistributionRate,
            mother_daughter_rate: taxSettings.motherDaughterRate,
            accounting_fees: taxSettings.accountingFees,
            furniture_amount: taxSettings.furnitureAmount,
            management_fees: taxSettings.managementFees,
            property_insurance: taxSettings.insurance,
            amortization_settings_json: {
              amortizationEnabled: taxSettings.amortizationEnabled,
              landValueRatio: taxSettings.landValueRatio,
              buildingAmortizationYears: taxSettings.buildingAmortizationYears,
              furnitureAmortizationYears: taxSettings.furnitureAmortizationYears,
            },
          } as any)
          .eq("id", project.id);
      }

      setAnalysisStep("done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'analyse";
      toast({ title: "Erreur", description: message, variant: "destructive" });
      setAnalysisStep("idle");
    }
  };

  const handleSaveSettings = async () => {
    if (!project || !user) return;
    const { error } = await supabase
      .from("projects")
      .update({
        frais_notaire_pct: project.frais_notaire_pct,
        vacance_locative: project.vacance_locative,
        charges_non_recup: project.charges_non_recup,
        croissance_valeur: project.croissance_valeur,
        croissance_loyers: project.croissance_loyers,
        inflation_charges: project.inflation_charges,
        taux_interet: project.taux_interet,
        duree_credit: project.duree_credit,
        apport: project.apport,
        assurance_emprunteur: project.assurance_emprunteur,
      })
      .eq("id", project.id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Paramètres sauvegardés" });
      setShowSettings(false);
    }
  };

  const updateProject = (key: string, value: any) =>
    setProject((p) => (p ? { ...p, [key]: value } : p));

  const isAnalyzing = analysisStep === "scraping" || analysisStep === "analyzing";
  const activePrix = listing?.prix || manualPrix;
  const activeSurface = listing?.surface || manualSurface;
  const selectedRentMonthly =
    project?.strategie === "lcd"
      ? (adr > 0 ? Math.round(adr * 30 * (Math.max(0, occupationCible) / 100)) : 0)
      : loyerEstime;
  const marketRentMonthly =
    project?.strategie === "lcd"
      ? 0
      : marketData?.marketRentPerSqm && activeSurface > 0
        ? Math.round(Number(marketData.marketRentPerSqm) * activeSurface)
        : 0;
  const baseProjectAnalysisInput =
    activePrix > 0
      ? buildProjectAnalysisInput({
          price: activePrix,
          selectedRentMonthly,
          marketRentMonthly,
        })
      : null;
  const baseProjectAnalysis = baseProjectAnalysisInput ? computeProjectAnalysis(baseProjectAnalysisInput) : null;
  const annualTaxAmount =
    taxAnalysis
      ? taxAnalysis.fiscal.taxAmount + taxAnalysis.fiscal.socialContributions + taxAnalysis.fiscal.dividendsTax
      : null;
  const projectAnalysis =
    baseProjectAnalysisInput
      ? computeProjectAnalysis({
          ...baseProjectAnalysisInput,
          tax: {
            ...baseProjectAnalysisInput.tax,
            annualTaxAmount,
            investmentAnalysis: taxAnalysis,
          },
        })
      : null;
  const currentTaxCanonicalInput = useMemo(() => {
    if (!params || !aiResult || !baseProjectAnalysisInput || !baseProjectAnalysis) return null;

    return buildCanonicalInvestmentInput({
      price: activePrix,
      notaryFees: baseProjectAnalysis.acquisition.notaryFees,
      worksAmount: travaux,
      annualRent: selectedRentMonthly * 12,
      annualCharges:
        baseProjectAnalysisInput.operating.condoChargesAnnualNonRecoverable +
        baseProjectAnalysisInput.operating.maintenanceAnnual +
        baseProjectAnalysisInput.operating.otherAnnual,
      propertyTax: taxeFonciere,
      vacancyRate: baseProjectAnalysis.exploitation.vacancyRate,
      loanAmount: baseProjectAnalysis.financing.loanAmount,
      annualDebtService: baseProjectAnalysis.financing.annualDebtService,
      annualBorrowerInsurance: baseProjectAnalysis.financing.monthlyInsurance * 12,
      interestRate: baseProjectAnalysis.financing.interestRate,
      durationYears: baseProjectAnalysis.financing.durationYears,
      annualRentGrowthRate: params.croissance_loyers / 100,
      annualValueGrowthRate: params.croissance_valeur / 100,
      annualChargeGrowthRate: params.inflation_charges / 100,
      taxSettings,
    });
  }, [
    aiResult,
    activePrix,
    baseProjectAnalysis,
    baseProjectAnalysisInput,
    params,
    selectedRentMonthly,
    taxeFonciere,
    taxSettings,
    travaux,
  ]);

  const toggleComparisonRegime = (regime: TaxRegime) => {
    if (regime === taxSettings.taxRegime) return;
    setComparisonRegimes((current) => {
      if (current.includes(regime)) {
        return current.filter((item) => item !== regime);
      }
      if (current.length >= 3) return current;
      return [...current, regime];
    });
  };

  useEffect(() => {
    if (!currentTaxCanonicalInput || taxDiagnostics.paywallRequired || availableRegimeOptions.options.length === 0) {
      if (taxDiagnostics.paywallRequired || availableRegimeOptions.options.length === 0) {
        setTaxAnalysis(null);
        setTaxComparisonRows([]);
      }
      return;
    }

    try {
      const nextAnalysis = analyzeInvestment(currentTaxCanonicalInput);
      const regimesToCompare = [
        taxSettings.taxRegime,
        ...comparisonRegimes.filter((regime) =>
          availableRegimeOptions.options.some((option) => option.regime === regime),
        ),
      ].slice(0, 4);
      setTaxAnalysis(nextAnalysis);
      setTaxComparisonRows(compareTaxRegimes(currentTaxCanonicalInput, Array.from(new Set(regimesToCompare))));
    } catch (error) {
      console.warn("[analysis] unable to recompute tax simulation", error);
    }
  }, [
    availableRegimeOptions.options,
    comparisonRegimes,
    currentTaxCanonicalInput,
    taxDiagnostics.paywallRequired,
    taxSettings.taxRegime,
  ]);

  if (loading) {
    return <AppLayout><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div></AppLayout>;
  }

  if (!project) {
    return <AppLayout><div className="text-center py-20 text-muted-foreground">Projet introuvable.</div></AppLayout>;
  }
  const marketPriceRef = Number(marketData?.marketPricePerSqm || 0);
  const marketRentRef = Number(marketData?.marketRentPerSqm || 0);
  const displayedDvf =
    marketPriceRef > 0
      ? `${Math.round(marketPriceRef).toLocaleString("fr-FR")} €/m²`
      : aiResult?.prixM2Dvf || "n/a";
  const marketSourceLine = marketData?.sourcePrixM2 || marketData?.sourceLoyerM2
    ? `Source prix: ${marketData?.sourcePrixM2 || "n/a"} · Source loyer: ${marketData?.sourceLoyerM2 || "n/a"}`
    : null;
  const prixAnnonceNum = activePrix || readNum(aiResult?.prixAnnonce || 0);
  const projectionBase = projectAnalysis?.acquisition.totalProjectCost || prixAnnonceNum || 0;
  const priceM2Annonce = activePrix > 0 && activeSurface > 0 ? activePrix / activeSurface : 0;
  const dvfMedianRef = marketPriceRef > 0 ? marketPriceRef : readNum(aiResult?.prixM2Dvf || 0);
  const marketDataMissing = marketStatus !== "ok";
  const pointsFortsDecision: { point: string; impact: string }[] = [];
  const pointsFaiblesDecision: { flag: string; impact: string }[] = [];

  if (!projectAnalysis || projectAnalysis.exploitation.selectedRentMonthly <= 0) {
    pointsFaiblesDecision.push({
      flag: "Loyer retenu indisponible",
      impact: "Impossible de calculer un rendement cohérent sans loyer mensuel retenu",
    });
  } else if (projectAnalysis.exploitation.grossYieldActInHand >= projectAnalysis.pricing.targetGrossYieldActInHand) {
    pointsFortsDecision.push({
      point: "Rendement brut acte en main au niveau cible",
      impact: `${formatPct(projectAnalysis.exploitation.grossYieldActInHand * 100)} (objectif ${(projectAnalysis.pricing.targetGrossYieldActInHand * 100).toFixed(0)}%)`,
    });
  } else {
    pointsFaiblesDecision.push({
      flag: "Rendement acte en main sous cible",
      impact: projectAnalysis
        ? `${formatPct(projectAnalysis.exploitation.grossYieldActInHand * 100)} ; seuil d'équilibre: ${formatEUR(projectAnalysis.exploitation.breakEvenRentMonthly)}/mois`
        : "Analyse incomplète",
    });
  }

  if (projectAnalysis && !projectAnalysis.pricing.isPriceCompatible) {
    pointsFaiblesDecision.push({
      flag: "Prix affiché au-dessus du maximum compatible",
      impact: `${formatEUR(Math.abs(projectAnalysis.pricing.displayedPriceGap))} à négocier pour l'objectif retenu`,
    });
  } else if (projectAnalysis) {
    pointsFortsDecision.push({
      point: "Prix compatible avec l'objectif",
      impact: "Le prix affiché reste sous le maximum compatible avec l'objectif retenu",
    });
  }

  if (dvfMedianRef > 0 && priceM2Annonce > 0) {
    const ecartPrixM2Pct = ((priceM2Annonce - dvfMedianRef) / dvfMedianRef) * 100;
    if (ecartPrixM2Pct <= -5) {
      pointsFortsDecision.push({
        point: "Prix/m² sous la référence locale",
        impact: `${formatPct(Math.abs(ecartPrixM2Pct))} sous la médiane`,
      });
    } else if (ecartPrixM2Pct >= 5) {
      pointsFaiblesDecision.push({
        flag: "Prix/m² au-dessus du marché local",
        impact: `${formatPct(ecartPrixM2Pct)} au-dessus de la médiane locale`,
      });
    }
  }

  if ((projectAnalysis?.exploitation.cashflowBeforeTaxMonthly || 0) >= 0) {
    pointsFortsDecision.push({
      point: "Cash-flow avant impôt au moins à l'équilibre",
      impact: projectAnalysis ? formatEUR(projectAnalysis.exploitation.cashflowBeforeTaxMonthly) : "n/a",
    });
  } else {
    pointsFaiblesDecision.push({
      flag: "Cash-flow avant impôt négatif",
      impact: projectAnalysis ? formatEUR(Math.abs(projectAnalysis.exploitation.cashflowBeforeTaxMonthly)) : "n/a",
    });
  }

  const dpe = String(listing?.dpe || "").toUpperCase();
  if (["A", "B", "C", "D"].includes(dpe)) {
    pointsFortsDecision.push({
      point: `DPE ${dpe}`,
      impact: "Risque réglementaire/énergétique plus limité",
    });
  } else if (["E", "F", "G"].includes(dpe)) {
    pointsFaiblesDecision.push({
      flag: `DPE ${dpe}`,
      impact: "Travaux énergétiques possibles, à chiffrer avant offre",
    });
  }

  if (marketDataMissing) {
    pointsFaiblesDecision.push({
      flag: "Données de marché partielles",
      impact: "Décision possible mais confiance réduite sur le positionnement local",
    });
  }
  projectAnalysis?.warnings
    .filter((warning) => warning.severity !== "info")
    .forEach((warning) => {
      pointsFaiblesDecision.push({
        flag: warning.message,
        impact: warning.blockingForVerdict ? "A confirmer avant conclusion" : "Hypothèse sensible",
      });
    });
  const projectionChartData = projections.map((p) => ({
    ...p,
    valeurBienPct: projectionBase > 0 ? (p.valeurBien / projectionBase) * 100 : null,
    cashFlowCumulePct: projectionBase > 0 ? (p.cashFlowCumule / projectionBase) * 100 : null,
    valeurNettePct: projectionBase > 0 ? (p.valeurNette / projectionBase) * 100 : null,
  }));
  const projectionCurveData = [
    {
      annee: 0,
      valeurBien: activePrix || prixAnnonceNum || 0,
      cashFlowCumule: 0,
      valeurNette: 0,
      valeurBienPct: projectionBase > 0 ? ((activePrix || prixAnnonceNum || 0) / projectionBase) * 100 : null,
      cashFlowCumulePct: projectionBase > 0 ? 0 : null,
      valeurNettePct: projectionBase > 0 ? 0 : null,
    },
    ...projectionChartData,
  ].sort((a, b) => a.annee - b.annee);
  const cashflowPositive = (projectAnalysis?.exploitation.cashflowBeforeTaxMonthly || 0) >= 0;
  const selectedSeuilCashflowZero = projectAnalysis?.exploitation.breakEvenRentMonthly ?? 0;

  const renderProjectionTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const point = payload[0]?.payload || {};
    const rows = [
      { key: "valeurNette", label: "Valeur nette créée", pctKey: "valeurNettePct", color: "#2F8CFF" },
      { key: "cashFlowCumule", label: "Cash-flow cumulé", pctKey: "cashFlowCumulePct", color: "#22D3EE" },
      { key: "valeurBien", label: "Valeur du bien", pctKey: "valeurBienPct", color: "#8fb5ff" },
    ];
    return (
      <div className="analysis-tooltip">
        <p className="analysis-tooltip-title">Horizon {label} ans</p>
        {rows.map((r) => {
          const value = Number(point?.[r.key] ?? 0);
          const pctVal = point?.[r.pctKey];
          return (
            <p key={r.key} className="analysis-tooltip-row">
              <span className="analysis-tooltip-dot" style={{ background: r.color }} />
              <span className="text-slate-200">{r.label}:</span>
              <span className="text-white font-semibold">{formatEUR(value)}</span>
              {projectionBase > 0 && Number.isFinite(pctVal) ? (
                <span className="text-cyan-300">({formatPct(Number(pctVal))})</span>
              ) : null}
            </p>
          );
        })}
      </div>
    );
  };
  return (
    <AppLayout>
      <div className="analysis-cockpit-page">
        <div className="analysis-cockpit-bg" />
        <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <ProjectHeaderBar
            projectName={project.name}
            objectiveLabel={objectifLabels[project.objectif] || project.objectif}
            strategyLabel={strategieLabels[project.strategie] || project.strategie}
            financingLabel={project.financement === "credit" ? "Crédit" : "Comptant"}
            onToggleSettings={() => setShowSettings((prev) => !prev)}
          />

          {showSettings && (
            <ProjectSettingsPanel
              project={project}
              onUpdate={updateProject}
              onCancel={() => setShowSettings(false)}
              onSave={handleSaveSettings}
            />
          )}

          <AnalysisInputCard
            url={url}
            onUrlChange={setUrl}
            isAnalyzing={isAnalyzing}
            manualPrix={manualPrix}
            onManualPrixChange={setManualPrix}
            manualSurface={manualSurface}
            onManualSurfaceChange={setManualSurface}
            manualCity={manualCity}
            onManualCityChange={setManualCity}
            travaux={travaux}
            onTravauxChange={setTravaux}
            chargesMensuelles={chargesMensuelles}
            onChargesMensuellesChange={setChargesMensuelles}
            taxeFonciere={taxeFonciere}
            onTaxeFonciereChange={setTaxeFonciere}
            loyerEstime={loyerEstime}
            onLoyerEstimeChange={setLoyerEstime}
            adr={adr}
            onAdrChange={setAdr}
            autresCouts={autresCouts}
            onAutresCoutsChange={setAutresCouts}
            occupationCible={occupationCible}
            onOccupationCibleChange={setOccupationCible}
            projectStrategie={project.strategie}
            analysisStep={analysisStep}
            onRun={handleAnalyse}
            draftMessage={draftMessage}
            onClearDraft={clearDraft}
          />

          {listing && <ListingInfoCard listing={listing} />}

          {baseProjectAnalysis && params && (
            <FinancialSummaryCards
              fraisNotaire={baseProjectAnalysis.acquisition.notaryFees}
              coutGlobal={baseProjectAnalysis.acquisition.totalProjectCost}
              mensualiteCredit={baseProjectAnalysis.financing.monthlyPaymentExcludingInsurance}
              assuranceMensuelle={baseProjectAnalysis.financing.monthlyInsurance}
              capitalEmprunte={baseProjectAnalysis.financing.loanAmount}
              fraisNotairePct={params.frais_notaire_pct}
              financement={params.financement}
              dureeCredit={baseProjectAnalysis.financing.durationYears}
              tauxInteret={baseProjectAnalysis.financing.interestRate * 100}
            />
          )}

	          {/* AI Results */}
	          {aiResult && projectAnalysis && (
	            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
		              <AnalysisResultsCard
		                aiResult={aiResult}
		                title={listing?.titre || project.name}
		                strategyLabel={strategieLabels[project.strategie]}
                    analysis={projectAnalysis}
		                projectStrategie={project.strategie}
		                adr={adr}
		                params={params}
		                marketStatus={marketStatus}
		                displayedDvf={displayedDvf}
		                marketRentRef={marketRentRef}
		                marketSourceLine={marketSourceLine}
                    priceM2Annonce={priceM2Annonce}
                    dvfMedianRef={dvfMedianRef}
		                pointsFortsDecision={pointsFortsDecision}
		                pointsFaiblesDecision={pointsFaiblesDecision}
		                projections={projections}
	                projectionBase={projectionBase}
	                projectionCurveData={projectionCurveData}
	                renderProjectionTooltip={renderProjectionTooltip}
	                formatEUR={formatEUR}
	                formatPct={formatPct}
	              />

                <TaxSimulationCard
                  plan={plan}
                  availableRegimeOptions={availableRegimeOptions.options}
                  compatibilityWarnings={taxUiWarnings}
                  paywallRequired={taxDiagnostics.paywallRequired}
                  taxSettings={taxSettings}
                  comparisonRegimes={comparisonRegimes}
                  selectedRegimeOption={selectedRegimeOption}
                  primaryAnalysis={taxAnalysis}
                  comparisonRows={taxComparisonRows}
                  onChange={updateTaxSettings}
                  onToggleComparisonRegime={toggleComparisonRegime}
                  formatEUR={formatEUR}
                  formatPct={formatPct}
                />

                {taxAnalysis && (
                  <div className="analysis-cockpit-card p-6">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Lecture patrimoniale</h3>
                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="analysis-cockpit-subcard p-4">
                        <p className="analysis-label">Capital remboursé</p>
                        <p className="analysis-kpi text-2xl">{formatEUR(taxAnalysis.patrimonial.capitalRepaid)}</p>
                      </div>
                      <div className="analysis-cockpit-subcard p-4">
                        <p className="analysis-label">Trésorerie cumulée</p>
                        <p className="analysis-kpi text-2xl">{formatEUR(taxAnalysis.patrimonial.cumulativePostTaxTreasury)}</p>
                      </div>
                      <div className="analysis-cockpit-subcard p-4">
                        <p className="analysis-label">Valeur nette créée</p>
                        <p className="analysis-kpi text-2xl">{formatEUR(taxAnalysis.patrimonial.netValueCreated)}</p>
                      </div>
                      <div className="analysis-cockpit-subcard p-4">
                        <p className="analysis-label">Sortie potentielle</p>
                        <p className="analysis-kpi text-2xl">{formatEUR(taxAnalysis.patrimonial.potentialExitValue)}</p>
                      </div>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="border-b border-border/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="pb-2 pr-4">Horizon</th>
                            <th className="pb-2 pr-4">Valeur bien</th>
                            <th className="pb-2 pr-4">Capital remboursé</th>
                            <th className="pb-2 pr-4">Trésorerie après impôt</th>
                            <th className="pb-2">Valeur nette créée</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taxAnalysis.patrimonial.projections.map((projection) => (
                            <tr key={projection.year} className="border-b border-border/20 text-muted-foreground">
                              <td className="py-3 pr-4 text-foreground">{projection.year} ans</td>
                              <td className="py-3 pr-4">{formatEUR(projection.propertyValue)}</td>
                              <td className="py-3 pr-4">{formatEUR(projection.principalRepaid)}</td>
                              <td className="py-3 pr-4">{formatEUR(projection.cumulativePostTaxTreasury)}</td>
                              <td className="py-3 text-foreground">{formatEUR(projection.netValueCreated)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{taxAnalysis.patrimonial.objectiveFit}</p>
                  </div>
                )}
	            </motion.div>
	          )}

          {savedAnalyses.length > 0 && (
            <div className="analysis-cockpit-card p-6 mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText size={14} className="text-primary" /> Historique des analyses ({savedAnalyses.length})
              </h3>
              <div className="space-y-2">
                {savedAnalyses.map((a) => {
                  const result = a.analysis_result as AnalysisResult | null;
                  const listing = a.listing_data as any;
                  return (
                    <button
                      key={a.id}
                      onClick={() => loadSavedAnalysis(a)}
                      className="w-full text-left analysis-history-row rounded-lg p-3 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <Home size={14} className="text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {listing?.titre || a.type_local || "Analyse"} — {a.ville || a.code_postal || ""}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {Number(a.prix)?.toLocaleString("fr-FR")}€ · {a.surface}m²
                              {result?.decision ? ` · ${result.decision}` : ""}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                          {new Date(a.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deterministic analysis synthesis (no AI call) */}
          {aiResult && projectAnalysis && (
            <div className="analysis-cockpit-card p-6 mt-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">Synthèse d'analyse</h3>
              </div>
              <div className="analysis-v2-text rounded-lg p-5 text-sm text-foreground leading-7 space-y-2">
                <p className="font-semibold text-foreground">
                  Verdict {projectAnalysis.verdict.label.toLowerCase()} · fiabilité {projectAnalysis.reliability.replaceAll("_", " ")}
                </p>
                <p>{projectAnalysis.verdict.summary}</p>
                <p>
                  Pour un cash-flow avant impôt à l'équilibre, il faudrait un loyer de{" "}
                  <span className="text-primary font-semibold">{formatEUR(selectedSeuilCashflowZero)}/mois</span>.
                </p>
                <p>
                  Le cash-flow avant impôt ressort à{" "}
                  <span className={cashflowPositive ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                    {formatEUR(projectAnalysis.exploitation.cashflowBeforeTaxMonthly)}/mois
                  </span>.
                </p>
                {projectAnalysis.taxation.cashflowAfterTaxMonthly !== null ? (
                  <p>
                    Après fiscalité, il reste{" "}
                    <span className={projectAnalysis.taxation.cashflowAfterTaxMonthly >= 0 ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                      {formatEUR(projectAnalysis.taxation.cashflowAfterTaxMonthly)}/mois
                    </span>.
                  </p>
                ) : null}
              </div>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground text-center mt-6">
            Aide à la décision — à vérifier avant engagement. Méthode v0.1
          </p>
        </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDetail;






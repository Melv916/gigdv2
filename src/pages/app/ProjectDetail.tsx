import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { FileText, Home, Loader2 } from "lucide-react";
import {
  calcFraisNotaire,
  calcCoutGlobal,
  calcMensualiteCredit,
  calcAssuranceMensuelle,
  calcSeuilLoyerMinimum,
  calcProjections,
  type ProjectParams,
  type Projection,
} from "@/lib/calculations";
import { importAnalysisUrl } from "@/lib/v2/api";
import { fetchRentEstimate } from "@/lib/investment/api";
import {
  buildMarketData,
  normalizePropertyData,
  type MarketData,
  type PropertyData,
} from "@/lib/market/cityMarketPipeline";
import { buildAnalysisKpiModel } from "@/features/investment/analysis/kpiModel";
import { AnalysisResultsCard } from "@/features/investment/analysis/components/AnalysisResultsCard";
import {
  AnalysisInputCard,
  FinancialSummaryCards,
  ListingInfoCard,
  ProjectHeaderBar,
  ProjectSettingsPanel,
} from "@/features/investment/analysis/components/ProjectDetailTopSections";
import {
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

function buildFallbackAnalysisResult(args: {
  prix: number;
  surface: number;
  loyerMensuel: number;
  mensualiteTotale: number;
  coutGlobal: number;
  dvfMedian: number | null;
  vacanceLocativeMois: number;
  chargesMensuelles: number;
  chargesNonRecup: number;
  taxeFonciere: number;
}): AnalysisResult {
  const prixM2 = args.surface > 0 ? Math.round(args.prix / args.surface) : 0;
  const rendementBrut = args.coutGlobal > 0 ? (args.loyerMensuel * 12 * 100) / args.coutGlobal : 0;
  const revenuMensuelEffectif = (args.loyerMensuel * (12 - args.vacanceLocativeMois)) / 12;
  const chargesMensuellesTotales = args.chargesMensuelles + args.chargesNonRecup + (args.taxeFonciere / 12);
  const cash = revenuMensuelEffectif - chargesMensuellesTotales - args.mensualiteTotale;
  const decision = cash >= 100 ? "FONCEZ" : cash >= 0 ? "NEGOCIER" : "TROP CHER";
  const redFlags: { flag: string; impact: string }[] = [];

  if (!args.loyerMensuel) redFlags.push({ flag: "Loyer non renseigné", impact: "Rendement et cash-flow sous-estimés" });
  if (cash < 0) redFlags.push({ flag: "Cash-flow mensuel négatif", impact: `${formatEur(Math.abs(cash))}/mois` });
  if (args.dvfMedian && prixM2 > args.dvfMedian) {
    redFlags.push({
      flag: "Prix au m² supérieur à la médiane DVF",
      impact: `+${Math.round(((prixM2 - args.dvfMedian) / args.dvfMedian) * 100)}%`,
    });
  }

  const prixCibleDvf = args.dvfMedian && args.surface > 0
    ? Math.round(args.dvfMedian * args.surface * 0.97)
    : null;
  const prixMaxAchat = prixCibleDvf && prixCibleDvf > 0
    ? Math.min(args.prix, prixCibleDvf)
    : Math.max(0, args.prix - Math.max(5000, args.prix * 0.05));

  return {
    decision,
    prixAnnonce: formatEur(args.prix),
    prixMax: formatEur(prixMaxAchat),
    prixM2: `${prixM2.toLocaleString("fr-FR")}€/m²`,
    prixM2Dvf: args.dvfMedian ? `${Math.round(args.dvfMedian).toLocaleString("fr-FR")}€/m²` : "n/a",
    score: "n/a",
    rendement: `${rendementBrut.toFixed(2)}%`,
    loyerEstime: `${Math.round(args.loyerMensuel).toLocaleString("fr-FR")}€/mois`,
    cashFlow: `${Math.round(cash).toLocaleString("fr-FR")}€/mois`,
    seuilLoyer: `${Math.round(args.mensualiteTotale).toLocaleString("fr-FR")}€/mois`,
    occupationMin: "n/a",
    redFlags,
    goodPoints: [],
    scriptParticulier: [
      "Je peux avancer rapidement si les justificatifs sont complets.",
      "Mon offre intègre les charges, les travaux et le risque de vacance.",
    ],
    scriptAgence: [
      "Je me base sur les comparables DVF et une enveloppe travaux réaliste.",
      "Je peux signer vite si le prix tient compte des risques identifiés.",
    ],
  };
}

function inferTypology(surface: number, pieces?: number | null): "all" | "t1t2" | "t3plus" {
  if (typeof pieces === "number" && pieces > 0) return pieces <= 2 ? "t1t2" : "t3plus";
  if (surface > 0) return surface <= 45 ? "t1t2" : "t3plus";
  return "all";
}

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Analysis state
  const [url, setUrl] = useState("");
  const [manualPrix, setManualPrix] = useState<number>(0);
  const [manualSurface, setManualSurface] = useState<number>(0);
  const [manualCP, setManualCP] = useState("");
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

  // Projections
  const [projections, setProjections] = useState<Projection[]>([]);

  // Saved analyses history
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);

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
          setProject(data as unknown as Project);
        }
        setLoading(false);
      });
  }, [user, id]);

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

  const params: ProjectParams | null = project
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
    : null;

  const handleAnalyse = async () => {
    if (!project || !params) return;
    setAnalysisStep("scraping");
    setAiResult(null);
    setMarketStatus("indisponible");
    setMarketData(null);
    setPropertyData(null);
    setListing(null);
    setProjections([]);

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
          const cleanedCity = isValidCityValue(String(normalizedProperty.city || listingData?.ville || ""))
            ? String(normalizedProperty.city || listingData?.ville)
            : (inferredFromUrl.city || "");
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

      const listingCodePostal = normalizePostalCode(String(listingData?.codePostal || manualCP || "").trim());
      const inferredFromUrl = parseSelogerLocationFromUrl(url);
      const isSelogerUrl = /seloger\.com/i.test(String(url || ""));
      const listingCityRaw = String(listingData?.ville || "").trim();
      const listingCity = isValidCityValue(listingCityRaw) ? listingCityRaw : "";
      const cityForLookup =
        isSelogerUrl && inferredFromUrl.city
          ? inferredFromUrl.city
          : (listingCity || inferredFromUrl.city || "");
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
          ville: listingData?.ville || null,
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

      // Recompute financing figures from the actual analyzed price/surface (not stale UI state).
      const fraisNotaireLocal = calcFraisNotaire(prix, params.frais_notaire_pct);
      const coutGlobalLocal = calcCoutGlobal(prix, fraisNotaireLocal, travaux, autresCouts);
      const capitalEmprunteLocal =
        params.financement === "credit" ? Math.max(0, coutGlobalLocal - params.apport) : 0;
      const mensualiteCreditLocal =
        params.financement === "credit"
          ? calcMensualiteCredit(capitalEmprunteLocal, params.taux_interet, params.duree_credit)
          : 0;
      const assuranceMensuelleLocal =
        params.financement === "credit"
          ? calcAssuranceMensuelle(capitalEmprunteLocal, params.assurance_emprunteur)
          : 0;
      const mensualiteTotaleLocal = mensualiteCreditLocal + assuranceMensuelleLocal;

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

      // Always prioritize city_market_prices for URL-imported listings.
      let loyerPourCalc = marketRentMonthly > 0 ? marketRentMonthly : (loyerEstime || 0);
      if (marketRentMonthly > 0) {
        setLoyerEstime(marketRentMonthly);
      }

      if (!loyerPourCalc && Number(surface) > 0) {
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
          title: "Loyer requis",
          description: "Loyer de marché introuvable. Renseigne un loyer estimé réel pour lancer l'analyse.",
          variant: "destructive",
        });
        setAnalysisStep("idle");
        return;
      }

      const fallbackAnalysis = buildFallbackAnalysisResult({
        prix,
        surface,
        loyerMensuel: loyerPourCalc,
        mensualiteTotale: mensualiteTotaleLocal,
        coutGlobal: coutGlobalLocal,
        dvfMedian: Number(normalizedMarket.marketPricePerSqm || 0) || null,
        vacanceLocativeMois: params.vacance_locative,
        chargesMensuelles,
        chargesNonRecup: params.charges_non_recup,
        taxeFonciere,
      });

      setAiResult(fallbackAnalysis);

      // Calculate projections locally
      const projs = calcProjections(params, prix, loyerPourCalc, chargesMensuelles, taxeFonciere, travaux, autresCouts);
      setProjections(projs);
      console.log("[analysis] final payload for calculation", {
        propertyData: normalizedProperty,
        marketData: normalizedMarket,
        calcInputs: {
          prix,
          surface,
          loyerPourCalc,
          mensualiteTotaleLocal,
          coutGlobalLocal,
        },
      });

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
          code_postal: listingData?.codePostal || manualCP || null,
          ville: listingData?.ville || null,
          dpe: listingData?.dpe || null,
          charges_mensuelles: chargesMensuelles,
          taxe_fonciere: taxeFonciere,
          travaux_estimes: travaux,
          loyer_estime: loyerPourCalc,
          adr: adr || null,
          occupation_cible: occupationCible || null,
          autres_couts: autresCouts,
          listing_data: listingData,
          dvf_summary: marketSummary,
          analysis_result: fallbackAnalysis,
        };
        const { data: saved } = await supabase.from("project_analyses").insert(analysisRecord).select().single();
        if (saved) {
          setSavedAnalyses((prev) => [saved, ...prev]);
        }
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

  if (loading) {
    return <AppLayout><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div></AppLayout>;
  }

  if (!project) {
    return <AppLayout><div className="text-center py-20 text-muted-foreground">Projet introuvable.</div></AppLayout>;
  }

  const isAnalyzing = analysisStep === "scraping" || analysisStep === "analyzing";
  const activePrix = listing?.prix || manualPrix;
  const activeSurface = listing?.surface || manualSurface;

  // Compute financial summary
  const fraisNotaire = params ? calcFraisNotaire(activePrix, params.frais_notaire_pct) : 0;
  const coutGlobal = calcCoutGlobal(activePrix, fraisNotaire, travaux, autresCouts);
  const capitalEmprunte = params?.financement === "credit" ? coutGlobal - (params?.apport || 0) : 0;
  const mensualiteCredit = params ? calcMensualiteCredit(capitalEmprunte, params.taux_interet, params.duree_credit) : 0;
  const assuranceMensuelle = params ? calcAssuranceMensuelle(capitalEmprunte, params.assurance_emprunteur) : 0;

  // Seuils by type
  const seuilTypes = params && activePrix
    ? (["ld-nue", "meuble", "coloc", "lcd"] as const).map((t) => ({
        type: t,
        label: strategieLabels[t],
        seuil: calcSeuilLoyerMinimum(params, activePrix, travaux, chargesMensuelles, taxeFonciere, autresCouts, t),
      }))
    : [];

  const kpiModel = buildAnalysisKpiModel({
    aiResult,
    loyerEstime,
    coutGlobal,
    activePrix,
    activeSurface,
    marketData,
    marketStatus,
    travaux,
    autresCouts,
    fraisNotairePct: params?.frais_notaire_pct || 0,
  });
  const {
    prixAnnonceNum,
    basePrixRendement,
    hasRentForYield,
    rendementBrutCalc,
    minRent8,
    rendementTargetReached,
    prixCibleRendement8,
    ecartNego,
    ecartNegoPct,
    coutGlobalPrixCible,
    rendementAbove10,
    projectionBase,
    marketRentRef,
    displayedDvf,
    marketSourceLine,
    marketPossibleRentMonthly,
    cashFlowMensuelNum,
    priceM2Annonce,
    dvfMedianRef,
    marketDataMissing,
  } = kpiModel;
  const pointsFortsDecision: { point: string; impact: string }[] = [];
  const pointsFaiblesDecision: { flag: string; impact: string }[] = [];

  if (!hasRentForYield) {
    pointsFaiblesDecision.push({
      flag: "Loyer marché indisponible",
      impact: "Impossible de calculer le rendement brut sans loyer mensuel",
    });
  } else if (rendementTargetReached) {
    pointsFortsDecision.push({
      point: "Rendement brut au niveau cible",
      impact: `${formatPct(Number(rendementBrutCalc || 0))} (objectif 8%)`,
    });
  } else {
    pointsFaiblesDecision.push({
      flag: "Rendement brut sous cible",
      impact: `${formatPct(Number(rendementBrutCalc || 0))} ; loyer cible 8%: ${formatEUR(minRent8)}/mois`,
    });
  }

  if (ecartNego > 0) {
    pointsFaiblesDecision.push({
      flag: "Positionnement prix a renegocier",
      impact: `${formatEUR(ecartNego)} a negocier (${formatPct(ecartNegoPct)}) pour atteindre 8% brut`,
    });
  } else if (hasRentForYield && basePrixRendement > 0 && prixCibleRendement8 > 0) {
    pointsFortsDecision.push({
      point: "Prix coherent avec la cible de rendement",
      impact: "Pas de negociation requise pour la cible 8% brut",
    });
  }

  if (dvfMedianRef > 0 && priceM2Annonce > 0) {
    const ecartPrixM2Pct = ((priceM2Annonce - dvfMedianRef) / dvfMedianRef) * 100;
    if (ecartPrixM2Pct <= -5) {
      pointsFortsDecision.push({
        point: "Prix/m² sous la reference locale",
        impact: `${formatPct(Math.abs(ecartPrixM2Pct))} sous la mediane`,
      });
    } else if (ecartPrixM2Pct >= 5) {
      pointsFaiblesDecision.push({
        flag: "Prix/m² au-dessus du marche local",
        impact: `${formatPct(ecartPrixM2Pct)} au-dessus de la mediane locale`,
      });
    }
  }

  if (cashFlowMensuelNum > 0) {
    pointsFortsDecision.push({
      point: "Cash-flow mensuel positif",
      impact: formatEUR(cashFlowMensuelNum),
    });
  } else {
    pointsFaiblesDecision.push({
      flag: "Cash-flow mensuel negatif",
      impact: formatEUR(Math.abs(cashFlowMensuelNum)),
    });
  }

  const dpe = String(listing?.dpe || "").toUpperCase();
  if (["A", "B", "C", "D"].includes(dpe)) {
    pointsFortsDecision.push({
      point: `DPE ${dpe}`,
      impact: "Risque reglementaire/energetique plus limite",
    });
  } else if (["E", "F", "G"].includes(dpe)) {
    pointsFaiblesDecision.push({
      flag: `DPE ${dpe}`,
      impact: "Travaux energetiques possibles, a chiffrer avant offre",
    });
  }

  if (marketDataMissing) {
    pointsFaiblesDecision.push({
      flag: "Donnees de marche partielles",
      impact: "Decision possible mais confiance reduite sur le positionnement local",
    });
  }
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
  const cashflowPositive = cashFlowMensuelNum > 0;
  const selectedSeuilCashflowZero =
    seuilTypes.find((s) => s.type === project.strategie)?.seuil ?? 0;

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
            financingLabel={project.financement === "credit" ? "Credit" : "Comptant"}
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
            manualCP={manualCP}
            onManualCPChange={setManualCP}
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
          />

          {listing && <ListingInfoCard listing={listing} />}

          {activePrix > 0 && params && (
            <FinancialSummaryCards
              fraisNotaire={fraisNotaire}
              coutGlobal={coutGlobal}
              mensualiteCredit={mensualiteCredit}
              assuranceMensuelle={assuranceMensuelle}
              capitalEmprunte={capitalEmprunte}
              fraisNotairePct={params.frais_notaire_pct}
              financement={params.financement}
              dureeCredit={params.duree_credit}
              tauxInteret={params.taux_interet}
            />
          )}

	          {/* AI Results */}
	          {aiResult && (
	            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
	              <AnalysisResultsCard
	                aiResult={aiResult}
	                title={listing?.titre || project.name}
	                strategyLabel={strategieLabels[project.strategie]}
	                hasRentForYield={hasRentForYield}
	                rendementBrutCalc={rendementBrutCalc}
	                rendementTargetReached={rendementTargetReached}
	                rendementAbove10={rendementAbove10}
	                minRent8={minRent8}
	                marketPossibleRentMonthly={marketPossibleRentMonthly}
	                prixCibleRendement8={prixCibleRendement8}
	                coutGlobalPrixCible={coutGlobalPrixCible}
	                ecartNego={ecartNego}
	                ecartNegoPct={ecartNegoPct}
	                seuilTypes={seuilTypes}
	                projectStrategie={project.strategie}
	                adr={adr}
	                params={params}
	                marketStatus={marketStatus}
	                displayedDvf={displayedDvf}
	                marketRentRef={marketRentRef}
	                marketSourceLine={marketSourceLine}
	                pointsFortsDecision={pointsFortsDecision}
	                pointsFaiblesDecision={pointsFaiblesDecision}
	                projections={projections}
	                projectionBase={projectionBase}
	                projectionCurveData={projectionCurveData}
	                renderProjectionTooltip={renderProjectionTooltip}
	                formatEUR={formatEUR}
	                formatPct={formatPct}
	              />
	            </motion.div>
	          )}

          {/* Saved analyses history */}
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
                      onClick={() => {
                        if (listing) setListing(listing);
	                        if (result) {
	                          setAiResult(result);
	                          setAnalysisStep("done");
	                          setMarketStatus("indisponible");
	                          const loyerRaw = String(result.loyerEstime || "0");
                          const loyerMatch = loyerRaw.match(/(\d[\d\s]*)/);
                          const loyerParsed = loyerMatch ? parseFloat(loyerMatch[1].replace(/\s/g, "")) : 0;
                          const lp = Number(a.loyer_estime) || loyerParsed || 0;
                          if (params) {
                            setProjections(calcProjections(params, Number(a.prix), lp, Number(a.charges_mensuelles), Number(a.taxe_fonciere), Number(a.travaux_estimes), Number(a.autres_couts)));
                          }
                        }
                        setUrl(a.url || "");
                        setTravaux(Number(a.travaux_estimes) || 0);
                        setChargesMensuelles(Number(a.charges_mensuelles) || 0);
                        setTaxeFonciere(Number(a.taxe_fonciere) || 0);
                        setLoyerEstime(Number(a.loyer_estime) || 0);
                        setAutresCouts(Number(a.autres_couts) || 0);
                      }}
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
          {aiResult && (
            <div className="analysis-cockpit-card p-6 mt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Synthèse d'analyse</h3>
              <div className="analysis-v2-text rounded-lg p-5 text-sm text-foreground leading-7 space-y-2">
                <p>Voici le resume d'analyse du bien.</p>
                <p>
                  Par consequent, pour un cash-flow = 0, il faudrait un loyer de{" "}
                  <span className="text-primary font-semibold">{formatEUR(selectedSeuilCashflowZero)}/mois</span>.
                </p>
                <p>
                  Actuellement, votre cash-flow est de{" "}
                  <span className={cashflowPositive ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                    {formatEUR(cashFlowMensuelNum)}/mois
                  </span>.
                </p>
                <p className={cashflowPositive ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                  {cashflowPositive
                    ? "C'est donc un bon investissement."
                    : "Ce n'est pas un bon placement sans negociation."}
                </p>
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




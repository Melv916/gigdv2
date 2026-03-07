import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Link2, Loader2, AlertTriangle, CheckCircle2, TrendingUp, BarChart3,
  MapPin, FileText, MessageSquare, User, Building2, Home, Settings, ArrowLeft, Percent, Tag, Target,
} from "lucide-react";
import {
  calcFraisNotaire, calcCoutGlobal, calcMensualiteCredit, calcAssuranceMensuelle,
  calcSeuilLoyerMinimum, calcProjections, type ProjectParams, type Projection,
} from "@/lib/calculations";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { createAnalysis, getMarketEnrichment, getMe, importAnalysisUrl } from "@/lib/v2/api";
import { fetchRentEstimate } from "@/lib/investment/api";
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

type CityMarketPriceRow = {
  insee_code: string | null;
  commune: string | null;
  departement_code: string | null;
  rent_m2_app_all: number | null;
  rent_m2_app_t1t2: number | null;
  rent_m2_app_t3plus: number | null;
  rent_m2_house: number | null;
  sale_m2_all: number | null;
};

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

function computeGrossYield(loyerMensuel: number, basePrix: number): number {
  if (!Number.isFinite(loyerMensuel) || !Number.isFinite(basePrix) || loyerMensuel <= 0 || basePrix <= 0) return 0;
  return (loyerMensuel * 12 * 100) / basePrix;
}

function computeMinRentForTargetYield(basePrix: number, target = 0.08): number {
  if (!Number.isFinite(basePrix) || basePrix <= 0) return 0;
  return Math.ceil((target * basePrix) / 12);
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

function normalizeCity(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function pickRentM2(
  row: CityMarketPriceRow | null,
  type: "house" | "apartment",
  typology: "all" | "t1t2" | "t3plus",
): number {
  if (!row) return 0;
  if (type === "house") return Number(row.rent_m2_house || row.rent_m2_app_all || 0);
  if (typology === "t1t2") return Number(row.rent_m2_app_t1t2 || row.rent_m2_app_all || 0);
  if (typology === "t3plus") return Number(row.rent_m2_app_t3plus || row.rent_m2_app_all || 0);
  return Number(row.rent_m2_app_all || 0);
}

async function fetchCityMarketReference(args: {
  insee?: string;
  ville?: string;
  departementCode?: string;
}): Promise<CityMarketPriceRow | null> {
  const insee = String(args.insee || "").trim();
  const ville = String(args.ville || "").trim();
  const departementCode = String(args.departementCode || "").trim();

  if (insee) {
    const { data } = await supabase
      .from("city_market_prices")
      .select("insee_code,commune,departement_code,rent_m2_app_all,rent_m2_app_t1t2,rent_m2_app_t3plus,rent_m2_house,sale_m2_all")
      .eq("insee_code", insee)
      .maybeSingle();
    if (data) return data as CityMarketPriceRow;
  }

  if (ville && departementCode) {
    const { data } = await supabase
      .from("city_market_prices")
      .select("insee_code,commune,departement_code,rent_m2_app_all,rent_m2_app_t1t2,rent_m2_app_t3plus,rent_m2_house,sale_m2_all")
      .eq("departement_code", departementCode)
      .ilike("commune", ville)
      .limit(10);
    if (data && data.length > 0) {
      const expected = normalizeCity(ville);
      const exact = data.find((r: any) => normalizeCity(String(r.commune || "")) === expected);
      return (exact || data[0]) as CityMarketPriceRow;
    }
  }

  return null;
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
  const [scriptTab, setScriptTab] = useState<"particulier" | "agence">("particulier");
  const [v2AnalysisText, setV2AnalysisText] = useState("");
  const [cacheHit, setCacheHit] = useState(false);
  const [iaMode, setIaMode] = useState<"courte" | "complete">("courte");
  const [marketStatus, setMarketStatus] = useState<"ok" | "processing" | "failed" | "indisponible">("indisponible");
  const [marketEnrichment, setMarketEnrichment] = useState<any>(null);
  const [marketSources, setMarketSources] = useState<any[]>([]);
  const [marketAnalysisId, setMarketAnalysisId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!marketAnalysisId || marketStatus !== "processing") return;
    let cancelled = false;
    let tries = 0;

    const poll = async () => {
      if (cancelled) return;
      tries += 1;
      try {
        const data = await getMarketEnrichment(marketAnalysisId);
        if (cancelled) return;
        setMarketStatus(data?.status || "indisponible");
        setMarketEnrichment(data?.enrichment || null);
        setMarketSources(Array.isArray(data?.sources) ? data.sources : []);
        if (data?.status === "processing" && tries < 12) {
          setTimeout(poll, 1500);
        }
      } catch {
        if (!cancelled && tries < 12) setTimeout(poll, 1800);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [marketAnalysisId, marketStatus]);

  useEffect(() => {
    if (!user) return;
    getMe()
      .then((data) => {
        setIaMode(data?.iaModeAllowed === "complete" ? "complete" : "courte");
      })
      .catch(() => undefined);
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
    setV2AnalysisText("");
    setCacheHit(false);
    setMarketStatus("indisponible");
    setMarketEnrichment(null);
    setMarketSources([]);
    setMarketAnalysisId(null);
    setListing(null);
    setProjections([]);

    try {
      let listingData: any = null;
      let dvfSummary: any = null;
      let prix = manualPrix;
      let surface = manualSurface;
      let cityMarketRef: CityMarketPriceRow | null = null;

      if (url) {
        const imported = await importAnalysisUrl(url);
        listingData = imported?.listing || null;
        dvfSummary = imported?.dvfSummary || null;
        prix = Number(listingData?.prix || 0) || prix;
        surface = Number(listingData?.surface || 0) || surface;
        if (listingData) setListing(listingData);
      }

      const listingCodePostal = String(listingData?.codePostal || manualCP || "").trim();
      const listingDepartementCode =
        listingCodePostal.length >= 2
          ? listingCodePostal.startsWith("97") && listingCodePostal.length >= 3
            ? listingCodePostal.slice(0, 3)
            : listingCodePostal.slice(0, 2)
          : "";
      cityMarketRef = await fetchCityMarketReference({
        insee: String((listingData as any)?.insee || "").trim(),
        ville: String(listingData?.ville || "").trim(),
        departementCode: listingDepartementCode,
      });

      // Sale m2 reference from city_market_prices (your city table) in priority.
      if (Number(cityMarketRef?.sale_m2_all || 0) > 0) {
        dvfSummary = { ...(dvfSummary || {}), medianePrixM2: Number(cityMarketRef?.sale_m2_all) };
      }

      if (!prix || !surface) {
        toast({ title: "Données requises", description: "Renseignez le prix et la surface.", variant: "destructive" });
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

      let loyerPourCalc = loyerEstime || 0;
      if (!loyerPourCalc && surface > 0) {
        const type = /maison/i.test(String(listingData?.typeLocal || "")) ? "house" : "apartment";
        const typology = inferTypology(Number(surface), Number(listingData?.pieces || 0) || undefined);
        const rentM2FromCityTable = pickRentM2(cityMarketRef, type, typology);
        if (rentM2FromCityTable > 0) {
          loyerPourCalc = Math.round(rentM2FromCityTable * Number(surface));
          setLoyerEstime(loyerPourCalc);
        }
      }
      if (!loyerPourCalc && surface > 0) {
        try {
          const codePostal = String(listingData?.codePostal || manualCP || "").trim();
          const departementCode =
            codePostal.length >= 2
              ? codePostal.startsWith("97") && codePostal.length >= 3
                ? codePostal.slice(0, 3)
                : codePostal.slice(0, 2)
              : undefined;
          const insee = String((listingData as any)?.insee || "").trim() || undefined;
          const type = /maison/i.test(String(listingData?.typeLocal || "")) ? "house" : "apartment";
          const typology = inferTypology(Number(surface), Number(listingData?.pieces || 0) || undefined);
          const rent = await fetchRentEstimate({
            insee,
            departement_code: departementCode,
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
          // Keep manual/default value if no rent estimate is available.
        }
      }
      if (!loyerPourCalc && prix > 0) {
        // Last-resort fallback to avoid null economics when open-data is unavailable.
        loyerPourCalc = Math.round((prix * 0.055) / 12);
        setLoyerEstime(loyerPourCalc);
      }

      const fallbackAnalysis = buildFallbackAnalysisResult({
        prix,
        surface,
        loyerMensuel: loyerPourCalc,
        mensualiteTotale: mensualiteTotaleLocal,
        coutGlobal: coutGlobalLocal,
        dvfMedian: Number(dvfSummary?.medianePrixM2 || 0) || null,
        vacanceLocativeMois: params.vacance_locative,
        chargesMensuelles,
        chargesNonRecup: params.charges_non_recup,
        taxeFonciere,
      });

      setAiResult(fallbackAnalysis);

      // V2 AI synthesis in addition to V1 analysis (no replacement).
      try {
        const strategyMap: Record<string, "nue" | "meuble" | "colocation" | "lcd"> = {
          "ld-nue": "nue",
          meuble: "meuble",
          coloc: "colocation",
          lcd: "lcd",
        };
        const v2 = await createAnalysis({
          url: url || `manual://${Date.now()}`,
          strategy: strategyMap[project.strategie] || "nue",
          mode: iaMode,
          inputs: {
            travaux,
            charges_mensuelles: chargesMensuelles,
            taxe_fonciere: taxeFonciere,
            autres_couts: autresCouts,
            vacance_mois: params.vacance_locative,
            strategie: strategyMap[project.strategie] || "nue",
            prix,
            surface,
            loyer_estime: loyerPourCalc,
            mensualite_totale: mensualiteTotaleLocal,
            prompt_version: "v3",
          },
          importData: {
            listing: listingData || {
              titre: "Saisie manuelle",
              prix,
              surface,
              codePostal: manualCP || null,
              vendeur: "inconnu",
              typeLocal: "Appartement",
            },
            dvfSummary: dvfSummary || {},
          },
        });
        setV2AnalysisText(String(v2?.analysis?.analysis_text || ""));
        setCacheHit(Boolean(v2?.cacheHit));
        if (v2?.analysis?.id) setMarketAnalysisId(String(v2.analysis.id));
        if (v2?.market) {
          setMarketStatus(v2.market.status || "indisponible");
          setMarketEnrichment(v2.market.enrichment || null);
          setMarketSources(Array.isArray(v2.market.sources) ? v2.market.sources : []);
        }
      } catch {
        // Keep V1 result available even if V2 synthesis fails.
      }

      // Calculate projections locally
      const projs = calcProjections(params, prix, loyerPourCalc, chargesMensuelles, taxeFonciere, travaux, autresCouts);
      setProjections(projs);

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
          dvf_summary: dvfSummary,
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

  const prixAnnonceNum = aiResult ? Number(String(aiResult.prixAnnonce).replace(/[^0-9.-]/g, "")) : 0;
  const loyerEstimeNum = loyerEstime > 0
    ? loyerEstime
    : Number(String(aiResult?.loyerEstime || "").replace(/[^0-9.-]/g, "")) || 0;
  const basePrixRendement = prixAnnonceNum > 0 ? prixAnnonceNum : coutGlobal;
  const rendementBrutCalc = computeGrossYield(loyerEstimeNum, basePrixRendement);
  const minRent8 = computeMinRentForTargetYield(basePrixRendement, 0.08);
  const rendementTargetReached = rendementBrutCalc >= 8;
  const prixCibleRendement8 = loyerEstimeNum > 0 ? (loyerEstimeNum * 12) / 0.08 : 0;
  const ecartNego = !rendementTargetReached && basePrixRendement > 0 && prixCibleRendement8 > 0
    ? Math.max(0, basePrixRendement - prixCibleRendement8)
    : 0;
  const ecartNegoPct = basePrixRendement > 0 && ecartNego > 0 ? (ecartNego / basePrixRendement) * 100 : 0;
  const fraisNotairePrixCible = params && prixCibleRendement8 > 0 ? calcFraisNotaire(prixCibleRendement8, params.frais_notaire_pct) : 0;
  const coutGlobalPrixCible = prixCibleRendement8 > 0 ? calcCoutGlobal(prixCibleRendement8, fraisNotairePrixCible, travaux, autresCouts) : 0;
  const rendementAbove10 = rendementBrutCalc > 10;
  const projectionBase = basePrixRendement > 0 ? basePrixRendement : 0;
  const dvfMedianEnriched = Number(marketEnrichment?.dvf?.median_eur_m2 || 0);
  const dvfComparables = Number(marketEnrichment?.dvf?.samples_count || 0);
  const dvfPeriod = String(marketEnrichment?.dvf?.period || "n/a");
  const dvfScope = String(marketEnrichment?.scope || "n/a");
  const marketReason = String(marketEnrichment?.reason || "").trim();
  const displayedDvf =
    dvfMedianEnriched > 0
      ? `${Math.round(dvfMedianEnriched).toLocaleString("fr-FR")}€/m²`
      : aiResult?.prixM2Dvf || "n/a";
  const marketSourceLine = marketSources.length > 0
    ? `Source: data.gouv.fr (${marketSources[0]?.dataset_id || "n/a"}/${marketSources[0]?.resource_id || "n/a"})`
    : null;
  const cashFlowMensuelNum = aiResult ? Number(String(aiResult.cashFlow || "0").replace(/[^0-9.-]/g, "")) : 0;
  const priceM2Annonce = activePrix > 0 && activeSurface > 0 ? activePrix / activeSurface : 0;
  const dvfMedianRef = dvfMedianEnriched > 0
    ? dvfMedianEnriched
    : Number(String(aiResult?.prixM2Dvf || "0").replace(/[^0-9.-]/g, ""));
  const pointsFortsDecision: { point: string; impact: string }[] = [];
  const pointsFaiblesDecision: { flag: string; impact: string }[] = [];

  if (rendementTargetReached) {
    pointsFortsDecision.push({
      point: "Rendement brut au niveau cible",
      impact: `${formatPct(rendementBrutCalc)} (objectif 8%)`,
    });
  } else {
    pointsFaiblesDecision.push({
      flag: "Rendement brut sous cible",
      impact: `${formatPct(rendementBrutCalc)} ; loyer cible 8%: ${formatEUR(minRent8)}/mois`,
    });
  }

  if (ecartNego > 0) {
    pointsFaiblesDecision.push({
      flag: "Positionnement prix a renegocier",
      impact: `${formatEUR(ecartNego)} a negocier (${formatPct(ecartNegoPct)}) pour atteindre 8% brut`,
    });
  } else if (basePrixRendement > 0 && prixCibleRendement8 > 0) {
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

  if (marketStatus !== "ok") {
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link to="/app/projets" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></Link>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">{project.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {objectifLabels[project.objectif]} · {strategieLabels[project.strategie]} · {project.financement === "credit" ? "Crédit" : "Comptant"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings size={14} /> Paramètres
            </Button>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="analysis-cockpit-card p-6 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Paramètres du projet <span className="text-primary text-xs">Méthode v0.1</span></h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Frais notaire (%)</Label>
                  <Input type="number" step="0.5" value={project.frais_notaire_pct} onChange={(e) => updateProject("frais_notaire_pct", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Vacance (mois/an)</Label>
                  <Input type="number" value={project.vacance_locative} onChange={(e) => updateProject("vacance_locative", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Croiss. valeur (%)</Label>
                  <Input type="number" step="0.5" value={project.croissance_valeur} onChange={(e) => updateProject("croissance_valeur", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Croiss. loyers (%)</Label>
                  <Input type="number" step="0.5" value={project.croissance_loyers} onChange={(e) => updateProject("croissance_loyers", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                </div>
                {project.financement === "credit" && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Taux intérêt (%)</Label>
                      <Input type="number" step="0.1" value={project.taux_interet} onChange={(e) => updateProject("taux_interet", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Durée crédit (ans)</Label>
                      <Input type="number" value={project.duree_credit} onChange={(e) => updateProject("duree_credit", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Apport (€)</Label>
                      <Input type="number" value={project.apport} onChange={(e) => updateProject("apport", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Assurance (%/an)</Label>
                      <Input type="number" step="0.01" value={project.assurance_emprunteur} onChange={(e) => updateProject("assurance_emprunteur", +e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowSettings(false)}>Annuler</Button>
                <Button variant="hero" size="sm" onClick={handleSaveSettings}>Sauvegarder</Button>
              </div>
            </motion.div>
          )}

          {/* Analysis input */}
          <div className="analysis-cockpit-card p-6 mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Analyser un bien</h3>
            <Tabs defaultValue="url" className="space-y-4">
              <TabsList className="bg-muted/30">
                <TabsTrigger value="url">Lien annonce</TabsTrigger>
                <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
              </TabsList>
              <TabsContent value="url">
                <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-1.5">
                  <Link2 size={16} className="text-muted-foreground shrink-0 ml-2" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.seloger.com/annonces/achat/..."
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-2 outline-none"
                    disabled={isAnalyzing}
                  />
                </div>
              </TabsContent>
              <TabsContent value="manual">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Prix (€)</Label>
                    <Input type="number" value={manualPrix || ""} onChange={(e) => setManualPrix(+e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Surface (m²)</Label>
                    <Input type="number" value={manualSurface || ""} onChange={(e) => setManualSurface(+e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Code postal</Label>
                    <Input value={manualCP} onChange={(e) => setManualCP(e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Additional inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="space-y-1">
                <Label className="text-xs">Travaux (€)</Label>
                <Input type="number" value={travaux || ""} onChange={(e) => setTravaux(+e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Charges/mois (€)</Label>
                <Input type="number" value={chargesMensuelles || ""} onChange={(e) => setChargesMensuelles(+e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Taxe foncière/an (€)</Label>
                <Input type="number" value={taxeFonciere || ""} onChange={(e) => setTaxeFonciere(+e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{project.strategie === "lcd" ? "ADR (€/nuit)" : "Loyer estimé (€/mois)"}</Label>
                <Input
                  type="number"
                  value={project.strategie === "lcd" ? adr || "" : loyerEstime || ""}
                  onChange={(e) => project.strategie === "lcd" ? setAdr(+e.target.value) : setLoyerEstime(+e.target.value)}
                  className="bg-muted/30 border-border/50 h-9 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <div className="space-y-1">
                <Label className="text-xs">Autres coûts (€)</Label>
                <Input type="number" value={autresCouts || ""} onChange={(e) => setAutresCouts(+e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
              </div>
              {project.strategie === "lcd" && (
                <div className="space-y-1">
                  <Label className="text-xs">Occupation cible (%)</Label>
                  <Input type="number" value={occupationCible} onChange={(e) => setOccupationCible(+e.target.value)} className="bg-muted/30 border-border/50 h-9 text-sm" />
                </div>
              )}
            </div>

            <Button variant="hero" className="w-full mt-4" onClick={handleAnalyse} disabled={isAnalyzing}>
              {analysisStep === "scraping" ? <><Loader2 className="animate-spin" size={16} /> Lecture de l'annonce…</> :
               analysisStep === "analyzing" ? <><Loader2 className="animate-spin" size={16} /> Analyse en cours…</> :
               "Lancer l'analyse"}
            </Button>
          </div>

          {/* Listing info */}
          {listing && (
            <div className="analysis-cockpit-card p-4 flex flex-wrap items-center gap-4 mb-6">
              <Home size={18} className="text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{listing.titre || `${listing.typeLocal} ${listing.pieces}p`}</p>
                <p className="text-xs text-muted-foreground">
                  {listing.ville} {listing.codePostal} — {listing.surface}m² — {listing.prix?.toLocaleString("fr-FR")}€
                  {listing.dpe ? ` — DPE ${listing.dpe}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Financial summary (always visible if we have a price) */}
          {activePrix > 0 && params && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Frais de notaire", value: `${fraisNotaire.toLocaleString("fr-FR")}€`, sub: `${params.frais_notaire_pct}% du prix` },
                { label: "Coût global", value: `${coutGlobal.toLocaleString("fr-FR")}€`, sub: "Achat + notaire + travaux" },
                ...(params.financement === "credit" ? [
                  { label: "Mensualité crédit", value: `${mensualiteCredit.toLocaleString("fr-FR")}€/mois`, sub: `+ ${assuranceMensuelle}€ assurance` },
                  { label: "Capital emprunté", value: `${capitalEmprunte.toLocaleString("fr-FR")}€`, sub: `${params.duree_credit} ans à ${params.taux_interet}%` },
                ] : []),
              ].map((s) => (
                <div key={s.label} className="analysis-cockpit-subcard p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-lg font-display font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI Results */}
          {aiResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="analysis-cockpit-card p-6 md:p-8">
                {/* 1) Header analyse */}
                <div className="analysis-head-wrap mb-6">
                  <div>
                    <p className="analysis-label mb-2">Cockpit d'analyse</p>
                    <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
                      {listing?.titre || project.name} · {strategieLabels[project.strategie]}
                    </h2>
                  </div>
                  <div className={`analysis-verdict ${
                    aiResult.decision === "FONCEZ" ? "analysis-verdict-positive" :
                    aiResult.decision === "TROP CHER" ? "analysis-verdict-negative" :
                    "analysis-verdict-neutral"
                  }`}>
                    {aiResult.decision}
                  </div>
                </div>

                {/* 2) KPIs prioritaires */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <div className="analysis-cockpit-subcard p-4">
                    <p className="analysis-label flex items-center gap-2"><TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Cash-flow</p>
                    <p className="analysis-kpi">{aiResult.cashFlow}</p>
                    <p className="text-xs text-muted-foreground">mensuel</p>
                  </div>
                  <div className="analysis-cockpit-subcard p-4">
                    <p className="analysis-label flex items-center gap-2"><BarChart3 size={14} strokeWidth={1.5} className="analysis-icon" /> Rendement brut</p>
                    <p className="analysis-kpi">{formatPct(rendementBrutCalc)}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`analysis-yield-badge ${rendementTargetReached ? "analysis-yield-badge-ok" : "analysis-yield-badge-low"}`}>
                        {rendementTargetReached ? "OK (≥ 8%)" : "Sous objectif"}
                      </span>
                      {rendementAbove10 && <span className="analysis-yield-badge analysis-yield-badge-high">Au-dessus de la cible (10%+)</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {rendementTargetReached
                        ? "Objectif investisseur atteint (8–10%)."
                        : <>Pour atteindre 8% de rendement brut, il faut un loyer ≥ <span className="text-primary font-semibold">{formatEUR(minRent8)}/mois</span>.</>}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">Rendement brut basé sur loyer estimé (hors charges, vacance, fiscalité).</p>
                  </div>
                  <div className="analysis-cockpit-subcard p-4">
                    <p className="analysis-label flex items-center gap-2"><Percent size={14} strokeWidth={1.5} className="analysis-icon" /> Prix/m²</p>
                    <p className="analysis-kpi">{aiResult.prixM2}</p>
                    <p className="text-xs text-muted-foreground">annonce</p>
                  </div>
                  <div className="analysis-cockpit-subcard p-4">
                    <p className="analysis-label flex items-center gap-2"><TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Loyer conseillé (8% brut)</p>
                    <p className="analysis-kpi">{minRent8 > 0 ? `${minRent8.toLocaleString("fr-FR")}€/mois` : "n/a"}</p>
                    <p className="text-xs text-muted-foreground">Base prix annonce (fallback coût global)</p>
                  </div>
                </div>

                {/* 3) Bloc négociation central */}
                <div className="analysis-cockpit-subcard p-5 mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target size={14} strokeWidth={1.5} className="analysis-icon" /> Négociation
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: Tag, label: "Prix annoncé", value: aiResult.prixAnnonce, sub: aiResult.prixM2 },
                      { icon: Tag, label: "Prix cible (8% brut)", value: prixCibleRendement8 > 0 ? formatEUR(prixCibleRendement8) : "n/a", sub: "hors frais" },
                      { icon: Tag, label: "Coût global cible", value: prixCibleRendement8 > 0 ? formatEUR(coutGlobalPrixCible) : "n/a", sub: "prix cible + notaire + travaux" },
                      {
                        icon: Target,
                        label: "Écart négo",
                        value: `${formatEUR(ecartNego)}${ecartNegoPct > 0 ? ` (${formatPct(ecartNegoPct)})` : ""}`,
                        sub: ecartNego > 0 ? "capital a negocier pour atteindre 8% brut" : "pas besoin de negocier (8% brut deja atteint)",
                      },
                    ].map((s) => (
                      <div key={s.label} className="analysis-kpi-box">
                        <p className="analysis-label flex items-center gap-2"><s.icon size={13} strokeWidth={1.5} className="analysis-icon" /> {s.label}</p>
                        <p className="text-lg md:text-xl font-display font-bold text-foreground mt-2">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4) Seuil loyer minimum */}
                {seuilTypes.length > 0 && (
                  <div className="analysis-cockpit-subcard p-5 mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Seuil de loyer minimum (cash-flow = 0)
                    </h4>
                    <Tabs defaultValue={project.strategie}>
                      <TabsList className="bg-muted/30">
                        {seuilTypes.map((s) => (
                          <TabsTrigger key={s.type} value={s.type}>{s.label}</TabsTrigger>
                        ))}
                      </TabsList>
                      {seuilTypes.map((s) => (
                        <TabsContent key={s.type} value={s.type}>
                          <div className="analysis-threshold-row">
                            <span className="text-sm text-muted-foreground">
                              {s.type === "lcd" ? "Revenu minimum mensuel" :
                               s.type === "coloc" ? "Loyer total minimum" :
                               `Loyer minimum (${s.label})`}
                            </span>
                            <span className="text-2xl font-display font-bold text-primary">{s.seuil.toLocaleString("fr-FR")}€/mois</span>
                          </div>
                          {s.type === "lcd" && adr > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Occupation minimum : {Math.ceil((s.seuil / adr / 30) * 100)}% ({Math.ceil(s.seuil / adr)} nuits/mois)
                            </p>
                          )}
                        </TabsContent>
                      ))}
                    </Tabs>
                    <p className="text-[10px] text-muted-foreground mt-2">Hypothèses utilisées : notaire {params?.frais_notaire_pct}%, vacance {params?.vacance_locative} mois/an · Méthode v0.1</p>
                  </div>
                )}

                {/* 5) Marché/DVF + Données clés + points intégrés */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <div className="analysis-cockpit-subcard p-5">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Building2 size={14} strokeWidth={1.5} className="analysis-icon" /> Marché et données clés
                    </h4>
                    <div className="mb-3">
                      <span className={`analysis-yield-badge ${
                        marketStatus === "ok"
                          ? "analysis-yield-badge-ok"
                          : marketStatus === "processing"
                            ? "analysis-yield-badge-high"
                            : "analysis-yield-badge-low"
                      }`}>
                        Enrichissement marché: {marketStatus === "ok" ? "OK" : marketStatus === "processing" ? "En cours" : "Indispo"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { icon: MapPin, label: "Médiane DVF quartier", value: displayedDvf },
                        { icon: TrendingUp, label: "Loyer estimé", value: aiResult.loyerEstime },
                        { icon: FileText, label: "Cash-flow mensuel", value: aiResult.cashFlow },
                      ].map((m) => (
                        <div key={m.label} className="analysis-line-item">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <m.icon size={14} strokeWidth={1.5} className="analysis-icon" />
                            <span className="text-sm">{m.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">{m.value}</span>
                        </div>
                      ))}
                    </div>
                    {dvfComparables > 0 && (
                      <p className="text-[11px] text-muted-foreground mt-3">
                        {dvfComparables} comparables · {dvfPeriod} · échelle {dvfScope}
                      </p>
                    )}
                    {marketSourceLine && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {marketSourceLine}
                      </p>
                    )}
                    {marketStatus !== "ok" && marketReason && (
                      <p className="text-[10px] text-amber-300 mt-1">
                        Raison: {marketReason}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-3 border border-border/40 rounded-full inline-flex px-2 py-0.5">
                      Hypothèses v0.1 · DVF + IA
                    </p>
                  </div>
                  <div className="analysis-cockpit-subcard p-5">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle size={14} strokeWidth={1.5} className="analysis-icon" /> Lecture qualitative
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="analysis-label mb-2 flex items-center gap-2"><CheckCircle2 size={13} strokeWidth={1.5} className="text-green-400" /> Points forts</p>
                        <ul className="analysis-list">
                          {pointsFortsDecision.length > 0 ? pointsFortsDecision.map((g, i) => (
                            <li key={i}><span className="text-foreground">{g.point}</span> <span className="text-green-400">({g.impact})</span></li>
                          )) : <li>Aucun point positif détecté.</li>}
                        </ul>
                      </div>
                      <div>
                        <p className="analysis-label mb-2 flex items-center gap-2"><AlertTriangle size={13} strokeWidth={1.5} className="text-amber-400" /> Points faibles / risques</p>
                        <ul className="analysis-list">
                          {pointsFaiblesDecision.length > 0 ? pointsFaiblesDecision.map((r, i) => (
                            <li key={i}><span className="text-foreground">{r.flag}</span> <span className="text-amber-400">(Impact : {r.impact})</span></li>
                          )) : <li>Aucun risque majeur détecté.</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6) Projections */}
                {projections.length > 0 && (
                  <div className="analysis-cockpit-subcard p-5 mb-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Projections 5 / 10 / 20 ans
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {projections.map((p) => (
                        <div key={p.annee} className="analysis-kpi-box">
                          <p className="analysis-label mb-2">À {p.annee} ans</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">Valeur du bien</span><span className="text-foreground font-semibold">{formatEUR(p.valeurBien)} {projectionBase > 0 ? <span className="text-cyan-300">({formatPct((p.valeurBien / projectionBase) * 100)})</span> : null}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Capital remboursé</span><span className="text-foreground font-semibold">{p.capitalRembourse.toLocaleString("fr-FR")}€</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Cash-flow cumulé</span><span className={`font-semibold ${p.cashFlowCumule >= 0 ? "text-green-400" : "text-destructive"}`}>{formatEUR(p.cashFlowCumule)} {projectionBase > 0 ? <span className="text-cyan-300">({formatPct((p.cashFlowCumule / projectionBase) * 100)})</span> : null}</span></div>
                            <div className="flex justify-between border-t border-border/30 pt-1 mt-1"><span className="text-muted-foreground">Valeur nette créée</span><span className={`font-bold ${p.valeurNette >= 0 ? "text-primary" : "text-destructive"}`}>{formatEUR(p.valeurNette)} {projectionBase > 0 ? <span className="text-cyan-300">({formatPct((p.valeurNette / projectionBase) * 100)})</span> : null}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="analysis-chart-wrap h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projectionCurveData}>
                          <defs>
                            <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2F8CFF" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#2F8CFF" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.18} />
                              <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <ReferenceLine y={0} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
                          <XAxis
                            type="number"
                            dataKey="annee"
                            domain={[0, 20]}
                            ticks={[0, 5, 10, 15, 20]}
                            tickFormatter={(v) => `${v} ans`}
                            stroke="rgba(219,232,255,0.75)"
                            fontSize={11}
                          />
                          <YAxis stroke="rgba(219,232,255,0.75)" fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                          <Tooltip content={renderProjectionTooltip} />
                          <Area type="monotone" dataKey="valeurNette" stroke="#2F8CFF" strokeWidth={3} fill="url(#netGradient)" />
                          <Area type="monotone" dataKey="cashFlowCumule" stroke="#22D3EE" strokeWidth={2.5} fill="url(#cashGradient)" />
                          <Line type="monotone" dataKey="valeurBien" stroke="#8fb5ff" strokeWidth={1.8} strokeDasharray="4 4" dot={{ r: 3, fill: "#8fb5ff" }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="analysis-line-legend">
                      <span><i style={{ background: "#2F8CFF" }} /> Valeur nette créée</span>
                      <span><i style={{ background: "#22D3EE" }} /> Cash-flow cumulé</span>
                      <span><i style={{ background: "#8fb5ff" }} /> Valeur du bien</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Hypothèses : valeur +{params?.croissance_valeur}%/an, loyers +{params?.croissance_loyers}%/an, charges +{params?.inflation_charges}%/an · Méthode v0.1
                    </p>
                  </div>
                )}

                {/* 7) Scripts */}
                <div className="analysis-cockpit-subcard p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Target size={14} strokeWidth={1.5} className="analysis-icon" /> Scripts de négociation
                  </h4>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setScriptTab("particulier")}
                      className={`analysis-tab-btn ${scriptTab === "particulier" ? "analysis-tab-btn-active" : ""}`}
                    >
                      <User size={12} strokeWidth={1.5} /> Particulier
                    </button>
                    <button
                      onClick={() => setScriptTab("agence")}
                      className={`analysis-tab-btn ${scriptTab === "agence" ? "analysis-tab-btn-active" : ""}`}
                    >
                      <Building2 size={12} strokeWidth={1.5} /> Agence
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(scriptTab === "particulier" ? aiResult.scriptParticulier : aiResult.scriptAgence)?.map((s, i) => (
                      <div key={i} className="analysis-script-line">{s}</div>
                    ))}
                  </div>
                </div>
              </div>
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
                          setMarketEnrichment(null);
                          setMarketSources([]);
                          setMarketAnalysisId(null);
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

          {/* V2 synthesis appended to V1 experience */}
          {v2AnalysisText && (
            <div className="analysis-cockpit-card p-6 mt-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold text-foreground">Synthèse IA V2</h3>
                <span className="text-[10px] text-muted-foreground">
                  Mode {iaMode} · {cacheHit ? "Cache hit" : "Générée"}
                </span>
              </div>
              <div className="analysis-v2-text rounded-lg p-5 text-sm text-foreground whitespace-pre-wrap leading-8">
                {v2AnalysisText}
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




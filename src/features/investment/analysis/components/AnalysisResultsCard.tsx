import { useState, type ReactNode } from "react";
import type { Projection } from "@/lib/calculations";
import type { ProjectAnalysisOutput } from "@/lib/investment/tax";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  MapPin,
  Percent,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AnalysisResult = {
  decision: string;
  prixAnnonce: string;
  prixM2: string;
  loyerEstime: string;
  cashFlow: string;
  scriptParticulier: string[];
  scriptAgence: string[];
};

type PointFort = { point: string; impact: string };
type PointFaible = { flag: string; impact: string };

type ProjectionCurvePoint = {
  annee: number;
  valeurBien: number;
  cashFlowCumule: number;
  valeurNette: number;
  valeurBienPct: number | null;
  cashFlowCumulePct: number | null;
  valeurNettePct: number | null;
};

type ProjectHypotheses = {
  frais_notaire_pct: number;
  vacance_locative: number;
  croissance_valeur: number;
  croissance_loyers: number;
  inflation_charges: number;
};

type MarketStatus = "ok" | "processing" | "failed" | "indisponible";

interface AnalysisResultsCardProps {
  aiResult: AnalysisResult;
  title: string;
  strategyLabel: string;
  analysis: ProjectAnalysisOutput;
  projectStrategie: string;
  adr: number;
  params: ProjectHypotheses | null;
  marketStatus: MarketStatus;
  displayedDvf: string;
  marketRentRef: number;
  marketSourceLine: string | null;
  priceM2Annonce: number;
  dvfMedianRef: number;
  pointsFortsDecision: PointFort[];
  pointsFaiblesDecision: PointFaible[];
  projections: Projection[];
  projectionBase: number;
  projectionCurveData: ProjectionCurvePoint[];
  renderProjectionTooltip: (args: any) => ReactNode;
  formatEUR: (value: number) => string;
  formatPct: (value: number) => string;
}

export function AnalysisResultsCard(props: AnalysisResultsCardProps) {
  const [scriptTab, setScriptTab] = useState<"particulier" | "agence">("particulier");
  const afterTaxMonthly = props.analysis.taxation.cashflowAfterTaxMonthly;
  const priceGap = props.analysis.pricing.displayedPriceGap;
  const verdictTone =
    props.analysis.verdict.status === "favorable"
      ? "analysis-verdict-positive"
      : props.analysis.verdict.status === "insuffisant"
        ? "analysis-verdict-negative"
        : "analysis-verdict-neutral";
  const breakEvenOccupancy =
    props.projectStrategie === "lcd" && props.adr > 0
      ? Math.ceil((props.analysis.exploitation.breakEvenRentMonthly / props.adr / 30) * 100)
      : null;

  return (
    <div className="analysis-cockpit-card p-6 md:p-8">
      <div className="analysis-head-wrap mb-6">
        <div>
          <p className="analysis-label mb-2">Cockpit d'analyse</p>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
            {props.title} · {props.strategyLabel}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{props.analysis.verdict.summary}</p>
        </div>
        <div className={`analysis-verdict ${verdictTone}`}>{props.analysis.verdict.label}</div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 xl:grid-cols-5">
        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2">
            <TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Cash-flow avant impot
          </p>
          <p className="analysis-kpi">{props.formatEUR(props.analysis.exploitation.cashflowBeforeTaxMonthly)}</p>
          <p className="text-xs text-muted-foreground">mensuel</p>
        </div>

        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2">
            <Percent size={14} strokeWidth={1.5} className="analysis-icon" /> Cash-flow apres impot
          </p>
          <p className="analysis-kpi">{afterTaxMonthly === null ? "A confirmer" : props.formatEUR(afterTaxMonthly)}</p>
          <p className="text-xs text-muted-foreground">mensuel</p>
        </div>

        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2">
            <BarChart3 size={14} strokeWidth={1.5} className="analysis-icon" /> Brut hors frais
          </p>
          <p className="analysis-kpi">{props.formatPct(props.analysis.exploitation.grossYieldExcludingFees * 100)}</p>
          <p className="text-xs text-muted-foreground">annuel</p>
        </div>

        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2">
            <BarChart3 size={14} strokeWidth={1.5} className="analysis-icon" /> Brut acte en main
          </p>
          <p className="analysis-kpi">{props.formatPct(props.analysis.exploitation.grossYieldActInHand * 100)}</p>
          <p className="text-xs text-muted-foreground">annuel</p>
        </div>

        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2">
            <BarChart3 size={14} strokeWidth={1.5} className="analysis-icon" /> Net exploitation
          </p>
          <p className="analysis-kpi">{props.formatPct(props.analysis.exploitation.netOperatingYield * 100)}</p>
          <p className="text-xs text-muted-foreground">annuel</p>
        </div>
      </div>

      <div className="analysis-cockpit-subcard p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Target size={14} strokeWidth={1.5} className="analysis-icon" /> Prix maximum compatible avec l'objectif
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Objectif retenu : {props.formatPct(props.analysis.pricing.targetGrossYieldActInHand * 100)} brut acte en main
            </p>
          </div>
          <span
            className={`analysis-yield-badge ${
              props.analysis.pricing.isPriceCompatible ? "analysis-yield-badge-ok" : "analysis-yield-badge-low"
            }`}
          >
            {props.analysis.pricing.isPriceCompatible ? "Prix compatible" : "Prix a renegocier"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-4">
          {[
            { label: "Prix affiche", value: props.formatEUR(props.analysis.acquisition.purchasePrice), sub: props.aiResult.prixM2 },
            {
              label: "Prix maximum compatible",
              value: props.formatEUR(props.analysis.pricing.purchasePriceMaxCompatible),
              sub: "hors ajustement de financement",
            },
            {
              label: "Cout total max compatible",
              value: props.formatEUR(props.analysis.pricing.totalCostMaxCompatible),
              sub: "acte en main",
            },
            {
              label: "Ecart avec le prix affiche",
              value: `${priceGap >= 0 ? "+" : "-"}${props.formatEUR(Math.abs(priceGap))}`,
              sub: props.analysis.pricing.isPriceCompatible ? "sous le seuil objectif" : "negociation recommandee",
            },
          ].map((item) => (
            <div key={item.label} className="analysis-kpi-box">
              <p className="analysis-label">{item.label}</p>
              <p className="text-lg md:text-xl font-display font-bold text-foreground mt-2">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="analysis-cockpit-subcard p-5 mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Loyer minimum pour cash-flow avant impot = 0
        </h4>
        <div className="analysis-threshold-row">
          <span className="text-sm text-muted-foreground">
            {props.projectStrategie === "lcd" ? "Revenu minimum mensuel" : "Loyer minimum mensuel"}
          </span>
          <span className="text-2xl font-display font-bold text-primary">
            {props.analysis.exploitation.breakEvenRentMonthly.toLocaleString("fr-FR")} EUR/mois
          </span>
        </div>
        {breakEvenOccupancy !== null ? (
          <p className="text-xs text-muted-foreground mt-2">
            Occupation minimale indicative : {breakEvenOccupancy}% ({Math.ceil(props.analysis.exploitation.breakEvenRentMonthly / props.adr)} nuits/mois)
          </p>
        ) : null}
        <p className="text-[10px] text-muted-foreground mt-2">
          Integre annuite de credit, charges d'exploitation annuelles et vacance retenue.
        </p>
      </div>

      <div className="analysis-cockpit-subcard p-5 mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Scenarios rapides
        </h4>
        <div className="grid gap-3 md:grid-cols-3">
          {props.analysis.exploitation.scenarios.map((scenario) => (
            <div key={scenario.key} className="analysis-kpi-box">
              <p className="analysis-label">{scenario.label}</p>
              <p className="mt-2 text-lg font-display font-bold text-foreground">
                {props.formatEUR(scenario.cashflowBeforeTaxMonthly)}/mois
              </p>
              <p className="text-xs text-muted-foreground mt-1">Cash-flow avant impot</p>
              <p className="text-xs text-muted-foreground mt-3">
                Loyer retenu : {props.formatEUR(scenario.selectedRentMonthly)}/mois
              </p>
              <p className="text-xs text-muted-foreground">Vacance : {(scenario.vacancyRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Charges : {props.formatEUR(scenario.operatingChargesAnnual)}/an</p>
              <p className="text-xs text-muted-foreground">
                Cash-flow apres impot : {scenario.cashflowAfterTaxMonthly === null ? "A confirmer" : `${props.formatEUR(scenario.cashflowAfterTaxMonthly)}/mois`}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2">
        <div className="analysis-cockpit-subcard p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Building2 size={14} strokeWidth={1.5} className="analysis-icon" /> Marche et reperes
          </h4>
          <div className="mb-3">
            <span
              className={`analysis-yield-badge ${
                props.marketStatus === "ok"
                  ? "analysis-yield-badge-ok"
                  : props.marketStatus === "processing"
                    ? "analysis-yield-badge-high"
                    : "analysis-yield-badge-low"
              }`}
            >
              Enrichissement marche : {props.marketStatus === "ok" ? "OK" : props.marketStatus === "processing" ? "En cours" : "Indispo"}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { icon: MapPin, label: "Prix moyen marche (ville)", value: props.displayedDvf },
              {
                icon: TrendingUp,
                label: "Loyer marche",
                value: props.marketRentRef > 0 ? `${Math.round(props.marketRentRef).toLocaleString("fr-FR")} EUR/m2` : "n/a",
              },
              {
                icon: Percent,
                label: "Prix annonce",
                value: props.priceM2Annonce > 0 ? `${Math.round(props.priceM2Annonce).toLocaleString("fr-FR")} EUR/m2` : "n/a",
              },
            ].map((item) => (
              <div key={item.label} className="analysis-line-item">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <item.icon size={14} strokeWidth={1.5} className="analysis-icon" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          {props.dvfMedianRef > 0 && props.priceM2Annonce > 0 ? (
            <p className="text-xs text-muted-foreground mt-3">
              Ecart prix/m2 vs reference : {props.formatPct(((props.priceM2Annonce - props.dvfMedianRef) / props.dvfMedianRef) * 100)}
            </p>
          ) : null}
          {props.marketSourceLine ? <p className="text-[10px] text-muted-foreground mt-1">{props.marketSourceLine}</p> : null}
        </div>

        <div className="analysis-cockpit-subcard p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle size={14} strokeWidth={1.5} className="analysis-icon" /> Lecture qualitative
          </h4>
          <div className="space-y-3">
            <div>
              <p className="analysis-label mb-2 flex items-center gap-2">
                <CheckCircle2 size={13} strokeWidth={1.5} className="text-green-400" /> Points forts
              </p>
              <ul className="analysis-list">
                {props.pointsFortsDecision.length > 0 ? (
                  props.pointsFortsDecision.map((item, index) => (
                    <li key={`${item.point}-${index}`}>
                      <span className="text-foreground">{item.point}</span>{" "}
                      <span className="text-green-400">({item.impact})</span>
                    </li>
                  ))
                ) : (
                  <li>Aucun point fort majeur detecte.</li>
                )}
              </ul>
            </div>
            <div>
              <p className="analysis-label mb-2 flex items-center gap-2">
                <AlertTriangle size={13} strokeWidth={1.5} className="text-amber-400" /> Points faibles / risques
              </p>
              <ul className="analysis-list">
                {props.pointsFaiblesDecision.length > 0 ? (
                  props.pointsFaiblesDecision.map((item, index) => (
                    <li key={`${item.flag}-${index}`}>
                      <span className="text-foreground">{item.flag}</span>{" "}
                      <span className="text-amber-400">(Impact : {item.impact})</span>
                    </li>
                  ))
                ) : (
                  <li>Aucun risque majeur detecte.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {props.projections.length > 0 && (
        <div className="analysis-cockpit-subcard p-5 mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Projections 5 / 10 / 20 ans
          </h4>
          <div className="grid grid-cols-1 gap-3 mb-4 md:grid-cols-3">
            {props.projections.map((projection) => (
              <div key={projection.annee} className="analysis-kpi-box">
                <p className="analysis-label mb-2">A {projection.annee} ans</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valeur du bien</span>
                    <span className="text-foreground font-semibold">{props.formatEUR(projection.valeurBien)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capital rembourse</span>
                    <span className="text-foreground font-semibold">{props.formatEUR(projection.capitalRembourse)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cash-flow cumule</span>
                    <span className={`font-semibold ${projection.cashFlowCumule >= 0 ? "text-green-400" : "text-destructive"}`}>
                      {props.formatEUR(projection.cashFlowCumule)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/30 pt-1 mt-1">
                    <span className="text-muted-foreground">Valeur nette creee</span>
                    <span className={`font-bold ${projection.valeurNette >= 0 ? "text-primary" : "text-destructive"}`}>
                      {props.formatEUR(projection.valeurNette)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="analysis-chart-wrap h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={props.projectionCurveData}>
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
                  tickFormatter={(value) => `${value} ans`}
                  stroke="rgba(219,232,255,0.75)"
                  fontSize={11}
                />
                <YAxis stroke="rgba(219,232,255,0.75)" fontSize={11} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip content={props.renderProjectionTooltip} />
                <Area type="monotone" dataKey="valeurNette" stroke="#2F8CFF" strokeWidth={3} fill="url(#netGradient)" />
                <Area type="monotone" dataKey="cashFlowCumule" stroke="#22D3EE" strokeWidth={2.5} fill="url(#cashGradient)" />
                <Line
                  type="monotone"
                  dataKey="valeurBien"
                  stroke="#8fb5ff"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: "#8fb5ff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="analysis-line-legend">
            <span>
              <i style={{ background: "#2F8CFF" }} /> Valeur nette creee
            </span>
            <span>
              <i style={{ background: "#22D3EE" }} /> Cash-flow cumule
            </span>
            <span>
              <i style={{ background: "#8fb5ff" }} /> Valeur du bien
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Hypotheses : valeur +{props.params?.croissance_valeur}%/an, loyers +{props.params?.croissance_loyers}%/an, charges +{props.params?.inflation_charges}%/an
          </p>
        </div>
      )}

      <div className="analysis-cockpit-subcard p-5 mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Percent size={14} strokeWidth={1.5} className="analysis-icon" /> Fiscalite
        </h4>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="analysis-kpi-box">
            <p className="analysis-label">Impot estime</p>
            <p className="mt-2 text-lg font-display font-bold text-foreground">
              {props.analysis.taxation.annualTaxAmount === null ? "A confirmer" : props.formatEUR(props.analysis.taxation.annualTaxAmount)}
            </p>
            <p className="text-xs text-muted-foreground">annuel</p>
          </div>
          <div className="analysis-kpi-box">
            <p className="analysis-label">Rendement net-net</p>
            <p className="mt-2 text-lg font-display font-bold text-foreground">
              {props.analysis.taxation.netNetYield === null ? "A confirmer" : props.formatPct(props.analysis.taxation.netNetYield * 100)}
            </p>
            <p className="text-xs text-muted-foreground">annuel</p>
          </div>
          <div className="analysis-kpi-box">
            <p className="analysis-label">Regime fiscal</p>
            <p className="mt-2 text-lg font-display font-bold text-foreground">{props.analysis.taxation.taxRegime}</p>
            <p className="text-xs text-muted-foreground">retenu</p>
          </div>
          <div className="analysis-kpi-box">
            <p className="analysis-label">TMI / IS</p>
            <p className="mt-2 text-lg font-display font-bold text-foreground">
              {props.formatPct(props.analysis.taxation.tmi * 100)} · {props.formatPct(props.analysis.taxation.corporateTaxRate * 100)}
            </p>
            <p className="text-xs text-muted-foreground">parametres fiscaux</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">{props.analysis.taxation.definitionNetNetYield}</p>
      </div>

      {props.analysis.patrimonial.projections.length > 0 ? (
        <div className="analysis-cockpit-subcard p-5 mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Building2 size={14} strokeWidth={1.5} className="analysis-icon" /> Lecture patrimoniale
          </h4>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="analysis-kpi-box">
              <p className="analysis-label">Capital rembourse</p>
              <p className="mt-2 text-lg font-display font-bold text-foreground">
                {props.analysis.patrimonial.capitalRepaid === null ? "n/a" : props.formatEUR(props.analysis.patrimonial.capitalRepaid)}
              </p>
            </div>
            <div className="analysis-kpi-box">
              <p className="analysis-label">Tresorerie cumulee</p>
              <p className="mt-2 text-lg font-display font-bold text-foreground">
                {props.analysis.patrimonial.cumulativePostTaxTreasury === null ? "n/a" : props.formatEUR(props.analysis.patrimonial.cumulativePostTaxTreasury)}
              </p>
            </div>
            <div className="analysis-kpi-box">
              <p className="analysis-label">Valeur nette creee</p>
              <p className="mt-2 text-lg font-display font-bold text-foreground">
                {props.analysis.patrimonial.netValueCreated === null ? "n/a" : props.formatEUR(props.analysis.patrimonial.netValueCreated)}
              </p>
            </div>
            <div className="analysis-kpi-box">
              <p className="analysis-label">Sortie potentielle</p>
              <p className="mt-2 text-lg font-display font-bold text-foreground">
                {props.analysis.patrimonial.potentialExitValue === null ? "n/a" : props.formatEUR(props.analysis.patrimonial.potentialExitValue)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="analysis-cockpit-subcard p-5">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target size={14} strokeWidth={1.5} className="analysis-icon" /> Scripts de negotiation
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
          {(scriptTab === "particulier" ? props.aiResult.scriptParticulier : props.aiResult.scriptAgence)?.map((line, index) => (
            <div key={`${scriptTab}-${index}`} className="analysis-script-line">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

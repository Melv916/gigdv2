import { useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Projection } from "@/lib/calculations";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  FileText,
  MapPin,
  Percent,
  Tag,
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

type SeuilType = {
  type: "ld-nue" | "meuble" | "coloc" | "lcd";
  label: string;
  seuil: number;
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
  hasRentForYield: boolean;
  rendementBrutCalc: number | null;
  rendementTargetReached: boolean;
  rendementAbove10: boolean;
  minRent8: number;
  marketPossibleRentMonthly: number;
  prixCibleRendement8: number;
  coutGlobalPrixCible: number;
  ecartNego: number;
  ecartNegoPct: number;
  seuilTypes: SeuilType[];
  projectStrategie: string;
  adr: number;
  params: ProjectHypotheses | null;
  marketStatus: MarketStatus;
  displayedDvf: string;
  marketRentRef: number;
  marketSourceLine: string | null;
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

  return (
    <div className="analysis-cockpit-card p-6 md:p-8">
      <div className="analysis-head-wrap mb-6">
        <div>
          <p className="analysis-label mb-2">Cockpit d'analyse</p>
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground">
            {props.title} · {props.strategyLabel}
          </h2>
        </div>
        <div className={`analysis-verdict ${
          props.aiResult.decision === "FONCEZ" ? "analysis-verdict-positive" :
          props.aiResult.decision === "TROP CHER" ? "analysis-verdict-negative" :
          "analysis-verdict-neutral"
        }`}>
          {props.aiResult.decision}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2"><TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Cash-flow</p>
          <p className="analysis-kpi">{props.aiResult.cashFlow}</p>
          <p className="text-xs text-muted-foreground">mensuel</p>
        </div>
        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2"><BarChart3 size={14} strokeWidth={1.5} className="analysis-icon" /> Rendement brut</p>
          <p className="analysis-kpi">{props.rendementBrutCalc !== null ? props.formatPct(props.rendementBrutCalc) : "n/a"}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className={`analysis-yield-badge ${!props.hasRentForYield ? "analysis-yield-badge-low" : props.rendementTargetReached ? "analysis-yield-badge-ok" : "analysis-yield-badge-low"}`}>
              {!props.hasRentForYield ? "Indispo (loyer manquant)" : props.rendementTargetReached ? "OK (>= 8%)" : "Sous objectif"}
            </span>
            {props.rendementAbove10 && <span className="analysis-yield-badge analysis-yield-badge-high">Au-dessus de la cible (10%+)</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {!props.hasRentForYield
              ? "Ajoute un loyer estime mensuel pour calculer le rendement brut."
              : props.rendementTargetReached
              ? "Objectif investisseur atteint (8-10%)."
              : <>Pour atteindre 8% de rendement brut, il faut un loyer &gt;= <span className="text-primary font-semibold">{props.formatEUR(props.minRent8)}/mois</span>.</>}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Rendement brut base sur loyer estime (hors charges, vacance, fiscalite).</p>
        </div>
        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2"><Percent size={14} strokeWidth={1.5} className="analysis-icon" /> Loyer possible estime</p>
          <p className="analysis-kpi">
            {props.marketPossibleRentMonthly > 0
              ? `${props.marketPossibleRentMonthly.toLocaleString("fr-FR")}€/mois`
              : props.aiResult.loyerEstime}
          </p>
          <p className="text-xs text-muted-foreground">marche local (city_market_prices)</p>
        </div>
        <div className="analysis-cockpit-subcard p-4">
          <p className="analysis-label flex items-center gap-2"><TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Loyer conseille (8% brut)</p>
          <p className="analysis-kpi">{props.minRent8 > 0 ? `${props.minRent8.toLocaleString("fr-FR")}€/mois` : "n/a"}</p>
          <p className="text-xs text-muted-foreground">Base prix annonce (fallback cout global)</p>
        </div>
      </div>

      <div className="analysis-cockpit-subcard p-5 mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target size={14} strokeWidth={1.5} className="analysis-icon" /> Negociation
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Tag, label: "Prix annonce", value: props.aiResult.prixAnnonce, sub: props.aiResult.prixM2 },
            { icon: Tag, label: "Prix cible (8% brut)", value: props.hasRentForYield && props.prixCibleRendement8 > 0 ? props.formatEUR(props.prixCibleRendement8) : "n/a", sub: "hors frais" },
            { icon: Tag, label: "Cout global cible", value: props.hasRentForYield && props.prixCibleRendement8 > 0 ? props.formatEUR(props.coutGlobalPrixCible) : "n/a", sub: "prix cible + notaire + travaux" },
            {
              icon: Target,
              label: "Ecart nego",
              value: props.hasRentForYield
                ? `${props.formatEUR(props.ecartNego)}${props.ecartNegoPct > 0 ? ` (${props.formatPct(props.ecartNegoPct)})` : ""}`
                : "n/a",
              sub: !props.hasRentForYield
                ? "loyer marche indisponible, ecart non calculable"
                : props.ecartNego > 0
                  ? "capital a negocier pour atteindre 8% brut"
                  : "pas besoin de negocier (8% brut deja atteint)",
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

      {props.seuilTypes.length > 0 && (
        <div className="analysis-cockpit-subcard p-5 mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp size={14} strokeWidth={1.5} className="analysis-icon" /> Seuil de loyer minimum (cash-flow = 0)
          </h4>
          <Tabs defaultValue={props.projectStrategie}>
            <TabsList className="bg-muted/30">
              {props.seuilTypes.map((s) => (
                <TabsTrigger key={s.type} value={s.type}>{s.label}</TabsTrigger>
              ))}
            </TabsList>
            {props.seuilTypes.map((s) => (
              <TabsContent key={s.type} value={s.type}>
                <div className="analysis-threshold-row">
                  <span className="text-sm text-muted-foreground">
                    {s.type === "lcd" ? "Revenu minimum mensuel" :
                     s.type === "coloc" ? "Loyer total minimum" :
                     `Loyer minimum (${s.label})`}
                  </span>
                  <span className="text-2xl font-display font-bold text-primary">{s.seuil.toLocaleString("fr-FR")}€/mois</span>
                </div>
                {s.type === "lcd" && props.adr > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Occupation minimum : {Math.ceil((s.seuil / props.adr / 30) * 100)}% ({Math.ceil(s.seuil / props.adr)} nuits/mois)
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
          <p className="text-[10px] text-muted-foreground mt-2">Hypotheses utilisees : notaire {props.params?.frais_notaire_pct}%, vacance {props.params?.vacance_locative} mois/an · Methode v0.1</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="analysis-cockpit-subcard p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Building2 size={14} strokeWidth={1.5} className="analysis-icon" /> Marche et donnees cles
          </h4>
          <div className="mb-3">
            <span className={`analysis-yield-badge ${
              props.marketStatus === "ok"
                ? "analysis-yield-badge-ok"
                : props.marketStatus === "processing"
                  ? "analysis-yield-badge-high"
                  : "analysis-yield-badge-low"
            }`}>
              Enrichissement marche: {props.marketStatus === "ok" ? "OK" : props.marketStatus === "processing" ? "En cours" : "Indispo"}
            </span>
          </div>
          <div className="space-y-2">
            {[
              { icon: MapPin, label: "Prix moyen marche (ville)", value: props.displayedDvf },
              { icon: TrendingUp, label: "Loyer marche (m2)", value: props.marketRentRef > 0 ? `${Math.round(props.marketRentRef).toLocaleString("fr-FR")}€/m2` : "n/a" },
              { icon: FileText, label: "Cash-flow mensuel", value: props.aiResult.cashFlow },
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
          {props.marketSourceLine && (
            <p className="text-[10px] text-muted-foreground mt-1">{props.marketSourceLine}</p>
          )}
          <p className="text-[10px] text-muted-foreground mt-3 border border-border/40 rounded-full inline-flex px-2 py-0.5">
            Hypotheses v0.1 · city_market_prices
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
                {props.pointsFortsDecision.length > 0 ? props.pointsFortsDecision.map((g, i) => (
                  <li key={i}><span className="text-foreground">{g.point}</span> <span className="text-green-400">({g.impact})</span></li>
                )) : <li>Aucun point positif detecte.</li>}
              </ul>
            </div>
            <div>
              <p className="analysis-label mb-2 flex items-center gap-2"><AlertTriangle size={13} strokeWidth={1.5} className="text-amber-400" /> Points faibles / risques</p>
              <ul className="analysis-list">
                {props.pointsFaiblesDecision.length > 0 ? props.pointsFaiblesDecision.map((r, i) => (
                  <li key={i}><span className="text-foreground">{r.flag}</span> <span className="text-amber-400">(Impact : {r.impact})</span></li>
                )) : <li>Aucun risque majeur detecte.</li>}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {props.projections.map((p) => (
              <div key={p.annee} className="analysis-kpi-box">
                <p className="analysis-label mb-2">A {p.annee} ans</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Valeur du bien</span><span className="text-foreground font-semibold">{props.formatEUR(p.valeurBien)} {props.projectionBase > 0 ? <span className="text-cyan-300">({props.formatPct((p.valeurBien / props.projectionBase) * 100)})</span> : null}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Capital rembourse</span><span className="text-foreground font-semibold">{p.capitalRembourse.toLocaleString("fr-FR")}€</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Cash-flow cumule</span><span className={`font-semibold ${p.cashFlowCumule >= 0 ? "text-green-400" : "text-destructive"}`}>{props.formatEUR(p.cashFlowCumule)} {props.projectionBase > 0 ? <span className="text-cyan-300">({props.formatPct((p.cashFlowCumule / props.projectionBase) * 100)})</span> : null}</span></div>
                  <div className="flex justify-between border-t border-border/30 pt-1 mt-1"><span className="text-muted-foreground">Valeur nette creee</span><span className={`font-bold ${p.valeurNette >= 0 ? "text-primary" : "text-destructive"}`}>{props.formatEUR(p.valeurNette)} {props.projectionBase > 0 ? <span className="text-cyan-300">({props.formatPct((p.valeurNette / props.projectionBase) * 100)})</span> : null}</span></div>
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
                  tickFormatter={(v) => `${v} ans`}
                  stroke="rgba(219,232,255,0.75)"
                  fontSize={11}
                />
                <YAxis stroke="rgba(219,232,255,0.75)" fontSize={11} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip content={props.renderProjectionTooltip} />
                <Area type="monotone" dataKey="valeurNette" stroke="#2F8CFF" strokeWidth={3} fill="url(#netGradient)" />
                <Area type="monotone" dataKey="cashFlowCumule" stroke="#22D3EE" strokeWidth={2.5} fill="url(#cashGradient)" />
                <Line type="monotone" dataKey="valeurBien" stroke="#8fb5ff" strokeWidth={1.8} strokeDasharray="4 4" dot={{ r: 3, fill: "#8fb5ff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="analysis-line-legend">
            <span><i style={{ background: "#2F8CFF" }} /> Valeur nette creee</span>
            <span><i style={{ background: "#22D3EE" }} /> Cash-flow cumule</span>
            <span><i style={{ background: "#8fb5ff" }} /> Valeur du bien</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Hypotheses : valeur +{props.params?.croissance_valeur}%/an, loyers +{props.params?.croissance_loyers}%/an, charges +{props.params?.inflation_charges}%/an · Methode v0.1
          </p>
        </div>
      )}

      <div className="analysis-cockpit-subcard p-5">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target size={14} strokeWidth={1.5} className="analysis-icon" /> Scripts de negociation
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
          {(scriptTab === "particulier" ? props.aiResult.scriptParticulier : props.aiResult.scriptAgence)?.map((s, i) => (
            <div key={i} className="analysis-script-line">{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

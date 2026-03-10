import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Link2, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProjectHeaderProps = {
  projectName: string;
  objectiveLabel: string;
  strategyLabel: string;
  financingLabel: string;
  onToggleSettings: () => void;
};

export function ProjectHeaderBar(props: ProjectHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Link to="/app/projets" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{props.projectName}</h1>
          <p className="text-xs text-muted-foreground">
            {props.objectiveLabel} · {props.strategyLabel} · {props.financingLabel}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={props.onToggleSettings}>
        <Settings size={14} /> Parametres
      </Button>
    </div>
  );
}

type EditableProjectSettings = {
  financement: string;
  frais_notaire_pct: number;
  vacance_locative: number;
  croissance_valeur: number;
  croissance_loyers: number;
  taux_interet: number;
  duree_credit: number;
  apport: number;
  assurance_emprunteur: number;
};

type ProjectSettingsPanelProps = {
  project: EditableProjectSettings;
  onUpdate: (key: string, value: number) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function ProjectSettingsPanel(props: ProjectSettingsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="analysis-cockpit-card mb-6 p-6"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Parametres du projet <span className="text-xs text-primary">Methode v0.1</span>
      </h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Frais notaire (%)</Label>
          <Input
            type="number"
            step="0.5"
            value={props.project.frais_notaire_pct}
            onChange={(e) => props.onUpdate("frais_notaire_pct", +e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Vacance (mois/an)</Label>
          <Input
            type="number"
            value={props.project.vacance_locative}
            onChange={(e) => props.onUpdate("vacance_locative", +e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Croiss. valeur (%)</Label>
          <Input
            type="number"
            step="0.5"
            value={props.project.croissance_valeur}
            onChange={(e) => props.onUpdate("croissance_valeur", +e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Croiss. loyers (%)</Label>
          <Input
            type="number"
            step="0.5"
            value={props.project.croissance_loyers}
            onChange={(e) => props.onUpdate("croissance_loyers", +e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>

        {props.project.financement === "credit" && (
          <>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Taux interet (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={props.project.taux_interet}
                onChange={(e) => props.onUpdate("taux_interet", +e.target.value)}
                className="h-9 border-border/50 bg-muted/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Duree credit (ans)</Label>
              <Input
                type="number"
                value={props.project.duree_credit}
                onChange={(e) => props.onUpdate("duree_credit", +e.target.value)}
                className="h-9 border-border/50 bg-muted/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Apport (€)</Label>
              <Input
                type="number"
                value={props.project.apport}
                onChange={(e) => props.onUpdate("apport", +e.target.value)}
                className="h-9 border-border/50 bg-muted/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Assurance (%/an)</Label>
              <Input
                type="number"
                step="0.01"
                value={props.project.assurance_emprunteur}
                onChange={(e) => props.onUpdate("assurance_emprunteur", +e.target.value)}
                className="h-9 border-border/50 bg-muted/30 text-sm"
              />
            </div>
          </>
        )}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={props.onCancel}>
          Annuler
        </Button>
        <Button variant="hero" size="sm" onClick={props.onSave}>
          Sauvegarder
        </Button>
      </div>
    </motion.div>
  );
}

type AnalysisInputCardProps = {
  url: string;
  onUrlChange: (value: string) => void;
  isAnalyzing: boolean;
  manualPrix: number;
  onManualPrixChange: (value: number) => void;
  manualSurface: number;
  onManualSurfaceChange: (value: number) => void;
  manualCP: string;
  onManualCPChange: (value: string) => void;
  travaux: number;
  onTravauxChange: (value: number) => void;
  chargesMensuelles: number;
  onChargesMensuellesChange: (value: number) => void;
  taxeFonciere: number;
  onTaxeFonciereChange: (value: number) => void;
  loyerEstime: number;
  onLoyerEstimeChange: (value: number) => void;
  adr: number;
  onAdrChange: (value: number) => void;
  autresCouts: number;
  onAutresCoutsChange: (value: number) => void;
  occupationCible: number;
  onOccupationCibleChange: (value: number) => void;
  projectStrategie: string;
  analysisStep: "idle" | "scraping" | "analyzing" | "done";
  onRun: () => void;
};

export function AnalysisInputCard(props: AnalysisInputCardProps) {
  return (
    <div className="analysis-cockpit-card mb-6 p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Analyser un bien</h3>
      <Tabs defaultValue="url" className="space-y-4">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="url">Lien annonce</TabsTrigger>
          <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <div className="flex items-center gap-2 rounded-lg bg-muted/20 p-1.5">
            <Link2 size={16} className="ml-2 shrink-0 text-muted-foreground" />
            <input
              value={props.url}
              onChange={(e) => props.onUrlChange(e.target.value)}
              placeholder="https://www.seloger.com/annonces/achat/..."
              className="w-full bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              disabled={props.isAnalyzing}
            />
          </div>
        </TabsContent>
        <TabsContent value="manual">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs">Prix (€)</Label>
              <Input
                type="number"
                value={props.manualPrix || ""}
                onChange={(e) => props.onManualPrixChange(+e.target.value)}
                className="h-9 border-border/50 bg-muted/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Surface (m2)</Label>
              <Input
                type="number"
                value={props.manualSurface || ""}
                onChange={(e) => props.onManualSurfaceChange(+e.target.value)}
                className="h-9 border-border/50 bg-muted/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Code postal</Label>
              <Input
                value={props.manualCP}
                onChange={(e) => props.onManualCPChange(e.target.value)}
                className="h-9 border-border/50 bg-muted/30 text-sm"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1">
          <Label className="text-xs">Travaux (€)</Label>
          <Input
            type="number"
            value={props.travaux || ""}
            onChange={(e) => props.onTravauxChange(+e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Charges/mois (€)</Label>
          <Input
            type="number"
            value={props.chargesMensuelles || ""}
            onChange={(e) => props.onChargesMensuellesChange(+e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Taxe fonciere/an (€)</Label>
          <Input
            type="number"
            value={props.taxeFonciere || ""}
            onChange={(e) => props.onTaxeFonciereChange(+e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{props.projectStrategie === "lcd" ? "ADR (€/nuit)" : "Loyer estime (€/mois)"}</Label>
          <Input
            type="number"
            value={props.projectStrategie === "lcd" ? props.adr || "" : props.loyerEstime || ""}
            onChange={(e) =>
              props.projectStrategie === "lcd"
                ? props.onAdrChange(+e.target.value)
                : props.onLoyerEstimeChange(+e.target.value)
            }
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-1">
          <Label className="text-xs">Autres couts (€)</Label>
          <Input
            type="number"
            value={props.autresCouts || ""}
            onChange={(e) => props.onAutresCoutsChange(+e.target.value)}
            className="h-9 border-border/50 bg-muted/30 text-sm"
          />
        </div>
        {props.projectStrategie === "lcd" && (
          <div className="space-y-1">
            <Label className="text-xs">Occupation cible (%)</Label>
            <Input
              type="number"
              value={props.occupationCible}
              onChange={(e) => props.onOccupationCibleChange(+e.target.value)}
              className="h-9 border-border/50 bg-muted/30 text-sm"
            />
          </div>
        )}
      </div>

      <Button variant="hero" className="mt-4 w-full" onClick={props.onRun} disabled={props.isAnalyzing}>
        {props.analysisStep === "scraping" ? (
          <>
            <Loader2 className="animate-spin" size={16} /> Lecture de l'annonce...
          </>
        ) : props.analysisStep === "analyzing" ? (
          <>
            <Loader2 className="animate-spin" size={16} /> Analyse en cours...
          </>
        ) : (
          "Lancer l'analyse"
        )}
      </Button>
    </div>
  );
}

type ListingInfoCardProps = {
  listing: any;
};

export function ListingInfoCard(props: ListingInfoCardProps) {
  return (
    <div className="analysis-cockpit-card mb-6 flex flex-wrap items-center gap-4 p-4">
      <Home size={18} className="shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {props.listing.titre || `${props.listing.typeLocal} ${props.listing.pieces}p`}
        </p>
        <p className="text-xs text-muted-foreground">
          {props.listing.ville} {props.listing.codePostal} - {props.listing.surface}m2 - {props.listing.prix?.toLocaleString("fr-FR")}€
          {props.listing.dpe ? ` - DPE ${props.listing.dpe}` : ""}
        </p>
      </div>
    </div>
  );
}

type FinancialSummaryCardsProps = {
  fraisNotaire: number;
  coutGlobal: number;
  mensualiteCredit: number;
  assuranceMensuelle: number;
  capitalEmprunte: number;
  fraisNotairePct: number;
  financement: string;
  dureeCredit: number;
  tauxInteret: number;
};

type FinancialSummaryCard = {
  label: string;
  value: string;
  sub: string;
};

export function FinancialSummaryCards(props: FinancialSummaryCardsProps) {
  const cards: FinancialSummaryCard[] = [
    {
      label: "Frais de notaire",
      value: `${props.fraisNotaire.toLocaleString("fr-FR")}€`,
      sub: `${props.fraisNotairePct}% du prix`,
    },
    {
      label: "Cout global",
      value: `${props.coutGlobal.toLocaleString("fr-FR")}€`,
      sub: "Achat + notaire + travaux",
    },
  ];

  if (props.financement === "credit") {
    cards.push(
      {
        label: "Mensualite credit",
        value: `${props.mensualiteCredit.toLocaleString("fr-FR")}€/mois`,
        sub: `+ ${props.assuranceMensuelle}€ assurance`,
      },
      {
        label: "Capital emprunte",
        value: `${props.capitalEmprunte.toLocaleString("fr-FR")}€`,
        sub: `${props.dureeCredit} ans a ${props.tauxInteret}%`,
      },
    );
  }

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="analysis-cockpit-subcard p-4">
          <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">{card.label}</p>
          <p className="font-display text-lg font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}

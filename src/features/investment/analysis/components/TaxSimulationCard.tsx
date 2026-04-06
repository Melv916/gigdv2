import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type {
  AppPlan,
  InvestmentAnalysis,
  InvestorObjective,
  OwnershipMode,
  ProjectTaxSettingsInput,
  TaxComparisonRow,
  TaxRegime,
  TaxRegimeOption,
} from "@/lib/investment/tax";
import { TaxRegimeInfoCard } from "./TaxRegimeInfoCard";

const exploitationLabels = {
  location_nue: "Location nue",
  location_meublee: "Meuble",
  colocation: "Colocation",
  location_courte_duree: "LCD",
} as const;

const ownershipLabels: Record<OwnershipMode, string> = {
  nom_propre: "Nom propre",
  sci: "SCI",
  holding: "Holding",
  sci_avec_holding: "SCI avec holding",
};

const visibleOwnershipModes: OwnershipMode[] = ["nom_propre", "sci"];

const objectiveLabels: Record<InvestorObjective, string> = {
  cashflow_immediat: "Cash immediat",
  patrimoine_long_terme: "Patrimoine",
  reinvestissement_societe: "Reinvestissement",
  optimisation_fiscale: "Optimisation fiscale",
  remontee_tresorerie: "Remontee de cash",
};

interface TaxSimulationCardProps {
  plan: AppPlan;
  availableRegimeOptions: TaxRegimeOption[];
  compatibilityWarnings: string[];
  paywallRequired: boolean;
  taxSettings: ProjectTaxSettingsInput;
  comparisonRegimes: TaxRegime[];
  selectedRegimeOption: TaxRegimeOption | null;
  primaryAnalysis: InvestmentAnalysis | null;
  comparisonRows: TaxComparisonRow[];
  onChange: <K extends keyof ProjectTaxSettingsInput>(key: K, value: ProjectTaxSettingsInput[K]) => void;
  onToggleComparisonRegime: (regime: TaxRegime) => void;
  formatEUR: (value: number) => string;
  formatPct: (value: number) => string;
}

function selectBtn(active: boolean) {
  return `rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border/50 bg-muted/20 text-muted-foreground hover:border-primary/40"
  }`;
}

export function TaxSimulationCard(props: TaxSimulationCardProps) {
  const planLabel =
    props.plan === "avance" ? "Avance" : props.plan === "investisseur" ? "Investisseur" : "Free / Debutant";
  const annualTaxAmount = props.primaryAnalysis
    ? props.primaryAnalysis.fiscal.taxAmount +
      props.primaryAnalysis.fiscal.socialContributions +
      props.primaryAnalysis.fiscal.dividendsTax
    : 0;

  return (
    <div className="analysis-cockpit-card p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="analysis-label mb-2">Simulation fiscale</p>
          <h3 className="text-xl font-display font-bold text-foreground">Lecture fiscale et comparatif de regimes</h3>
        </div>
        <span className="rounded-full border border-border/50 px-3 py-1 text-xs text-muted-foreground">
          Plan : {planLabel}
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="analysis-cockpit-subcard p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Etape 1</p>
            <h4 className="mt-1 text-sm font-semibold text-foreground">Comment exploitez-vous ce bien ?</h4>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {Object.entries(exploitationLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={selectBtn(props.taxSettings.exploitationMode === key)}
                  onClick={() => props.onChange("exploitationMode", key as ProjectTaxSettingsInput["exploitationMode"])}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="analysis-cockpit-subcard p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Etape 2</p>
            <h4 className="mt-1 text-sm font-semibold text-foreground">Comment achetez-vous ?</h4>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {visibleOwnershipModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={selectBtn(props.taxSettings.ownershipMode === mode)}
                  onClick={() => props.onChange("ownershipMode", mode)}
                >
                  {ownershipLabels[mode]}
                </button>
              ))}
            </div>
          </div>

          <div className="analysis-cockpit-subcard p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Etape 3</p>
            <h4 className="mt-1 text-sm font-semibold text-foreground">Quel regime voulez-vous tester ?</h4>
            {props.paywallRequired ? (
              <div className="mt-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
                <p className="text-sm text-foreground">
                  La couche fiscale detaillee est reservee aux plans Investisseur et Avance.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Le plan Free conserve la lecture economique brute. Passez au plan superieur pour debloquer les regimes fiscaux,
                  le cash-flow apres impot et le comparatif.
                </p>
                <Button asChild variant="hero" size="sm" className="mt-4">
                  <Link to="/app/abonnement">Voir les abonnements</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {props.availableRegimeOptions.map((option) => (
                    <button
                      key={option.regime}
                      type="button"
                      className={selectBtn(props.taxSettings.taxRegime === option.regime)}
                      onClick={() => props.onChange("taxRegime", option.regime)}
                    >
                      <p className="font-medium">{option.label}</p>
                      <p className="mt-1 text-xs opacity-80">{option.shortDescription}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">TMI (%)</Label>
                    <Input
                      type="number"
                      step="1"
                      value={props.taxSettings.tmi * 100}
                      onChange={(event) => props.onChange("tmi", Number(event.target.value) / 100)}
                      className="h-9 border-border/50 bg-muted/30 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Prelevements sociaux (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={props.taxSettings.socialRate * 100}
                      onChange={(event) => props.onChange("socialRate", Number(event.target.value) / 100)}
                      className="h-9 border-border/50 bg-muted/30 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Taux IS (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={props.taxSettings.corporateTaxRate * 100}
                      onChange={(event) => props.onChange("corporateTaxRate", Number(event.target.value) / 100)}
                      className="h-9 border-border/50 bg-muted/30 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Compta annuelle (EUR)</Label>
                    <Input
                      type="number"
                      value={props.taxSettings.accountingFees}
                      onChange={(event) => props.onChange("accountingFees", Number(event.target.value))}
                      className="h-9 border-border/50 bg-muted/30 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Mobilier amortissable (EUR)</Label>
                    <Input
                      type="number"
                      value={props.taxSettings.furnitureAmount}
                      onChange={(event) => props.onChange("furnitureAmount", Number(event.target.value))}
                      className="h-9 border-border/50 bg-muted/30 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Objectif investisseur</Label>
                    <select
                      value={props.taxSettings.investorObjective}
                      onChange={(event) => props.onChange("investorObjective", event.target.value as InvestorObjective)}
                      className="h-9 w-full rounded-md border border-border/50 bg-muted/30 px-3 text-sm text-foreground"
                    >
                      {(Object.keys(objectiveLabels) as InvestorObjective[]).map((objective) => (
                        <option key={objective} value={objective}>
                          {objectiveLabels[objective]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={props.taxSettings.amortizationEnabled}
                      onCheckedChange={(checked) => props.onChange("amortizationEnabled", checked === true)}
                    />
                    Amortissements actives
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={props.taxSettings.reducedCorporateTaxEligible}
                      onCheckedChange={(checked) => props.onChange("reducedCorporateTaxEligible", checked === true)}
                    />
                    Taux IS reduit eligible
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={props.taxSettings.reinvestInsteadOfDistribute}
                      onCheckedChange={(checked) => props.onChange("reinvestInsteadOfDistribute", checked === true)}
                    />
                    Reinvestir au lieu de distribuer
                  </label>
                </div>
              </>
            )}

            {props.compatibilityWarnings.length > 0 && (
              <div className="mt-4 space-y-2">
                {props.compatibilityWarnings.map((warning) => (
                  <div
                    key={warning}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200"
                  >
                    {warning}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <TaxRegimeInfoCard option={props.selectedRegimeOption} />
      </div>

      {!props.paywallRequired && props.primaryAnalysis && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-6">
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Mode de detention</p>
              <p className="analysis-kpi text-2xl">{ownershipLabels[props.taxSettings.ownershipMode]}</p>
            </div>
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Regime retenu</p>
              <p className="analysis-kpi text-2xl">{props.selectedRegimeOption?.label || props.taxSettings.taxRegime}</p>
            </div>
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Base taxable annuelle</p>
              <p className="analysis-kpi text-2xl">{props.formatEUR(props.primaryAnalysis.fiscal.taxableIncome)}</p>
            </div>
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Impot estime annuel</p>
              <p className="analysis-kpi text-2xl">{props.formatEUR(annualTaxAmount)}</p>
            </div>
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Cash-flow apres impot annuel</p>
              <p className="analysis-kpi text-2xl">{props.formatEUR(props.primaryAnalysis.fiscal.postTaxCashflow)}</p>
            </div>
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Cash-flow apres impot mensuel</p>
              <p className="analysis-kpi text-2xl">{props.formatEUR(props.primaryAnalysis.fiscal.postTaxCashflow / 12)}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Rendement net-net annuel</p>
              <p className="analysis-kpi text-2xl">{props.formatPct(props.primaryAnalysis.fiscal.netNetYield * 100)}</p>
            </div>
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Complexite</p>
              <p className="analysis-kpi text-2xl">{props.primaryAnalysis.fiscal.complexity}</p>
            </div>
            <div className="analysis-cockpit-subcard p-4">
              <p className="analysis-label">Objectif fiscal</p>
              <p className="text-sm text-foreground mt-2">{props.primaryAnalysis.fiscal.coherenceWithObjective}</p>
            </div>
          </div>

          <div className="analysis-cockpit-subcard p-5">
            <h4 className="text-sm font-semibold text-foreground">Hypotheses et avertissements</h4>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Hypotheses retenues</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {props.primaryAnalysis.fiscal.assumptions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Warnings</p>
                <ul className="mt-2 space-y-1 text-xs text-amber-300">
                  {props.primaryAnalysis.fiscal.warnings.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="analysis-cockpit-subcard p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-foreground">Comparer un autre regime</h4>
                <p className="text-xs text-muted-foreground">Jusqu'a 4 regimes compatibles.</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Rendement net-net annuel : {props.formatPct(props.primaryAnalysis.fiscal.netNetYield * 100)}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {props.availableRegimeOptions.map((option) => {
                const isSelected =
                  option.regime === props.taxSettings.taxRegime || props.comparisonRegimes.includes(option.regime);
                return (
                  <button
                    key={option.regime}
                    type="button"
                    className={selectBtn(isSelected)}
                    onClick={() => props.onToggleComparisonRegime(option.regime)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-2 pr-4">Regime</th>
                    <th className="pb-2 pr-4">Cash-flow avant impot annuel</th>
                    <th className="pb-2 pr-4">Impot annuel</th>
                    <th className="pb-2 pr-4">Cash-flow apres impot annuel</th>
                    <th className="pb-2 pr-4">Rendement net-net annuel</th>
                    <th className="pb-2 pr-4">Complexite</th>
                    <th className="pb-2">Notes / alertes</th>
                  </tr>
                </thead>
                <tbody>
                  {props.comparisonRows.map((row) => (
                    <tr key={row.regime} className="border-b border-border/20 align-top text-muted-foreground">
                      <td className="py-3 pr-4 text-foreground">{row.regime}</td>
                      <td className="py-3 pr-4">{props.formatEUR(row.cashflowBeforeTax)}</td>
                      <td className="py-3 pr-4">{props.formatEUR(row.taxAmount)}</td>
                      <td className="py-3 pr-4 text-foreground">{props.formatEUR(row.cashflowAfterTax)}</td>
                      <td className="py-3 pr-4">{props.formatPct(row.netNetYield * 100)}</td>
                      <td className="py-3 pr-4">{row.complexity}</td>
                      <td className="py-3 text-xs">
                        <p>{row.coherenceWithObjective}</p>
                        {row.warnings[0] ? <p className="mt-1 text-amber-300">{row.warnings[0]}</p> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

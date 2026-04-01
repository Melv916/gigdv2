import { TAX_REGIME_OPTIONS } from "./assumptions";
import type {
  AppPlan,
  CompatibilityDiagnostics,
  ExploitationMode,
  OwnershipMode,
  TaxRegime,
} from "./types";

function hasStandardTaxAccess(plan: AppPlan): boolean {
  return plan === "investisseur" || plan === "avance";
}

function hasAdvancedTaxAccess(plan: AppPlan): boolean {
  return plan === "avance";
}

function baseCompatibility(ownershipMode: OwnershipMode, exploitationMode: ExploitationMode): TaxRegime[] {
  if (ownershipMode === "nom_propre" && exploitationMode === "location_nue") {
    return ["micro_foncier", "reel_foncier"];
  }
  if (
    ownershipMode === "nom_propre" &&
    (exploitationMode === "location_meublee" ||
      exploitationMode === "colocation" ||
      exploitationMode === "location_courte_duree")
  ) {
    return ["lmnp_micro_bic", "lmnp_reel", "lmp_micro_bic", "lmp_reel"];
  }
  if (ownershipMode === "sci" && exploitationMode === "location_nue") {
    return ["sci_ir", "sci_is"];
  }
  if (ownershipMode === "sci" && exploitationMode !== "location_nue") {
    return ["sci_is"];
  }
  if (ownershipMode === "holding") {
    return ["holding_is_remontee_dividendes"];
  }
  if (ownershipMode === "sci_avec_holding") {
    return ["sci_is_holding_mere_fille"];
  }
  return [];
}

export function resolveAvailableTaxRegimes(
  plan: AppPlan,
  ownershipMode: OwnershipMode,
  exploitationMode: ExploitationMode,
): TaxRegime[] {
  const base = baseCompatibility(ownershipMode, exploitationMode);
  if (!hasStandardTaxAccess(plan)) return [];

  return base.filter((regime) => {
    const option = TAX_REGIME_OPTIONS[regime];
    if (!option) return false;
    if (option.advancedOnly) return hasAdvancedTaxAccess(plan);
    return true;
  });
}

export function resolveTaxCompatibilityDiagnostics(
  plan: AppPlan,
  ownershipMode: OwnershipMode,
  exploitationMode: ExploitationMode,
): CompatibilityDiagnostics {
  const warnings: string[] = [];
  const paywallRequired = !hasStandardTaxAccess(plan);

  if (paywallRequired) {
    warnings.push("La simulation fiscale detaillee est reservee aux plans Investisseur et Avance.");
  }

  if (ownershipMode === "sci" && exploitationMode !== "location_nue") {
    warnings.push("Cas complexe: location meublee en SCI a valider avec un professionnel avant decision.");
  }

  if ((ownershipMode === "holding" || ownershipMode === "sci_avec_holding") && !hasAdvancedTaxAccess(plan)) {
    warnings.push("Les montages holding et mere-fille sont reserves au plan Avance.");
  }

  const regimes = resolveAvailableTaxRegimes(plan, ownershipMode, exploitationMode);
  if (hasStandardTaxAccess(plan) && regimes.length === 0) {
    warnings.push("Aucun regime compatible n'est propose pour cette combinaison dans la phase actuelle.");
  }

  return {
    regimes,
    warnings,
    paywallRequired,
  };
}

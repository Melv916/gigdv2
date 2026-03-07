export function computeAcquisitionCost(input: {
  prix_achat: number;
  frais_notaire: number;
  frais_agence: number;
  travaux: number;
  mobilier: number;
  frais_dossier_garantie: number;
}): number {
  return (
    input.prix_achat +
    input.frais_notaire +
    input.frais_agence +
    input.travaux +
    input.mobilier +
    input.frais_dossier_garantie
  );
}

export function computeRentFigures(loyerHc: number, chargesLocatives: number, vacanceMois: number) {
  const loyers_annuels_bruts = (loyerHc + chargesLocatives) * 12;
  const vacance = (loyerHc + chargesLocatives) * vacanceMois;
  const loyers_annuels_effectifs = loyers_annuels_bruts - vacance;
  return { loyers_annuels_bruts, vacance, loyers_annuels_effectifs };
}

export function computeOwnerCharges(input: {
  loyer_hc: number;
  gestion_pct: number;
  glis_pct: number;
  entretien_pct: number;
  taxe_fonciere_an: number;
  assurance_pno_an: number;
  charges_copro_nonrecup_an: number;
  compta_an?: number;
}) {
  const annualHc = input.loyer_hc * 12;
  const gestion = annualHc * input.gestion_pct;
  const glis = annualHc * input.glis_pct;
  const entretien = annualHc * input.entretien_pct;
  const charges_total =
    input.taxe_fonciere_an +
    input.assurance_pno_an +
    input.charges_copro_nonrecup_an +
    gestion +
    glis +
    entretien +
    (input.compta_an ?? 0);
  return { gestion, glis, entretien, charges_total };
}

export function computeYields(
  loyerHcAnnual: number,
  coutTotal: number,
  chargesTotal: number,
  impotsAnnuel: number
) {
  if (coutTotal <= 0) {
    return { rendement_brut: 0, rendement_net: 0, rendement_net_net: 0 };
  }
  const rendement_brut = loyerHcAnnual / coutTotal;
  const rendement_net = (loyerHcAnnual - chargesTotal) / coutTotal;
  const rendement_net_net = (loyerHcAnnual - chargesTotal - impotsAnnuel) / coutTotal;
  return { rendement_brut, rendement_net, rendement_net_net };
}

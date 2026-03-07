import { pctToRate } from "./config";

export interface LoanPaymentResult {
  mensualite_hors_ass: number;
  assurance_mens: number;
  mensualite_totale: number;
}

export function computeMonthlyPayment(
  montantPret: number,
  tauxNominal: number,
  assurancePct: number,
  dureeAnnees: number
): LoanPaymentResult {
  if (montantPret <= 0 || dureeAnnees <= 0) {
    return { mensualite_hors_ass: 0, assurance_mens: 0, mensualite_totale: 0 };
  }

  const i = pctToRate(tauxNominal) / 12;
  const n = Math.max(1, Math.round(dureeAnnees * 12));
  const mensualite_hors_ass =
    i === 0 ? montantPret / n : (montantPret * (i * (1 + i) ** n)) / ((1 + i) ** n - 1);
  const assurance_mens = (montantPret * pctToRate(assurancePct)) / 12;
  const mensualite_totale = mensualite_hors_ass + assurance_mens;

  return { mensualite_hors_ass, assurance_mens, mensualite_totale };
}

export function remainingPrincipal(
  montantPret: number,
  tauxNominal: number,
  dureeAnnees: number,
  mensualiteHorsAss: number,
  elapsedMonths: number
): number {
  if (montantPret <= 0) return 0;
  const i = pctToRate(tauxNominal) / 12;
  const n = Math.max(1, Math.round(dureeAnnees * 12));
  const m = Math.max(0, Math.min(Math.round(elapsedMonths), n));

  if (i === 0) {
    return Math.max(0, montantPret - mensualiteHorsAss * m);
  }

  const numerator = (1 + i) ** n - (1 + i) ** m;
  const denominator = (1 + i) ** n - 1;
  return Math.max(0, montantPret * (numerator / denominator));
}

// Financial calculations for real estate investment analysis

export interface ProjectParams {
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
}

export interface AnalysisInput {
  prix: number;
  surface: number;
  travaux: number;
  chargesMensuelles: number;
  taxeFonciere: number;
  loyerEstime: number;
  autresCouts: number;
  adr?: number;
  occupationCible?: number;
}

export function calcFraisNotaire(prix: number, pct: number) {
  return Math.round(prix * (pct / 100));
}

export function calcCoutGlobal(prix: number, fraisNotaire: number, travaux: number, autres: number) {
  return prix + fraisNotaire + travaux + autres;
}

export function calcMensualiteCredit(capital: number, tauxAnnuel: number, dureeAnnees: number) {
  if (capital <= 0 || tauxAnnuel <= 0 || dureeAnnees <= 0) return 0;
  const tauxMensuel = tauxAnnuel / 100 / 12;
  const nbMois = dureeAnnees * 12;
  return Math.round(capital * tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -nbMois)));
}

export function calcAssuranceMensuelle(capitalEmprunte: number, tauxAssurance: number) {
  return Math.round((capitalEmprunte * tauxAssurance / 100) / 12);
}

export function calcSeuilLoyerMinimum(
  params: ProjectParams,
  prix: number,
  travaux: number,
  chargesMensuelles: number,
  taxeFonciere: number,
  autresCouts: number,
  type: "ld-nue" | "meuble" | "coloc" | "lcd"
) {
  const fraisNotaire = calcFraisNotaire(prix, params.frais_notaire_pct);
  const coutGlobal = calcCoutGlobal(prix, fraisNotaire, travaux, autresCouts);

  let mensualiteCredit = 0;
  let assurance = 0;
  if (params.financement === "credit") {
    const capitalEmprunte = coutGlobal - params.apport;
    mensualiteCredit = calcMensualiteCredit(capitalEmprunte, params.taux_interet, params.duree_credit);
    assurance = calcAssuranceMensuelle(capitalEmprunte, params.assurance_emprunteur);
  }

  const chargesFixes = mensualiteCredit + assurance + chargesMensuelles + params.charges_non_recup + (taxeFonciere / 12);
  const occupationRate = (12 - params.vacance_locative) / 12;

  // Seuil = charges fixes / taux d'occupation
  const seuilBase = Math.round(chargesFixes / occupationRate);

  // Strategy-specific adjustments for operating complexity/risk profile.
  // The output remains a "minimum monthly revenue" target for cash-flow >= 0.
  switch (type) {
    case "ld-nue":
      return seuilBase;
    case "meuble":
      return Math.round(seuilBase * 1.03);
    case "coloc":
      return Math.round(seuilBase * 1.08);
    case "lcd":
      return Math.round(seuilBase * 1.2);
    default:
      return seuilBase;
  }
}

export interface Projection {
  annee: number;
  valeurBien: number;
  capitalRembourse: number;
  capitalRestant: number;
  cashFlowCumule: number;
  valeurNette: number;
}

export function calcProjections(
  params: ProjectParams,
  prix: number,
  loyerMensuel: number,
  chargesMensuelles: number,
  taxeFonciere: number,
  travaux: number,
  autresCouts: number,
  horizons: number[] = [5, 10, 20]
): Projection[] {
  const fraisNotaire = calcFraisNotaire(prix, params.frais_notaire_pct);
  const coutGlobal = calcCoutGlobal(prix, fraisNotaire, travaux, autresCouts);

  let capitalEmprunte = 0;
  let mensualiteCredit = 0;
  let assurance = 0;
  if (params.financement === "credit") {
    capitalEmprunte = coutGlobal - params.apport;
    mensualiteCredit = calcMensualiteCredit(capitalEmprunte, params.taux_interet, params.duree_credit);
    assurance = calcAssuranceMensuelle(capitalEmprunte, params.assurance_emprunteur);
    // Add credit duration to horizons
    if (!horizons.includes(params.duree_credit)) {
      horizons.push(params.duree_credit);
    }
  }

  horizons.sort((a, b) => a - b);

  const tauxMensuel = params.taux_interet / 100 / 12;
  let capitalRestant = capitalEmprunte;
  let cashFlowCumule = -(params.apport + travaux + autresCouts + fraisNotaire);
  // If comptant, initial outlay is full cost
  if (params.financement === "comptant") {
    cashFlowCumule = -coutGlobal;
  }

  const results: Projection[] = [];
  let loyerCourant = loyerMensuel;
  let chargesCourantes = chargesMensuelles + params.charges_non_recup;
  let tfCourante = taxeFonciere;

  for (let annee = 1; annee <= Math.max(...horizons); annee++) {
    const occupationMois = 12 - params.vacance_locative;
    const revenuAnnuel = loyerCourant * occupationMois;
    const chargesAnnuelles = chargesCourantes * 12 + tfCourante;
    const creditAnnuel = (mensualiteCredit + assurance) * 12;

    // Capital remboursé this year
    let capitalRembourseCetteAnnee = 0;
    if (capitalEmprunte > 0 && annee <= params.duree_credit) {
      for (let m = 0; m < 12; m++) {
        if (capitalRestant <= 0) break;
        const interets = capitalRestant * tauxMensuel;
        const principal = Math.min(mensualiteCredit - interets, capitalRestant);
        capitalRestant -= principal;
        capitalRembourseCetteAnnee += principal;
      }
    }

    const cashFlowAnnee = annee <= params.duree_credit
      ? revenuAnnuel - chargesAnnuelles - creditAnnuel
      : revenuAnnuel - chargesAnnuelles;
    cashFlowCumule += cashFlowAnnee;

    const valeurBien = Math.round(prix * Math.pow(1 + params.croissance_valeur / 100, annee));
    const totalCapitalRembourse = capitalEmprunte - Math.max(capitalRestant, 0);

    if (horizons.includes(annee)) {
      results.push({
        annee,
        valeurBien,
        capitalRembourse: Math.round(totalCapitalRembourse),
        capitalRestant: Math.round(Math.max(capitalRestant, 0)),
        cashFlowCumule: Math.round(cashFlowCumule),
        // Net position at year N: asset equity + cumulative cash flows.
        valeurNette: Math.round(valeurBien - Math.max(capitalRestant, 0) + cashFlowCumule),
      });
    }

    // Apply annual growth
    loyerCourant = loyerCourant * (1 + params.croissance_loyers / 100);
    chargesCourantes = chargesCourantes * (1 + params.inflation_charges / 100);
    tfCourante = tfCourante * (1 + params.inflation_charges / 100);
  }

  return results;
}

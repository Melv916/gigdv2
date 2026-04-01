import { irr, npv } from "../irrService";
import {
  DEFAULT_REDUCED_CORPORATE_TAX_RATE,
  DEFAULT_REDUCED_CORPORATE_TAX_THRESHOLD,
} from "./constants";
import type { CanonicalInvestmentInput, EconomicResult, PatrimonialProjection } from "./types";

export function clampRate(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value > 1) return value / 100;
  if (value < 0) return 0;
  return value;
}

export function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

export function totalAcquisitionCost(input: CanonicalInvestmentInput): number {
  return (
    input.purchasePrice +
    input.notaryFees +
    input.agencyFees +
    input.worksAmount +
    input.furnitureAmount
  );
}

export function effectiveAnnualRent(input: CanonicalInvestmentInput): number {
  return Math.max(0, input.annualRent * (1 - input.vacancyRate));
}

export function annualOperatingCharges(input: CanonicalInvestmentInput): number {
  return Math.max(
    0,
    input.annualCharges +
      input.propertyTax +
      input.insurance +
      input.accountingFees +
      input.managementFees,
  );
}

export function grossYield(annualRent: number, totalCost: number): number {
  if (annualRent <= 0 || totalCost <= 0) return 0;
  return annualRent / totalCost;
}

export function netYieldBeforeTax(effectiveRent: number, charges: number, totalCost: number): number {
  if (effectiveRent <= 0 || totalCost <= 0) return 0;
  return (effectiveRent - charges) / totalCost;
}

export function computeAnnualLoanBreakdown(
  loanAmount: number,
  annualInterestRate: number,
  durationYears: number,
  annualDebtService: number,
  borrowerInsurance: number,
): { interest: number; principal: number; remainingPrincipal: number } {
  if (loanAmount <= 0 || durationYears <= 0 || annualDebtService <= 0) {
    return { interest: 0, principal: 0, remainingPrincipal: 0 };
  }

  const monthlyRate = clampRate(annualInterestRate) / 12;
  const monthlyInsurance = borrowerInsurance > 0 ? borrowerInsurance / 12 : 0;
  const monthlyDebtService = annualDebtService / 12;
  let remaining = loanAmount;
  let annualInterest = 0;
  let annualPrincipal = 0;

  for (let month = 0; month < 12; month += 1) {
    if (remaining <= 0) break;
    const interest = remaining * monthlyRate;
    const principal = Math.max(0, Math.min(remaining, monthlyDebtService - monthlyInsurance - interest));
    annualInterest += interest;
    annualPrincipal += principal;
    remaining -= principal;
  }

  return {
    interest: annualInterest,
    principal: annualPrincipal,
    remainingPrincipal: Math.max(0, remaining),
  };
}

export function computeBuildingAmortization(input: CanonicalInvestmentInput): number {
  if (!input.assetProfile.amortizationEnabled) return 0;
  const buildingBase = input.purchasePrice * input.assetProfile.buildingValueRatio;
  const years = input.assetProfile.amortizationPeriods.buildingYears;
  if (buildingBase <= 0 || years <= 0) return 0;
  return buildingBase / years;
}

export function computeFurnitureAmortization(input: CanonicalInvestmentInput): number {
  if (!input.assetProfile.amortizationEnabled) return 0;
  const years = input.assetProfile.amortizationPeriods.furnitureYears;
  if (input.furnitureAmount <= 0 || years <= 0) return 0;
  return input.furnitureAmount / years;
}

export function computeTotalAmortization(input: CanonicalInvestmentInput): number {
  return computeBuildingAmortization(input) + computeFurnitureAmortization(input);
}

export function computeCorporateTax(result: number, nominalRate: number, reducedEligible: boolean): number {
  if (result <= 0) return 0;
  const standardRate = clampRate(nominalRate);
  if (!reducedEligible) return result * standardRate;

  const reducedPart = Math.min(result, DEFAULT_REDUCED_CORPORATE_TAX_THRESHOLD);
  const normalPart = Math.max(0, result - DEFAULT_REDUCED_CORPORATE_TAX_THRESHOLD);
  return reducedPart * DEFAULT_REDUCED_CORPORATE_TAX_RATE + normalPart * standardRate;
}

export function buildEconomicResult(input: CanonicalInvestmentInput): EconomicResult {
  const totalCost = totalAcquisitionCost(input);
  const effectiveRent = effectiveAnnualRent(input);
  const operatingCharges = annualOperatingCharges(input);
  const annualDebtService = input.financing.annualDebtService;
  const annualLoan = computeAnnualLoanBreakdown(
    input.financing.loanAmount,
    input.financing.interestRate,
    input.financing.durationYears,
    input.financing.annualDebtService,
    input.financing.borrowerInsurance,
  );
  const annualNetBeforeDebt = effectiveRent - operatingCharges;
  const cashflowBeforeTax = annualNetBeforeDebt - annualDebtService;
  const dscr = annualDebtService > 0 ? annualNetBeforeDebt / annualDebtService : null;

  const annualGrowth = clampRate(input.assumptions.annualRentGrowthRate);
  const annualChargeGrowth = clampRate(input.assumptions.annualChargeGrowthRate);
  const valueGrowth = clampRate(input.assumptions.annualValueGrowthRate);
  const discountRate = clampRate(input.assumptions.discountRate);
  const exitCostRate = clampRate(input.assumptions.exitCostRate);
  const horizon = Math.max(10, input.financing.durationYears || 10);
  const initialOutflow = -(totalCost - input.financing.loanAmount);
  const cashflows = [initialOutflow];
  const annualNetCash = cashflowBeforeTax;

  for (let year = 1; year <= horizon; year += 1) {
    const growthFactor = (1 + annualGrowth) ** (year - 1);
    const chargesFactor = (1 + annualChargeGrowth) ** (year - 1);
    cashflows.push(annualNetCash * growthFactor - operatingCharges * (chargesFactor - growthFactor));
  }

  const exitValue =
    input.purchasePrice * (1 + valueGrowth) ** horizon * (1 - exitCostRate);
  cashflows[cashflows.length - 1] += exitValue;

  return {
    purchasePrice: input.purchasePrice,
    totalCost: roundCurrency(totalCost),
    annualRent: roundCurrency(input.annualRent),
    effectiveAnnualRent: roundCurrency(effectiveRent),
    annualCharges: roundCurrency(operatingCharges),
    annualDebtService: roundCurrency(annualDebtService),
    annualInterest: roundCurrency(annualLoan.interest),
    annualPrincipalRepaid: roundCurrency(annualLoan.principal),
    cashflowBeforeTax: roundCurrency(cashflowBeforeTax),
    grossYield: grossYield(input.annualRent, totalCost),
    netYieldBeforeTax: netYieldBeforeTax(effectiveRent, operatingCharges, totalCost),
    dscr,
    tri: irr(cashflows),
    van: npv(discountRate, cashflows),
    assumptions: [
      `Horizon de projection retenu: ${horizon} ans.`,
      `Croissance loyers retenue: ${(annualGrowth * 100).toFixed(1)}%.`,
      `Croissance valeur retenue: ${(valueGrowth * 100).toFixed(1)}%.`,
      `Inflation charges retenue: ${(annualChargeGrowth * 100).toFixed(1)}%.`,
      `Frais de sortie retenus: ${(exitCostRate * 100).toFixed(1)}%.`,
    ],
  };
}

export function buildProjection(
  year: number,
  propertyValue: number,
  remainingLoanPrincipal: number,
  principalRepaid: number,
  cumulativePostTaxTreasury: number,
): PatrimonialProjection {
  return {
    year,
    propertyValue: roundCurrency(propertyValue),
    remainingLoanPrincipal: roundCurrency(remainingLoanPrincipal),
    principalRepaid: roundCurrency(principalRepaid),
    cumulativePostTaxTreasury: roundCurrency(cumulativePostTaxTreasury),
    netValueCreated: roundCurrency(propertyValue - remainingLoanPrincipal + cumulativePostTaxTreasury),
  };
}

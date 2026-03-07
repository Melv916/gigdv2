export function npv(rate: number, cashflows: number[]): number {
  return cashflows.reduce((acc, cf, idx) => acc + cf / (1 + rate) ** idx, 0);
}

export function irr(
  cashflows: number[],
  opts?: { guess?: number; maxIter?: number; tolerance?: number }
): number | null {
  if (cashflows.length < 2) return null;
  const hasPositive = cashflows.some((c) => c > 0);
  const hasNegative = cashflows.some((c) => c < 0);
  if (!hasPositive || !hasNegative) return null;

  const maxIter = opts?.maxIter ?? 100;
  const tolerance = opts?.tolerance ?? 1e-7;
  let low = -0.99;
  let high = 3.0;
  let fLow = npv(low, cashflows);
  let fHigh = npv(high, cashflows);

  let expand = 0;
  while (fLow * fHigh > 0 && expand < 20) {
    high *= 2;
    fHigh = npv(high, cashflows);
    expand += 1;
  }

  if (fLow * fHigh > 0) return null;

  for (let i = 0; i < maxIter; i += 1) {
    const mid = (low + high) / 2;
    const fMid = npv(mid, cashflows);

    if (Math.abs(fMid) < tolerance) return mid;
    if (fLow * fMid < 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }

  return (low + high) / 2;
}

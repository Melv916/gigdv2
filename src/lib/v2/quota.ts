export type Plan = "free" | "debutant" | "investisseur" | "avance";

export function planQuotaLimit(plan: Plan): number | null {
  if (plan === "free") return 5;
  if (plan === "debutant") return 50;
  return null;
}

export function quotaExceeded(plan: Plan, used: number): boolean {
  const limit = planQuotaLimit(plan);
  if (limit === null) return false;
  return used >= limit;
}

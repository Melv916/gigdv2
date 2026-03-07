import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { Plan } from "./types.ts";

const PLAN_LIMITS: Record<Plan, number | null> = {
  free: 5,
  debutant: 50,
  investisseur: null,
  avance: null,
};

export function periodKeyForDate(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function allowedIAModeForPlan(plan: Plan): "courte" | "complete" {
  return plan === "investisseur" || plan === "avance" ? "complete" : "courte";
}

export function isQuotaExceeded(plan: Plan, count: number): boolean {
  const limit = PLAN_LIMITS[plan];
  if (limit === null) return false;
  return count >= limit;
}

export function planLimit(plan: Plan): number | null {
  return PLAN_LIMITS[plan];
}

export async function getUsageForPeriod(
  db: SupabaseClient,
  userId: string,
  periodKey: string
): Promise<number> {
  const { data } = await db
    .from("usage_tracking")
    .select("analyses_count")
    .eq("user_id", userId)
    .eq("period_key", periodKey)
    .maybeSingle();
  return data?.analyses_count ?? 0;
}

export async function incrementUsage(
  db: SupabaseClient,
  userId: string,
  periodKey: string
): Promise<number> {
  const current = await getUsageForPeriod(db, userId, periodKey);
  const next = current + 1;
  await db
    .from("usage_tracking")
    .upsert(
      {
        user_id: userId,
        period_key: periodKey,
        analyses_count: next,
      },
      { onConflict: "user_id,period_key" }
    );
  return next;
}

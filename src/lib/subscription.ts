import { supabase } from "@/integrations/supabase/client";

export type PlanId = "decouverte" | "debloque" | "investisseur" | "pro";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  features: string[];
}

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: "decouverte",
    name: "Decouverte",
    monthly: 0,
    yearly: 0,
    description: "Pour tester la plateforme",
    features: ["3 analyses/mois", "Moteur rentabilite", "DVF + loyers open-data"],
  },
  {
    id: "debloque",
    name: "Debloque",
    monthly: 19,
    yearly: 15,
    description: "Pour investisseurs actifs",
    features: ["30 analyses/mois", "Comparateur de deals", "Export PDF"],
  },
  {
    id: "investisseur",
    name: "Investisseur",
    monthly: 39,
    yearly: 31,
    description: "Pour usage intensif",
    features: ["100 analyses/mois", "Scenarios fiscaux", "Suivi portefeuille"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 79,
    yearly: 63,
    description: "Pour operationnels / pro",
    features: ["Analyses illimitees", "Support prioritaire", "API et integrations"],
  },
];

export interface SubscriptionState {
  planId: PlanId;
  billingCycle: "monthly" | "yearly";
  updatedAt: string;
}

function isPlanId(value: string): value is PlanId {
  return ["decouverte", "debloque", "investisseur", "pro"].includes(value);
}

function key(userId: string) {
  return `gigd:v2:subscription:${userId}`;
}

export function getSubscriptionForUser(userId: string): SubscriptionState {
  const raw = localStorage.getItem(key(userId));
  if (!raw) {
    return {
      planId: "decouverte",
      billingCycle: "monthly",
      updatedAt: new Date().toISOString(),
    };
  }
  try {
    const parsed = JSON.parse(raw) as SubscriptionState;
    return parsed;
  } catch {
    return {
      planId: "decouverte",
      billingCycle: "monthly",
      updatedAt: new Date().toISOString(),
    };
  }
}

export function setSubscriptionForUser(userId: string, state: SubscriptionState) {
  localStorage.setItem(key(userId), JSON.stringify(state));
}

export function findPlan(planId: PlanId) {
  return PLAN_DEFINITIONS.find((p) => p.id === planId) ?? PLAN_DEFINITIONS[0];
}

export async function fetchSubscriptionForUser(userId: string): Promise<SubscriptionState> {
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("plan_id,billing_cycle,updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return getSubscriptionForUser(userId);
  }

  const planId = isPlanId(data.plan_id) ? data.plan_id : "decouverte";
  const billingCycle = data.billing_cycle === "yearly" ? "yearly" : "monthly";
  const state: SubscriptionState = {
    planId,
    billingCycle,
    updatedAt: data.updated_at || new Date().toISOString(),
  };
  setSubscriptionForUser(userId, state);
  return state;
}

export async function saveSubscriptionForUser(userId: string, state: SubscriptionState): Promise<SubscriptionState> {
  const payload = {
    user_id: userId,
    plan_id: state.planId,
    billing_cycle: state.billingCycle,
    updated_at: state.updatedAt,
  };

  const { data, error } = await supabase
    .from("user_subscriptions")
    .upsert(payload, { onConflict: "user_id" })
    .select("plan_id,billing_cycle,updated_at")
    .single();

  if (error || !data) {
    setSubscriptionForUser(userId, state);
    return state;
  }

  const saved: SubscriptionState = {
    planId: isPlanId(data.plan_id) ? data.plan_id : state.planId,
    billingCycle: data.billing_cycle === "yearly" ? "yearly" : "monthly",
    updatedAt: data.updated_at || state.updatedAt,
  };
  setSubscriptionForUser(userId, saved);
  return saved;
}

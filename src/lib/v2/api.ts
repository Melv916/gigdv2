import { supabase } from "@/integrations/supabase/client";

async function authHeaders(): Promise<HeadersInit> {
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  return {
    apikey: key,
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path: string, init?: RequestInit) {
  const base = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gigd-v2-api`;
  const headers = await authHeaders();
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data?.error || `Request failed (${res.status})`);
    (error as Error & { payload?: unknown }).payload = data;
    throw error;
  }
  return data;
}

export function getMe() {
  return request("/api/me", { method: "GET" });
}

export function importAnalysisUrl(url: string) {
  return request("/api/analysis/import", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
}

export function createAnalysis(body: unknown) {
  return request("/api/analysis/create", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getAnalysis(id: string) {
  return request(`/api/analysis/${id}`, { method: "GET" });
}

export function triggerMarketEnrichment(analysisId: string, force = false) {
  return request("/api/market/enrich", {
    method: "POST",
    body: JSON.stringify({ analysisId, force }),
  });
}

export function getMarketEnrichment(analysisId: string) {
  return request(`/api/market/enrich/${analysisId}`, { method: "GET" });
}

export function createStripeCheckout(plan: "debutant" | "investisseur" | "avance") {
  return request("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

export function createStripePortal() {
  return request("/api/stripe/portal", { method: "POST" });
}

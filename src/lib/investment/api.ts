import { supabase } from "@/integrations/supabase/client";
import type { DealInput, DealOutput, RentEstimateOutput } from "./types";

function functionBaseUrl(): string {
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/functions/v1/investment-api`;
}

async function authHeaders(): Promise<HeadersInit> {
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const headers: HeadersInit = {
    apikey: key,
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function fetchRentEstimate(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) query.set(k, String(v));
  });

  const res = await fetch(`${functionBaseUrl()}/api/rent-estimate?${query.toString()}`, {
    method: "GET",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error(`Rent estimate failed (${res.status})`);
  return (await res.json()) as RentEstimateOutput;
}

export async function analyzeDealViaApi(input: DealInput) {
  const res = await fetch(`${functionBaseUrl()}/api/deal/analyze`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Deal analyze failed (${res.status})`);
  return (await res.json()) as DealOutput;
}

export async function compareDealsViaApi(deals: DealInput[]) {
  const res = await fetch(`${functionBaseUrl()}/api/deal/compare`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ deals }),
  });
  if (!res.ok) throw new Error(`Deal compare failed (${res.status})`);
  return (await res.json()) as Array<{ index: number; result: DealOutput }>;
}

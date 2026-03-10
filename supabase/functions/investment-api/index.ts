import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { analyzeDeal } from "../_shared/investment/dealService.ts";
import { getRentM2, type RentDataProvider } from "../_shared/investment/rentService.ts";
import type { DealInput, RentEstimateInput } from "../_shared/investment/types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db = createClient(supabaseUrl, supabaseKey);

function normalizeCity(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

async function resolveInseeFromCityAndDepartment(
  city: string | undefined,
  departementCode: string | undefined,
): Promise<string | null> {
  const ville = String(city || "").trim();
  const dept = String(departementCode || "").trim();
  if (!ville) return null;

  let query = db
    .from("city_market_prices")
    .select("insee_code,commune,departement_code")
    .limit(5000);

  if (dept) query = query.eq("departement_code", dept);

  const { data } = await query;
  if (!data || data.length === 0) return null;

  const expected = normalizeCity(ville);
  const ranked = data
    .map((row) => {
      const communeNorm = normalizeCity(String(row.commune || ""));
      let score = 0;
      if (communeNorm === expected) score = 100;
      else if (communeNorm.startsWith(expected)) score = 70;
      else if (communeNorm.includes(expected)) score = 50;
      return { insee: row.insee_code, score };
    })
    .filter((r) => r.score > 0 && r.insee)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.insee ?? null;
}

const provider: RentDataProvider = {
  async getParisEncadrement(input) {
    // Market references are restricted to city_market_prices only.
    return null;
  },

  async getCommuneRent(insee) {
    // Unique market source: city_market_prices.
    const { data: city } = await db
      .from("city_market_prices")
      .select("insee_code,departement_code,rent_m2_app_all,rent_m2_app_t1t2,rent_m2_app_t3plus,rent_m2_house,loyer_m2_moyen")
      .eq("insee_code", insee)
      .maybeSingle();
    if (city) {
      const rentAll = Number(city.rent_m2_app_all ?? city.loyer_m2_moyen ?? 0) || null;
      return {
        insee_code: city.insee_code,
        departement_code: city.departement_code,
        source_hint: "CITY_MARKET" as const,
        loyer_m2_cc_app_all: rentAll,
        loyer_m2_cc_app_t1t2: Number(city.rent_m2_app_t1t2 ?? city.rent_m2_app_all ?? city.loyer_m2_moyen ?? 0) || null,
        loyer_m2_cc_app_t3plus: Number(city.rent_m2_app_t3plus ?? city.rent_m2_app_all ?? city.loyer_m2_moyen ?? 0) || null,
        loyer_m2_cc_house: Number(city.rent_m2_house ?? city.rent_m2_app_all ?? city.loyer_m2_moyen ?? 0) || null,
      };
    }
    return null;
  },

  async getDepartmentFallback(departementCode, input) {
    // Department fallback remains constrained to city_market_prices.
    const { data: cityRows } = await db
      .from("city_market_prices")
      .select("rent_m2_app_all,rent_m2_app_t1t2,rent_m2_app_t3plus,rent_m2_house,loyer_m2_moyen")
      .eq("departement_code", departementCode)
      .limit(5000);
    if (cityRows && cityRows.length > 0) {
      const values = cityRows
        .map((row) => {
          if ((input.type ?? "apartment") === "house") {
            return Number(row.rent_m2_house ?? row.rent_m2_app_all ?? row.loyer_m2_moyen ?? 0);
          }
          if ((input.typology ?? "all") === "t1t2") {
            return Number(row.rent_m2_app_t1t2 ?? row.rent_m2_app_all ?? row.loyer_m2_moyen ?? 0);
          }
          if ((input.typology ?? "all") === "t3plus") {
            return Number(row.rent_m2_app_t3plus ?? row.rent_m2_app_all ?? row.loyer_m2_moyen ?? 0);
          }
          return Number(row.rent_m2_app_all ?? row.loyer_m2_moyen ?? 0);
        })
        .filter((n) => Number.isFinite(n) && n > 0);
      if (values.length > 0) return values.reduce((sum, n) => sum + n, 0) / values.length;
    }
    return null;
  },

  async getOLLFallback(input) {
    return null;
  },
};

function parseRoute(pathname: string): string {
  const idx = pathname.indexOf("/api/");
  return idx >= 0 ? pathname.slice(idx) : pathname;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const route = parseRoute(new URL(req.url).pathname);

    if (req.method === "GET" && route === "/api/rent-estimate") {
      const url = new URL(req.url);
      const city = url.searchParams.get("city") ?? undefined;
      const depCode = url.searchParams.get("departement_code") ?? undefined;
      const inseeFromLocation = await resolveInseeFromCityAndDepartment(city, depCode);
      const input: RentEstimateInput = {
        insee: inseeFromLocation ?? (url.searchParams.get("insee") ?? undefined),
        departement_code: depCode,
        arrondissement_paris: url.searchParams.get("arrondissement") ?? undefined,
        type: (url.searchParams.get("type") as RentEstimateInput["type"]) ?? "apartment",
        typology: (url.searchParams.get("typology") as RentEstimateInput["typology"]) ?? "all",
        surface: Number(url.searchParams.get("surface") || 0) || undefined,
        pieces: Number(url.searchParams.get("pieces") || 0) || undefined,
        meuble: url.searchParams.get("meuble") === "true",
      };

      const result = await getRentM2(provider, input);
      if (!result) {
        return new Response(JSON.stringify({ error: "Aucune estimation trouvée" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && route === "/api/deal/analyze") {
      const body = (await req.json()) as DealInput;
      const output = analyzeDeal(body);
      return new Response(JSON.stringify(output), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST" && route === "/api/deal/compare") {
      const body = (await req.json()) as { deals?: DealInput[] } | DealInput[];
      const deals = Array.isArray(body) ? body : body.deals ?? [];
      const output = deals.map((deal, idx) => ({ index: idx, result: analyzeDeal(deal) }));
      return new Response(JSON.stringify(output), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Route non supportée" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

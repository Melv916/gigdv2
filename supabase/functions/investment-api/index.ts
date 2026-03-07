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

const provider: RentDataProvider = {
  async getParisEncadrement(input) {
    if (!input.arrondissement_paris && !(input.insee?.startsWith("751"))) return null;
    const arrondissement = input.arrondissement_paris ?? input.insee?.slice(3, 5);
    if (!arrondissement) return null;

    const pieces = input.pieces ?? 1;
    const meuble = input.meuble ?? false;
    const { data } = await db
      .from("encadrement_paris")
      .select("*")
      .eq("arrondissement", arrondissement)
      .eq("pieces", pieces)
      .eq("meuble", meuble)
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  },

  async getCommuneRent(insee) {
    // Priority to aggregated city market table (updated from open-data migrations).
    const { data: city } = await db
      .from("city_market_prices")
      .select("insee_code,departement_code,rent_m2_app_all,rent_m2_app_t1t2,rent_m2_app_t3plus,rent_m2_house")
      .eq("insee_code", insee)
      .maybeSingle();
    if (city) {
      return {
        insee_code: city.insee_code,
        departement_code: city.departement_code,
        source_hint: "CITY_MARKET" as const,
        loyer_m2_cc_app_all: city.rent_m2_app_all,
        loyer_m2_cc_app_t1t2: city.rent_m2_app_t1t2,
        loyer_m2_cc_app_t3plus: city.rent_m2_app_t3plus,
        loyer_m2_cc_house: city.rent_m2_house,
      };
    }

    const { data } = await db
      .from("loyers_commune")
      .select("*")
      .eq("insee_code", insee)
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ? { ...data, source_hint: "ANIL" as const } : null;
  },

  async getDepartmentFallback(departementCode, input) {
    // Priority to aggregated city market table for department fallback.
    const { data: cityRows } = await db
      .from("city_market_prices")
      .select("rent_m2_app_all,rent_m2_app_t1t2,rent_m2_app_t3plus,rent_m2_house")
      .eq("departement_code", departementCode)
      .limit(5000);
    if (cityRows && cityRows.length > 0) {
      const values = cityRows
        .map((row) => {
          if ((input.type ?? "apartment") === "house") return Number(row.rent_m2_house ?? 0);
          if ((input.typology ?? "all") === "t1t2") return Number(row.rent_m2_app_t1t2 ?? row.rent_m2_app_all ?? 0);
          if ((input.typology ?? "all") === "t3plus") return Number(row.rent_m2_app_t3plus ?? row.rent_m2_app_all ?? 0);
          return Number(row.rent_m2_app_all ?? 0);
        })
        .filter((n) => Number.isFinite(n) && n > 0);
      if (values.length > 0) return values.reduce((sum, n) => sum + n, 0) / values.length;
    }

    let query = db.from("loyers_commune").select("*").eq("departement_code", departementCode);
    query = (input.type ?? "apartment") === "house" ? query.not("loyer_m2_cc_house", "is", null) : query.not("loyer_m2_cc_app_all", "is", null);
    const { data } = await query.limit(500);
    if (!data || data.length === 0) return null;

    const values = data
      .map((row) => {
        if ((input.type ?? "apartment") === "house") return Number(row.loyer_m2_cc_house ?? 0);
        if ((input.typology ?? "all") === "t1t2") return Number(row.loyer_m2_cc_app_t1t2 ?? row.loyer_m2_cc_app_all ?? 0);
        if ((input.typology ?? "all") === "t3plus") return Number(row.loyer_m2_cc_app_t3plus ?? row.loyer_m2_cc_app_all ?? 0);
        return Number(row.loyer_m2_cc_app_all ?? 0);
      })
      .filter((n) => Number.isFinite(n) && n > 0);

    if (values.length === 0) return null;
    return values.reduce((sum, n) => sum + n, 0) / values.length;
  },

  async getOLLFallback(input) {
    const typology = input.typology === "t1t2" ? "t1t2" : input.typology === "t3plus" ? "t3plus" : "all";
    const { data } = await db
      .from("loyers_oll")
      .select("*")
      .ilike("typologie", `%${typology}%`)
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? null;
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
      const input: RentEstimateInput = {
        insee: url.searchParams.get("insee") ?? undefined,
        departement_code: url.searchParams.get("departement_code") ?? undefined,
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

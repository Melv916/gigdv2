import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { objectif, strategie, canal } = body;

    let prix: number, surface: number, dvfSummary: any, listingInfo: string;

    // Two modes: pre-extracted listing data OR manual input
    if (body.listing && body.dvfSummary) {
      // From scrape-listing
      prix = body.listing.prix;
      surface = body.listing.surface;
      dvfSummary = body.dvfSummary;
      const l = body.listing;
      listingInfo = `${l.typeLocal || "Bien"} — ${l.ville || ""} ${l.codePostal || ""} — ${surface}m² — ${l.pieces || "?"} pièces${l.dpe ? ` — DPE ${l.dpe}` : ""}${l.charges ? ` — Charges ${l.charges}€/mois` : ""}${l.etage ? ` — Étage ${l.etage}` : ""}
Description: ${l.description || "N/A"}
Vendeur: ${l.vendeur || canal || "inconnu"}`;
    } else {
      // Manual input mode
      prix = body.prix;
      surface = body.surface;
      const codePostal = body.codePostal;

      if (!prix || !surface || !codePostal) {
        return new Response(
          JSON.stringify({ error: "Données insuffisantes" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Query local DVF database first, fallback to external API
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const db = createClient(supabaseUrl, supabaseKey);

      let resultats: any[] = [];
      const { data: localDvf } = await db
        .from("dvf_transactions")
        .select("date_mutation, valeur_fonciere, surface_reelle_bati, type_local, nombre_pieces_principales")
        .eq("code_postal", codePostal)
        .in("type_local", ["Appartement", "Maison"])
        .gt("valeur_fonciere", 0)
        .gt("surface_reelle_bati", 0)
        .order("date_mutation", { ascending: false })
        .limit(500);

      if (localDvf && localDvf.length > 0) {
        resultats = localDvf;
        console.log("DVF local DB:", resultats.length, "results");
      } else {
        // Fallback to cquest API
        try {
          const dvfUrl = `https://api.cquest.org/dvf?code_postal=${codePostal}`;
          const dvfResponse = await fetch(dvfUrl, { signal: AbortSignal.timeout(8000) });
          if (dvfResponse.ok) {
            const dvfData = await dvfResponse.json();
            resultats = dvfData.resultats || [];
          }
        } catch (e) { console.warn("DVF API error:", e); }
      }
      const now = new Date();
      const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());

      const filtered = resultats.filter((t: any) => {
        const date = new Date(t.date_mutation);
        return date >= threeYearsAgo && t.valeur_fonciere > 0 && t.surface_reelle_bati > 0 &&
          (t.type_local === "Appartement" || t.type_local === "Maison");
      });

      const prixM2List = filtered.map((t: any) => t.valeur_fonciere / t.surface_reelle_bati).sort((a: number, b: number) => a - b);
      const median = prixM2List.length > 0 ? prixM2List[Math.floor(prixM2List.length / 2)] : null;
      const avg = prixM2List.length > 0 ? prixM2List.reduce((a: number, b: number) => a + b, 0) / prixM2List.length : null;

      dvfSummary = {
        nbTransactions: filtered.length,
        medianePrixM2: median ? Math.round(median) : null,
        moyennePrixM2: avg ? Math.round(avg) : null,
        minPrixM2: prixM2List.length > 0 ? Math.round(prixM2List[0]) : null,
        maxPrixM2: prixM2List.length > 0 ? Math.round(prixM2List[prixM2List.length - 1]) : null,
        dernieresVentes: filtered.slice(0, 10).map((t: any) => ({
          date: t.date_mutation, prix: t.valeur_fonciere, surface: t.surface_reelle_bati,
          prixM2: Math.round(t.valeur_fonciere / t.surface_reelle_bati), type: t.type_local, pieces: t.nombre_pieces_principales,
        })),
      };
      listingInfo = `${surface}m² — ${codePostal}`;
    }

    // AI Analysis
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Tu es un expert en investissement immobilier français. Analyse cette opportunité et réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks).

Données de l'annonce:
- Prix annoncé: ${prix}€
- Surface: ${surface}m²
- Prix/m² annonce: ${Math.round(prix / surface)}€/m²
- Objectif: ${objectif || "locatif"}
- Stratégie: ${strategie || "meuble"}
- Infos: ${listingInfo}

Données DVF du secteur (${dvfSummary.nbTransactions} transactions sur 3 ans):
- Médiane prix/m²: ${dvfSummary.medianePrixM2}€
- Moyenne prix/m²: ${dvfSummary.moyennePrixM2}€
- Min/Max: ${dvfSummary.minPrixM2}€ — ${dvfSummary.maxPrixM2}€
- Dernières ventes: ${JSON.stringify(dvfSummary.dernieresVentes)}

Réponds avec ce JSON exact:
{
  "decision": "FONCEZ" ou "À NÉGOCIER" ou "TROP CHER",
  "prixAnnonce": "formaté avec €",
  "prixMax": "prix max conseillé formaté avec €",
  "prixM2": "prix/m² annonce formaté",
  "prixM2Dvf": "médiane DVF formaté",
  "score": "X/100",
  "rendement": "X,X%",
  "loyerEstime": "fourchette en €/mois",
  "cashFlow": "+/- X €/mois",
  "seuilLoyer": "X €/mois",
  "occupationMin": "X%",
  "redFlags": [{"flag": "description", "impact": "montant estimé"}],
  "scriptParticulier": ["phrase 1", "phrase 2", "phrase 3"],
  "scriptAgence": ["phrase 1", "phrase 2", "phrase 3"]
}`;

    const aiResponse = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: prompt }], temperature: 0.3 }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI error [${aiResponse.status}]: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Erreur de parsing de l'analyse IA");
    }

    return new Response(
      JSON.stringify({ analysis, dvfSummary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

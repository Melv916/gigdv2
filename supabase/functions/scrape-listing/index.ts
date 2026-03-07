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
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL de l'annonce requise" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Scrape the listing page with Firecrawl
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) {
      throw new Error("FIRECRAWL_API_KEY not configured");
    }

    console.log("Scraping listing URL:", url);

    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });

    if (!scrapeResponse.ok) {
      const errData = await scrapeResponse.json();
      throw new Error(`Firecrawl error [${scrapeResponse.status}]: ${JSON.stringify(errData)}`);
    }

    const scrapeData = await scrapeResponse.json();
    const markdown = scrapeData.data?.markdown || scrapeData.markdown || "";

    if (!markdown || markdown.length < 100) {
      throw new Error("Impossible de récupérer le contenu de l'annonce. Vérifiez le lien.");
    }

    console.log("Scraped content length:", markdown.length);

    // Use AI to extract structured data from the listing
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const extractionPrompt = `Extrais les informations de cette annonce immobilière. Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks).

Contenu de l'annonce:
${markdown.substring(0, 8000)}

Réponds avec ce JSON exact:
{
  "titre": "titre de l'annonce",
  "prix": nombre (prix en euros, sans symbole),
  "surface": nombre (surface en m², sans unité),
  "pieces": nombre de pièces,
  "chambres": nombre de chambres,
  "typeLocal": "Appartement" ou "Maison" ou "Studio" ou autre,
  "adresse": "adresse ou quartier",
  "codePostal": "code postal 5 chiffres",
  "ville": "nom de la ville",
  "etage": "étage si mentionné ou null",
  "dpe": "lettre DPE si mentionnée ou null",
  "charges": nombre (charges mensuelles si mentionnées ou null),
  "description": "résumé court de l'annonce en 1-2 phrases",
  "vendeur": "agence" ou "particulier",
  "photos": nombre de photos si mentionné
}`;

    const aiExtractionResponse = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: extractionPrompt }],
        temperature: 0.1,
      }),
    });

    if (!aiExtractionResponse.ok) {
      const errText = await aiExtractionResponse.text();
      throw new Error(`AI extraction error [${aiExtractionResponse.status}]: ${errText}`);
    }

    const aiExtractionData = await aiExtractionResponse.json();
    const extractionContent = aiExtractionData.choices?.[0]?.message?.content || "";

    let listing;
    try {
      const jsonMatch = extractionContent.match(/\{[\s\S]*\}/);
      listing = JSON.parse(jsonMatch ? jsonMatch[0] : extractionContent);
    } catch {
      console.error("Failed to parse extraction:", extractionContent);
      throw new Error("Erreur lors de l'extraction des données de l'annonce");
    }

    if (!listing.prix || !listing.surface || !listing.codePostal) {
      throw new Error("Données insuffisantes extraites de l'annonce (prix, surface ou code postal manquant)");
    }

    // Query local DVF database first, fallback to external APIs
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let resultats: any[] = [];

    // Try local DB first
    const { data: localDvf, error: dbError } = await supabase
      .from("dvf_transactions")
      .select("date_mutation, valeur_fonciere, surface_reelle_bati, type_local, nombre_pieces_principales, nature_mutation")
      .eq("code_postal", listing.codePostal)
      .in("type_local", ["Appartement", "Maison"])
      .gt("valeur_fonciere", 0)
      .gt("surface_reelle_bati", 0)
      .order("date_mutation", { ascending: false })
      .limit(500);

    if (!dbError && localDvf && localDvf.length > 0) {
      resultats = localDvf;
      console.log("DVF local DB:", resultats.length, "results");
    } else {
      console.warn("No local DVF data, trying external APIs...");
      // Fallback to cquest
      try {
        const dvfUrl = `https://api.cquest.org/dvf?code_postal=${listing.codePostal}`;
        const dvfResponse = await fetch(dvfUrl, { signal: AbortSignal.timeout(8000) });
        if (dvfResponse.ok) {
          const dvfData = await dvfResponse.json();
          resultats = dvfData.resultats || [];
        }
      } catch (e) { console.warn("DVF cquest error:", e); }
    }

    if (resultats.length === 0) {
      console.warn("No DVF data available from any source");
    }

    // Filter relevant transactions (last 3 years, same type)
    const now = new Date();
    const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());

    const filteredResults = resultats.filter((t: any) => {
      const date = new Date(t.date_mutation);
      return (
        date >= threeYearsAgo &&
        t.valeur_fonciere > 0 &&
        t.surface_reelle_bati > 0 &&
        (t.type_local === "Appartement" || t.type_local === "Maison")
      );
    });

    const prixM2List = filteredResults
      .map((t: any) => t.valeur_fonciere / t.surface_reelle_bati)
      .sort((a: number, b: number) => a - b);

    const medianPrixM2 = prixM2List.length > 0 ? prixM2List[Math.floor(prixM2List.length / 2)] : null;
    const avgPrixM2 = prixM2List.length > 0 ? prixM2List.reduce((a: number, b: number) => a + b, 0) / prixM2List.length : null;

    const dvfSummary = {
      nbTransactions: filteredResults.length,
      medianePrixM2: medianPrixM2 ? Math.round(medianPrixM2) : null,
      moyennePrixM2: avgPrixM2 ? Math.round(avgPrixM2) : null,
      minPrixM2: prixM2List.length > 0 ? Math.round(prixM2List[0]) : null,
      maxPrixM2: prixM2List.length > 0 ? Math.round(prixM2List[prixM2List.length - 1]) : null,
      dernieresVentes: filteredResults.slice(0, 10).map((t: any) => ({
        date: t.date_mutation,
        prix: t.valeur_fonciere,
        surface: t.surface_reelle_bati,
        prixM2: Math.round(t.valeur_fonciere / t.surface_reelle_bati),
        type: t.type_local,
        pieces: t.nombre_pieces_principales,
      })),
    };

    return new Response(
      JSON.stringify({ listing, dvfSummary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCacheKey, isCacheExpired } from "./cacheService.ts";
import type { IAMode } from "./types.ts";

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

function requiredSections(mode: IAMode): string {
  if (mode === "courte") {
    return `Format EXACT:
1. Resume
2. Prix et marche (DVF si dispo)
3. Lecture locative (cash-flow / seuil loyer)
4. A verifier
5. Questions a poser
6. Nego (positionnement)`;
  }

  return `Format EXACT (8 sections):
1. Resume du bien
2. Coherence du prix (marche/DVF)
3. Lecture locative (selon strategie)
4. Points forts
5. Points faibles/risques
6. Questions + docs a demander
7. Reco nego (agence/particulier)
8. Ce que l'annonce ne permet pas de confirmer`;
}

function lengthRule(mode: IAMode): string {
  return mode === "courte"
    ? "Longueur: 250-400 mots."
    : "Longueur: 900-1300 mots.";
}

function buildPrompt(args: {
  mode: IAMode;
  strategy: string;
  listing: Record<string, unknown>;
  dvf: Record<string, unknown>;
  inputs: Record<string, unknown>;
}): string {
  return `Tu es un agent immobilier specialise en investissement locatif (nue, meuble, colocation, LCD).
Interdits: scoring, note globale, GO/NO GO, cartes red flags/good points.
Tu fournis un texte structure selon sections imposees.
${lengthRule(args.mode)}
${requiredSections(args.mode)}

Donnees listing:
${JSON.stringify(args.listing)}

Donnees DVF:
${JSON.stringify(args.dvf)}

Inputs utilisateur:
${JSON.stringify(args.inputs)}

Strategie:
${args.strategy}
`;
}

function readNum(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function localAnalysisText(args: {
  mode: IAMode;
  strategy: string;
  listing: Record<string, unknown>;
  dvf: Record<string, unknown>;
  inputs: Record<string, unknown>;
}): string {
  const titre = String(args.listing.titre || "Bien locatif");
  const ville = String(args.listing.ville || args.listing.codePostal || "zone non precisee");
  const vendeur = String(args.listing.vendeur || "inconnu");
  const prix = readNum(args.listing.prix);
  const surface = readNum(args.listing.surface);
  const prixM2 = prix && surface && surface > 0 ? Math.round(prix / surface) : null;
  const dvfMedian = readNum(args.dvf.medianePrixM2);
  const travaux = readNum(args.inputs.travaux) || 0;
  const charges = readNum(args.inputs.charges_mensuelles) || 0;
  const taxe = readNum(args.inputs.taxe_fonciere) || 0;

  const common = {
    priceLine: prix ? `${Math.round(prix).toLocaleString("fr-FR")} EUR` : "prix non confirme",
    surfaceLine: surface ? `${surface} m2` : "surface non confirmee",
    dvfLine: dvfMedian ? `${Math.round(dvfMedian)} EUR/m2` : "DVF non disponible",
    ecart:
      prixM2 && dvfMedian
        ? `${Math.round(((prixM2 - dvfMedian) / dvfMedian) * 100)}% vs mediane locale`
        : "ecart non calculable",
  };

  if (args.mode === "courte") {
    return [
      "1. Resume",
      `Le bien "${titre}" situe a ${ville} peut etre analyse en ${args.strategy}. Les informations principales montrent ${common.priceLine} pour ${common.surfaceLine}. La lecture locative doit surtout valider le loyer de marche et le niveau de charges. Les points positifs possibles sont la clarte du positionnement locatif et l'adaptation du bien a la demande locale. Les points faibles potentiels sont l'absence de donnees techniques completes et l'incertitude sur certains postes de cout.`,
      "",
      "2. Prix et marche (DVF si dispo)",
      `Prix affiche: ${common.priceLine}. Prix au m2 estime: ${prixM2 ? `${prixM2} EUR/m2` : "non calcule"}. Mediane DVF locale: ${common.dvfLine}. Lecture: ${common.ecart}.`,
      "",
      "3. Lecture locative (cash-flow / seuil loyer)",
      `Travaux estimes: ${Math.round(travaux).toLocaleString("fr-FR")} EUR. Charges locatives mensuelles: ${Math.round(charges).toLocaleString("fr-FR")} EUR. Taxe fonciere annuelle: ${Math.round(taxe).toLocaleString("fr-FR")} EUR. Verifier le loyer cible par rapport aux comparables locaux pour garantir l'equilibre du cash-flow.`,
      "",
      "4. A verifier",
      "DPE exact, montant reel des charges, diagnostics obligatoires, etat de la copropriete, historique des travaux, niveau de vacance dans le secteur.",
      "",
      "5. Questions a poser",
      "Quel etait le dernier loyer pratique ? Y a-t-il des impayes ou contentieux ? Quel est le montant des travaux votes ? Quel est le niveau reel des charges sur 3 ans ?",
      "",
      "6. Nego (positionnement)",
      `Si vendeur ${vendeur === "agence" ? "agence" : "particulier"}: partir des comparables DVF, de la marge travaux, et des incertitudes documentaires pour justifier une offre prudente et argumentee.`,
    ].join("\n");
  }

  return [
    "1. Resume du bien",
    `Le bien "${titre}" a ${ville} se positionne pour une strategie ${args.strategy}. Les donnees disponibles indiquent ${common.priceLine} pour ${common.surfaceLine}. Cette analyse vise une decision locative structuree sans score global: on retient les bons signaux, les points de fragilite, et les verifications indispensables avant engagement.`,
    "",
    "2. Coherence du prix (marche/DVF)",
    `Prix affiche: ${common.priceLine}. Prix au m2 estime: ${prixM2 ? `${prixM2} EUR/m2` : "non calcule"}. Reference DVF: ${common.dvfLine}. Ecart: ${common.ecart}. Si le prix est au-dessus de la mediane locale, la marge de securite baisse; s'il est en ligne ou en dessous, l'operation peut gagner en robustesse selon l'etat reel du bien.`,
    "",
    "3. Lecture locative (selon strategie)",
    `Strategie retenue: ${args.strategy}. Les hypotheses actuelles incluent ${Math.round(travaux).toLocaleString("fr-FR")} EUR de travaux, ${Math.round(charges).toLocaleString("fr-FR")} EUR de charges mensuelles et ${Math.round(taxe).toLocaleString("fr-FR")} EUR de taxe fonciere annuelle. Le point cle est de valider un loyer cible coherent avec les comparables, puis de tester la sensibilite du cash-flow a la vacance et aux depenses non prevues.`,
    "",
    "4. Points forts",
    "Positionnement locatif clair, structure d'analyse complete (rendements, cash-flow, fiscalite, TRI/VAN), possibilite de calibrer rapidement plusieurs scenarios selon la strategie d'exploitation.",
    "",
    "5. Points faibles/risques",
    "Risque d'ecart entre loyer theorique et loyer reel de marche, risque travaux sous-estimes, risque charges de copropriete evolutives, risque vacance superieur aux hypotheses.",
    "",
    "6. Questions + docs a demander",
    "Demander: dernier bail, quittances, PV d'AG, detail charges N-1/N-2/N-3, taxe fonciere, diagnostics, factures travaux, etat locatif. Questions: derniere relocation, duree moyenne de vacance, travaux votes, sinistres recents.",
    "",
    "7. Reco nego (agence/particulier)",
    `Agence: argumenter avec comparables DVF et enveloppe travaux pour cadrer une offre chiffrable. Particulier: approche plus pedagogique, montrer l'impact des charges, du risque vacance et des mises aux normes pour justifier le prix cible.`,
    "",
    "8. Ce que l'annonce ne permet pas de confirmer",
    "Etat technique detaille, qualite de la copropriete, montant reel des charges sur plusieurs annees, tension locative exacte micro-locale, niveau de travaux cache.",
  ].join("\n");
}

export async function generateAnalysisWithCache(args: {
  db: SupabaseClient;
  userId: string;
  canonicalUrl: string;
  inputs: Record<string, unknown>;
  mode: IAMode;
  strategy: string;
  listing: Record<string, unknown>;
  dvf: Record<string, unknown>;
  ttlDays: number;
}): Promise<{ text: string; cacheHit: boolean; cacheKey: string }> {
  const cacheKey = await buildCacheKey(args.canonicalUrl, args.inputs, args.mode);

  const { data: cacheRow } = await args.db
    .from("ai_cache")
    .select("ai_text,created_at")
    .eq("cache_key", cacheKey)
    .maybeSingle();

  if (cacheRow?.ai_text) {
    const expired = isCacheExpired(cacheRow.created_at, args.ttlDays);
    if (!expired) {
      return { text: cacheRow.ai_text, cacheHit: true, cacheKey };
    }
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  const openAiKey = Deno.env.get("OPENAI_API_KEY");
  const openAiModel = Deno.env.get("OPENAI_MODEL") || "gpt-4.1-mini";
  let text = "";

  if (!openAiKey && !apiKey) {
    text = localAnalysisText({
      mode: args.mode,
      strategy: args.strategy,
      listing: args.listing,
      dvf: args.dvf,
      inputs: args.inputs,
    });
  } else if (openAiKey) {
    const prompt = buildPrompt({
      mode: args.mode,
      strategy: args.strategy,
      listing: args.listing,
      dvf: args.dvf,
      inputs: args.inputs,
    });

    const res = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openAiModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.25,
      }),
    });
    if (!res.ok) {
      text = localAnalysisText({
        mode: args.mode,
        strategy: args.strategy,
        listing: args.listing,
        dvf: args.dvf,
        inputs: args.inputs,
      });
    } else {
      const data = await res.json();
      text = String(data.choices?.[0]?.message?.content || "").trim();
      if (!text) {
        text = localAnalysisText({
          mode: args.mode,
          strategy: args.strategy,
          listing: args.listing,
          dvf: args.dvf,
          inputs: args.inputs,
        });
      }
    }
  } else {
    const prompt = buildPrompt({
      mode: args.mode,
      strategy: args.strategy,
      listing: args.listing,
      dvf: args.dvf,
      inputs: args.inputs,
    });

    const res = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.25,
      }),
    });
    if (!res.ok) {
      text = localAnalysisText({
        mode: args.mode,
        strategy: args.strategy,
        listing: args.listing,
        dvf: args.dvf,
        inputs: args.inputs,
      });
    } else {
      const data = await res.json();
      text = String(data.choices?.[0]?.message?.content || "").trim();
      if (!text) {
        text = localAnalysisText({
          mode: args.mode,
          strategy: args.strategy,
          listing: args.listing,
          dvf: args.dvf,
          inputs: args.inputs,
        });
      }
    }
  }

  await args.db.from("ai_cache").upsert(
    {
      cache_key: cacheKey,
      user_id: args.userId,
      canonical_url: args.canonicalUrl,
      inputs_json: args.inputs,
      mode: args.mode,
      ai_text: text,
    },
    { onConflict: "cache_key" }
  );

  return { text, cacheHit: false, cacheKey };
}

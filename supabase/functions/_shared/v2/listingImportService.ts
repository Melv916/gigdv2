import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { ImportedListing } from "./types.ts";

const FIRECRAWL_API = "https://api.firecrawl.dev/v1/scrape";
const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function dbClient() {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
}

function stripHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function toNumber(raw: string): number | null {
  const n = Number(raw.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function extractHeuristic(text: string, url: string): ImportedListing {
  const priceMatch = text.match(/(\d[\d\s]{3,})\s?(€|eur)/i);
  const surfaceMatch = text.match(/(\d{1,3}(?:[.,]\d{1,2})?)\s?m2\b/i);
  const cpMatch = text.match(/\b\d{5}\b/);
  const title = text.split("\n").map((l) => l.trim()).find((l) => l.length > 8 && l.length < 140) || "Annonce importee";
  const host = new URL(url).hostname.replace(/^www\./, "");

  return {
    titre: title,
    prix: priceMatch ? toNumber(priceMatch[1]) || undefined : undefined,
    surface: surfaceMatch ? toNumber(surfaceMatch[1]) || undefined : undefined,
    codePostal: cpMatch ? cpMatch[0] : undefined,
    ville: undefined,
    typeLocal: /maison/i.test(text) ? "Maison" : "Appartement",
    description: text.slice(0, 1200),
    vendeur: /agence|iad|orpi|laforet|century/i.test(host + " " + text) ? "agence" : "inconnu",
  };
}

export async function importListingFromUrl(url: string): Promise<{
  canonicalUrl: string;
  listing: ImportedListing;
  dvfSummary: Record<string, unknown>;
}> {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.searchParams.sort();
  const canonicalUrl = parsed.toString();

  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  let markdown = "";
  if (firecrawlKey) {
    const scrapeRes = await fetch(FIRECRAWL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: canonicalUrl,
        formats: ["markdown"],
        onlyMainContent: true,
        waitFor: 3000,
      }),
    });
    if (scrapeRes.ok) {
      const scrapeData = await scrapeRes.json();
      markdown = String(scrapeData.data?.markdown || scrapeData.markdown || "");
    }
  }

  if (!markdown || markdown.length < 60) {
    const pageRes = await fetch(canonicalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GIGD/2.0)" },
    });
    const html = pageRes.ok ? await pageRes.text() : "";
    markdown = stripHtml(html);
  }

  if (!markdown || markdown.length < 60) {
    return { canonicalUrl, listing: { titre: "Annonce importee", vendeur: "inconnu" }, dvfSummary: {} };
  }

  const aiKey = Deno.env.get("LOVABLE_API_KEY");

  const prompt = `Extrait UNIQUEMENT un JSON de cette annonce.
{
  "titre": "...",
  "prix": 0,
  "surface": 0,
  "pieces": 0,
  "typeLocal": "Appartement|Maison|Studio|Autre",
  "adresse": "...",
  "codePostal": "00000",
  "ville": "...",
  "dpe": "A|B|C|D|E|F|G|null",
  "charges": 0,
  "description": "...",
  "vendeur": "agence|particulier|inconnu"
}
Annonce:
${markdown.slice(0, 8000)}
`;

  let listing: ImportedListing | null = null;
  if (aiKey) {
    const aiRes = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
      }),
    });
    if (aiRes.ok) {
      const aiData = await aiRes.json();
      const content = aiData.choices?.[0]?.message?.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      try {
        listing = JSON.parse(jsonMatch ? jsonMatch[0] : content) as ImportedListing;
      } catch {
        listing = null;
      }
    }
  }

  if (!listing) listing = extractHeuristic(markdown, canonicalUrl);

  const db = dbClient();
  const { data: localDvf } = await db
    .from("dvf_transactions")
    .select("date_mutation,valeur_fonciere,surface_reelle_bati,type_local,nombre_pieces_principales")
    .eq("code_postal", listing.codePostal || "")
    .in("type_local", ["Appartement", "Maison"])
    .gt("valeur_fonciere", 0)
    .gt("surface_reelle_bati", 0)
    .order("date_mutation", { ascending: false })
    .limit(500);

  const tx = localDvf || [];
  const now = new Date();
  const threeYearsAgo = new Date(now.getUTCFullYear() - 3, now.getUTCMonth(), now.getUTCDate());
  const filtered = tx.filter((t: any) => new Date(t.date_mutation) >= threeYearsAgo);
  const prices = filtered
    .map((t: any) => Number(t.valeur_fonciere) / Number(t.surface_reelle_bati))
    .filter((n: number) => Number.isFinite(n) && n > 0)
    .sort((a: number, b: number) => a - b);
  const median = prices.length ? prices[Math.floor(prices.length / 2)] : null;
  const avg = prices.length ? prices.reduce((s: number, n: number) => s + n, 0) / prices.length : null;

  return {
    canonicalUrl,
    listing,
    dvfSummary: {
      nbTransactions: filtered.length,
      medianePrixM2: median ? Math.round(median) : null,
      moyennePrixM2: avg ? Math.round(avg) : null,
    },
  };
}

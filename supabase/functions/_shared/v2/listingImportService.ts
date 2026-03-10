import type { ImportedListing } from "./types.ts";

const FIRECRAWL_API = "https://api.firecrawl.dev/v1/scrape";
const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function stripHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function toNumber(raw: string): number | null {
  const n = Number(raw.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function textBetweenTags(html: string, tag: string): string | undefined {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m?.[1]?.replace(/\s+/g, " ").trim();
}

function fromRegexNum(html: string, patterns: RegExp[]): number | undefined {
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) {
      const n = toNumber(m[1]);
      if (n && n > 0) return n;
    }
  }
  return undefined;
}

function fromRegexStr(html: string, patterns: RegExp[]): string | undefined {
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1]) return String(m[1]).trim();
  }
  return undefined;
}

function sanitizeCity(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const cleaned = String(raw)
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b\d{5}\b/g, " ")
    .replace(/\b\d{2,3}\b/g, " ")
    .replace(/\bcedex\b/gi, " ")
    .replace(/\barr(?:ondissement)?\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || undefined;
}

function extractStructuredListing(html: string, url: string): ImportedListing | null {
  if (!html) return null;

  const title = textBetweenTags(html, "title");
  const price = fromRegexNum(html, [
    /"price"\s*:\s*"?([\d.,\s]+)"?/i,
    /"prix"\s*:\s*"?([\d.,\s]+)"?/i,
    /"amount"\s*:\s*"?([\d.,\s]+)"?/i,
  ]);
  const surface = fromRegexNum(html, [
    /"livingArea"\s*:\s*"?([\d.,\s]+)"?/i,
    /"floorSize"\s*:\s*\{[^}]*"value"\s*:\s*"?([\d.,\s]+)"?/i,
    /"surface"\s*:\s*"?([\d.,\s]+)"?/i,
  ]);
  const codePostal = fromRegexStr(html, [
    /"postalCode"\s*:\s*"(\d{5})"/i,
    /"codePostal"\s*:\s*"(\d{5})"/i,
  ]);
  const villeRaw = fromRegexStr(html, [
    /"addressLocality"\s*:\s*"([^"]+)"/i,
    /"city"\s*:\s*"([^"]+)"/i,
    /"ville"\s*:\s*"([^"]+)"/i,
  ]);
  const ville = sanitizeCity(villeRaw);
  const pieces = fromRegexNum(html, [
    /"numberOfRooms"\s*:\s*"?([\d.,\s]+)"?/i,
    /"rooms"\s*:\s*"?([\d.,\s]+)"?/i,
    /"pieces"\s*:\s*"?([\d.,\s]+)"?/i,
  ]);
  const insee = fromRegexStr(html, [
    /"inseeCode"\s*:\s*"(\d{5})"/i,
    /"codeInsee"\s*:\s*"(\d{5})"/i,
    /"code_commune"\s*:\s*"(\d{5})"/i,
  ]);
  const adresse = fromRegexStr(html, [
    /"streetAddress"\s*:\s*"([^"]+)"/i,
    /"address"\s*:\s*"([^"]+)"/i,
  ]);

  if (!price && !surface && !codePostal) return null;
  return {
    titre: title || "Annonce importee",
    prix: price,
    surface: surface,
    pieces: pieces ? Math.round(pieces) : undefined,
    codePostal,
    ville,
    insee,
    adresse,
    typeLocal: /maison/i.test(html) ? "Maison" : "Appartement",
    vendeur: /agence|orpi|laforet|century|iad/i.test(new URL(url).hostname + " " + html) ? "agence" : "inconnu",
  };
}

function extractHeuristic(text: string, url: string): ImportedListing {
  const priceMatch = text.match(/((?:\d{1,3}(?:[\s\u00A0]\d{3})+)|\d{5,8})(?:\s?(?:\u20AC|eur|euro|euros))\b/i);
  const surfaceMatch = text.match(/(\d{1,3}(?:[.,]\d{1,2})?)\s?m(?:2|\u00B2)\b/i);
  const cpMatch = text.match(/\b\d{5}\b/);
  const inseeMatch = text.match(/\b(?:insee|code\s*insee)\s*[:\-]?\s*(\d{5})\b/i);
  const title = text.split("\n").map((l) => l.trim()).find((l) => l.length > 8 && l.length < 140) || "Annonce importee";
  const host = new URL(url).hostname.replace(/^www\./, "");

  const cityInlineMatch = text.match(/\b([A-Za-zÀ-ÖØ-öø-ÿ' -]{2,})\s+(?:\d{5}|\d{2,3})\b/);
  return {
    titre: title,
    prix: priceMatch ? toNumber(priceMatch[1]) || undefined : undefined,
    surface: surfaceMatch ? toNumber(surfaceMatch[1]) || undefined : undefined,
    codePostal: cpMatch ? cpMatch[0] : undefined,
    ville: sanitizeCity(cityInlineMatch ? cityInlineMatch[1] : undefined),
    insee: inseeMatch ? inseeMatch[1] : undefined,
    typeLocal: /maison/i.test(text) ? "Maison" : "Appartement",
    description: text.slice(0, 1200),
    vendeur: /agence|iad|orpi|laforet|century/i.test(host + " " + text) ? "agence" : "inconnu",
  };
}

function fillMissingFromText(listing: ImportedListing, text: string, url: string): ImportedListing {
  const h = extractHeuristic(text, url);
  return {
    ...listing,
    prix: listing.prix || h.prix,
    surface: listing.surface || h.surface,
    codePostal: listing.codePostal || h.codePostal,
    ville: listing.ville || h.ville,
    typeLocal: listing.typeLocal || h.typeLocal,
    description: listing.description || h.description,
    vendeur: listing.vendeur || h.vendeur,
  };
}

export async function importListingFromUrl(url: string): Promise<{
  canonicalUrl: string;
  listing: ImportedListing;
  dvfSummary: Record<string, unknown>;
}> {
  const parsed = new URL(url);
  const isSeloger = /(^|\.)seloger\.com$/i.test(parsed.hostname);
  parsed.hash = "";
  parsed.searchParams.sort();
  const canonicalUrl = parsed.toString();

  const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
  let markdown = "";
  let rawHtml = "";
  let firecrawlError: string | null = null;
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
    } else {
      const errTxt = await scrapeRes.text().catch(() => "");
      firecrawlError = `Firecrawl ${scrapeRes.status}${errTxt ? `: ${errTxt.slice(0, 200)}` : ""}`;
    }
  } else if (isSeloger) {
    throw new Error("FIRECRAWL_API_KEY manquante pour importer SeLoger");
  }

  const pageRes = await fetch(canonicalUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; GIGD/2.0)" },
  });
  rawHtml = pageRes.ok ? await pageRes.text() : "";
  const antiBotDetected =
    /Please enable JS and disable any ad blocker/i.test(rawHtml) ||
    /captcha-delivery\.com/i.test(rawHtml) ||
    /cf-chl-bypass/i.test(rawHtml);

  if ((!markdown || markdown.length < 60) && !isSeloger) {
    const pageRes = await fetch(canonicalUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GIGD/2.0)" },
    });
    const html = pageRes.ok ? await pageRes.text() : "";
    markdown = stripHtml(html);
    if (!rawHtml && html) rawHtml = html;
  }

  const structured = extractStructuredListing(rawHtml, canonicalUrl);
  if (isSeloger && (!markdown || markdown.length < 60) && antiBotDetected) {
    throw new Error(
      firecrawlError
        ? `Import SeLoger bloque: ${firecrawlError}`
        : "Import SeLoger bloque (anti-bot). Vérifie FIRECRAWL_API_KEY côté Supabase."
    );
  }
  if ((!markdown || markdown.length < 60) && !structured) {
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

  let listing: ImportedListing | null = structured;
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
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content) as ImportedListing;
        listing = {
          ...parsed,
          prix: parsed.prix || structured?.prix,
          surface: parsed.surface || structured?.surface,
          codePostal: parsed.codePostal || structured?.codePostal,
          ville: sanitizeCity(parsed.ville) || structured?.ville,
          insee: (parsed as ImportedListing).insee || structured?.insee,
          adresse: parsed.adresse || structured?.adresse,
          pieces: parsed.pieces || structured?.pieces,
          titre: parsed.titre || structured?.titre,
        };
      } catch {
        listing = null;
      }
    }
  }

  if (!listing) {
    listing = markdown && markdown.length >= 60
      ? extractHeuristic(markdown, canonicalUrl)
      : { titre: "Annonce importee", vendeur: "inconnu" };
  }
  if (listing && structured) {
    listing = {
      ...listing,
      prix: listing.prix || structured.prix,
      surface: listing.surface || structured.surface,
      codePostal: listing.codePostal || structured.codePostal,
      ville: sanitizeCity(listing.ville) || structured.ville,
      insee: listing.insee || structured.insee,
      adresse: listing.adresse || structured.adresse,
      pieces: listing.pieces || structured.pieces,
      titre: listing.titre || structured.titre,
    };
  }
  if (listing && markdown && markdown.length >= 60) {
    listing = fillMissingFromText(listing, markdown, canonicalUrl);
  }
  console.log("[listingImport] property extracted", {
    prix: listing?.prix ?? null,
    surface: listing?.surface ?? null,
    ville: listing?.ville ?? null,
    codePostal: listing?.codePostal ?? null,
    insee: (listing as ImportedListing | null)?.insee ?? null,
  });

  return {
    canonicalUrl,
    listing,
    dvfSummary: {},
  };
}



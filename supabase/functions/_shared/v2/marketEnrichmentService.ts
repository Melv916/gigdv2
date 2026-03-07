import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  aggregateDvf,
  computeTtl,
  isExpired,
  selectBestDataset,
  type DvfComparable,
} from "./marketEnrichmentCore.ts";
import {
  downloadAndParseResource,
  getDatasetInfo,
  getResourceInfo,
  listDatasetResources,
  queryResourceData,
  searchDatasets,
} from "./mcpClient.ts";

type Kind = "DVF" | "INSEE" | "LOYER" | "AUTRE";

export interface MarketSource {
  kind: Kind;
  dataset_id: string | null;
  resource_id: string | null;
  source_url: string | null;
  updated_at: string;
}

export interface MarketEnrichmentPayload {
  status: "ok" | "processing" | "failed" | "indisponible";
  kind: Kind;
  geo_key: string;
  scope: "commune" | "cp" | "dataset";
  dvf: {
    median_eur_m2: number | null;
    q25_eur_m2: number | null;
    q75_eur_m2: number | null;
    samples_count: number;
    period: string;
    estimated_price_range: [number, number] | null;
    delta_vs_ask: number | null;
    delta_pct: number | null;
  };
  context_local?: {
    population?: number;
    revenu_median?: number;
    taux_vacance?: number;
  };
  reason?: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

function logEvent(event: string, payload: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      event,
      ts: nowIso(),
      ...payload,
    })
  );
}

function getGeoKey(args: { insee?: string | null; codePostal?: string | null; commune?: string | null }): string {
  if (args.insee && args.insee.trim()) return `COM:${args.insee.trim()}`;
  if (args.codePostal && args.codePostal.trim()) return `CP:${args.codePostal.trim()}`;
  return `CITY:${String(args.commune || "unknown").trim().toUpperCase()}`;
}

function normalizeListing(analysis: Record<string, unknown>) {
  const listing = (analysis.listing_json as Record<string, unknown>) || {};
  const inputs = (analysis.inputs_json as Record<string, unknown>) || {};
  const url = String(analysis.url || "");
  const canonicalUrl = String(analysis.canonical_url || url);
  const getNumber = (v: unknown): number | null => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number(v.replace(/[^\d.,-]/g, "").replace(",", "."));
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const prix = getNumber(listing.prix) ?? getNumber(inputs.prix);
  const surface = getNumber(listing.surface) ?? getNumber(inputs.surface);
  const codePostal = String(listing.codePostal || "").trim() || null;
  const commune = String(listing.ville || "").trim() || null;
  const insee = String((listing as any).insee || inputs.insee || "").trim() || null;
  const typeLocal = String(listing.typeLocal || "Appartement");

  return { prix, surface, codePostal, commune, insee, typeLocal, canonicalUrl };
}

async function getRegistry(
  db: SupabaseClient,
  kind: Kind,
  query: string
): Promise<{ dataset_id: string; resource_id: string; source_url: string | null } | null> {
  const { data } = await db
    .from("market_dataset_registry")
    .select("dataset_id,resource_id,source_url,ttl_until")
    .eq("kind", kind)
    .eq("query", query)
    .maybeSingle();

  if (data?.dataset_id && data?.resource_id && data?.ttl_until && !isExpired(data.ttl_until)) {
    return {
      dataset_id: data.dataset_id,
      resource_id: data.resource_id,
      source_url: data.source_url || null,
    };
  }
  return null;
}

async function upsertRegistry(
  db: SupabaseClient,
  args: {
    kind: Kind;
    query: string;
    dataset_id: string;
    resource_id: string;
    source_url: string | null;
    confidence: number;
  }
) {
  const ttlUntil = computeTtl(30);
  await db.from("market_dataset_registry").upsert(
    {
      kind: args.kind,
      query: args.query,
      dataset_id: args.dataset_id,
      resource_id: args.resource_id,
      source_url: args.source_url,
      ttl_until: ttlUntil,
      updated_at: nowIso(),
      confidence: args.confidence,
    },
    { onConflict: "kind,query" }
  );
}

async function resolveDvfRegistry(
  db: SupabaseClient,
  userId: string
): Promise<{ dataset_id: string; resource_id: string; source_url: string | null } | null> {
  const forcedDatasetId = (Deno.env.get("MCP_DVF_DATASET_ID") || "").trim();
  const forcedResourceId = (Deno.env.get("MCP_DVF_RESOURCE_ID") || "").trim();
  const forcedLooksValid =
    forcedDatasetId &&
    forcedResourceId &&
    !forcedDatasetId.includes("<") &&
    !forcedResourceId.includes("<");
  if (forcedLooksValid) {
    return {
      dataset_id: forcedDatasetId,
      resource_id: forcedResourceId,
      source_url: `https://www.data.gouv.fr/fr/datasets/${forcedDatasetId}`,
    };
  }

  const query = "DVF prix immobilier mutation";
  const cached = await getRegistry(db, "DVF", query);
  if (cached) return cached;

  const candidates = await searchDatasets(query, userId).catch(() => []);
  const best = selectBestDataset(
    candidates.map((c: any) => ({
      id: String(c.id || c.dataset_id || ""),
      title: String(c.title || ""),
      organization: String(c.organization?.name || c.organization || ""),
      tags: Array.isArray(c.tags) ? c.tags.map((t: any) => String(t.name || t)) : [],
    }))
  );
  if (!best?.id) return null;

  const info = await getDatasetInfo(best.id, userId).catch(() => ({}));
  const resources = await listDatasetResources(best.id, userId).catch(() => []);
  if (!resources.length) return null;

  const tabular = resources.find((r: any) => {
    const format = String(r.format || "").toLowerCase();
    return format.includes("csv") || format.includes("xls") || format.includes("parquet");
  }) || resources[0];

  const datasetId = String((info as any)?.id || best.id);
  const resourceId = String(tabular.id || tabular.resource_id || "");
  const sourceUrl = String((tabular.url || (info as any)?.page || "") || "") || null;
  if (!resourceId) return null;

  await upsertRegistry(db, {
    kind: "DVF",
    query,
    dataset_id: datasetId,
    resource_id: resourceId,
    source_url: sourceUrl,
    confidence: 85,
  });

  return {
    dataset_id: datasetId,
    resource_id: resourceId,
    source_url: sourceUrl,
  };
}

async function readGeoCache(
  db: SupabaseClient,
  geoKey: string,
  kind: Kind
): Promise<{ payload_json: Record<string, unknown>; dataset_id: string | null; resource_id: string | null } | null> {
  const { data } = await db
    .from("market_geo_cache")
    .select("payload_json,dataset_id,resource_id,ttl_until")
    .eq("geo_key", geoKey)
    .eq("kind", kind)
    .maybeSingle();

  if (!data?.payload_json || !data.ttl_until || isExpired(data.ttl_until)) return null;
  return {
    payload_json: data.payload_json as Record<string, unknown>,
    dataset_id: data.dataset_id || null,
    resource_id: data.resource_id || null,
  };
}

async function writeGeoCache(
  db: SupabaseClient,
  args: {
    geo_key: string;
    kind: Kind;
    payload_json: Record<string, unknown>;
    dataset_id: string | null;
    resource_id: string | null;
  }
) {
  await db.from("market_geo_cache").upsert(
    {
      geo_key: args.geo_key,
      kind: args.kind,
      payload_json: args.payload_json,
      dataset_id: args.dataset_id,
      resource_id: args.resource_id,
      computed_at: nowIso(),
      ttl_until: computeTtl(7),
    },
    { onConflict: "geo_key,kind" }
  );
}

async function upsertSnapshot(
  db: SupabaseClient,
  analysisId: string,
  kind: Kind,
  payload: Record<string, unknown>,
  datasetId: string | null,
  resourceId: string | null
) {
  await db.from("analysis_market_snapshot").upsert(
    {
      analysis_id: analysisId,
      kind,
      payload_json: payload,
      dataset_id: datasetId,
      resource_id: resourceId,
      created_at: nowIso(),
    },
    { onConflict: "analysis_id,kind" }
  );
}

async function tryLoadFromLocalDvf(
  db: SupabaseClient,
  geo: { insee: string | null; codePostal: string | null }
): Promise<DvfComparable[]> {
  let query = db
    .from("dvf_transactions")
    .select("date_mutation,valeur_fonciere,surface_reelle_bati,type_local,code_postal,code_commune")
    .gt("valeur_fonciere", 0)
    .gt("surface_reelle_bati", 0)
    .order("date_mutation", { ascending: false })
    .limit(2500);

  if (geo.insee) query = query.eq("code_commune", geo.insee);
  else if (geo.codePostal) query = query.eq("code_postal", geo.codePostal);
  else return [];

  const { data } = await query;
  return (data || []) as DvfComparable[];
}

async function loadDvfRowsFromMcp(
  userId: string,
  resourceId: string,
  geo: { insee: string | null; codePostal: string | null; commune: string | null }
): Promise<DvfComparable[]> {
  const questionGeo = geo.insee
    ? `transactions DVF de la commune INSEE ${geo.insee}`
    : geo.codePostal
      ? `transactions DVF du code postal ${geo.codePostal}`
      : geo.commune
        ? `transactions DVF de ${geo.commune}`
        : "transactions DVF recentes";

  const preview = await queryResourceData(resourceId, `${questionGeo} (apercu 20 lignes)`, 20, userId).catch(() => []);
  if (!preview.length) {
    return downloadAndParseResource(resourceId, 2000, userId).catch(() => []);
  }

  const resourceInfo = await getResourceInfo(resourceId, userId).catch(() => null);
  const tabularLikely =
    String((resourceInfo as any)?.format || "").toLowerCase().includes("csv") ||
    Boolean((resourceInfo as any)?.schema);

  if (tabularLikely) {
    const rows = await queryResourceData(resourceId, `${questionGeo} (max 2000 lignes)`, 2000, userId).catch(() => []);
    if (rows.length) return rows as DvfComparable[];
  }
  return downloadAndParseResource(resourceId, 2000, userId).catch(() => []);
}

function chooseScopeRows(
  rows: DvfComparable[],
  geo: { insee: string | null; codePostal: string | null }
): { rows: DvfComparable[]; scope: "commune" | "cp" | "dataset" } {
  if (geo.insee) {
    const byCommune = rows.filter((r) => String(r.code_commune || "").trim() === geo.insee);
    if (byCommune.length >= 8) return { rows: byCommune, scope: "commune" };
  }
  if (geo.codePostal) {
    const byCp = rows.filter((r) => String(r.code_postal || "").trim() === geo.codePostal);
    if (byCp.length >= 8) return { rows: byCp, scope: "cp" };
  }
  return { rows, scope: "dataset" };
}

function aggregateWithFallback(args: {
  rows: DvfComparable[];
  surface: number | null;
  askPrice: number | null;
  typeLocal: string | null;
}) {
  const strict = aggregateDvf({
    rows: args.rows,
    surface: args.surface,
    askPrice: args.askPrice,
    typeLocal: args.typeLocal,
    periodMonths: 24,
  });
  if (strict.samples_count >= 8) {
    return { aggregation: strict, profile: "strict_24m_surface_type" };
  }

  const noType = aggregateDvf({
    rows: args.rows,
    surface: args.surface,
    askPrice: args.askPrice,
    typeLocal: null,
    periodMonths: 24,
  });
  if (noType.samples_count >= 8) {
    return { aggregation: noType, profile: "relaxed_type_24m_surface" };
  }

  const widePeriod = aggregateDvf({
    rows: args.rows,
    surface: null,
    askPrice: args.askPrice,
    typeLocal: null,
    periodMonths: 36,
  });
  return {
    aggregation: widePeriod,
    profile: widePeriod.samples_count >= 8 ? "fallback_36m_no_surface_no_type" : "insufficient_after_fallback",
  };
}

export async function enrichMarketForAnalysis(args: {
  db: SupabaseClient;
  analysisId: string;
  userId: string;
  force?: boolean;
  maxSyncMs?: number;
}): Promise<{ status: "ok" | "processing" | "failed" | "indisponible"; enrichment: MarketEnrichmentPayload | null; sources: MarketSource[] }> {
  const featureEnabled = (Deno.env.get("MARKET_ENRICHMENT_ENABLED") || "true").toLowerCase() !== "false";
  if (!featureEnabled) {
    return { status: "indisponible", enrichment: null, sources: [] };
  }

  const startedAt = Date.now();
  const budget = args.maxSyncMs ?? 450;

  const { data: analysis } = await args.db
    .from("analyses")
    .select("id,user_id,url,canonical_url,inputs_json,listing_json")
    .eq("id", args.analysisId)
    .eq("user_id", args.userId)
    .maybeSingle();

  if (!analysis) {
    return { status: "failed", enrichment: null, sources: [] };
  }

  const listing = normalizeListing(analysis as Record<string, unknown>);
  const geoKey = getGeoKey({
    insee: listing.insee,
    codePostal: listing.codePostal,
    commune: listing.commune,
  });

  const cachedGeo = await readGeoCache(args.db, geoKey, "DVF");
  if (cachedGeo) {
    const payload = cachedGeo.payload_json as MarketEnrichmentPayload;
    await upsertSnapshot(args.db, args.analysisId, "DVF", payload as unknown as Record<string, unknown>, cachedGeo.dataset_id, cachedGeo.resource_id);
    logEvent("market_enrichment.cache_hit", {
      analysisId: args.analysisId,
      geo_key: geoKey,
      kind: "DVF",
      cache_hit: true,
      duration_ms: Date.now() - startedAt,
    });
    return {
      status: "ok",
      enrichment: payload,
      sources: [
        {
          kind: "DVF",
          dataset_id: cachedGeo.dataset_id,
          resource_id: cachedGeo.resource_id,
          source_url: null,
          updated_at: nowIso(),
        },
      ],
    };
  }

  if (!args.force && Date.now() - startedAt > budget) {
    await enqueueMarketEnrichmentJob(args.db, args.analysisId, args.userId);
    return { status: "processing", enrichment: null, sources: [] };
  }

  try {
    const localRows = await tryLoadFromLocalDvf(args.db, {
      insee: listing.insee,
      codePostal: listing.codePostal,
    });

    let rows: DvfComparable[] = localRows;
    let datasetId: string | null = "local_dvf_transactions";
    let resourceId: string | null = null;
    let sourceUrl: string | null = null;

    if (rows.length < 20) {
      const registry = await resolveDvfRegistry(args.db, args.userId);
      if (!registry) {
        const unavailable: MarketEnrichmentPayload = {
          status: "indisponible",
          kind: "DVF",
          geo_key: geoKey,
          scope: "dataset",
          dvf: {
            median_eur_m2: null,
            q25_eur_m2: null,
            q75_eur_m2: null,
            samples_count: 0,
            period: "n/a",
            estimated_price_range: null,
            delta_vs_ask: null,
            delta_pct: null,
          },
          reason: "Données DVF non accessibles via MCP",
        };
        await writeGeoCache(args.db, {
          geo_key: geoKey,
          kind: "DVF",
          payload_json: unavailable as unknown as Record<string, unknown>,
          dataset_id: null,
          resource_id: null,
        });
        await upsertSnapshot(args.db, args.analysisId, "DVF", unavailable as unknown as Record<string, unknown>, null, null);
        return { status: "indisponible", enrichment: unavailable, sources: [] };
      }

      rows = await loadDvfRowsFromMcp(args.userId, registry.resource_id, {
        insee: listing.insee,
        codePostal: listing.codePostal,
        commune: listing.commune,
      });
      datasetId = registry.dataset_id;
      resourceId = registry.resource_id;
      sourceUrl = registry.source_url;
    }

    const scoped = chooseScopeRows(rows, {
      insee: listing.insee,
      codePostal: listing.codePostal,
    });
    const { aggregation, profile } = aggregateWithFallback({
      rows: scoped.rows,
      surface: listing.surface,
      askPrice: listing.prix,
      typeLocal: listing.typeLocal,
    });

    const hasReliableMedian =
      Number.isFinite(Number(aggregation.median_eur_m2 || 0)) &&
      Number(aggregation.median_eur_m2 || 0) > 0;
    const payload: MarketEnrichmentPayload = {
      status: hasReliableMedian ? "ok" : "indisponible",
      kind: "DVF",
      geo_key: geoKey,
      scope: scoped.scope,
      dvf: aggregation,
      reason:
        hasReliableMedian
          ? `Profil: ${profile}`
          : "Comparables insuffisants (meme apres fallback 36 mois sans filtre type/surface)",
    };

    await writeGeoCache(args.db, {
      geo_key: geoKey,
      kind: "DVF",
      payload_json: payload as unknown as Record<string, unknown>,
      dataset_id: datasetId,
      resource_id: resourceId,
    });
    await upsertSnapshot(
      args.db,
      args.analysisId,
      "DVF",
      payload as unknown as Record<string, unknown>,
      datasetId,
      resourceId
    );

    logEvent("market_enrichment.ok", {
      analysisId: args.analysisId,
      geo_key: geoKey,
      dataset_id: datasetId,
      resource_id: resourceId,
      duration_ms: Date.now() - startedAt,
      rows_processed: rows.length,
      samples_count: aggregation.samples_count,
      cache_hit: false,
    });

    return {
      status: payload.status,
      enrichment: payload,
      sources: [
        {
          kind: "DVF",
          dataset_id: datasetId,
          resource_id: resourceId,
          source_url: sourceUrl,
          updated_at: nowIso(),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur enrichissement";
    logEvent("market_enrichment.failed", {
      analysisId: args.analysisId,
      geo_key: geoKey,
      duration_ms: Date.now() - startedAt,
      error: message,
    });
    await enqueueMarketEnrichmentJob(args.db, args.analysisId, args.userId);
    return { status: "processing", enrichment: null, sources: [] };
  }
}

export async function enqueueMarketEnrichmentJob(db: SupabaseClient, analysisId: string, userId: string) {
  await db.from("market_enrichment_jobs").upsert(
    {
      analysis_id: analysisId,
      user_id: userId,
      status: "queued",
      attempt_count: 0,
      error_message: null,
    },
    { onConflict: "analysis_id" }
  );
}

export async function getMarketEnrichmentStatus(args: {
  db: SupabaseClient;
  analysisId: string;
  userId: string;
}): Promise<{ status: "ok" | "processing" | "failed" | "indisponible"; enrichment: MarketEnrichmentPayload | null; sources: MarketSource[]; timestamps: { created_at: string | null; updated_at: string | null } }> {
  const { data: analysis } = await args.db
    .from("analyses")
    .select("id,user_id,created_at")
    .eq("id", args.analysisId)
    .eq("user_id", args.userId)
    .maybeSingle();
  if (!analysis) {
    return {
      status: "failed",
      enrichment: null,
      sources: [],
      timestamps: { created_at: null, updated_at: null },
    };
  }

  const { data: snapshot } = await args.db
    .from("analysis_market_snapshot")
    .select("payload_json,dataset_id,resource_id,created_at")
    .eq("analysis_id", args.analysisId)
    .eq("kind", "DVF")
    .maybeSingle();

  if (snapshot?.payload_json) {
    const payload = snapshot.payload_json as MarketEnrichmentPayload;
    return {
      status: payload.status === "ok" ? "ok" : payload.status,
      enrichment: payload,
      sources: [
        {
          kind: "DVF",
          dataset_id: snapshot.dataset_id || null,
          resource_id: snapshot.resource_id || null,
          source_url: null,
          updated_at: snapshot.created_at || nowIso(),
        },
      ],
      timestamps: {
        created_at: analysis.created_at || null,
        updated_at: snapshot.created_at || null,
      },
    };
  }

  const { data: job } = await args.db
    .from("market_enrichment_jobs")
    .select("status,error_message,created_at,updated_at")
    .eq("analysis_id", args.analysisId)
    .maybeSingle();

  if (!job) {
    return {
      status: "indisponible",
      enrichment: null,
      sources: [],
      timestamps: { created_at: analysis.created_at || null, updated_at: null },
    };
  }

  return {
    status: job.status === "done" ? "ok" : (job.status as "processing" | "failed"),
    enrichment: null,
    sources: [],
    timestamps: {
      created_at: job.created_at || analysis.created_at || null,
      updated_at: job.updated_at || null,
    },
  };
}

export async function processQueuedMarketJobs(args: {
  db: SupabaseClient;
  maxJobs?: number;
}): Promise<{ processed: number; failed: number }> {
  const maxJobs = args.maxJobs ?? 5;
  const { data: jobs } = await args.db
    .from("market_enrichment_jobs")
    .select("id,analysis_id,user_id,attempt_count")
    .in("status", ["queued", "processing"])
    .order("created_at", { ascending: true })
    .limit(maxJobs);

  let processed = 0;
  let failed = 0;

  for (const job of jobs || []) {
    await args.db
      .from("market_enrichment_jobs")
      .update({ status: "processing", attempt_count: Number(job.attempt_count || 0) + 1 })
      .eq("id", job.id);

    const result = await enrichMarketForAnalysis({
      db: args.db,
      analysisId: String(job.analysis_id),
      userId: String(job.user_id),
      force: true,
      maxSyncMs: 3000,
    });

    if (result.status === "ok" || result.status === "indisponible") {
      await args.db.from("market_enrichment_jobs").update({ status: "done", error_message: null }).eq("id", job.id);
      processed += 1;
    } else if (Number(job.attempt_count || 0) >= 2) {
      await args.db
        .from("market_enrichment_jobs")
        .update({ status: "failed", error_message: "Enrichissement non resolu apres retries" })
        .eq("id", job.id);
      failed += 1;
    } else {
      await args.db.from("market_enrichment_jobs").update({ status: "queued" }).eq("id", job.id);
    }
  }

  return { processed, failed };
}

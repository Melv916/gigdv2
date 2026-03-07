# GIGD V2

Version publique orientee investissement locatif uniquement (nue, meuble, colocation, LCD).

## Implementation Plan

1. Ajouter le socle data V2 (plans Stripe, analyses, cache IA, usage mensuel).
2. Ajouter les services backend modulaires (cache/quota/stripe/import/IA).
3. Exposer les endpoints API V2 (analysis, me, stripe).
4. Integrer les pages abonnement et espace avance (avec guard plan).
5. Migrer l'ecran d'analyse projet vers la sortie IA V2 (sans scoring/GO-NO GO).
6. Ajouter le module Market Enrichment (MCP data.gouv.fr) avec cache multi-niveaux.
7. Ajouter les endpoints d'enrichissement marche + job async.
8. Ajouter les tests smoke (cache key + quotas + enrichment DVF/MCP).
9. Documenter variables d'env, webhooks Stripe locaux et hypotheses.

## Hypotheses

Voir [ASSUMPTIONS.md](./ASSUMPTIONS.md).

## Base de donnees

Migration V2:
- `supabase/migrations/20260301100000_gigd_v2_core.sql`
- `supabase/migrations/20260302193000_add_market_enrichment_tables.sql`

Changements principaux:
- `profiles`: `plan`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_status`, `current_period_start`, `current_period_end`
- `analyses`: analyses utilisateur (URL, inputs, mode IA, texte)
- `ai_cache`: cache obligatoire IA par `cache_key`
- `usage_tracking`: compteur mensuel d'analyses par utilisateur
- `market_dataset_registry`: cache catalogue dataset/resource MCP (TTL 30j)
- `market_geo_cache`: cache geo des agregats DVF (TTL 7j)
- `analysis_market_snapshot`: snapshot immuable des valeurs utilisees par analyse
- `market_enrichment_jobs`: file async pour enrichissements longs

## Edge Function V2

Fonction:
- `supabase/functions/gigd-v2-api/index.ts`

Services:
- `supabase/functions/_shared/v2/quotaService.ts`
- `supabase/functions/_shared/v2/stripeService.ts`
- `supabase/functions/_shared/v2/aiService.ts`
- `supabase/functions/_shared/v2/cacheService.ts`
- `supabase/functions/_shared/v2/listingImportService.ts`
- `supabase/functions/_shared/v2/mcpClient.ts`
- `supabase/functions/_shared/v2/marketEnrichmentCore.ts`
- `supabase/functions/_shared/v2/marketEnrichmentService.ts`

Endpoints:
- `GET /api/me`
- `POST /api/analysis/import`
- `POST /api/analysis/create`
- `GET /api/analysis/:id`
- `POST /api/market/enrich`
- `GET /api/market/enrich/:analysisId`
- `POST /api/market/enrich/worker/run` (worker protege par secret)
- `POST /api/stripe/checkout`
- `POST /api/stripe/portal`
- `POST /api/stripe/webhook`

## Cache IA (obligatoire)

`cacheKey = sha256(canonicalUrl + stableStringify(inputs) + mode)`

Flux:
1. lookup `ai_cache` avant appel IA
2. si hit non expire (TTL), retour direct (`cacheHit=true`)
3. sinon appel IA, stockage en DB (`cacheHit=false`)

TTL:
- `AI_CACHE_TTL_DAYS` (defaut 30)

## Frontend V2

Pages:
- `src/pages/app/Subscription.tsx` -> `/app/abonnement`
- `src/pages/app/Advanced.tsx` -> `/app/avance`
- `src/pages/app/ProjectDetail.tsx` -> analyse V2 sans score/GO-NO GO

Client API:
- `src/lib/v2/api.ts`

## Variables d'environnement

Frontend (`.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Supabase Edge Functions secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_URL`
- `LOVABLE_API_KEY`
- `FIRECRAWL_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_DEBUTANT`
- `STRIPE_PRICE_ID_INVESTISSEUR`
- `STRIPE_PRICE_ID_AVANCE`
- `ADVANCE_WHATSAPP_URL`
- `ADVANCE_BOOK_URL`
- `ADVANCE_VIDEOS_URL`
- `AI_CACHE_TTL_DAYS` (optionnel, defaut 30)
- `MCP_DATA_GOUV_URL` (optionnel, defaut `https://mcp.data.gouv.fr/mcp`)
- `MCP_TIMEOUT_MS` (defaut 3000)
- `MCP_MAX_RETRIES` (defaut 2)
- `MCP_DVF_DATASET_ID` (optionnel, bypass discovery auto)
- `MCP_DVF_RESOURCE_ID` (optionnel, bypass discovery auto)
- `MARKET_ENRICHMENT_ENABLED` (`true|false`, defaut `true`)
- `MARKET_WORKER_SECRET` (obligatoire pour endpoint worker)

## Stripe local (webhooks)

1. Lancer Stripe CLI:
```bash
stripe listen --forward-to http://127.0.0.1:54321/functions/v1/gigd-v2-api/api/stripe/webhook
```
2. Copier le secret `whsec_...` et le definir dans `STRIPE_WEBHOOK_SECRET`.
3. Simuler un abonnement:
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## Tests

Tests smoke:
- `src/lib/v2/v2.test.ts`
- `src/lib/v2/market-enrichment-core.test.ts`
- `src/lib/v2/mcp-client-smoke.test.ts`

Lancer:
```bash
npm run test
```

Scenarios verifies:
- cache key hit/miss
- cache key different selon mode IA
- quotas Free (5) et Debutant (50)
- selection dataset DVF registry (core)
- agregation DVF (mediane/quantiles/delta)
- TTL cache helpers
- fallback agregation vide
- workflow MCP mocke (search/list/query)

## Market Enrichment (MCP data.gouv.fr)

Flux:
1. `analysis/create` tente un enrichissement DVF synchrone (budget court).
2. Si lent/indispo, job async en file (`market_enrichment_jobs`).
3. UI analyse affiche le badge `Enrichissement marche: En cours / OK / Indispo`.
4. Source et metadata affichables: `dataset_id/resource_id`, periode, nb comparables.

Caches:
- Niveau A: `market_dataset_registry` (mapping query -> dataset/resource, TTL 30j)
- Niveau B: `market_geo_cache` (agregats geo DVF, TTL 7j)
- Niveau C: `analysis_market_snapshot` (snapshot immuable par analyse)

Troubleshooting:
- Si DVF reste `n/a`, verifier `MARKET_ENRICHMENT_ENABLED=true`.
- Verifier que la migration `20260302193000_add_market_enrichment_tables.sql` est appliquee.
- Verifier connectivite sortante vers `https://mcp.data.gouv.fr/mcp`.
- Si beaucoup de `processing`, declencher le worker:
  - `POST /api/market/enrich/worker/run` avec header `x-worker-secret: <MARKET_WORKER_SECRET>`.

## Notes produit V2

- Pas de beta/waitlist/coming soon.
- Positionnement locatif uniquement.
- IA en texte structure (courte/complete), sans scoring global, sans GO/NO GO, sans cartes red flags/good points.

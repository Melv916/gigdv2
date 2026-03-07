# GIGD V2 Assumptions

This repository is implemented as:
- React + Vite frontend
- Supabase Postgres + Supabase Edge Functions backend
- Supabase Auth for user identity

Because the requested stack examples mention Next.js API routes, this implementation maps the same contract to:
- Edge function routes under `supabase/functions/gigd-v2-api/index.ts`
- Frontend calls via `supabase.functions.invoke("gigd-v2-api", ...)`

Schema adaptation choices:
- Existing `public.profiles` table is used as "users" profile table and extended with billing columns (`plan`, stripe ids, period dates, status)
- Existing project flow is preserved, and new V2 flow uses dedicated tables:
  - `public.analyses`
  - `public.ai_cache`
  - `public.usage_tracking` (adapted from requested `usage` to avoid naming collision risk)

Stripe integration assumptions:
- Stripe is called through REST API from Edge Function
- Webhook signature verification follows Stripe signed payload protocol (`Stripe-Signature`)
- Price IDs are provided by environment variables:
  - `STRIPE_PRICE_ID_DEBUTANT`
  - `STRIPE_PRICE_ID_INVESTISSEUR`
  - `STRIPE_PRICE_ID_AVANCE`

Advanced offer links:
- Delivered via env vars:
  - `ADVANCE_WHATSAPP_URL`
  - `ADVANCE_BOOK_URL`
  - `ADVANCE_VIDEOS_URL`

IA provider:
- Existing AI Gateway env key (`LOVABLE_API_KEY`) is reused for completion calls
- IA output is plain structured text (no scoring, no go/no-go, no cards)

Market enrichment:
- MCP integration targets `https://mcp.data.gouv.fr/mcp` from backend only (Edge Function), never from browser.
- Enrichment is best-effort with progressive fallback:
  1) local `dvf_transactions` if available
  2) MCP query/download
  3) mark as unavailable with explicit reason
- Heavy enrichment is queued in `market_enrichment_jobs` and can be processed by a protected worker endpoint.

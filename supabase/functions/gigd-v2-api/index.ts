import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { canonicalizeUrl } from "../_shared/v2/cacheService.ts";
import { generateAnalysisWithCache } from "../_shared/v2/aiService.ts";
import { importListingFromUrl } from "../_shared/v2/listingImportService.ts";
import {
  enrichMarketForAnalysis,
  getMarketEnrichmentStatus,
  processQueuedMarketJobs,
} from "../_shared/v2/marketEnrichmentService.ts";
import {
  allowedIAModeForPlan,
  getUsageForPeriod,
  incrementUsage,
  isQuotaExceeded,
  periodKeyForDate,
  planLimit,
} from "../_shared/v2/quotaService.ts";
import {
  createCheckoutSession,
  createPortalSession,
  mapPlanFromPriceId,
  verifyStripeSignature,
} from "../_shared/v2/stripeService.ts";
import type { AnalysisCreatePayload, IAMode, Plan } from "../_shared/v2/types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

function json(status: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parseRoute(pathname: string): string {
  const idx = pathname.indexOf("/api/");
  return idx >= 0 ? pathname.slice(idx) : pathname;
}

function nextMonthResetIso(): string {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  return next.toISOString();
}

function unauthorized() {
  return json(401, { error: "Unauthorized" });
}

async function getUser(req: Request): Promise<{ id: string; email: string | null } | null> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  const { data } = await db.auth.getUser(token);
  return data.user ? { id: data.user.id, email: data.user.email || null } : null;
}

async function getProfile(userId: string): Promise<{
  plan: Plan;
  stripe_customer_id: string | null;
  current_period_end: string | null;
  stripe_status: string | null;
}> {
  const { data } = await db
    .from("profiles")
    .select("plan,stripe_customer_id,current_period_end,stripe_status")
    .eq("user_id", userId)
    .maybeSingle();
  return {
    plan: (data?.plan as Plan) || "free",
    stripe_customer_id: data?.stripe_customer_id || null,
    current_period_end: data?.current_period_end || null,
    stripe_status: data?.stripe_status || null,
  };
}

function effectivePlan(plan: Plan, userEmail: string | null): Plan {
  const forced = (
    Deno.env.get("FORCE_ADVANCED_EMAILS") || "melvin.calmels@gmail.com"
  )
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (userEmail && forced.includes(userEmail.toLowerCase())) return "avance";
  return plan;
}

// Temporary public-free mode: disable paid restrictions.
const FREE_ACCESS_ALL = true;

async function updateProfileByUserId(
  userId: string,
  patch: Record<string, string | null | Date>
) {
  const normalized = Object.fromEntries(
    Object.entries(patch).map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v])
  );
  await db.from("profiles").update(normalized).eq("user_id", userId);
}

async function updateProfileByCustomerId(
  customerId: string,
  patch: Record<string, string | null | Date>
) {
  const normalized = Object.fromEntries(
    Object.entries(patch).map(([k, v]) => [k, v instanceof Date ? v.toISOString() : v])
  );
  await db.from("profiles").update(normalized).eq("stripe_customer_id", customerId);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const route = parseRoute(new URL(req.url).pathname);

  try {
    // Webhook must use raw payload for signature verification.
    if (req.method === "POST" && route === "/api/stripe/webhook") {
      const payload = await req.text();
      const signature = req.headers.get("stripe-signature") || "";
      const isValid = await verifyStripeSignature(payload, signature);
      if (!isValid) return json(400, { error: "Invalid Stripe signature" });

      const event = JSON.parse(payload);
      const type = String(event.type || "");
      const object = event.data?.object || {};

      if (type === "checkout.session.completed") {
        const userId = object.metadata?.user_id as string | undefined;
        if (userId) {
          await updateProfileByUserId(userId, {
            stripe_customer_id: object.customer || null,
            stripe_subscription_id: object.subscription || null,
            stripe_status: "active",
          });
        }
      }

      if (
        type === "customer.subscription.created" ||
        type === "customer.subscription.updated" ||
        type === "customer.subscription.deleted"
      ) {
        const customerId = object.customer as string;
        const status = String(object.status || "");
        const priceId = object.items?.data?.[0]?.price?.id as string | undefined;
        const plan = priceId ? mapPlanFromPriceId(priceId) : null;
        const currentPeriodStart = object.current_period_start
          ? new Date(Number(object.current_period_start) * 1000)
          : null;
        const currentPeriodEnd = object.current_period_end
          ? new Date(Number(object.current_period_end) * 1000)
          : null;
        await updateProfileByCustomerId(customerId, {
          stripe_subscription_id: object.id || null,
          stripe_status: status || null,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          plan: status === "canceled" ? "free" : plan || null,
        });
      }

      if (type === "invoice.paid" || type === "invoice.payment_failed") {
        const customerId = object.customer as string;
        await updateProfileByCustomerId(customerId, {
          stripe_status: type === "invoice.paid" ? "active" : "past_due",
        });
      }

      return json(200, { ok: true });
    }

    // Worker endpoint authenticated by shared secret (no user JWT required)
    if (req.method === "POST" && route === "/api/market/enrich/worker/run") {
      const workerSecret = Deno.env.get("MARKET_WORKER_SECRET") || "";
      const incoming = req.headers.get("x-worker-secret") || "";
      if (!workerSecret || incoming !== workerSecret) {
        return json(403, { error: "Forbidden" });
      }
      const run = await processQueuedMarketJobs({ db, maxJobs: 10 });
      return json(200, { ok: true, ...run });
    }

    const user = await getUser(req);
    if (!user) {
      if (req.method === "GET" && route === "/api/me") {
        const periodKey = periodKeyForDate(new Date());
        return json(200, {
          userId: "public",
          plan: "avance",
          iaModeAllowed: "complete",
          quota: {
            periodKey,
            used: 0,
            limit: null,
            remaining: null,
            nextReset: nextMonthResetIso(),
          },
          advancedAccess: true,
          advancedLinks: {
            whatsapp: Deno.env.get("ADVANCE_WHATSAPP_URL") || "",
            book: Deno.env.get("ADVANCE_BOOK_URL") || "",
            videos: Deno.env.get("ADVANCE_VIDEOS_URL") || "",
          },
        });
      }
      return unauthorized();
    }

    if (req.method === "GET" && route === "/api/me") {
      const profile = await getProfile(user.id);
      const plan = effectivePlan(profile.plan, user.email);
      const periodKey = periodKeyForDate(new Date());
      const count = await getUsageForPeriod(db, user.id, periodKey);
      return json(200, {
        userId: user.id,
        plan,
        iaModeAllowed: FREE_ACCESS_ALL ? "complete" : allowedIAModeForPlan(plan),
        quota: {
          periodKey,
          used: count,
          limit: FREE_ACCESS_ALL ? null : planLimit(plan),
          remaining:
            FREE_ACCESS_ALL || planLimit(plan) === null
              ? null
              : Math.max(0, (planLimit(plan) || 0) - count),
          nextReset: profile.current_period_end || nextMonthResetIso(),
        },
        advancedAccess: FREE_ACCESS_ALL ? true : plan === "avance",
        advancedLinks: {
          whatsapp: Deno.env.get("ADVANCE_WHATSAPP_URL") || "",
          book: Deno.env.get("ADVANCE_BOOK_URL") || "",
          videos: Deno.env.get("ADVANCE_VIDEOS_URL") || "",
        },
      });
    }

    if (req.method === "POST" && route === "/api/analysis/import") {
      const body = await req.json();
      const url = String(body.url || "");
      if (!url) return json(400, { error: "url is required" });
      const imported = await importListingFromUrl(url);
      return json(200, imported);
    }

    if (req.method === "POST" && route === "/api/analysis/create") {
      const payload = (await req.json()) as AnalysisCreatePayload;
      if (!payload?.url || !payload?.strategy) return json(400, { error: "url and strategy are required" });

      const profile = await getProfile(user.id);
      const plan = effectivePlan(profile.plan, user.email);
      const allowedMode = FREE_ACCESS_ALL ? "complete" : allowedIAModeForPlan(plan);
      const requestedMode = (payload.mode || "courte") as IAMode;
      const mode: IAMode = allowedMode === "courte" ? "courte" : requestedMode;

      const periodKey = periodKeyForDate(new Date());
      const currentUsage = await getUsageForPeriod(db, user.id, periodKey);
      if (!FREE_ACCESS_ALL && isQuotaExceeded(plan, currentUsage)) {
        return json(429, {
          error: "Quota exceeded",
          code: "QUOTA_EXCEEDED",
          redirectTo: "/tarifs",
          quota: { used: currentUsage, limit: planLimit(plan), periodKey },
        });
      }

      const imported = payload.importData
        ? {
            canonicalUrl: canonicalizeUrl(payload.url),
            listing: payload.importData.listing,
            dvfSummary: payload.importData.dvfSummary || {},
          }
        : await importListingFromUrl(payload.url);

      const ttlDays = Number(Deno.env.get("AI_CACHE_TTL_DAYS") || "30");
      const ai = await generateAnalysisWithCache({
        db,
        userId: user.id,
        canonicalUrl: imported.canonicalUrl,
        inputs: payload.inputs || {},
        mode,
        strategy: payload.strategy,
        listing: imported.listing as Record<string, unknown>,
        dvf: imported.dvfSummary as Record<string, unknown>,
        ttlDays,
      });

      const { data: analysis } = await db
        .from("analyses")
        .insert({
          user_id: user.id,
          url: payload.url,
          canonical_url: imported.canonicalUrl,
          inputs_json: payload.inputs || {},
          strategy: payload.strategy,
          ia_mode: mode,
          listing_json: imported.listing,
          dvf_json: imported.dvfSummary,
          analysis_text: ai.text,
          cache_hit: ai.cacheHit,
        })
        .select("*")
        .single();

      const market = analysis
        ? await enrichMarketForAnalysis({
            db,
            analysisId: analysis.id,
            userId: user.id,
            maxSyncMs: 450,
          })
        : { status: "indisponible" as const, enrichment: null, sources: [] };

      await incrementUsage(db, user.id, periodKey);

      return json(200, {
        analysis,
        cacheHit: ai.cacheHit,
        mode,
        market,
      });
    }

    if (req.method === "POST" && route === "/api/market/enrich") {
      const body = await req.json().catch(() => ({}));
      const analysisId = String(body.analysisId || "");
      if (!analysisId) return json(400, { error: "analysisId is required" });

      const force = Boolean(body.force || false);
      const result = await enrichMarketForAnalysis({
        db,
        analysisId,
        userId: user.id,
        force,
        maxSyncMs: 450,
      });
      return json(200, result);
    }

    if (req.method === "GET" && route.startsWith("/api/market/enrich/")) {
      const analysisId = route.replace("/api/market/enrich/", "");
      const result = await getMarketEnrichmentStatus({
        db,
        analysisId,
        userId: user.id,
      });
      return json(200, result);
    }

    if (req.method === "GET" && route.startsWith("/api/analysis/")) {
      const analysisId = route.replace("/api/analysis/", "");
      const { data } = await db
        .from("analyses")
        .select("*")
        .eq("id", analysisId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!data) return json(404, { error: "Not found" });
      return json(200, data);
    }

    if (req.method === "POST" && route === "/api/stripe/checkout") {
      const profile = await getProfile(user.id);
      const body = await req.json();
      const plan = String(body.plan || "") as Plan;
      if (!["debutant", "investisseur", "avance"].includes(plan)) {
        return json(400, { error: "Invalid plan for checkout" });
      }

      const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
      const session = await createCheckoutSession({
        customerId: profile.stripe_customer_id,
        customerEmail: user.email,
        plan,
        successUrl: `${appUrl}/app/abonnement?checkout=success`,
        cancelUrl: `${appUrl}/tarifs?checkout=cancel`,
        userId: user.id,
      });
      return json(200, session);
    }

    if (req.method === "POST" && route === "/api/stripe/portal") {
      const profile = await getProfile(user.id);
      if (!profile.stripe_customer_id) return json(400, { error: "No Stripe customer for this account" });
      const appUrl = Deno.env.get("APP_URL") || "http://localhost:5173";
      const portal = await createPortalSession({
        customerId: profile.stripe_customer_id,
        returnUrl: `${appUrl}/app/abonnement`,
      });
      return json(200, portal);
    }

    return json(404, { error: "Route not found" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return json(500, { error: message });
  }
});

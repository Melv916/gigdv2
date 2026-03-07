import type { Plan } from "./types.ts";

const STRIPE_API = "https://api.stripe.com/v1";

function stripeKey(): string {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  return key;
}

function priceIdForPlan(plan: Plan): string {
  if (plan === "debutant") return Deno.env.get("STRIPE_PRICE_ID_DEBUTANT") || "";
  if (plan === "investisseur") return Deno.env.get("STRIPE_PRICE_ID_INVESTISSEUR") || "";
  if (plan === "avance") return Deno.env.get("STRIPE_PRICE_ID_AVANCE") || "";
  return "";
}

export async function createCheckoutSession(args: {
  customerId?: string | null;
  customerEmail?: string | null;
  plan: Plan;
  successUrl: string;
  cancelUrl: string;
  userId: string;
}): Promise<{ id: string; url: string }> {
  const price = priceIdForPlan(args.plan);
  if (!price) throw new Error("Missing Stripe price id for selected plan");

  const body = new URLSearchParams();
  body.set("mode", "subscription");
  body.set("success_url", args.successUrl);
  body.set("cancel_url", args.cancelUrl);
  body.set("line_items[0][price]", price);
  body.set("line_items[0][quantity]", "1");
  body.set("metadata[user_id]", args.userId);
  body.set("metadata[plan]", args.plan);
  if (args.customerId) body.set("customer", args.customerId);
  else if (args.customerEmail) body.set("customer_email", args.customerEmail);

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const raw = await res.text();
    let detail = raw;
    try {
      const parsed = JSON.parse(raw);
      detail = parsed?.error?.message || raw;
    } catch {
      // keep raw text
    }
    throw new Error(`Stripe checkout failed: ${detail}`);
  }
  const data = await res.json();
  return { id: data.id, url: data.url };
}

export async function createPortalSession(args: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  const body = new URLSearchParams();
  body.set("customer", args.customerId);
  body.set("return_url", args.returnUrl);

  const res = await fetch(`${STRIPE_API}/billing_portal/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) {
    const raw = await res.text();
    let detail = raw;
    try {
      const parsed = JSON.parse(raw);
      detail = parsed?.error?.message || raw;
    } catch {
      // keep raw text
    }
    throw new Error(`Stripe portal failed: ${detail}`);
  }
  const data = await res.json();
  return { url: data.url };
}

export async function verifyStripeSignature(payload: string, signatureHeader: string): Promise<boolean> {
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET missing");
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(signatureHeader.split(",").map((p) => p.split("=", 2)));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expected = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return expected === signature;
}

export function mapPlanFromPriceId(priceId: string): Plan | null {
  if (priceId === Deno.env.get("STRIPE_PRICE_ID_DEBUTANT")) return "debutant";
  if (priceId === Deno.env.get("STRIPE_PRICE_ID_INVESTISSEUR")) return "investisseur";
  if (priceId === Deno.env.get("STRIPE_PRICE_ID_AVANCE")) return "avance";
  return null;
}

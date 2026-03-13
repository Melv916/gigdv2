export type TrackingEventName =
  | "view_page"
  | "click_cta_primary"
  | "click_cta_secondary"
  | "start_analysis"
  | "complete_analysis"
  | "submit_contact_form"
  | "click_email"
  | "click_call"
  | "open_method_page"
  | "read_seo_page";

type TrackingPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    va?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(name: TrackingEventName, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }

  if (typeof window.va === "function") {
    window.va("event", { name, ...payload });
  }

  window.dispatchEvent(new CustomEvent("gigd:track", { detail: { name, payload } }));
}

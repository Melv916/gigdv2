import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>;

interface SeoProps {
  title: string;
  description: string;
  pathname?: string;
  canonicalUrl?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  structuredData?: StructuredData;
  trackingType?: "page" | "seo" | "method";
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export function Seo({
  title,
  description,
  pathname = "/",
  canonicalUrl,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  structuredData,
  trackingType = "page",
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const resolvedCanonical = canonicalUrl || `${SITE_URL}${pathname}`;
    const robots = noindex ? "noindex, nofollow" : "index, follow";

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "fr_FR" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: resolvedCanonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: resolvedCanonical });

    trackEvent("view_page", { path: pathname, title: fullTitle, trackingType });
    if (trackingType === "seo") {
      trackEvent("read_seo_page", { path: pathname, title: fullTitle });
    }
    if (trackingType === "method") {
      trackEvent("open_method_page", { path: pathname, title: fullTitle });
    }

    return undefined;
  }, [canonicalUrl, description, image, noindex, pathname, title, trackingType, type]);

  useEffect(() => {
    const existing = document.head.querySelectorAll('script[data-seo-ld]');
    existing.forEach((node) => {
      if ((node as HTMLScriptElement).dataset.path === pathname) {
        node.remove();
      }
    });

    if (!structuredData) return undefined;

    const payloads = Array.isArray(structuredData) ? structuredData : [structuredData];
    const nodes = payloads.map((payload, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoLd = `${index}`;
      script.dataset.path = pathname;
      script.text = JSON.stringify(payload);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      nodes.forEach((node) => node.remove());
    };
  }, [pathname, structuredData]);

  return null;
}

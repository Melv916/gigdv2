import type { IAMode } from "./types.ts";

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
}

export function canonicalizeUrl(url: string): string {
  const parsed = new URL(url);
  parsed.hash = "";
  parsed.searchParams.sort();
  return parsed.toString();
}

export async function buildCacheKey(canonicalUrl: string, inputs: unknown, mode: IAMode): Promise<string> {
  const payload = `${canonicalUrl}|${stableStringify(inputs)}|${mode}`;
  const bytes = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isCacheExpired(createdAt: string, ttlDays: number): boolean {
  const created = new Date(createdAt).getTime();
  const maxAge = ttlDays * 24 * 60 * 60 * 1000;
  return Date.now() - created > maxAge;
}

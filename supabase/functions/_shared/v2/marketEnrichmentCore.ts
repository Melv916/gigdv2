export interface DvfComparable {
  date_mutation?: string;
  valeur_fonciere?: number | string | null;
  surface_reelle_bati?: number | string | null;
  type_local?: string | null;
  code_postal?: string | null;
  code_commune?: string | null;
  [key: string]: unknown;
}

export interface DvfAggregateInput {
  rows: DvfComparable[];
  surface?: number | null;
  askPrice?: number | null;
  typeLocal?: string | null;
  periodMonths?: number;
}

export interface DvfAggregation {
  median_eur_m2: number | null;
  q25_eur_m2: number | null;
  q75_eur_m2: number | null;
  samples_count: number;
  period: string;
  estimated_price_range: [number, number] | null;
  delta_vs_ask: number | null;
  delta_pct: number | null;
}

export interface DatasetCandidate {
  id: string;
  title?: string;
  organization?: string;
  tags?: string[];
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function normalizeType(typeLocal: string | null | undefined): "Appartement" | "Maison" | null {
  if (!typeLocal) return null;
  const v = typeLocal.toLowerCase();
  if (v.includes("appart")) return "Appartement";
  if (v.includes("maison")) return "Maison";
  return null;
}

function percentile(sortedAsc: number[], p: number): number | null {
  if (!sortedAsc.length) return null;
  if (sortedAsc.length === 1) return sortedAsc[0];
  const idx = (sortedAsc.length - 1) * p;
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sortedAsc[lower];
  const weight = idx - lower;
  return sortedAsc[lower] * (1 - weight) + sortedAsc[upper] * weight;
}

export function isExpired(ttlUntil: string | Date, now = new Date()): boolean {
  return new Date(ttlUntil).getTime() <= now.getTime();
}

export function computeTtl(days: number, now = new Date()): string {
  const ms = Math.max(1, days) * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + ms).toISOString();
}

export function selectBestDataset(candidates: DatasetCandidate[]): DatasetCandidate | null {
  if (!candidates.length) return null;

  const score = (c: DatasetCandidate): number => {
    const text = `${c.title || ""} ${c.organization || ""} ${(c.tags || []).join(" ")}`.toLowerCase();
    let s = 0;
    if (text.includes("dvf")) s += 40;
    if (text.includes("demande de valeurs fonci")) s += 30;
    if (text.includes("etalab")) s += 15;
    if (text.includes("data.gouv")) s += 10;
    if (text.includes("mutation")) s += 8;
    return s;
  };

  return [...candidates].sort((a, b) => score(b) - score(a))[0];
}

export function aggregateDvf(input: DvfAggregateInput): DvfAggregation {
  const periodMonths = input.periodMonths ?? 24;
  const now = new Date();
  const minTs = new Date(now.getFullYear(), now.getMonth() - periodMonths, now.getDate()).getTime();
  const normalizedType = normalizeType(input.typeLocal || null);
  const targetSurface = toNumber(input.surface);
  const askPrice = toNumber(input.askPrice);

  const filtered = input.rows.filter((row) => {
    const value = toNumber(row.valeur_fonciere);
    const surface = toNumber(row.surface_reelle_bati);
    if (!value || !surface || value <= 0 || surface <= 0) return false;

    if (row.date_mutation) {
      const ts = new Date(String(row.date_mutation)).getTime();
      if (Number.isFinite(ts) && ts < minTs) return false;
    }

    if (normalizedType) {
      const rowType = normalizeType(String(row.type_local || ""));
      if (rowType && rowType !== normalizedType) return false;
    }

    if (targetSurface && targetSurface > 0) {
      const minS = targetSurface * 0.8;
      const maxS = targetSurface * 1.2;
      if (surface < minS || surface > maxS) return false;
    }
    return true;
  });

  const eurM2 = filtered
    .map((row) => {
      const value = toNumber(row.valeur_fonciere)!;
      const surface = toNumber(row.surface_reelle_bati)!;
      return value / surface;
    })
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);

  const q25 = percentile(eurM2, 0.25);
  const q50 = percentile(eurM2, 0.5);
  const q75 = percentile(eurM2, 0.75);
  const estimatedRange =
    q25 && q75 && targetSurface && targetSurface > 0
      ? [Math.round(q25 * targetSurface), Math.round(q75 * targetSurface)] as [number, number]
      : null;
  const medianPrice = q50 && targetSurface && targetSurface > 0 ? q50 * targetSurface : null;
  const delta = askPrice && medianPrice ? askPrice - medianPrice : null;
  const deltaPct = delta !== null && medianPrice && medianPrice > 0 ? (delta / medianPrice) * 100 : null;

  return {
    median_eur_m2: q50 ? Math.round(q50) : null,
    q25_eur_m2: q25 ? Math.round(q25) : null,
    q75_eur_m2: q75 ? Math.round(q75) : null,
    samples_count: eurM2.length,
    period: `${periodMonths} derniers mois`,
    estimated_price_range: estimatedRange,
    delta_vs_ask: delta !== null ? Math.round(delta) : null,
    delta_pct: deltaPct !== null ? Number(deltaPct.toFixed(2)) : null,
  };
}

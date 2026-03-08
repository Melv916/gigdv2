export type PropertyData = {
  purchasePrice: number;
  surface: number;
  city: string | null;
  postalCode: string | null;
  inseeCode: string | null;
  address: string | null;
  rooms: number | null;
};

export type MarketData = {
  marketPricePerSqm: number | null;
  marketRentPerSqm: number | null;
  priceMinPerSqm: number | null;
  priceMaxPerSqm: number | null;
  rentMinPerSqm: number | null;
  rentMaxPerSqm: number | null;
  scoreFiabilite: number | null;
  sourcePrixM2: string | null;
  sourceLoyerM2: string | null;
  dateReferenceSource: string | null;
  commentaire: string | null;
};

function num(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().replace(/\bm(?:2|\u00B2)\b/gi, "");
  if (!s) return null;
  const compact = s.replace(/\s/g, "").replace(/'/g, "");
  let normalized = compact.replace(/[^\d,.-]/g, "");
  if (!normalized) return null;
  if (normalized.includes(",") && normalized.includes(".")) {
    normalized =
      normalized.lastIndexOf(",") > normalized.lastIndexOf(".")
        ? normalized.replace(/\./g, "").replace(",", ".")
        : normalized.replace(/,/g, "");
  } else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function firstNum(row: Record<string, unknown> | null | undefined, keys: string[]): number | null {
  if (!row) return null;
  for (const key of keys) {
    const value = num(row[key]);
    if (value !== null && value > 0) return value;
  }
  return null;
}

function firstStr(row: Record<string, unknown> | null | undefined, keys: string[]): string | null {
  if (!row) return null;
  for (const key of keys) {
    const value = row[key];
    if (value !== null && value !== undefined) {
      const s = String(value).trim();
      if (s) return s;
    }
  }
  return null;
}

export function normalizePropertyData(input: Record<string, unknown>): PropertyData {
  const purchasePrice =
    num(input.prix) ||
    num(input.price) ||
    num(input.purchasePrice) ||
    num(input.purchase_price) ||
    0;
  const surface =
    num(input.surface) ||
    num(input.livingArea) ||
    num(input.living_area) ||
    num(input.area) ||
    0;

  return {
    purchasePrice,
    surface,
    city: firstStr(input, ["ville", "city"]),
    postalCode: firstStr(input, ["codePostal", "postalCode"]),
    inseeCode: firstStr(input, ["insee", "inseeCode", "code_insee"]),
    address: firstStr(input, ["adresse", "address"]),
    rooms: num(input.pieces),
  };
}

export function buildMarketData(
  row: Record<string, unknown> | null,
  args: { type: "house" | "apartment"; typology: "all" | "t1t2" | "t3plus" },
): MarketData {
  const marketPricePerSqm = firstNum(row, ["sale_m2_all", "prix_m2_moyen"]);
  let marketRentPerSqm: number | null = null;
  if (args.type === "house") {
    marketRentPerSqm = firstNum(row, ["rent_m2_house", "loyer_m2_maison", "rent_m2_app_all", "loyer_m2_moyen"]);
  } else if (args.typology === "t1t2") {
    marketRentPerSqm = firstNum(row, ["rent_m2_app_t1t2", "rent_m2_app_all", "loyer_m2_moyen"]);
  } else if (args.typology === "t3plus") {
    marketRentPerSqm = firstNum(row, ["rent_m2_app_t3plus", "rent_m2_app_all", "loyer_m2_moyen"]);
  } else {
    marketRentPerSqm = firstNum(row, ["rent_m2_app_all", "loyer_m2_moyen"]);
  }

  return {
    marketPricePerSqm,
    marketRentPerSqm,
    priceMinPerSqm: firstNum(row, ["prix_m2_min_si_disponible"]),
    priceMaxPerSqm: firstNum(row, ["prix_m2_max_si_disponible"]),
    rentMinPerSqm: firstNum(row, ["loyer_m2_min_si_disponible", "loyer_m2_min"]),
    rentMaxPerSqm: firstNum(row, ["loyer_m2_max_si_disponible", "loyer_m2_max"]),
    scoreFiabilite: firstNum(row, ["score_fiabilite"]),
    sourcePrixM2: firstStr(row, ["source_prix_m2", "sale_source"]),
    sourceLoyerM2: firstStr(row, ["source_loyer_m2", "rent_source"]),
    dateReferenceSource: firstStr(row, ["date_reference_source"]),
    commentaire: firstStr(row, ["commentaire"]),
  };
}

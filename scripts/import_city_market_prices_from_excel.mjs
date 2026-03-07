import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import XLSX from "xlsx";

function argValue(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const s = String(value).trim();
  if (!s) return null;
  const compact = s.replace(/\s/g, "").replace(/'/g, "");
  let normalized = compact;
  if (compact.includes(",") && compact.includes(".")) {
    normalized =
      compact.lastIndexOf(",") > compact.lastIndexOf(".")
        ? compact.replace(/\./g, "").replace(",", ".")
        : compact.replace(/,/g, "");
  } else if (compact.includes(",")) {
    normalized = compact.replace(",", ".");
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function normalizeInsee(value) {
  if (value === null || value === undefined) return null;
  let s = String(value).trim().toUpperCase();
  if (!s) return null;
  s = s.replace(/\s/g, "");
  if (/^\d+$/.test(s)) return s.padStart(5, "0");
  if (/^(2A|2B)\d{1,3}$/.test(s)) return s.slice(0, 2) + s.slice(2).padStart(3, "0");
  return s;
}

function normalizeDept(value, inseeCode) {
  const raw = String(value || "").trim().toUpperCase();
  if (raw) {
    if (/^\d+$/.test(raw)) return raw.padStart(2, "0");
    if (/^(2A|2B)$/.test(raw)) return raw;
    if (/^97\d$/.test(raw)) return raw;
  }
  if (!inseeCode) return null;
  if (/^(2A|2B)/.test(inseeCode)) return inseeCode.slice(0, 2);
  if (/^97\d/.test(inseeCode)) return inseeCode.slice(0, 3);
  if (/^\d{5}$/.test(inseeCode)) return inseeCode.slice(0, 2);
  return null;
}

function pickHeader(headers, candidates) {
  const map = new Map(headers.map((h) => [normalizeKey(h), h]));
  for (const c of candidates) {
    const found = map.get(normalizeKey(c));
    if (found) return found;
  }
  for (const c of candidates) {
    const needle = normalizeKey(c);
    const hit = headers.find((h) => normalizeKey(h).includes(needle));
    if (hit) return hit;
  }
  return null;
}

function buildMapping(headers) {
  return {
    insee: pickHeader(headers, ["insee_code", "code_insee", "insee", "codgeo", "code_commune"]),
    commune: pickHeader(headers, ["commune", "ville", "nom_commune", "city"]),
    departement: pickHeader(headers, ["departement_code", "code_departement", "departement", "dep", "code_dep"]),
    rentAppAll: pickHeader(headers, ["rent_m2_app_all", "loyer_m2_cc_app_all", "loyer_m2_app_all", "loyer_m2_appartement", "loyer_m2"]),
    rentAppT1T2: pickHeader(headers, ["rent_m2_app_t1t2", "loyer_m2_cc_app_t1t2", "loyer_m2_app_t1t2"]),
    rentAppT3Plus: pickHeader(headers, ["rent_m2_app_t3plus", "loyer_m2_cc_app_t3plus", "loyer_m2_app_t3plus"]),
    rentHouse: pickHeader(headers, ["rent_m2_house", "loyer_m2_cc_house", "loyer_m2_maison"]),
    saleAll: pickHeader(headers, ["sale_m2_all", "prix_m2_all", "prix_m2", "prix_vente_m2", "prix_m2_vente"]),
    saleApartment: pickHeader(headers, ["sale_m2_apartment", "prix_m2_appartement", "prix_m2_app"]),
    saleHouse: pickHeader(headers, ["sale_m2_house", "prix_m2_maison"]),
  };
}

async function run() {
  const filePath = argValue("--file", "");
  const sheetName = argValue("--sheet", "");
  const dryRun = hasFlag("--dry-run");

  if (!filePath) {
    throw new Error("Usage: node scripts/import_city_market_prices_from_excel.mjs --file <path.xlsx> [--sheet <name>] [--dry-run]");
  }

  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Fichier introuvable: ${absPath}`);
  }

  const wb = XLSX.readFile(absPath, { cellDates: false });
  const chosenSheet = sheetName || wb.SheetNames[0];
  if (!chosenSheet || !wb.Sheets[chosenSheet]) {
    throw new Error(`Feuille introuvable: ${chosenSheet}`);
  }

  const rows = XLSX.utils.sheet_to_json(wb.Sheets[chosenSheet], { defval: null });
  if (!rows.length) {
    throw new Error("Le fichier Excel ne contient aucune ligne exploitable.");
  }

  const headers = Object.keys(rows[0]);
  const m = buildMapping(headers);

  const preparedByInsee = new Map();
  let skippedMissingInsee = 0;
  for (const r of rows) {
    const insee = normalizeInsee(m.insee ? r[m.insee] : null);
    if (!insee) {
      skippedMissingInsee += 1;
      continue;
    }

    const departement = normalizeDept(m.departement ? r[m.departement] : null, insee);
    preparedByInsee.set(insee, {
      insee_code: insee,
      commune: m.commune ? String(r[m.commune] || "").trim() || null : null,
      departement_code: departement,
      rent_m2_app_all: m.rentAppAll ? parseNumber(r[m.rentAppAll]) : null,
      rent_m2_app_t1t2: m.rentAppT1T2 ? parseNumber(r[m.rentAppT1T2]) : null,
      rent_m2_app_t3plus: m.rentAppT3Plus ? parseNumber(r[m.rentAppT3Plus]) : null,
      rent_m2_house: m.rentHouse ? parseNumber(r[m.rentHouse]) : null,
      sale_m2_all: m.saleAll ? parseNumber(r[m.saleAll]) : null,
      sale_m2_apartment: m.saleApartment ? parseNumber(r[m.saleApartment]) : null,
      sale_m2_house: m.saleHouse ? parseNumber(r[m.saleHouse]) : null,
      updated_at: new Date().toISOString(),
    });
  }
  const prepared = Array.from(preparedByInsee.values());

  console.log(`Feuille: ${chosenSheet}`);
  console.log(`Lignes source: ${rows.length}`);
  console.log(`Lignes preparees (avec INSEE): ${prepared.length}`);
  console.log(`Lignes ignorees (INSEE manquant): ${skippedMissingInsee}`);
  console.log("Mapping detecte:", m);

  if (!prepared.length) {
    throw new Error("Aucune ligne importable: verifie la colonne INSEE.");
  }

  if (dryRun) {
    console.log("Apercu (5 premieres lignes):");
    console.log(prepared.slice(0, 5));
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Variables requises: SUPABASE_URL (ou VITE_SUPABASE_URL) et SUPABASE_SERVICE_ROLE_KEY");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const batchSize = 500;
  for (let i = 0; i < prepared.length; i += batchSize) {
    const chunk = prepared.slice(i, i + batchSize);
    const { error } = await supabase
      .from("city_market_prices")
      .upsert(chunk, { onConflict: "insee_code" });
    if (error) {
      throw new Error(`Erreur upsert batch ${i / batchSize + 1}: ${error.message}`);
    }
    console.log(`Batch ${i / batchSize + 1} OK (${chunk.length} lignes)`);
  }

  console.log("Import termine.");
}

run().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});

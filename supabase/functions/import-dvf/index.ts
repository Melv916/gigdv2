import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, skipLines = 0 } = await req.json();

    if (!fileUrl) {
      return new Response(
        JSON.stringify({ error: "fileUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Skip lines:", skipLines);

    // Convert Google Drive share link to direct download
    let downloadUrl = fileUrl;
    const driveMatch = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      downloadUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}&confirm=t`;
    }

    console.log("Downloading CSV from:", downloadUrl);

    const csvResponse = await fetch(downloadUrl, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!csvResponse.ok) {
      throw new Error(`Failed to download CSV: ${csvResponse.status}`);
    }

    const csvText = await csvResponse.text();
    console.log("CSV size:", csvText.length, "chars");

    // Parse CSV
    const lines = csvText.split("\n");
    const headerLine = lines[0];
    const headers = headerLine.split(",").map((h) => h.trim().replace(/"/g, ""));

    console.log("Headers:", headers.join(", "));
    console.log("Total lines:", lines.length);

    // Map header indices
    const colIdx = (name: string) => headers.indexOf(name);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process in batches
    const BATCH_SIZE = 500;
    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    let batch: any[] = [];

    for (let i = 1 + skipLines; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Parse CSV line (handle potential quoted fields)
      const fields = parseCSVLine(line);

      const valeurFonciere = parseFloat(fields[colIdx("valeur_fonciere")] || "0");
      const surfaceBati = parseFloat(fields[colIdx("surface_reelle_bati")] || "0");
      const codePostal = fields[colIdx("code_postal")]?.trim();

      // Skip rows without essential data
      if (!codePostal || valeurFonciere <= 0) {
        skipped++;
        continue;
      }

      batch.push({
        id_mutation: fields[colIdx("id_mutation")]?.trim() || null,
        date_mutation: fields[colIdx("date_mutation")]?.trim() || null,
        nature_mutation: fields[colIdx("nature_mutation")]?.trim() || null,
        valeur_fonciere: valeurFonciere || null,
        adresse_numero: fields[colIdx("adresse_numero")]?.trim() || null,
        adresse_nom_voie: fields[colIdx("adresse_nom_voie")]?.trim() || null,
        code_postal: codePostal,
        code_commune: fields[colIdx("code_commune")]?.trim() || null,
        nom_commune: fields[colIdx("nom_commune")]?.trim() || null,
        code_departement: fields[colIdx("code_departement")]?.trim() || null,
        id_parcelle: fields[colIdx("id_parcelle")]?.trim() || null,
        type_local: fields[colIdx("type_local")]?.trim() || null,
        surface_reelle_bati: surfaceBati || null,
        nombre_pieces_principales: parseInt(fields[colIdx("nombre_pieces_principales")] || "0") || null,
        surface_terrain: parseFloat(fields[colIdx("surface_terrain")] || "0") || null,
        longitude: parseFloat(fields[colIdx("longitude")] || "0") || null,
        latitude: parseFloat(fields[colIdx("latitude")] || "0") || null,
      });

      if (batch.length >= BATCH_SIZE) {
        const { error } = await supabase.from("dvf_transactions").insert(batch);
        if (error) {
          console.error("Insert error at batch:", Math.floor(i / BATCH_SIZE), error.message);
          errors++;
        } else {
          inserted += batch.length;
        }
        batch = [];

        // Log progress
        if (inserted % 5000 === 0) {
          console.log(`Progress: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);
        }
      }
    }

    // Insert remaining batch
    if (batch.length > 0) {
      const { error } = await supabase.from("dvf_transactions").insert(batch);
      if (error) {
        console.error("Final batch insert error:", error.message);
        errors++;
      } else {
        inserted += batch.length;
      }
    }

    console.log(`Done: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);

    return new Response(
      JSON.stringify({ success: true, inserted, skipped, errors, totalLines: lines.length - 1 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Import error:", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

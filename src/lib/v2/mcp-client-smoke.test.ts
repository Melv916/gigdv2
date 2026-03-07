import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  listDatasetResources,
  queryResourceData,
  searchDatasets,
} from "../../../supabase/functions/_shared/v2/mcpClient";

declare global {
  var Deno: { env: { get: (k: string) => string | undefined } };
}

describe("mcpClient smoke (mocked MCP)", () => {
  beforeEach(() => {
    globalThis.Deno = {
      env: {
        get: (key: string) => {
          if (key === "MCP_DATA_GOUV_URL") return "https://mcp.data.gouv.fr/mcp";
          if (key === "MCP_TIMEOUT_MS") return "3000";
          if (key === "MCP_MAX_RETRIES") return "0";
          return undefined;
        },
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles search_datasets + list_dataset_resources + query_resource_data flow", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) => {
      const body = JSON.parse(String(init?.body || "{}"));
      if (body.method === "search_datasets") {
        return new Response(JSON.stringify({ result: { datasets: [{ id: "dataset_dvf", title: "DVF" }] } }), { status: 200 });
      }
      if (body.method === "list_dataset_resources") {
        return new Response(JSON.stringify({ result: { resources: [{ id: "resource_dvf", format: "csv" }] } }), { status: 200 });
      }
      if (body.method === "query_resource_data") {
        return new Response(JSON.stringify({ result: { rows: [{ valeur_fonciere: 100000, surface_reelle_bati: 40 }] } }), { status: 200 });
      }
      return new Response(JSON.stringify({ result: {} }), { status: 200 });
    });

    const datasets = await searchDatasets("DVF", "user-1");
    const resources = await listDatasetResources("dataset_dvf", "user-1");
    const rows = await queryResourceData("resource_dvf", "transactions", 200, "user-1");

    expect(datasets[0].id).toBe("dataset_dvf");
    expect(resources[0].id).toBe("resource_dvf");
    expect(rows).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

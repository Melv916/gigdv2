function envGet(key: string): string | undefined {
  const denoEnv = (globalThis as any)?.Deno?.env;
  if (denoEnv && typeof denoEnv.get === "function") {
    return denoEnv.get(key);
  }
  return undefined;
}

function endpoint(): string {
  return envGet("MCP_DATA_GOUV_URL") || "https://mcp.data.gouv.fr/mcp";
}

interface RpcResponse<T = unknown> {
  result?: T;
  error?: { message?: string };
}

type JsonObject = Record<string, unknown>;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let globalTokens = 5;
let userBuckets = new Map<string, { tokens: number; ts: number }>();
let lastRefill = Date.now();

function refillBuckets() {
  const now = Date.now();
  if (now - lastRefill >= 1000) {
    globalTokens = 5;
    lastRefill = now;
    userBuckets = new Map(
      [...userBuckets.entries()].map(([k, v]) => [k, { tokens: 2, ts: now }])
    );
  }
}

async function takeRateLimit(userId: string): Promise<void> {
  refillBuckets();
  const bucket = userBuckets.get(userId) || { tokens: 2, ts: Date.now() };
  if (globalTokens <= 0 || bucket.tokens <= 0) {
    await sleep(220);
    refillBuckets();
  }
  globalTokens = Math.max(0, globalTokens - 1);
  userBuckets.set(userId, { tokens: Math.max(0, bucket.tokens - 1), ts: Date.now() });
}

async function rpcCall<T>(
  method: string,
  params: JsonObject,
  userId: string
): Promise<T> {
  await takeRateLimit(userId);
  const timeoutMs = Number(envGet("MCP_TIMEOUT_MS") || "3000");
  const maxRetries = Number(envGet("MCP_MAX_RETRIES") || "2");
  let lastErr = "MCP request failed";

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(endpoint(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          method,
          params,
        }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        lastErr = "MCP rate limited (429)";
        await sleep(220 * (attempt + 1));
        continue;
      }

      if (!res.ok) {
        lastErr = `MCP HTTP ${res.status}`;
        await sleep(180 * (attempt + 1));
        continue;
      }

      const data = (await res.json()) as RpcResponse<T>;
      if (data.error) {
        lastErr = data.error.message || "MCP RPC error";
        await sleep(180 * (attempt + 1));
        continue;
      }
      return data.result as T;
    } catch (error) {
      lastErr = error instanceof Error ? error.message : "MCP transport error";
      await sleep(180 * (attempt + 1));
    } finally {
      clearTimeout(timer);
    }
  }

  throw new Error(lastErr);
}

export async function searchDatasets(query: string, userId: string): Promise<any[]> {
  const result = await rpcCall<any>("search_datasets", { query, page: 1, page_size: 20 }, userId);
  return Array.isArray(result?.datasets) ? result.datasets : Array.isArray(result) ? result : [];
}

export async function getDatasetInfo(datasetId: string, userId: string): Promise<any> {
  return rpcCall<any>("get_dataset_info", { dataset_id: datasetId }, userId);
}

export async function listDatasetResources(datasetId: string, userId: string): Promise<any[]> {
  const result = await rpcCall<any>("list_dataset_resources", { dataset_id: datasetId }, userId);
  return Array.isArray(result?.resources) ? result.resources : Array.isArray(result) ? result : [];
}

export async function getResourceInfo(resourceId: string, userId: string): Promise<any> {
  return rpcCall<any>("get_resource_info", { resource_id: resourceId }, userId);
}

export async function queryResourceData(
  resourceId: string,
  question: string,
  pageSize: number,
  userId: string
): Promise<any[]> {
  const result = await rpcCall<any>(
    "query_resource_data",
    { resource_id: resourceId, question, page_size: pageSize },
    userId
  );
  return Array.isArray(result?.rows) ? result.rows : Array.isArray(result) ? result : [];
}

export async function downloadAndParseResource(
  resourceId: string,
  maxRows: number,
  userId: string
): Promise<any[]> {
  const result = await rpcCall<any>(
    "download_and_parse_resource",
    { resource_id: resourceId, max_rows: maxRows, max_size_mb: 500 },
    userId
  );
  return Array.isArray(result?.rows) ? result.rows : Array.isArray(result) ? result : [];
}

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

function read(filePath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), "utf8");
}

describe("market source guards", () => {
  it("investment-api no longer queries legacy market tables", () => {
    const content = read("supabase/functions/investment-api/index.ts");
    expect(content).not.toContain("loyers_commune");
    expect(content).not.toContain("loyers_oll");
    expect(content).not.toContain("encadrement_paris");
    expect(content).toContain(".from(\"city_market_prices\")");
  });

  it("project detail can call rent-estimate API when city lookup is unavailable", () => {
    const content = read("src/pages/app/ProjectDetail.tsx");
    expect(content).toContain("fetchRentEstimate(");
  });
});

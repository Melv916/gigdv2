import { describe, expect, it } from "vitest";
import { cacheKeyFor } from "./cache";
import { planQuotaLimit, quotaExceeded } from "./quota";

describe("cache key", () => {
  it("returns miss when inputs differ (key differs)", async () => {
    const k1 = await cacheKeyFor("https://x.com/a", { charges: 120, travaux: 0 }, "courte");
    const k2 = await cacheKeyFor("https://x.com/a", { charges: 121, travaux: 0 }, "courte");
    expect(k1).not.toBe(k2);
  });

  it("returns hit when same payload (key equal)", async () => {
    const k1 = await cacheKeyFor("https://x.com/a", { charges: 120, travaux: 0 }, "courte");
    const k2 = await cacheKeyFor("https://x.com/a", { travaux: 0, charges: 120 }, "courte");
    expect(k1).toBe(k2);
  });

  it("returns different key for different mode", async () => {
    const k1 = await cacheKeyFor("https://x.com/a", { charges: 120 }, "courte");
    const k2 = await cacheKeyFor("https://x.com/a", { charges: 120 }, "complete");
    expect(k1).not.toBe(k2);
  });
});

describe("quota", () => {
  it("enforces free quota at 5", () => {
    expect(planQuotaLimit("free")).toBe(5);
    expect(quotaExceeded("free", 4)).toBe(false);
    expect(quotaExceeded("free", 5)).toBe(true);
  });

  it("enforces debutant quota at 50", () => {
    expect(planQuotaLimit("debutant")).toBe(50);
    expect(quotaExceeded("debutant", 49)).toBe(false);
    expect(quotaExceeded("debutant", 50)).toBe(true);
  });
});

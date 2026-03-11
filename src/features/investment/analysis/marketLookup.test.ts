import { describe, expect, it } from "vitest";
import {
  buildDepartementCandidates,
  inferDepartementCode,
  isValidCityValue,
  parseSelogerLocationFromUrl,
  pickRentM2,
} from "./marketLookup";

describe("marketLookup helpers", () => {
  it("parses city and departement from SeLoger URL slug", () => {
    const parsed = parseSelogerLocationFromUrl(
      "https://www.seloger.com/annonces/achat/appartement/evry-91/258303081.htm",
    );
    expect(parsed.city).toBe("Evry");
    expect(parsed.departementCode).toBe("91");
  });

  it("infers departement from postal code with overseas support", () => {
    expect(inferDepartementCode({ postalCode: "91000" })).toBe("91");
    expect(inferDepartementCode({ postalCode: "97100" })).toBe("971");
    expect(inferDepartementCode({ insee: "91228" })).toBe("91");
    expect(inferDepartementCode({ departementCode: "091" })).toBe("91");
    expect(inferDepartementCode({ insee: "20579", departementCode: "91" })).toBe("91");
  });

  it("builds robust departement candidates for lookups", () => {
    expect(buildDepartementCandidates("91")).toEqual(["91", "091"]);
    expect(buildDepartementCandidates("091")).toEqual(["91", "091"]);
    expect(buildDepartementCandidates("971")).toEqual(["971"]);
    expect(buildDepartementCandidates("2A")).toEqual(["2A"]);
  });

  it("rejects invalid city values and keeps valid text-only names", () => {
    expect(isValidCityValue("91000 Evry")).toBe(true);
    expect(isValidCityValue("75001")).toBe(false);
    expect(isValidCityValue("Evreux")).toBe(true);
  });

  it("selects fallback rent fields in order", () => {
    const row = {
      insee_code: "91228",
      commune: "Evry",
      departement_code: "91",
      rent_m2_app_all: 17.76,
      rent_m2_app_t1t2: null,
      rent_m2_app_t3plus: null,
      rent_m2_house: null,
      sale_m2_all: 2400,
      loyer_m2_moyen: 17.2,
    };
    expect(pickRentM2(row, "apartment", "all")).toBe(17.76);
    expect(pickRentM2(row, "apartment", "t3plus")).toBe(17.76);
    expect(pickRentM2(row, "house", "all")).toBe(17.76);
  });
});

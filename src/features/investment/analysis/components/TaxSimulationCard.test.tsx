import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TaxSimulationCard } from "./TaxSimulationCard";
import { defaultTaxSettings, TAX_REGIME_OPTIONS } from "@/lib/investment/tax";

describe("TaxSimulationCard", () => {
  const baseProps = {
    plan: "free" as const,
    availableRegimeOptions: [TAX_REGIME_OPTIONS.micro_foncier, TAX_REGIME_OPTIONS.reel_foncier],
    compatibilityWarnings: [],
    paywallRequired: true,
    taxSettings: defaultTaxSettings("location_nue"),
    comparisonRegimes: [],
    selectedRegimeOption: TAX_REGIME_OPTIONS.micro_foncier,
    primaryAnalysis: null,
    comparisonRows: [],
    onChange: vi.fn(),
    onToggleComparisonRegime: vi.fn(),
    formatEUR: (value: number) => `${value} EUR`,
    formatPct: (value: number) => `${value}%`,
  };

  it("shows the fiscal paywall for free users", async () => {
    render(
      <MemoryRouter>
        <TaxSimulationCard {...baseProps} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/couche fiscale detaillee/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voir les abonnements/i })).toBeInTheDocument();
  });
});

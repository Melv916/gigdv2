import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import App from "@/App";

const { mockSupabase, authUser } = vi.hoisted(() => {
  const authUser = { id: "user-1", email: "melvin.calmels@gmail.com" };

  const projectRow = {
    id: "project-1",
    name: "Projet test",
    objectif: "locatif",
    strategie: "ld-nue",
    financement: "credit",
    apport: 30000,
    duree_credit: 20,
    taux_interet: 3.5,
    assurance_emprunteur: 0.34,
    frais_notaire_pct: 8,
    vacance_locative: 1,
    charges_non_recup: 0,
    budget_travaux: 0,
    croissance_valeur: 2,
    croissance_loyers: 2,
    inflation_charges: 2,
    status: "actif",
    created_at: "2026-01-01T10:00:00.000Z",
    updated_at: "2026-01-02T10:00:00.000Z",
    user_id: "user-1",
  };

  const datasets: Record<string, any[]> = {
    projects: [projectRow],
    project_analyses: [],
    profiles: [{ user_id: "user-1", plan: "avance" }],
    city_market_prices: [
      {
        code_insee: "91228",
        commune: "Evry",
        departement_code: "91",
        prix_m2_moyen: 2900,
        loyer_m2_moyen: 17.76,
      },
    ],
  };

  const makeQuery = (table: string) => {
    const state: { op: "select" | "insert" | "update" | "delete"; payload: any } = {
      op: "select",
      payload: null,
    };

    const resolveList = () => {
      if (state.op === "select") return datasets[table] || [];
      if (state.op === "insert") {
        if (table === "projects") return [{ id: "project-new" }];
        if (table === "project_analyses") return [{ id: "analysis-1" }];
      }
      return [];
    };

    const resolveSingle = () => {
      if (state.op === "select") {
        if (table === "projects") return datasets.projects[0] || null;
        if (table === "profiles") return datasets.profiles[0] || null;
        return (datasets[table] || [])[0] || null;
      }
      if (state.op === "insert") {
        if (table === "projects") return { id: "project-new" };
        if (table === "project_analyses") return { id: "analysis-1" };
      }
      return null;
    };

    const query: any = {
      select: vi.fn(() => {
        state.op = "select";
        return query;
      }),
      insert: vi.fn((payload: any) => {
        state.op = "insert";
        state.payload = payload;
        return query;
      }),
      update: vi.fn((payload: any) => {
        state.op = "update";
        state.payload = payload;
        return query;
      }),
      delete: vi.fn(() => {
        state.op = "delete";
        return query;
      }),
      upsert: vi.fn(() => {
        state.op = "insert";
        return query;
      }),
      eq: vi.fn(() => query),
      neq: vi.fn(() => query),
      in: vi.fn(() => query),
      order: vi.fn(() => query),
      limit: vi.fn(() => query),
      single: vi.fn(async () => ({ data: resolveSingle(), error: null })),
      maybeSingle: vi.fn(async () => ({ data: resolveSingle(), error: null })),
      then: (resolve: any, reject: any) => Promise.resolve({ data: resolveList(), error: null }).then(resolve, reject),
    };

    return query;
  };

  const mockSupabase = {
    auth: {
      onAuthStateChange: vi.fn((cb: any) => {
        cb("SIGNED_IN", { user: authUser });
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      getSession: vi.fn(async () => ({ data: { session: { user: authUser } }, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
      signInWithPassword: vi.fn(async () => ({ data: {}, error: null })),
      signUp: vi.fn(async () => ({ data: {}, error: null })),
    },
    from: vi.fn((table: string) => makeQuery(table)),
  };

  return { mockSupabase, authUser };
});

vi.mock("@/integrations/supabase/client", () => ({ supabase: mockSupabase }));

vi.mock("@/hooks/useAuth", () => ({
  AuthProvider: ({ children }: any) => children,
  useAuth: () => ({ user: authUser, session: { user: authUser }, loading: false, signOut: vi.fn() }),
}));

vi.mock("@/lib/v2/api", () => ({
  getMe: vi.fn(async () => ({
    email: "melvin.calmels@gmail.com",
    plan: "avance",
    advancedAccess: true,
    iaModeAllowed: "complete",
    quota: { used: 1, limit: null, nextReset: "2026-04-01" },
    advancedLinks: {
      whatsapp: "https://chat.whatsapp.com/JBgAs0K2CIII3l1RWEiwXb",
      book: "https://example.com/book",
      videos: "https://example.com/videos",
    },
  })),
  importAnalysisUrl: vi.fn(async () => ({
    listing: {
      titre: "Annonce test",
      prix: 99500,
      surface: 41,
      ville: "Evry",
      codePostal: "91000",
      insee: "91228",
      typeLocal: "Appartement",
      pieces: 2,
    },
    dvfSummary: {},
  })),
  createAnalysis: vi.fn(async () => ({
    analysis: { analysis_text: "Synthese test" },
    cacheHit: false,
  })),
}));

vi.mock("@/lib/investment/api", () => ({
  fetchRentEstimate: vi.fn(async () => ({ loyer_total_estime: 950 })),
}));

afterEach(() => {
  cleanup();
});

function renderRoute(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("App Smoke Routes", () => {
  it("renders landing page", async () => {
    renderRoute("/");
    expect(await screen.findByText(/Ne devinez plus/i)).toBeInTheDocument();
  });

  it("renders product page", async () => {
    renderRoute("/produit");
    expect(await screen.findByText(/Le parcours complet/i)).toBeInTheDocument();
  });

  it("renders pricing page", async () => {
    renderRoute("/tarifs");
    expect(await screen.findByText(/Tarifs V2/i)).toBeInTheDocument();
  });

  it("renders faq page", async () => {
    renderRoute("/faq");
    expect(await screen.findByText(/Toutes vos questions/i)).toBeInTheDocument();
  });

  it("renders legal page", async () => {
    renderRoute("/mentions-legales");
    expect(await screen.findByRole("heading", { name: /Mentions legales/i })).toBeInTheDocument();
    expect((await screen.findAllByText(/contact@gigd.fr/i)).length).toBeGreaterThan(0);
  });

  it("renders contact page", async () => {
    renderRoute("/contact");
    expect(await screen.findByRole("heading", { name: /Une question produit/i })).toBeInTheDocument();
  });

  it("renders method page", async () => {
    renderRoute("/methode");
    expect(await screen.findByRole("heading", { name: /Comment GIGD construit une analyse utile/i })).toBeInTheDocument();
  });

  it("renders resources page", async () => {
    renderRoute("/ressources");
    expect(await screen.findByRole("heading", { name: /Guides pratiques pour investisseur locatif/i })).toBeInTheDocument();
  });

  it("renders a seo article page", async () => {
    renderRoute("/cash-flow-immobilier");
    expect(
      await screen.findByRole("heading", { level: 1, name: /Comprendre le cash-flow immobilier/i }),
    ).toBeInTheDocument();
  });

  it("renders dashboard page", async () => {
    renderRoute("/app");
    expect(await screen.findByText(/Pilotage investissement V2/i)).toBeInTheDocument();
  });

  it("renders projects list page", async () => {
    renderRoute("/app/projets");
    expect(await screen.findByText(/Mes projets/i)).toBeInTheDocument();
  });

  it("renders new project page", async () => {
    renderRoute("/app/projets/nouveau");
    expect(await screen.findByText(/Nouveau projet/i)).toBeInTheDocument();
  });

  it("renders project detail page", async () => {
    renderRoute("/app/projets/project-1");
    expect(await screen.findByText(/Analyser un bien/i)).toBeInTheDocument();
  });

  it("renders account page", async () => {
    renderRoute("/app/compte");
    expect(await screen.findByText(/^Compte$/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rejoindre le WhatsApp avance/i)).toBeInTheDocument();
  });

  it("renders subscription page", async () => {
    renderRoute("/app/abonnement");
    expect(await screen.findByText(/^Abonnement$/i)).toBeInTheDocument();
  });

  it("renders advanced page", async () => {
    renderRoute("/app/avance");
    expect(await screen.findByText(/Espace Avancé/i)).toBeInTheDocument();
  });
});

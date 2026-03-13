export const SITE_NAME = "GIGD";
export const SITE_TAGLINE = "Good Investment. Good Decision.";
export const SITE_URL = "https://gigd.fr";
export const CONTACT_EMAIL = "contact@gigd.fr";
export const SUPPORT_SLA = "Reponse sous 24h ouvrees";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/home-premium-bg.png`;

export type PublicNavItem = {
  label: string;
  to: string;
  description?: string;
};

export const primaryNavLinks: PublicNavItem[] = [
  { label: "Produit", to: "/produit", description: "Vue d'ensemble des fonctionnalites" },
  { label: "Methode", to: "/methode", description: "Comment GIGD construit une analyse" },
  { label: "Ressources", to: "/ressources", description: "Guides et pages SEO piliers" },
  { label: "Tarifs", to: "/tarifs", description: "Formules et acces" },
  { label: "FAQ", to: "/faq", description: "Questions frequentes" },
];

export const trustNavLinks: PublicNavItem[] = [
  { label: "A propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
  { label: "Mentions legales", to: "/mentions-legales" },
  { label: "Politique de confidentialite", to: "/politique-confidentialite" },
  { label: "CGU", to: "/cgu" },
];

export const featuredSeoLinks: PublicNavItem[] = [
  {
    label: "Calcul rentabilite locative",
    to: "/calcul-rentabilite-locative",
    description: "Differencier rendement brut, net et net net.",
  },
  {
    label: "Cash-flow immobilier",
    to: "/cash-flow-immobilier",
    description: "Comprendre la tenue mensuelle d'un projet.",
  },
  {
    label: "Analyser une annonce immobiliere",
    to: "/analyser-une-annonce-immobiliere",
    description: "Verifier les informations utiles avant visite ou offre.",
  },
  {
    label: "Estimation loyer",
    to: "/estimation-loyer",
    description: "Construire une hypothese de loyer prudente.",
  },
  {
    label: "Prix m2",
    to: "/prix-m2",
    description: "Positionner un bien par rapport au marche local.",
  },
  {
    label: "Frais de notaire",
    to: "/frais-notaire",
    description: "Reintegrer le cout global dans le rendement.",
  },
  {
    label: "SCI ou nom propre",
    to: "/sci-ou-nom-propre",
    description: "Comparer les logiques de detention selon votre strategie.",
  },
];

export function getAnalysisCtaPath(isAuthenticated: boolean): string {
  return isAuthenticated ? "/app/projets/nouveau" : "/auth?next=%2Fapp%2Fprojets%2Fnouveau";
}

export const sitemapSitePaths = [
  "/",
  "/produit",
  "/tarifs",
  "/faq",
  "/mentions-legales",
  "/politique-confidentialite",
  "/contact",
  "/a-propos",
  "/methode",
  "/ressources",
  "/calcul-rentabilite-locative",
  "/cash-flow-immobilier",
  "/analyser-une-annonce-immobiliere",
  "/estimation-loyer",
  "/prix-m2",
  "/frais-notaire",
  "/sci-ou-nom-propre",
  "/cgu",
];

export const publicSitePaths = [...sitemapSitePaths, "/confidentialite"];

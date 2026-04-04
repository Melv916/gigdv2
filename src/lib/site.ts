import { getSeoPagesByPaths, homeFeaturedResourcePaths } from "@/content/seoPages";

export const SITE_NAME = "GIGD";
export const SITE_TAGLINE = "Good Investment. Good Decision.";
export const SITE_URL = "https://gigd.fr";
export const CONTACT_EMAIL = "contact@gigd.fr";
export const SUPPORT_SLA = "Réponse sous 24h ouvrées";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/home-premium-bg.png`;

export type PublicNavItem = {
  label: string;
  to: string;
  description?: string;
};

export const primaryNavLinks: PublicNavItem[] = [
  { label: "Produit", to: "/produit", description: "Vue d'ensemble des fonctionnalités" },
  { label: "Méthode", to: "/methode", description: "Comment GIGD construit une analyse" },
  { label: "Ressources", to: "/ressources", description: "Guides et pages SEO piliers" },
  { label: "Tarifs", to: "/tarifs", description: "Formules et accès" },
  { label: "FAQ", to: "/faq", description: "Questions fréquentes" },
];

export const trustNavLinks: PublicNavItem[] = [
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
  { label: "Mentions légales", to: "/mentions-legales" },
  { label: "Politique de confidentialité", to: "/politique-confidentialite" },
  { label: "CGU", to: "/cgu" },
];

export const featuredSeoLinks: PublicNavItem[] = getSeoPagesByPaths(homeFeaturedResourcePaths).map((page) => ({
  label: page.listingTitle,
  to: page.path,
  description: page.listingDescription,
}));

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
  "/rendement-brut-net-net-net",
  "/cash-flow-avant-impot-apres-impot",
  "/micro-foncier-ou-reel",
  "/lmnp-micro-bic-ou-reel",
  "/sci-ir-ou-sci-is",
  "/cout-global-acquisition",
  "/comparer-deux-investissements-locatifs",
  "/objectif-rendement-brut",
  "/cgu",
];

export const publicSitePaths = [...sitemapSitePaths, "/confidentialite"];

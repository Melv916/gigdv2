export type SeoArticleSubsection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type SeoArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  subsections?: SeoArticleSubsection[];
};

export type SeoArticleFaq = {
  question: string;
  answer: string;
};

export type SeoArticleDefinition = {
  path: string;
  listingTitle: string;
  listingDescription: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  eyebrow?: string;
  heroTag?: string;
  heroAsideTitle?: string;
  heroAsidePoints?: string[];
  keyPointsTitle?: string;
  keyPointsIntro?: string;
  sections: SeoArticleSection[];
  keyPoints: string[];
  faq?: SeoArticleFaq[];
  faqTitle?: string;
  faqIntro?: string;
  relatedPaths: string[];
  relatedTitle?: string;
  productTitle?: string;
  productPoints?: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  closingNote?: string;
};

export type ResourceCategoryKey = "comprendre" | "analyser" | "structurer";

export type ResourceHubCategory = {
  key: ResourceCategoryKey;
  indexLabel: string;
  title: string;
  description: string;
  paths: string[];
};

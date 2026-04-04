import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, LineChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { type SeoArticleDefinition, getSeoPageByPath } from "@/content/seoPages";
import { featuredSeoLinks, getAnalysisCtaPath, SITE_NAME, SITE_URL } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import { useAuth } from "@/hooks/useAuth";

interface ArticlePageProps {
  page: SeoArticleDefinition;
}

function getSectionId(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ArticlePage({ page }: ArticlePageProps) {
  const { user } = useAuth();
  const analysisHref = getAnalysisCtaPath(Boolean(user));
  const heroSecondaryHref = "/methode";
  const finalSecondaryHref = page.ctaSecondaryHref ?? "/contact";
  const finalSecondaryLabel = page.ctaSecondaryLabel ?? "Parler de votre besoin";
  const productTitle = page.productTitle ?? "Dans GIGD";
  const productPoints = page.productPoints ?? [
    "Lecture du rendement, cash-flow et coût global sur la même analyse.",
    "Comparaison prix au m2 et estimation de loyer à partir des données disponibles.",
    "Explicitation des hypothèses et points à vérifier avant offre.",
  ];
  const heroAsidePoints = page.heroAsidePoints ?? productPoints;
  const relatedPages = page.relatedPaths
    .map((path) => getSeoPageByPath(path))
    .filter((value): value is SeoArticleDefinition => Boolean(value));
  const introParagraphs = page.intro.split("\n\n").filter(Boolean);
  const sectionLinks = page.sections.map((section) => ({
    id: getSectionId(section.title),
    title: section.title,
  }));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      inLanguage: "fr-FR",
      mainEntityOfPage: `${SITE_URL}${page.path}`,
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Ressources", item: `${SITE_URL}/ressources` },
        { "@type": "ListItem", position: 3, name: page.listingTitle, item: `${SITE_URL}${page.path}` },
      ],
    },
    ...(page.faq?.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <PageLayout>
      <Seo
        title={page.title}
        description={page.description}
        pathname={page.path}
        type="article"
        trackingType="seo"
        structuredData={structuredData}
      />

      <article className="py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-10">
              <section className="glass-card rounded-[2rem] p-8 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-primary">
                      <span>{page.eyebrow ?? "Ressource GIGD"}</span>
                      <span className="text-muted-foreground">Investissement locatif</span>
                      {page.heroTag ? (
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] tracking-[0.14em]">
                          {page.heroTag}
                        </span>
                      ) : null}
                    </div>

                    <h1 className="mt-4 max-w-4xl text-3xl font-display font-bold text-foreground md:text-5xl">
                      {page.h1}
                    </h1>
                    <div className="mt-5 max-w-3xl space-y-4">
                      {introParagraphs.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-7 text-muted-foreground md:text-lg">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link
                        to={analysisHref}
                        onClick={() => trackEvent("click_cta_primary", { location: page.path, target: analysisHref })}
                      >
                        <Button variant="hero" size="lg">
                          Lancer une analyse
                          <ArrowRight />
                        </Button>
                      </Link>
                      <Link
                        to={heroSecondaryHref}
                        onClick={() => trackEvent("click_cta_secondary", { location: page.path, target: heroSecondaryHref })}
                      >
                        <Button variant="hero-outline" size="lg">
                          Voir la méthode
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <aside className="rounded-[1.5rem] border border-border/50 bg-background/35 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {page.heroAsideTitle ?? "À retenir"}
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                      {heroAsidePoints.map((point) => (
                        <li key={point} className="rounded-xl border border-border/40 bg-card/40 px-4 py-3">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </aside>
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-6 md:p-8">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {page.keyPointsTitle ?? "Points essentiels"}
                  </p>
                  {page.keyPointsIntro ? (
                    <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{page.keyPointsIntro}</p>
                  ) : null}
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {page.keyPoints.map((point) => (
                    <div key={point} className="rounded-2xl border border-border/50 bg-card/60 p-5">
                      <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </section>

              {page.sections.map((section) => (
                <section
                  key={section.title}
                  id={getSectionId(section.title)}
                  className="rounded-[1.75rem] border border-border/50 bg-card/45 p-7 md:p-8 scroll-mt-28"
                >
                  <h2 className="text-2xl font-display font-semibold text-foreground">{section.title}</h2>
                  <div className="mt-5 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-muted-foreground md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.bullets?.length ? (
                    <ul className="mt-6 grid gap-3 md:grid-cols-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="rounded-xl border border-border/40 bg-background/35 px-4 py-3 text-sm text-muted-foreground">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.subsections?.length ? (
                    <div className="mt-8 space-y-6">
                      {section.subsections.map((subsection) => (
                        <div key={subsection.title} className="rounded-xl border border-border/40 bg-background/30 p-5">
                          <h3 className="text-lg font-display font-semibold text-foreground">{subsection.title}</h3>
                          <div className="mt-3 space-y-3">
                            {subsection.paragraphs.map((paragraph) => (
                              <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                                {paragraph}
                              </p>
                            ))}
                          </div>

                          {subsection.bullets?.length ? (
                            <ul className="mt-4 grid gap-3 md:grid-cols-2">
                              {subsection.bullets.map((bullet) => (
                                <li
                                  key={bullet}
                                  className="rounded-lg border border-border/35 bg-card/40 px-4 py-3 text-sm text-muted-foreground"
                                >
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}

              {page.faq?.length ? (
                <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-7 md:p-8">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-primary" size={18} />
                    <h2 className="text-2xl font-display font-semibold text-foreground">{page.faqTitle ?? "FAQ"}</h2>
                  </div>
                  {page.faqIntro ? (
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{page.faqIntro}</p>
                  ) : null}
                  <Accordion type="single" collapsible className="mt-6 space-y-3">
                    {page.faq.map((item, index) => (
                      <AccordionItem key={item.question} value={`faq-${index}`} className="rounded-xl border border-border/40 px-5">
                        <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-sm leading-6 text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ) : null}

              <section className="rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-card via-card/80 to-primary/5 p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-primary" size={18} />
                  <h2 className="text-2xl font-display font-semibold text-foreground">{page.ctaTitle}</h2>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                  {page.ctaDescription}
                </p>
                {page.closingNote ? (
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/80">{page.closingNote}</p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={analysisHref}
                    onClick={() => trackEvent("click_cta_primary", { location: `${page.path}-bottom`, target: analysisHref })}
                  >
                    <Button variant="hero">
                      {page.ctaLabel}
                      <ArrowRight />
                    </Button>
                  </Link>
                  <Link
                    to={finalSecondaryHref}
                    onClick={() =>
                      trackEvent("click_cta_secondary", {
                        location: `${page.path}-bottom`,
                        target: finalSecondaryHref,
                      })
                    }
                  >
                    <Button variant="hero-outline">{finalSecondaryLabel}</Button>
                  </Link>
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-primary" size={18} />
                  <h2 className="text-lg font-display font-semibold text-foreground">Sommaire</h2>
                </div>
                <div className="mt-4 space-y-2">
                  {sectionLinks.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block rounded-xl border border-border/35 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/45 hover:bg-primary/5 hover:text-foreground"
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </section>

              <section className="sticky top-24 rounded-[1.75rem] border border-border/50 bg-card/60 p-6">
                <div className="flex items-center gap-3">
                  <LineChart className="text-primary" size={18} />
                  <h2 className="text-lg font-display font-semibold text-foreground">{productTitle}</h2>
                </div>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  {productPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    to={analysisHref}
                    onClick={() => trackEvent("start_analysis", { location: `sidebar-${page.path}` })}
                  >
                    <Button className="w-full" variant="hero">
                      Démarrer
                    </Button>
                  </Link>
                </div>
              </section>

              {relatedPages.length ? (
                <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    {page.relatedTitle ?? "Liens internes recommandés"}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {relatedPages.map((relatedPage) => (
                      <Link
                        key={relatedPage.path}
                        to={relatedPage.path}
                        className="block rounded-xl border border-border/40 px-4 py-4 transition-colors hover:border-primary/45 hover:bg-primary/5"
                      >
                        <p className="text-sm font-medium text-foreground">{relatedPage.listingTitle}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{relatedPage.listingDescription}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-6">
                <h2 className="text-lg font-display font-semibold text-foreground">Explorer aussi</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredSeoLinks
                    .filter((link) => link.to !== page.path)
                    .slice(0, 5)
                    .map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="rounded-full border border-border/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </article>
    </PageLayout>
  );
}

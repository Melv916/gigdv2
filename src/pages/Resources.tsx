import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Compass, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo/Seo";
import {
  featuredResourcePath,
  getHubExplorerPages,
  getSeoPageByPath,
  getSeoPagesByPaths,
  resourceHubCategories,
  seoPages,
} from "@/content/seoPages";
import { SITE_NAME, SITE_URL, getAnalysisCtaPath } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/tracking";

const Resources = () => {
  const { user } = useAuth();
  const analysisHref = getAnalysisCtaPath(Boolean(user));
  const hubSections = resourceHubCategories.map((category) => ({
    ...category,
    pages: getSeoPagesByPaths(category.paths),
  }));
  const explorerPages = getHubExplorerPages();
  const featuredPage = getSeoPageByPath(featuredResourcePath);

  return (
    <PageLayout>
      <Seo
        title="Ressources investissement locatif | Centre de décision investisseur"
        description="Le centre de décision investisseur GIGD pour juger rendement, cash-flow, coût global, fiscalité et structure d'un investissement locatif."
        pathname="/ressources"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Ressources GIGD",
            description:
              "Centre de décision investisseur pour comprendre, analyser et structurer un investissement locatif.",
            url: `${SITE_URL}/ressources`,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: seoPages.map((page, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}${page.path}`,
              name: page.listingTitle,
            })),
          },
        ]}
      />

      <section className="py-20">
        <div className="container space-y-12">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Ressources</span>
                <h1 className="mt-4 max-w-4xl text-4xl font-display font-bold text-foreground md:text-5xl">
                  Le centre de décision investisseur GIGD
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                  Cette rubrique ne sert plus seulement à expliquer des notions. Elle aide à répondre à ce qu’un
                  investisseur regarde, aux seuils qu’il utilise, à la décision qui suit et à la manière dont GIGD le
                  montre concrètement.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  Les contenus sont organisés pour comprendre, analyser, structurer puis décider. Chaque guide relie un
                  indicateur à une décision, à un régime fiscal, à un coût réel ou à une comparaison de biens.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={analysisHref}
                    onClick={() => trackEvent("click_cta_primary", { location: "/ressources", target: analysisHref })}
                  >
                    <Button variant="hero" size="lg">
                      Lancer une analyse
                      <ArrowRight />
                    </Button>
                  </Link>
                  <Link
                    to="/methode"
                    onClick={() => trackEvent("click_cta_secondary", { location: "/ressources", target: "/methode" })}
                  >
                    <Button variant="hero-outline" size="lg">
                      Comprendre la méthode
                    </Button>
                  </Link>
                </div>
              </div>

              <aside className="rounded-[1.5rem] border border-border/50 bg-background/35 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Navigation éditoriale</p>
                <div className="mt-4 space-y-3">
                  {hubSections.map((section) => (
                    <a
                      key={section.key}
                      href={`#${section.key}`}
                      className="block rounded-2xl border border-border/40 bg-card/45 px-4 py-4 transition-colors hover:border-primary/45 hover:bg-primary/5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                          {section.indexLabel}
                        </span>
                        <p className="text-sm font-medium text-foreground">{section.title}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.description}</p>
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </div>

          {hubSections.map((section) => (
            <section
              key={section.key}
              id={section.key}
              className="rounded-[1.85rem] border border-border/50 bg-card/45 p-7 md:p-8 scroll-mt-28"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {section.indexLabel}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Parcours ressources
                    </p>
                  </div>
                  <h2 className="mt-4 text-3xl font-display font-semibold text-foreground">{section.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                    {section.description}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-background/35 px-4 py-3 text-sm text-muted-foreground">
                  {section.pages.length} guide{section.pages.length > 1 ? "s" : ""} pour cette étape
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {section.pages.map((page) => (
                  <article key={page.path} className="rounded-[1.5rem] border border-border/40 bg-background/35 p-6">
                    <div className="flex items-center gap-2 text-primary">
                      <BookOpen size={18} />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                        {page.eyebrow ?? section.title}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-display font-semibold text-foreground">{page.listingTitle}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.listingDescription}</p>

                    <div className="mt-5 grid gap-3">
                      {page.keyPoints.slice(0, 2).map((point) => (
                        <div key={point} className="rounded-xl border border-border/35 bg-card/40 px-4 py-3">
                          <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={page.path}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
                      onClick={() =>
                        trackEvent("click_cta_secondary", { location: `/ressources-${section.key}`, target: page.path })
                      }
                    >
                      Lire le guide
                      <ArrowRight size={15} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-[1.85rem] border border-border/50 bg-gradient-to-br from-card via-card/85 to-primary/10 p-7 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <Compass className="text-primary" size={18} />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">D. Décider</p>
                </div>
                <h2 className="mt-4 text-3xl font-display font-semibold text-foreground">
                  Passer du contenu à l’analyse
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  La décision n’arrive pas après une seule métrique. Elle arrive quand rendement, cash-flow, coût
                  global, fiscalité et structure racontent la même histoire sur le même bien.
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  C’est exactement le rôle de GIGD : transformer des repères éditoriaux en lecture opérationnelle,
                  fiscale et patrimoniale sur un cas réel.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={analysisHref}
                    onClick={() =>
                      trackEvent("click_cta_primary", { location: "/ressources-decider", target: analysisHref })
                    }
                  >
                    <Button variant="hero">
                      Lancer une analyse GIGD
                      <ArrowRight />
                    </Button>
                  </Link>
                  {featuredPage ? (
                    <Link
                      to={featuredPage.path}
                      onClick={() =>
                        trackEvent("click_cta_secondary", {
                          location: "/ressources-decider",
                          target: featuredPage.path,
                        })
                      }
                    >
                      <Button variant="hero-outline">Lire le guide pivot</Button>
                    </Link>
                  ) : null}
                </div>
              </div>

              {featuredPage ? (
                <article className="rounded-[1.5rem] border border-border/40 bg-background/40 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={18} />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">Page stratégique</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-display font-semibold text-foreground">{featuredPage.listingTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{featuredPage.listingDescription}</p>
                  <div className="mt-5 space-y-3">
                    {featuredPage.keyPoints.slice(0, 2).map((point) => (
                      <div key={point} className="rounded-xl border border-border/35 bg-card/35 px-4 py-3">
                        <p className="text-sm leading-6 text-muted-foreground">{point}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to={featuredPage.path}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
                    onClick={() =>
                      trackEvent("click_cta_secondary", {
                        location: "/ressources-featured",
                        target: featuredPage.path,
                      })
                    }
                  >
                    Ouvrir la page
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ) : null}
            </div>
          </section>

          <section className="rounded-[1.85rem] border border-border/50 bg-card/45 p-7 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Explorer aussi</p>
                <h2 className="mt-4 text-3xl font-display font-semibold text-foreground">Ressources déjà en ligne</h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                  Les guides existants restent utiles pour compléter la lecture d’une annonce, d’un loyer, d’un prix au
                  m² ou d’un cadre de méthode plus large.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {explorerPages.map((page) => (
                <article key={page.path} className="rounded-[1.5rem] border border-border/40 bg-background/35 p-6">
                  <h3 className="text-lg font-display font-semibold text-foreground">{page.listingTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.listingDescription}</p>
                  <Link
                    to={page.path}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
                    onClick={() => trackEvent("click_cta_secondary", { location: "/ressources-explorer", target: page.path })}
                  >
                    Lire la page
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
};

export default Resources;

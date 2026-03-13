import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo/Seo";
import { seoPages } from "@/content/seoPages";
import { SITE_NAME, SITE_URL, getAnalysisCtaPath } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/tracking";

const Resources = () => {
  const { user } = useAuth();
  const analysisHref = getAnalysisCtaPath(Boolean(user));

  return (
    <PageLayout>
      <Seo
        title="Ressources investissement locatif"
        description="Guides GIGD pour comprendre rendement, cash-flow, loyer, prix au m2 et structurer une analyse d'investissement locatif."
        pathname="/ressources"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Ressources GIGD",
            description:
              "Guides et pages piliers pour mieux comprendre l'analyse d'un investissement locatif.",
            url: `${SITE_URL}/ressources`,
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
            },
          },
        ]}
      />

      <section className="py-20">
        <div className="container space-y-12">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Ressources</span>
            <h1 className="mt-4 text-4xl font-display font-bold text-foreground md:text-5xl">
              Guides pratiques pour investisseur locatif
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              Cette section rassemble les pages piliers de GIGD: lecture du rendement, interpretation du cash-flow,
              estimation du loyer, positionnement prix au m2 et cadrage de l'analyse. Chaque guide renvoie ensuite
              vers le produit, la methode et les pages liees pour construire un vrai parcours de lecture.
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
                  Comprendre la methode
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {seoPages.map((page) => (
              <article key={page.path} className="rounded-[1.75rem] border border-border/50 bg-card/50 p-6">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen size={18} />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">Guide</span>
                </div>
                <h2 className="mt-4 text-xl font-display font-semibold text-foreground">{page.listingTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{page.listingDescription}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {page.keyPoints.slice(0, 2).map((point) => (
                    <span key={point} className="rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground">
                      {point}
                    </span>
                  ))}
                </div>
                <Link
                  to={page.path}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  onClick={() => trackEvent("click_cta_secondary", { location: "/ressources-card", target: page.path })}
                >
                  Lire la page
                  <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>

          <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-7 md:p-8">
            <div className="flex items-center gap-3">
              <FileText className="text-primary" size={18} />
              <h2 className="text-2xl font-display font-semibold text-foreground">Publier facilement ensuite</h2>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              La structure de cette section repose sur un jeu de contenus centralise. Ajouter une nouvelle page
              ressource revient a enrichir la base de definitions de contenus et a publier la nouvelle route dans le
              sitemap, sans toucher au moteur d'analyse.
            </p>
          </section>
        </div>
      </section>
    </PageLayout>
  );
};

export default Resources;

import { Link } from "react-router-dom";
import { ArrowRight, Building2, ShieldCheck, Target } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo/Seo";
import { SITE_NAME, SITE_URL, getAnalysisCtaPath } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/tracking";

const blocks = [
  {
    icon: Target,
    title: "Pourquoi GIGD existe",
    text:
      "Parce qu'une annonce ne suffit pas pour prendre une décision d'investissement. Il faut relier prix, loyer, financement, fiscalité et marché local dans une lecture exploitable.",
  },
  {
    icon: Building2,
    title: "Pour qui",
    text:
      "GIGD s'adresse aux investisseurs locatifs, aux primo-investisseurs et aux professionnels qui veulent cadrer une opportunité avant offre, visite ou arbitrage.",
  },
  {
    icon: ShieldCheck,
    title: "Ce que le produit apporte",
    text:
      "Une aide à la décision structurée, des KPI lisibles, des hypothèses explicites et une méthode qui ne remplace pas l'expertise humaine mais la rend plus productive.",
  },
];

const About = () => {
  const { user } = useAuth();
  const analysisHref = getAnalysisCtaPath(Boolean(user));

  return (
    <PageLayout>
      <Seo
        title="À propos de GIGD"
        description="Comprendre l'origine du projet GIGD, son positionnement et ce qu'il apporte aux investisseurs locatifs."
        pathname="/a-propos"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "À propos de GIGD",
            description: "Présentation du projet GIGD et de sa mission produit.",
            url: `${SITE_URL}/a-propos`,
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />

      <section className="py-20">
        <div className="container space-y-12">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">À propos</span>
            <h1 className="mt-4 max-w-4xl text-4xl font-display font-bold text-foreground md:text-5xl">
              Une plateforme conçue pour rendre l'analyse immobilière plus lisible
            </h1>
            <div className="mt-5 max-w-3xl space-y-5 text-base leading-7 text-muted-foreground md:text-lg">
              <p>
                GIGD est né d’un besoin concret : analyser les annonces immobilières avec un vrai cadre de décision,
                pas avec de l’approximation.
              </p>
              <p>
                Le projet a été développé pour aider les investisseurs à comprendre rapidement si un bien tient
                réellement debout : coût global, rentabilité, cash-flow, hypothèses, projections et lecture du marché
                local.
              </p>
              <p>
                L’objectif n’est pas de vendre du rêve, mais de donner une méthode claire, transparente et utile pour
                prendre de meilleures décisions en investissement locatif.
              </p>
              <p>
                Dans un contexte où l’avenir financier est de plus en plus incertain, GIGD veut rendre l’analyse
                immobilière plus accessible, plus structurée et plus juste.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {blocks.map((block) => (
              <article key={block.title} className="rounded-[1.75rem] border border-border/50 bg-card/50 p-6">
                <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary">
                  <block.icon size={20} />
                </div>
                <h2 className="mt-4 text-xl font-display font-semibold text-foreground">{block.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{block.text}</p>
              </article>
            ))}
          </div>

          <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Ce que nous cherchons à éviter</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/40 bg-background/35 p-5 text-sm leading-7 text-muted-foreground">
                Les raccourcis marketing qui promettent un verdict magique sans expliquer les hypothèses.
              </div>
              <div className="rounded-xl border border-border/40 bg-background/35 p-5 text-sm leading-7 text-muted-foreground">
                Les analyses opaques qui masquent les limites de la donnée ou la sensibilité du projet.
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-card via-card/85 to-primary/5 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Suite logique</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              Si vous voulez comprendre comment les analyses sont construites, la page Méthode détaille les données,
              les KPI et les limites de lecture. Si vous avez déjà un bien en tête, vous pouvez passer directement à
              une analyse dans l'application.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/methode"
                onClick={() => trackEvent("click_cta_secondary", { location: "/a-propos", target: "/methode" })}
              >
                <Button variant="hero-outline">Voir la méthode</Button>
              </Link>
              <Link
                to={analysisHref}
                onClick={() => trackEvent("click_cta_primary", { location: "/a-propos", target: analysisHref })}
              >
                <Button variant="hero">
                  Lancer une analyse
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;

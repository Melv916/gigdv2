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
      "Parce qu'une annonce ne suffit pas pour prendre une decision d'investissement. Il faut relier prix, loyer, financement, fiscalite et marche local dans une lecture exploitable.",
  },
  {
    icon: Building2,
    title: "Pour qui",
    text:
      "GIGD s'adresse aux investisseurs locatifs, aux primo-investisseurs et aux professionnels qui veulent cadrer une opportunite avant offre, visite ou arbitrage.",
  },
  {
    icon: ShieldCheck,
    title: "Ce que le produit apporte",
    text:
      "Une aide a la decision structuree, des KPI lisibles, des hypotheses explicites et une methode qui ne remplace pas l'expertise humaine mais la rend plus productive.",
  },
];

const About = () => {
  const { user } = useAuth();
  const analysisHref = getAnalysisCtaPath(Boolean(user));

  return (
    <PageLayout>
      <Seo
        title="A propos de GIGD"
        description="Comprendre l'origine du projet GIGD, son positionnement et ce qu'il apporte aux investisseurs locatifs."
        pathname="/a-propos"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "A propos de GIGD",
            description: "Presentation du projet GIGD et de sa mission produit.",
            url: `${SITE_URL}/a-propos`,
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />

      <section className="py-20">
        <div className="container space-y-12">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">A propos</span>
            <h1 className="mt-4 max-w-4xl text-4xl font-display font-bold text-foreground md:text-5xl">
              Une plateforme concue pour rendre l'analyse immobiliere plus lisible
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              GIGD est ne d'un constat simple: beaucoup de decisions d'investissement sont prises avec des chiffres
              partiels, des tableurs fragiles ou des hypotheses implicites. Le role du produit est de remettre de
              l'ordre dans cette lecture, sans travestir la complexite d'un deal locatif.
            </p>
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
            <h2 className="text-2xl font-display font-semibold text-foreground">Ce que nous cherchons a eviter</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/40 bg-background/35 p-5 text-sm leading-7 text-muted-foreground">
                Les raccourcis marketing qui promettent un verdict magique sans expliquer les hypotheses.
              </div>
              <div className="rounded-xl border border-border/40 bg-background/35 p-5 text-sm leading-7 text-muted-foreground">
                Les analyses opaques qui masquent les limites de la donnee ou la sensibilite du projet.
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-card via-card/85 to-primary/5 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Suite logique</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              Si vous voulez comprendre comment les analyses sont construites, la page Methode detaille les donnees,
              les KPI et les limites de lecture. Si vous avez deja un bien en tete, vous pouvez passer directement a
              une analyse dans l'application.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/methode"
                onClick={() => trackEvent("click_cta_secondary", { location: "/a-propos", target: "/methode" })}
              >
                <Button variant="hero-outline">Voir la methode</Button>
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

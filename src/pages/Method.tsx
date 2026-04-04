import { Link } from "react-router-dom";
import { ArrowRight, Database, LineChart, ShieldCheck, Workflow } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo/Seo";
import { SITE_NAME, SITE_URL, getAnalysisCtaPath } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { trackEvent } from "@/lib/tracking";

const sections = [
  {
    icon: Workflow,
    title: "Comment l'analyse fonctionne",
    text:
      "GIGD part des informations de l'annonce ou de la saisie utilisateur, enrichit la lecture avec des références de marché disponibles, puis calcule les KPI financiers et restitue une lecture actionnable.",
  },
  {
    icon: Database,
    title: "Quelles données sont utilisées",
    text:
      "Les analyses s'appuient sur les données du bien, les hypothèses saisies par l'utilisateur et les références de marché disponibles dans le produit. Les sources visibles sont exposées lorsqu'elles sont disponibles.",
  },
  {
    icon: LineChart,
    title: "Que signifient les KPI",
    text:
      "Rendement, cash-flow, mensualité, prix au m2, loyer estimé, seuils et ratios servent à lire la solidité économique d'un deal. Ils ne valent que si les hypothèses de départ sont correctement comprises.",
  },
  {
    icon: ShieldCheck,
    title: "Limites et interprétation",
    text:
      "GIGD est un outil d'aide à la décision. Il ne constitue pas un conseil d'investissement, juridique, fiscal ou comptable. Les résultats doivent être vérifiés avant toute offre ou engagement.",
  },
];

const Method = () => {
  const { user } = useAuth();
  const analysisHref = getAnalysisCtaPath(Boolean(user));

  return (
    <PageLayout>
      <Seo
        title="Méthode GIGD"
        description="Comprendre comment GIGD construit une analyse immobilière, quelles données sont prises en compte et comment lire les KPI."
        pathname="/methode"
        trackingType="method"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Méthode GIGD",
            description:
              "Présentation de la méthode GIGD: données, hypothèses, KPI, limites et interprétation.",
            url: `${SITE_URL}/methode`,
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />

      <section className="py-20">
        <div className="container space-y-12">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Méthode</span>
            <h1 className="mt-4 max-w-4xl text-4xl font-display font-bold text-foreground md:text-5xl">
              Comment GIGD construit une analyse utile sans masquer les hypothèses
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              L'objectif de la méthode n'est pas de transformer un bien en note magique. Elle sert à rendre explicite
              ce qui est souvent implicite: les données de départ, les hypothèses retenues, les KPI produits et les
              limites de ce que l'outil peut affirmer.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section) => (
              <article key={section.title} className="rounded-[1.75rem] border border-border/50 bg-card/50 p-6">
                <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary">
                  <section.icon size={20} />
                </div>
                <h2 className="mt-4 text-xl font-display font-semibold text-foreground">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.text}</p>
              </article>
            ))}
          </div>

          <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Hypothèses à garder en tête</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                "Le loyer estimé reste une hypothèse de marché, pas un engagement de location.",
                "Les travaux, charges et taxes doivent être complétés ou vérifiés par l'utilisateur quand l'annonce est partielle.",
                "Le rendement et le cash-flow varient selon le financement, la fiscalité et la vacance retenus.",
                "Les comparaisons de marché dépendent de la qualité et de la disponibilité des références locales.",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-border/40 bg-background/35 p-5 text-sm leading-7 text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Comment lire le résultat</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
              Une analyse GIGD doit être lue comme une aide à la décision. Si les KPI sont cohérents entre eux, si le
              prix au m2 reste défendable, si le loyer retenu est prudent et si les points de vigilance sont acceptés,
              le projet gagne en lisibilité. Si plusieurs hypothèses critiques restent fragiles, le rôle du produit est
              justement de vous le montrer.
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-card via-card/85 to-primary/5 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Passer à l'étape suivante</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              La méthode explique le cadre. L'application sert ensuite à l'appliquer à un bien réel, annonce par
              annonce, avec vos hypothèses de financement et d'exploitation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={analysisHref}
                onClick={() => trackEvent("click_cta_primary", { location: "/methode", target: analysisHref })}
              >
                <Button variant="hero">
                  Lancer une analyse
                  <ArrowRight />
                </Button>
              </Link>
              <Link
                to="/ressources"
                onClick={() => trackEvent("click_cta_secondary", { location: "/methode", target: "/ressources" })}
              >
                <Button variant="hero-outline">Voir les ressources</Button>
              </Link>
            </div>
          </section>
        </div>
      </section>
    </PageLayout>
  );
};

export default Method;

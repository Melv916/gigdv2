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
      "GIGD part des informations de l'annonce ou de la saisie utilisateur, enrichit la lecture avec des references de marche disponibles, puis calcule les KPI financiers et restitue une lecture actionnable.",
  },
  {
    icon: Database,
    title: "Quelles donnees sont utilisees",
    text:
      "Les analyses s'appuient sur les donnees du bien, les hypotheses saisies par l'utilisateur et les references de marche disponibles dans le produit. Les sources visibles sont exposees lorsqu'elles sont disponibles.",
  },
  {
    icon: LineChart,
    title: "Que signifient les KPI",
    text:
      "Rendement, cash-flow, mensualite, prix au m2, loyer estime, seuils et ratios servent a lire la solidite economique d'un deal. Ils ne valent que si les hypotheses de depart sont correctement comprises.",
  },
  {
    icon: ShieldCheck,
    title: "Limites et interpretation",
    text:
      "GIGD est un outil d'aide a la decision. Il ne constitue pas un conseil d'investissement, juridique, fiscal ou comptable. Les resultats doivent etre verifies avant toute offre ou engagement.",
  },
];

const Method = () => {
  const { user } = useAuth();
  const analysisHref = getAnalysisCtaPath(Boolean(user));

  return (
    <PageLayout>
      <Seo
        title="Methode GIGD"
        description="Comprendre comment GIGD construit une analyse immobiliere, quelles donnees sont prises en compte et comment lire les KPI."
        pathname="/methode"
        trackingType="method"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Methode GIGD",
            description:
              "Presentation de la methode GIGD: donnees, hypotheses, KPI, limites et interpretation.",
            url: `${SITE_URL}/methode`,
            publisher: { "@type": "Organization", name: SITE_NAME },
          },
        ]}
      />

      <section className="py-20">
        <div className="container space-y-12">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Methode</span>
            <h1 className="mt-4 max-w-4xl text-4xl font-display font-bold text-foreground md:text-5xl">
              Comment GIGD construit une analyse utile sans masquer les hypotheses
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              L'objectif de la methode n'est pas de transformer un bien en note magique. Elle sert a rendre explicite
              ce qui est souvent implicite: les donnees de depart, les hypotheses retenues, les KPI produits et les
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
            <h2 className="text-2xl font-display font-semibold text-foreground">Hypotheses a garder en tete</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                "Le loyer estime reste une hypothese de marche, pas un engagement de location.",
                "Les travaux, charges et taxes doivent etre completes ou verifies par l'utilisateur quand l'annonce est partielle.",
                "Le rendement et le cash-flow varient selon le financement, la fiscalite et la vacance retenus.",
                "Les comparaisons de marche dependent de la qualite et de la disponibilite des references locales.",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-border/40 bg-background/35 p-5 text-sm leading-7 text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border/50 bg-card/45 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Comment lire le resultat</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
              Une analyse GIGD doit etre lue comme une aide a la decision. Si les KPI sont coherents entre eux, si le
              prix au m2 reste defendable, si le loyer retenu est prudent et si les points de vigilance sont acceptes,
              le projet gagne en lisibilite. Si plusieurs hypothese critiques restent fragiles, le role du produit est
              justement de vous le montrer.
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-card via-card/85 to-primary/5 p-7 md:p-8">
            <h2 className="text-2xl font-display font-semibold text-foreground">Passer a l'etape suivante</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              La methode explique le cadre. L'application sert ensuite a l'appliquer a un bien reel, annonce par
              annonce, avec vos hypotheses de financement et d'exploitation.
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

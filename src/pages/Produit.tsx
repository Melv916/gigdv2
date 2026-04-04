import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { motion } from "framer-motion";
import { Link2, Target, BarChart3, AlertTriangle, FileText, MessageSquare, Download, Settings } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Coller l'annonce",
    desc: "Collez le lien d'une annonce locative. GIGD extrait automatiquement les informations clés : prix, surface, localisation, DPE.",
  },
  {
    icon: Target,
    title: "Choisir la stratégie",
    desc: "Location nue, meublée, colocation ou location courte durée. Les calculs s'adaptent à votre stratégie.",
  },
  {
    icon: Settings,
    title: "Renseigner vos hypothèses",
    desc: "Travaux, charges, taxe foncière, vacance locative et financement pour personnaliser l'analyse.",
  },
  {
    icon: BarChart3,
    title: "Calculs complets",
    desc: "Rendements, cash-flow, fiscalité, DSCR, TRI et VAN avec détails transparents et hypothèses affichées.",
  },
  {
    icon: AlertTriangle,
    title: "Points à vérifier",
    desc: "Informations manquantes, incohérences potentielles, documents à demander avant offre.",
  },
  {
    icon: MessageSquare,
    title: "Négociation guidée",
    desc: "Recommandations de positionnement et questions à poser, différenciées agence vs particulier.",
  },
  {
    icon: Download,
    title: "Export décision",
    desc: "Conservez un récapitulatif des chiffres et de l'analyse IA pour partager ou archiver.",
  },
];

const Produit = () => {
  return (
    <PageLayout>
      <Seo
        title="Produit GIGD"
        description="Fonctionnalités de GIGD pour importer une annonce, analyser un bien locatif et lire les KPI utiles à la décision."
        pathname="/produit"
      />
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Produit</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-display font-bold text-foreground">
              Le parcours complet, de l'annonce à la décision locative
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              GIGD V2 couvre uniquement l'investissement locatif: location nue, meublée, colocation et LCD.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-6 flex gap-5 items-start group hover:glow-cyan transition-shadow duration-500"
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                  <step.icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-base font-display font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mt-12"
          >
            <div className="glass-card rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-display font-semibold text-foreground">Exemples concrets</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Ces blocs sont reliés aux boutons de la home pour illustrer chaque usage.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <article id="exemple-database" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">Database</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Extraction annonce + DVF</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: T3, Lyon 3e, 72m2. GIGD recoupe prix affiché, médiane DVF locale et loyers observables.
                  </p>
                </article>

                <article id="exemple-api" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">API Collections</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Pipeline de calculs</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: appel séquentiel import, enrichissement marché, calcul TRI/VAN, puis synthèse décision.
                  </p>
                </article>

                <article id="exemple-nego" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">Scripts de négo</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Trame agence vs particulier</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: "Le prix cible est 265k EUR car les charges copro dégradent le cash-flow de 85 EUR/mois."
                  </p>
                </article>

                <article id="exemple-risque" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">Analyse risque</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Points de vigilance</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: DPE E, travaux 8k-15k EUR, charges élevées, loyer surestimé par rapport au quartier.
                  </p>
                </article>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-12 gradient-border glass-card rounded-xl p-6 text-center"
          >
            <FileText size={24} className="mx-auto mb-3 text-secondary" />
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">Fiscalité paramétrable</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Régimes micro et réel, LMNP et SCI, avec hypothèses explicites. GIGD fournit une aide au cadrage, pas un conseil fiscal.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Produit;

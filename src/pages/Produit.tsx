import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { motion } from "framer-motion";
import { Link2, Target, BarChart3, AlertTriangle, FileText, MessageSquare, Download, Settings } from "lucide-react";

const steps = [
  { icon: Link2, title: "Coller l'annonce", desc: "Collez le lien d'une annonce locative. GIGD extrait automatiquement les informations cles : prix, surface, localisation, DPE." },
  { icon: Target, title: "Choisir la strategie", desc: "Location nue, meublee, colocation ou location courte duree. Les calculs s'adaptent a votre strategie." },
  { icon: Settings, title: "Renseigner vos hypotheses", desc: "Travaux, charges, taxe fonciere, vacance locative et financement pour personnaliser l'analyse." },
  { icon: BarChart3, title: "Calculs complets", desc: "Rendements, cash-flow, fiscalite, DSCR, TRI et VAN avec details transparents et hypotheses affichees." },
  { icon: AlertTriangle, title: "Points a verifier", desc: "Informations manquantes, incoherences potentielles, documents a demander avant offre." },
  { icon: MessageSquare, title: "Negociation guidee", desc: "Recommandations de positionnement et questions a poser, differenciees agence vs particulier." },
  { icon: Download, title: "Export decision", desc: "Conservez un recapitulatif des chiffres et de l'analyse IA pour partager ou archiver." },
];

const Produit = () => {
  return (
    <PageLayout>
      <Seo
        title="Produit GIGD"
        description="Fonctionnalites de GIGD pour importer une annonce, analyser un bien locatif et lire les KPI utiles a la decision."
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
              Le parcours complet, de l'annonce a la decision locative
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              GIGD V2 couvre uniquement l'investissement locatif: location nue, meublee, colocation et LCD.
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
                Ces blocs sont relies aux boutons de la home pour illustrer chaque usage.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <article id="exemple-database" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">Database</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Extraction annonce + DVF</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: T3, Lyon 3e, 72m2. GIGD recoupe prix affiche, mediane DVF locale et loyers observables.
                  </p>
                </article>

                <article id="exemple-api" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">API Collections</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Pipeline de calculs</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: appel sequentiel import, enrichissement marche, calcul TRI/VAN, puis synthese decision.
                  </p>
                </article>

                <article id="exemple-nego" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">Scripts de nego</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Trame agence vs particulier</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: "Le prix cible est 265k EUR car les charges copro degradent le cash-flow de 85 EUR/mois."
                  </p>
                </article>

                <article id="exemple-risque" className="rounded-xl border border-border/40 bg-card/40 p-4 scroll-mt-24">
                  <p className="text-xs uppercase tracking-wider text-primary">Analyse risque</p>
                  <h4 className="mt-1 text-base font-semibold text-foreground">Points de vigilance</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Exemple: DPE E, travaux 8k-15k EUR, charges elevees, loyer surestime par rapport au quartier.
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
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">Fiscalite parametrable</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Regimes micro et reel, LMNP et SCI, avec hypotheses explicites. GIGD fournit une aide au cadrage, pas un conseil fiscal.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Produit;

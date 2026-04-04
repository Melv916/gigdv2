import { Link } from "react-router-dom";
import { ArrowRight, Building2, ChartColumn, CircleGauge, Compass, Landmark, ShieldCheck, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { featuredSeoLinks } from "@/lib/site";

const valueItems = [
  {
    icon: CircleGauge,
    title: "Rentabilité lisible",
    text: "Rendement brut, net et net net pour comparer un bien avec le bon niveau d'exigence.",
  },
  {
    icon: Wallet,
    title: "Cash-flow et mensualités",
    text: "Lecture immédiate de l'effort mensuel, de l'autofinancement et des seuils de loyer.",
  },
  {
    icon: ChartColumn,
    title: "Prix au m2 et loyer",
    text: "Positionnement du bien par rapport au marché et estimation du potentiel locatif.",
  },
  {
    icon: ShieldCheck,
    title: "Points à vérifier",
    text: "Signalement des angles morts, hypothèses fortes et points de vigilance avant offre.",
  },
];

const audienceItems = [
  {
    icon: Compass,
    title: "Primo-investisseur",
    text: "Pour cadrer un premier projet avec des chiffres plus fiables qu'un simple tableur.",
  },
  {
    icon: Landmark,
    title: "Investisseur locatif",
    text: "Pour filtrer plus vite, comparer plusieurs opportunités et documenter une décision.",
  },
  {
    icon: Building2,
    title: "Professionnel de l'immobilier",
    text: "Pour disposer d'une lecture partageable avec un client, un associé ou un partenaire.",
  },
];

const trustItems = [
  "Approche chiffrée fondée sur des KPI utiles à la décision.",
  "Comparaison avec les références de marché disponibles dans le produit.",
  "Hypothèses explicites et limites de lecture assumées.",
  "Aide à la décision, sans promesse de certitude artificielle.",
];

export function WhatYouGetSection() {
  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Ce que vous obtenez</span>
          <h2 className="mt-3 text-2xl md:text-4xl font-display font-bold text-foreground">
            Une lecture exploitable du potentiel d'un bien
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {valueItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[1.5rem] border border-border/50 bg-card/50 p-5 md:p-6"
            >
              <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary">
                <item.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-display font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 md:leading-7 text-muted-foreground">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection() {
  return (
    <section className="py-14 md:py-20 bg-card/25">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Pour qui</span>
          <h2 className="mt-3 text-2xl md:text-4xl font-display font-bold text-foreground">
            Un produit pensé pour les décisions locatives concrètes
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {audienceItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[1.5rem] border border-border/50 bg-card/50 p-5 md:p-6"
            >
              <div className="w-fit rounded-xl bg-primary/10 p-3 text-primary">
                <item.icon size={20} />
              </div>
              <h3 className="mt-4 text-lg font-display font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 md:leading-7 text-muted-foreground">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <div className="rounded-[2rem] border border-border/50 bg-gradient-to-br from-card via-card/85 to-primary/5 p-6 md:p-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Pourquoi faire confiance à GIGD
            </span>
            <h2 className="mt-3 text-2xl md:text-4xl font-display font-bold text-foreground">
              Une logique d'analyse, pas un vernis marketing
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
              GIGD sert à clarifier une décision d'investissement: lecture des KPI, comparaison au marché, restitution
              plus lisible et transparence sur la méthode.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="rounded-xl border border-border/40 bg-background/35 p-4 md:p-5 text-sm leading-6 md:leading-7 text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResourceTeaserSection() {
  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Guides utiles</span>
            <h2 className="mt-3 text-2xl md:text-4xl font-display font-bold text-foreground">
              Pages piliers pour comprendre avant d'agir
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
              Chaque ressource est connectée au produit, à la méthode et aux autres sujets liés pour renforcer le
              parcours utilisateur et la compréhension globale du site.
            </p>
          </div>

          <Link to="/ressources">
            <Button variant="hero-outline">
              Voir toutes les ressources
              <ArrowRight />
            </Button>
          </Link>
        </motion.div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredSeoLinks.slice(0, 6).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-[1.5rem] border border-border/50 bg-card/50 p-5 md:p-6 transition-colors hover:border-primary/45 hover:bg-primary/5"
            >
              <h3 className="text-lg font-display font-semibold text-foreground">{link.label}</h3>
              <p className="mt-3 text-sm leading-6 md:leading-7 text-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

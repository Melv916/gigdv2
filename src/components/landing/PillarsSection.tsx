import { motion } from "framer-motion";
import { BarChart3, ShieldCheck, MessageSquare } from "lucide-react";

const pillars = [
  {
    icon: BarChart3,
    title: "Analyse chiffrée",
    desc: "Rentabilité nette, cash-flow, prix au m2 comparé et seuil de loyer, automatiquement à partir de données réelles.",
  },
  {
    icon: ShieldCheck,
    title: "Vérifications",
    desc: "Check-list des documents à demander, points d'attention locatifs et informations manquantes à valider avant offre.",
  },
  {
    icon: MessageSquare,
    title: "Négociation guidée",
    desc: "Scripts adaptés selon le canal (agence ou particulier), argumentaire basé sur les données DVF du secteur.",
  },
];

export function PillarsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Ce que GIGD apporte</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Trois piliers pour investir en locatif
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="gradient-border glass-card rounded-xl p-7 group hover:glow-cyan transition-shadow duration-500"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                <p.icon size={24} />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

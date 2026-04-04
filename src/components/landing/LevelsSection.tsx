import { motion } from "framer-motion";
import { Zap, GraduationCap, TrendingUp, Gem } from "lucide-react";

const levels = [
  { icon: Zap, title: "Free", desc: "5 analyses/mois + IA courte", tag: "Gratuit" },
  { icon: GraduationCap, title: "Débutant", desc: "50 analyses/mois + IA courte", tag: "9,90 EUR/mois" },
  { icon: TrendingUp, title: "Investisseur", desc: "Analyses illimitées + IA complète", tag: "29,90 EUR/mois" },
  { icon: Gem, title: "Avancé", desc: "Illimité + IA complète + espace premium", tag: "49,90 EUR/mois" },
];

export function LevelsSection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Niveaux</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Une offre qui évolue avec votre volume d'analyses
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {levels.map((l, i) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 flex flex-col group hover:glow-cyan transition-shadow duration-500"
            >
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit mb-3">
                <l.icon size={20} />
              </div>
              <h3 className="text-base font-display font-semibold text-foreground mb-1">{l.title}</h3>
              <p className="text-sm text-muted-foreground flex-1">{l.desc}</p>
              <span className="mt-4 text-xs font-semibold text-primary">{l.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

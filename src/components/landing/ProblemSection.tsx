import { motion } from "framer-motion";
import { AlertTriangle, HelpCircle, Calculator, Scale } from "lucide-react";

const pains = [
  { icon: HelpCircle, title: "Aucune visibilité sur les prix réels", desc: "Les annonces ne reflètent pas les prix de vente réels du quartier." },
  { icon: Calculator, title: "Calculs de rentabilité flous", desc: "Trop de paramètres oubliés : charges, fiscalité, vacance, travaux." },
  { icon: AlertTriangle, title: "Pièges invisibles", desc: "Copropriétés à problèmes, travaux votés, PLU défavorable — qui vérifie ?" },
  { icon: Scale, title: "Négociation à l'aveugle", desc: "Sans données solides, impossible de justifier une offre inférieure." },
];

export function ProblemSection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Le problème</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Investir sans données fiables, c'est parier.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {pains.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-destructive/30 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive w-fit mb-3">
                <p.icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

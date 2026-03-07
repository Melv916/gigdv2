import { motion } from "framer-motion";
import { User, Building2, Check } from "lucide-react";

const particulier = [
  "Accès direct au vendeur — négociation plus souple",
  "Scripts adaptés pour particulier (émotionnel, contexte)",
  "Pas de frais d'agence",
  "Vigilance accrue sur les diagnostics et documents",
];

const agence = [
  "Professionnel intermédiaire — cadrage plus formel",
  "Scripts adaptés pour agence (mandat, comparatifs)",
  "Possibilité de négocier les honoraires",
  "Dossier souvent plus structuré",
];

export function ComparisonSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Négociation</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Particulier vs Agence
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">GIGD adapte ses conseils selon le canal de vente.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { icon: User, title: "Particulier", items: particulier, color: "primary" },
            { icon: Building2, title: "Agence", items: agence, color: "secondary" },
          ].map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, x: ci === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2 rounded-lg ${col.color === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                  <col.icon size={20} />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground">{col.title}</h3>
              </div>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <Check size={16} className={`shrink-0 mt-0.5 ${col.color === "primary" ? "text-primary" : "text-secondary"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

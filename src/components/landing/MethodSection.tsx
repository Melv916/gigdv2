import { motion } from "framer-motion";
import { Lightbulb, Eye, ShieldCheck } from "lucide-react";

const methods = [
  { icon: Lightbulb, title: "Clarté", desc: "Des calculs expliqués, sans jargon inutile." },
  { icon: Eye, title: "Transparence", desc: "Hypothèses visibles, sources indiquées, méthode versionnée." },
  { icon: ShieldCheck, title: "Responsabilité", desc: "GIGD est une aide à la décision : il met en évidence ce qui doit être vérifié avant tout engagement." },
];

export function MethodSection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Notre méthode</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Une approche rigoureuse et ouverte
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {methods.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center group hover:glow-violet transition-shadow duration-500"
            >
              <div className="p-3 rounded-xl bg-secondary/10 text-secondary w-fit mx-auto mb-4">
                <m.icon size={24} />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-secondary/30 text-secondary bg-secondary/5">
            Méthode v0.1
          </span>
        </div>
      </div>
    </section>
  );
}

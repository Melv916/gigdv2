import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, Eye, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const methods = [
  {
    icon: Lightbulb,
    title: "Clarté",
    desc: "Des calculs expliqués, sans jargon inutile et avec une lecture orientée décision.",
  },
  {
    icon: Eye,
    title: "Transparence",
    desc: "Hypothèses visibles, sources indiquées et méthode consultable depuis le site.",
  },
  {
    icon: ShieldCheck,
    title: "Responsabilité",
    desc: "GIGD aide à prioriser ce qui doit être vérifié avant toute offre ou engagement.",
  },
];

export function MethodSection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Notre méthode</span>
          <h2 className="mt-3 text-3xl font-display font-bold text-foreground md:text-4xl">
            Une approche rigoureuse et ouverte
          </h2>
        </motion.div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {methods.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card group rounded-xl p-6 text-center transition-shadow duration-500 hover:glow-violet"
            >
              <div className="mx-auto mb-4 w-fit rounded-xl bg-secondary/10 p-3 text-secondary">
                <m.icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-display font-semibold text-foreground">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/methode">
            <Button variant="hero-outline">
              Lire la méthode complète
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

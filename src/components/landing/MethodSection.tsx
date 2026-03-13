import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, Eye, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const methods = [
  { icon: Lightbulb, title: "Clarte", desc: "Des calculs expliques, sans jargon inutile et avec une lecture orientee decision." },
  { icon: Eye, title: "Transparence", desc: "Hypotheses visibles, sources indiquees et methode consultable depuis le site." },
  { icon: ShieldCheck, title: "Responsabilite", desc: "GIGD aide a prioriser ce qui doit etre verifie avant toute offre ou engagement." },
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
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Notre methode</span>
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
        <div className="mt-8 text-center">
          <Link to="/methode">
            <Button variant="hero-outline">
              Lire la methode complete
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

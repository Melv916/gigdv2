import { motion } from "framer-motion";
import { Link2, CheckCircle, ThumbsUp } from "lucide-react";

const steps = [
  { icon: Link2, step: "1", title: "Coller", desc: "Collez le lien d'une annonce locative." },
  { icon: CheckCircle, step: "2", title: "Analyser", desc: "GIGD importe le bien, croise DVF/open-data loyers et calcule la rentabilité complète." },
  { icon: ThumbsUp, step: "3", title: "Agir", desc: "Recevez une analyse IA actionnable avec points forts/faibles, vérifications et stratégie de négo." },
];

export function SolutionSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">La solution</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            3 étapes. 1 décision locative claire.
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-xl p-6 text-center group hover:glow-cyan transition-shadow duration-500"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                {s.step}
              </div>
              <s.icon size={28} className="mx-auto mb-3 text-primary" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed"
        >
          Tu colles une annonce, GIGD structure l'analyse locative et te donne un plan d'action concret sans score ni verdict simpliste.
        </motion.p>
      </div>
    </section>
  );
}

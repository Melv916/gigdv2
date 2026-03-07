import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function MissionSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Notre mission</span>
          <Heart size={28} className="mx-auto mt-4 mb-4 text-primary" />
          <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
            Aider chacun à analyser un bien immobilier, détecter les pièges et prendre une décision d'investissement claire et justifiable.
          </p>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed italic max-w-xl mx-auto">
            « Inciter à de bons choix : les bons comptes font les bons amis. De bons acheteurs feront de bons vendeurs. Et c'est ainsi que l'écosystème immobilier fonctionne durablement. »
          </p>
        </motion.div>
      </div>
    </section>
  );
}

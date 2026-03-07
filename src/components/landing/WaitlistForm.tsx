import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

export function WaitlistForm() {
  return (
    <section id="go-v2" className="py-20 bg-card/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card rounded-2xl p-8 md:p-10"
        >
          <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-4">
            <Rocket size={26} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">GIGD V2</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Passez en mode operationnel
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Activez un plan, creez vos projets, comparez vos deals et pilotez vos decisions dans un seul dashboard.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/tarifs">
              <Button variant="hero" size="lg">
                Voir les tarifs
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero-outline" size="lg">
                Acceder a mon espace
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


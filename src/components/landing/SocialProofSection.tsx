import { motion } from "framer-motion";
import { Shield, BookOpen, Eye } from "lucide-react";

const items = [
  { icon: Shield, label: "Mode V2", desc: "Acces produit immediat" },
  { icon: BookOpen, label: "Methode versionnee", desc: "Transparence sur les calculs" },
  { icon: Eye, label: "Hypotheses visibles", desc: "Chaque hypothese est explicite" },
];

export function SocialProofSection() {
  return (
    <section className="py-16 border-y border-border/30">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-center gap-4 justify-center md:justify-start"
            >
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


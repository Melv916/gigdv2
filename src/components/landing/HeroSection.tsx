import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, ShieldCheck, Code2, Sparkles } from "lucide-react";

const featureTags = [
  "Loyers open-data ANIL/OLL",
  "TRI, VAN et cash-flow net-net",
  "Fiscalité configurable",
  "Comparaison multi-deals",
];

export function HeroSection() {
  const [link, setLink] = useState("");

  return (
    <section className="relative overflow-hidden py-24 md:py-32 signature-grid">
      <div className="absolute inset-0 hero-glow" />
      <span className="signature-orb w-56 h-56 bg-primary/30 left-8 top-8" />
      <span className="signature-orb w-48 h-48 bg-secondary/30 right-12 top-24" style={{ animationDelay: "-2s" }} />
      <div className="absolute inset-0 bg-background/84" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-semibold uppercase tracking-wider border border-primary/35 text-primary bg-primary/10">
              <Sparkles size={13} />
              GIGD V2
            </span>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
              Analysez plus vite,
              <br />
              <span className="gradient-text">décidez avec précision.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Centralisez vos hypothèses, estimez le loyer avec les données publiques et obtenez
              une lecture claire de la rentabilité, du risque bancaire et de la création de valeur.
            </p>

            <div className="mt-8 max-w-2xl">
              <div className="flex items-center gap-2 holo-panel rounded-2xl p-1.5">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search size={18} className="text-muted-foreground shrink-0" />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Collez le lien de votre annonce"
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm py-3 outline-none"
                  />
                </div>
                <Button variant="hero" size="default" className="shrink-0 rounded-xl px-5">
                  Analyser le bien
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {featureTags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] text-muted-foreground bg-muted/30 border border-border/50">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="holo-panel rounded-2xl p-5 gradient-border signature-float">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Lecture instantanée</p>
              <div className="space-y-3">
                <div className="rounded-xl bg-muted/25 p-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Confiance loyer</span>
                    <span className="text-primary font-semibold">84/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                    <div className="h-full w-[84%] bg-gradient-to-r from-primary to-secondary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-muted/25 p-3">
                    <p className="text-muted-foreground mb-1">Cash-flow net-net</p>
                    <p className="text-green-400 font-semibold">+162 EUR/mois</p>
                  </div>
                  <div className="rounded-xl bg-muted/25 p-3">
                    <p className="text-muted-foreground mb-1">TRI projet</p>
                    <p className="text-foreground font-semibold">11.2%</p>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/25 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1"><ShieldCheck size={12} /> DSCR bancaire</span>
                    <span className="font-semibold text-foreground">1.36</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1"><Code2 size={12} /> Rendement net</span>
                    <span className="font-semibold text-foreground">6.4%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

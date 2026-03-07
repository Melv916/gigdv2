import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "GIGD remplace-t-il un agent ou un expert ?",
    a: "Non. GIGD est un outil d'aide a la decision. Il fournit des analyses chiffrees basees sur des donnees reelles (DVF/open-data loyers), mais ne remplace pas l'avis d'un professionnel.",
  },
  {
    q: "D'ou viennent les chiffres et hypotheses ?",
    a: "Les donnees de prix proviennent des bases DVF. Les loyers viennent des sources open-data (ANIL, OLL, encadrement Paris). Les hypotheses de calcul sont affichees dans chaque analyse.",
  },
  {
    q: "Comment GIGD gere la fiscalite ?",
    a: "GIGD propose plusieurs regimes (nu, LMNP, SCI IR/IS) avec des regles configurables. Les options d'optimisation et de fiscalite sont disponibles uniquement pour les clients en mode Avance. Les calculs sont indicatifs et doivent etre verifies avec votre expert-comptable.",
  },
  {
    q: "Est-ce que ca marche pour la location courte duree ?",
    a: "Oui. Vous pouvez selectionner la strategie LCD et ajuster vos hypotheses d'occupation et de revenus.",
  },
  {
    q: "Mes donnees sont-elles securisees ?",
    a: "Oui. Vos donnees personnelles sont protegees conformement au RGPD. Les analyses ne sont pas partagees.",
  },
  {
    q: "Comment activer mon abonnement ?",
    a: "Depuis la page Tarifs, choisissez une formule puis finalisez le paiement Stripe. Vous pouvez ensuite gerer votre abonnement dans /app/abonnement.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Questions frequentes
          </h2>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass-card rounded-xl border-border/30 px-5"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary transition-colors py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export { faqs };

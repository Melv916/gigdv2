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
    a: "Non. GIGD est un outil d'aide à la décision. Il fournit des analyses chiffrées basées sur des données réelles (DVF/open-data loyers), mais ne remplace pas l'avis d'un professionnel.",
  },
  {
    q: "D'où viennent les chiffres et hypothèses ?",
    a: "Les données de prix proviennent des bases DVF. Les loyers viennent des sources open-data (ANIL, OLL, encadrement Paris). Les hypothèses de calcul sont affichées dans chaque analyse.",
  },
  {
    q: "Comment GIGD gère la fiscalité ?",
    a: "GIGD propose plusieurs régimes (nu, LMNP, SCI IR/IS) avec des règles configurables. Les options d'optimisation et de fiscalité sont disponibles uniquement pour les clients en mode Avancé. Les calculs sont indicatifs et doivent être vérifiés avec votre expert-comptable.",
  },
  {
    q: "Est-ce que ça marche pour la location courte durée ?",
    a: "Oui. Vous pouvez sélectionner la stratégie LCD et ajuster vos hypothèses d'occupation et de revenus.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui. Vos données personnelles sont protégées conformément au RGPD. Les analyses ne sont pas partagées.",
  },
  {
    q: "Comment activer mon abonnement ?",
    a: "Depuis la page Tarifs, choisissez une formule puis finalisez le paiement Stripe. Vous pouvez ensuite gérer votre abonnement dans /app/abonnement.",
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
            Questions fréquentes
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

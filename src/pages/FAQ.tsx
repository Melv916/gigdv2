import { PageLayout } from "@/components/layout/PageLayout";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs as baseFaqs } from "@/components/landing/FAQSection";
import { Seo } from "@/components/seo/Seo";

const extraFaqs = [
  {
    q: "Comment fonctionne l'analyse IA ?",
    a: "L'analyse IA est actuellement en cours de developpement.",
  },
  {
    q: "Que faire si une info manque dans l'annonce ?",
    a: "GIGD ajoute une section A verifier et liste les documents a demander. Vous pouvez aussi completer manuellement les donnees (charges, taxe fonciere, travaux) pour affiner l'analyse.",
  },
];

const allFaqs = [...baseFaqs, ...extraFaqs];

const FAQ = () => {
  return (
    <PageLayout>
      <Seo
        title="FAQ GIGD"
        description="Questions frequentes sur GIGD, le fonctionnement des analyses, les donnees et l'utilisation du produit."
        pathname="/faq"
      />
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-display font-bold text-foreground">
              Toutes vos questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Retrouvez les reponses aux questions les plus frequentes sur GIGD V2.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {allFaqs.map((faq, i) => (
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
    </PageLayout>
  );
};

export default FAQ;

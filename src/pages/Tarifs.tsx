import { PageLayout } from "@/components/layout/PageLayout";
import { Seo } from "@/components/seo/Seo";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type PlanId = "free" | "debutant" | "investisseur" | "avance";

const PLANS: Array<{
  id: PlanId;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
}> = [
  {
    id: "free",
    name: "Free",
    price: "0 EUR",
    description: "Pour decouvrir le moteur locatif",
    features: ["5 analyses / mois", "IA courte", "Calculs locatifs complets"],
  },
  {
    id: "debutant",
    name: "Debutant",
    price: "9,90 EUR",
    description: "Pour lancer son rythme d'analyse",
    features: ["50 analyses / mois", "IA courte", "Support standard"],
  },
  {
    id: "investisseur",
    name: "Investisseur",
    price: "29,90 EUR",
    description: "Pour un usage intensif",
    features: ["Analyses illimitees", "IA complete", "Sans support dedie"],
    highlight: true,
  },
  {
    id: "avance",
    name: "Avance",
    price: "49,90 EUR",
    description: "Pour l'accompagnement premium",
    features: ["Analyses illimitees", "IA complete", "Acces espace premium /app/avance"],
  },
];

const Tarifs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const choosePlan = (planId: PlanId) => {
    if (planId === "free") {
      navigate(user ? "/app/abonnement" : "/auth?next=%2Fapp%2Fabonnement");
      return;
    }
    if (user) {
      navigate(`/app/abonnement?plan=${planId}`);
      return;
    }
    const next = encodeURIComponent(`/app/abonnement?plan=${planId}`);
    navigate(`/auth?next=${next}`);
  };

  return (
    <PageLayout>
      <Seo
        title="Tarifs GIGD"
        description="Consultez les formules GIGD pour analyser des opportunites d'investissement locatif."
        pathname="/tarifs"
      />
      <section className="py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Tarifs V2</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-display font-bold text-foreground">
              Des plans clairs, activables immediatement
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Investissement locatif uniquement. Pas de beta, pas de liste d'attente.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-2xl p-6 flex flex-col ${plan.highlight ? "gradient-border glow-cyan" : ""}`}
              >
                {plan.highlight && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-3">
                    Recommande
                  </span>
                )}
                <h3 className="text-lg font-display font-semibold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-3 mb-5">
                  <span className="text-3xl font-display font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? "hero" : "hero-outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => choosePlan(plan.id)}
                >
                  {plan.id === "free" ? "Voir mon plan" : "Choisir cette formule"}
                  <ArrowRight size={14} />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Tarifs;

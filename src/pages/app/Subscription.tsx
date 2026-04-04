import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getMe } from "@/lib/v2/api";
import { supabase } from "@/integrations/supabase/client";

type Plan = "free" | "debutant" | "investisseur" | "avance";

const plans: Array<{ id: Plan; label: string; price: string; desc: string }> = [
  { id: "free", label: "Free", price: "0 EUR/mois", desc: "5 analyses/mois + IA courte" },
  { id: "debutant", label: "Débutant", price: "0 EUR/mois", desc: "50 analyses/mois + IA courte" },
  { id: "investisseur", label: "Investisseur", price: "0 EUR/mois", desc: "Illimité + IA complète" },
  { id: "avance", label: "Avancé", price: "0 EUR/mois", desc: "Illimité + espace premium" },
];

const Subscription = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);
  const [busyPlan, setBusyPlan] = useState<string>("");

  const refresh = async () => {
    const data = await getMe();
    setMe(data);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (!plan) return;
    if (plan === "free" || plan === "debutant" || plan === "investisseur" || plan === "avance") {
      onSelectPlan(plan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const quotaText = useMemo(() => {
    if (!me?.quota) return "-";
    if (me.quota.limit === null) return "Illimite";
    return `${me.quota.used}/${me.quota.limit}`;
  }, [me]);

  const onSelectPlan = async (plan: Plan) => {
    try {
      setBusyPlan(plan);
      const session = await supabase.auth.getSession();
      const uid = session.data.session?.user?.id;
      if (!uid) throw new Error("Session introuvable");

      const { error } = await supabase.from("profiles").update({ plan }).eq("user_id", uid);
      if (error) throw error;

      await refresh();
      toast({ title: "Plan mis à jour", description: `Plan actif : ${plan}` });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Impossible de changer le plan", variant: "destructive" });
    } finally {
      setBusyPlan("");
    }
  };

  if (loading) return <AppLayout><div className="py-20 text-center text-muted-foreground">Chargement...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="glass-card rounded-[1.75rem] p-6 md:p-8">
          <p className="premium-eyebrow">Abonnement</p>
          <h1 className="mt-3 text-2xl font-display font-bold text-foreground">Piloter le niveau d'acces GIGD</h1>
          <p className="text-sm text-muted-foreground mt-2">Plan actuel : <b>{me?.plan}</b></p>
          <p className="text-sm text-muted-foreground">Quota consommé : <b>{quotaText}</b></p>
          <p className="text-sm text-muted-foreground">Prochain reset : <b>{me?.quota?.nextReset || "-"}</b></p>
          <p className="text-xs text-muted-foreground mt-2">Mode temporaire : tous les plans sont gratuits et sélectionnables librement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {plans.map((p) => (
            <div key={p.id} className="glass-card rounded-[1.4rem] p-5">
              <p className="font-semibold text-foreground">{p.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.price}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              <div className="mt-3">
                <Button
                  variant={me?.plan === p.id ? "outline" : "hero"}
                  onClick={() => onSelectPlan(p.id)}
                  disabled={busyPlan === p.id || me?.plan === p.id}
                >
                  {busyPlan === p.id ? "Mise à jour..." : me?.plan === p.id ? "Plan actif" : `Activer ${p.label}`}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Subscription;

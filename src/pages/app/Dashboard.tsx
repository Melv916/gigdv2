import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FolderOpen,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { getMe } from "@/lib/v2/api";

interface Project {
  id: string;
  name: string;
  objectif: string;
  strategie: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setProjects((data as Project[]) || []);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getMe()
      .then((data) => setPlan(data?.plan || "free"))
      .catch(() => setPlan("free"));
  }, [user]);

  const objectifLabels: Record<string, string> = {
    locatif: "Investissement locatif",
  };

  const strategieLabels: Record<string, string> = {
    "ld-nue": "Location nue",
    meuble: "Meublé",
    coloc: "Colocation",
    lcd: "Courte durée",
  };

  const lastActivity = projects[0] ? new Date(projects[0].updated_at).toLocaleDateString("fr-FR") : "-";
  const activeProjects = projects.filter((p) => (p.status || "actif") !== "archive").length;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl p-6 md:p-8 mb-6 bg-gradient-to-br from-cyan-500/10 via-background to-orange-500/10 border border-border/40">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-primary font-semibold">Dashboard premium</p>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-1">Pilotage investissement V2</h1>
                <p className="text-sm text-muted-foreground mt-2">Vue unifiée : projets, rythme d'analyse, abonnement, exécution.</p>
              </div>
              <div className="flex gap-2">
                <Link to="/app/abonnement">
                  <Button variant="hero-outline" size="sm">
                    <CreditCard size={14} />
                    Abonnement
                  </Button>
                </Link>
                <Link to="/app/projets/nouveau">
                  <Button variant="hero" size="sm">
                    <Plus size={14} />
                    Nouveau projet
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Projets actifs", value: activeProjects, icon: FolderOpen, note: `${projects.length} total` },
              { label: "Dernière activité", value: lastActivity, icon: Clock, note: "mise à jour projet" },
              { label: "Abonnement", value: plan, icon: CreditCard, note: "facturation Stripe" },
              { label: "Statut d'exécution", value: "Opérationnel", icon: ShieldCheck, note: "moteur open-data actif" },
            ].map((kpi) => (
              <div key={kpi.label} className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <kpi.icon size={15} className="text-primary" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="text-xl font-display font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.note}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Pipeline projets</h2>
                <Link to="/app/projets" className="text-xs text-primary hover:underline">Voir tout</Link>
              </div>

              {projects.length === 0 && !loading ? (
                <div className="text-center py-10">
                  <FolderOpen size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">Aucun projet pour le moment.</p>
                  <Link to="/app/projets/nouveau">
                    <Button variant="hero" size="sm">
                      <Plus size={14} />
                      Créer un projet
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {projects.slice(0, 6).map((p) => (
                    <Link key={p.id} to={`/app/projets/${p.id}`}>
                      <div className="rounded-xl p-3 bg-muted/20 hover:bg-muted/30 transition-colors flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {objectifLabels[p.objectif] || "Investissement locatif"} · {strategieLabels[p.strategie] || p.strategie}
                          </p>
                        </div>
                        <ArrowRight size={14} className="text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} className="text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Actions rapides</h2>
              </div>
              <div className="space-y-2">
                <Link to="/app/projets/nouveau">
                  <button className="w-full text-left rounded-lg bg-muted/20 hover:bg-muted/30 p-3 transition-colors">
                    <p className="text-sm font-medium text-foreground">Analyser un nouveau bien</p>
                    <p className="text-xs text-muted-foreground">Créer un projet et lancer l'analyse.</p>
                  </button>
                </Link>
                <Link to="/app/abonnement">
                  <button className="w-full text-left rounded-lg bg-muted/20 hover:bg-muted/30 p-3 transition-colors">
                    <p className="text-sm font-medium text-foreground">Ajuster mon abonnement</p>
                    <p className="text-xs text-muted-foreground">Sélectionner la formule adaptée.</p>
                  </button>
                </Link>
                <Link to="/tarifs">
                  <button className="w-full text-left rounded-lg bg-muted/20 hover:bg-muted/30 p-3 transition-colors">
                    <p className="text-sm font-medium text-foreground">Comparer les plans</p>
                    <p className="text-xs text-muted-foreground">Voir les différences de fonctionnalités.</p>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              V2 active : moteur d'analyse locative open-data, fiscalité configurable, TRI/VAN, comparaison de deals.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

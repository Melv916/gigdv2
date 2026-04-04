import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, FolderOpen, Gem, Plus, Sparkles } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  objectif: string;
  strategie: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const objectifLabels: Record<string, string> = {
  locatif: "Investissement locatif",
};

const strategieLabels: Record<string, string> = {
  "ld-nue": "Location nue",
  meuble: "Meuble",
  coloc: "Colocation",
  lcd: "Courte duree",
};

const statusLabels: Record<string, string> = {
  actif: "Actif",
  archive: "Archive",
  brouillon: "Brouillon",
  draft: "Brouillon",
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getProjectDescriptor = (project: Pick<Project, "objectif" | "strategie">) => {
  const objectif = objectifLabels[project.objectif] || "Investissement locatif";
  const strategie = strategieLabels[project.strategie] || project.strategie;
  return { objectif, strategie };
};

const getStatusTone = (status?: string) => {
  switch ((status || "actif").toLowerCase()) {
    case "archive":
      return "border-white/10 bg-white/5 text-slate-300";
    case "brouillon":
    case "draft":
      return "border-primary/20 bg-primary/10 text-sky-200";
    default:
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  const latestProject = projects[0] || null;
  const activeProjects = projects.filter((project) => (project.status || "actif") !== "archive").length;

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 md:gap-7">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-[2rem] border border-white/6 bg-white/[0.02] px-5 py-5 shadow-[0_16px_50px_rgba(2,8,20,0.18)] backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-7"
        >
          <div className="space-y-2">
            <p className="premium-eyebrow">Cockpit GIGD</p>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-foreground md:text-[2.5rem]">Dashboard</h1>
              <p className="max-w-2xl text-sm text-slate-300/88 md:text-[15px]">
                Pilotez vos projets, vos analyses et votre abonnement.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="dashboard-panel rounded-[2rem] px-5 py-5 md:px-7 md:py-6"
        >
          <div className="relative z-10 space-y-4">
            <div className="space-y-2">
              <p className="premium-eyebrow">Reprise rapide</p>
              <div className="space-y-1.5">
                <h2 className="text-2xl font-semibold text-foreground md:text-[2.15rem]">
                  Reprendre votre dernier projet
                </h2>
                <p className="max-w-2xl text-sm text-slate-300/80 md:text-[15px]">
                  Revenez tout de suite sur le dossier le plus recent et relancez votre prochaine action utile.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-3.5">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-3 h-6 w-32 animate-pulse rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            ) : latestProject ? (
              <>
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`dashboard-status-pill ${getStatusTone(latestProject.status)}`}>
                      {statusLabels[(latestProject.status || "actif").toLowerCase()] || latestProject.status || "Actif"}
                    </span>
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {activeProjects} projet{activeProjects > 1 ? "s" : ""} en cours
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="max-w-3xl text-3xl font-semibold text-white md:text-[2.8rem]">{latestProject.name}</h3>
                    <p className="max-w-2xl text-[15px] text-slate-300/84">
                      {getProjectDescriptor(latestProject).objectif} · {getProjectDescriptor(latestProject).strategie}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="dashboard-mini-card rounded-[1.2rem] p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Strategie</p>
                    <p className="mt-2.5 text-sm font-medium text-foreground">
                      {getProjectDescriptor(latestProject).strategie}
                    </p>
                  </div>
                  <div className="dashboard-mini-card rounded-[1.2rem] p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Derniere mise a jour</p>
                    <p className="mt-2.5 text-sm font-medium text-foreground">{formatDate(latestProject.updated_at)}</p>
                  </div>
                  <div className="dashboard-mini-card rounded-[1.2rem] p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Statut</p>
                    <p className="mt-2.5 text-sm font-medium text-foreground">
                      {statusLabels[(latestProject.status || "actif").toLowerCase()] || latestProject.status || "Actif"}
                    </p>
                  </div>
                  <div className="dashboard-mini-card rounded-[1.2rem] p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Portefeuille</p>
                    <p className="mt-2.5 text-sm font-medium text-foreground">
                      {projects.length} projet{projects.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="dashboard-mini-card rounded-[1.35rem] p-4 md:p-5">
                <p className="text-lg font-medium text-foreground">Aucun projet a reprendre pour le moment.</p>
                <p className="mt-2 max-w-xl text-sm text-slate-300/78">
                  Lancez une nouvelle analyse pour creer votre premier dossier d'investissement et demarrer votre espace de pilotage.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5 pt-0.5">
              {latestProject ? (
                <Link to={`/app/projets/${latestProject.id}`}>
                  <Button variant="hero">
                    <FolderOpen size={16} />
                    Ouvrir le projet
                  </Button>
                </Link>
              ) : (
                <Link to="/app/projets/nouveau">
                  <Button variant="hero">
                    <Plus size={16} />
                    Creer un projet
                  </Button>
                </Link>
              )}

              <Link to="/app/projets/nouveau">
                <Button variant="hero-outline">
                  <Sparkles size={16} />
                  Nouvelle analyse
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_340px]"
        >
          <div className="dashboard-panel-muted rounded-[2rem] p-5 md:p-6">
            <div className="flex flex-col gap-3 border-b border-white/6 pb-5 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="premium-eyebrow">Mes projets</p>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Mes projets</h2>
                  <p className="mt-1 text-sm text-slate-300/76">
                    Retrouvez vos dossiers actifs et rouvrez le bon projet sans passer par une vue admin.
                  </p>
                </div>
              </div>
              <Link to="/app/projets" className="text-sm font-medium text-sky-300 transition-colors hover:text-white">
                Voir tous les projets
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {!loading && projects.length === 0 ? (
                <div className="dashboard-mini-card rounded-[1.5rem] p-6 text-center">
                  <FolderOpen size={28} className="mx-auto text-slate-500" />
                  <p className="mt-4 text-base font-medium text-foreground">Aucun projet en portefeuille</p>
                  <p className="mt-2 text-sm text-slate-300/74">Creez une analyse pour faire apparaitre votre premier projet ici.</p>
                </div>
              ) : (
                projects.slice(0, 6).map((project, index) => {
                  const descriptor = getProjectDescriptor(project);
                  return (
                    <div key={project.id} className="dashboard-project-row rounded-[1.5rem] px-4 py-4 md:px-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0 space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                              Projet {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className={`dashboard-status-pill ${getStatusTone(project.status)}`}>
                              {statusLabels[(project.status || "actif").toLowerCase()] || project.status || "Actif"}
                            </span>
                          </div>
                          <div>
                            <h3 className="truncate text-lg font-semibold text-foreground">{project.name}</h3>
                            <p className="mt-1 text-sm text-slate-300/76">
                              {descriptor.objectif} · {descriptor.strategie}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 md:justify-end">
                          <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
                            Mis a jour le {formatDate(project.updated_at)}
                          </div>
                          <Link to={`/app/projets/${project.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full border border-white/10 bg-white/[0.03] px-4 text-slate-100 hover:bg-white/[0.08]"
                            >
                              Ouvrir
                              <ArrowRight size={14} />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="dashboard-panel-muted rounded-[2rem] p-5 md:p-6">
            <div className="space-y-2 border-b border-white/6 pb-5">
              <p className="premium-eyebrow">Actions utiles</p>
              <h2 className="text-xl font-semibold text-foreground">Actions utiles</h2>
              <p className="text-sm text-slate-300/76">
                Les raccourcis pratiques restent accessibles, mais la priorite visuelle reste sur vos projets.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  title: "Analyser un nouveau bien",
                  description: "Creer un projet et lancer une nouvelle analyse.",
                  to: "/app/projets/nouveau",
                  icon: Plus,
                },
                {
                  title: "Ajuster mon abonnement",
                  description: "Mettre a jour votre formule ou votre facturation.",
                  to: "/app/abonnement",
                  icon: CreditCard,
                },
                {
                  title: "Comparer les plans",
                  description: "Consulter les differences de fonctionnalites.",
                  to: "/tarifs",
                  icon: Sparkles,
                },
                {
                  title: "Acceder a l'espace avance",
                  description: "Ouvrir les ressources et outils complementaires.",
                  to: "/app/avance",
                  icon: Gem,
                },
              ].map((action) => (
                <Link key={action.title} to={action.to} className="block">
                  <div className="dashboard-mini-card rounded-[1.4rem] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="mt-0.5 rounded-[1rem] border border-white/8 bg-white/[0.04] p-2 text-sky-300">
                          <action.icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{action.title}</p>
                          <p className="mt-1 text-sm text-slate-300/72">{action.description}</p>
                        </div>
                      </div>
                      <ArrowRight size={15} className="mt-1 text-slate-500" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

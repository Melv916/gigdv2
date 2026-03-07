import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  objectif: string;
  strategie: string;
  financement: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const objectifLabels: Record<string, string> = {
  rp: "Résidence Principale",
  locatif: "Locatif",
  marchand: "Marchand de biens",
};
const strategieLabels: Record<string, string> = {
  "ld-nue": "LD nue",
  meuble: "Meublé",
  coloc: "Colocation",
  lcd: "LCD",
};

const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Supprimer ce projet et toutes ses analyses ?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">Mes projets</h1>
            <Link to="/app/projets/nouveau">
              <Button variant="hero"><Plus size={16} /> Nouveau projet</Button>
            </Link>
          </div>

          <div className="space-y-3">
            {projects.map((p) => (
              <Link key={p.id} to={`/app/projets/${p.id}`}>
                <div className="glass-card rounded-xl p-5 hover:border-primary/30 transition-colors flex items-center justify-between group">
                  <div>
                    <p className="font-semibold text-foreground text-lg">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {objectifLabels[p.objectif] || p.objectif} · {strategieLabels[p.strategie] || p.strategie} · {p.financement === "credit" ? "Crédit" : "Comptant"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.updated_at).toLocaleDateString("fr-FR")}
                    </span>
                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
            {!loading && projects.length === 0 && (
              <div className="glass-card rounded-2xl p-12 text-center">
                <p className="text-muted-foreground mb-4">Aucun projet pour le moment.</p>
                <Link to="/app/projets/nouveau">
                  <Button variant="hero"><Plus size={16} /> Créer un projet</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ProjectList;

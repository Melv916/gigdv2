import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

const STEPS = ["Projet", "Stratégie", "Financement", "Hypothèses"];

const NewProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    objectif: "locatif",
    strategie: "meuble",
    financement: "credit",
    apport: 0,
    duree_credit: 20,
    taux_interet: 3.5,
    assurance_emprunteur: 0.34,
    frais_notaire_pct: 8,
    vacance_locative: 1,
    croissance_valeur: 2,
    croissance_loyers: 2,
    inflation_charges: 2,
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 0;
    return true;
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...form, user_id: user.id, charges_non_recup: 0, budget_travaux: 0 })
      .select("id")
      .single();
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      setSaving(false);
    } else {
      navigate(`/app/projets/${data.id}`);
    }
  };

  const selectBtn = (active: boolean) =>
    `px-4 py-3 rounded-xl text-sm font-medium border transition-all cursor-pointer text-left ${
      active
        ? "border-primary bg-primary/10 text-primary"
        : "border-border/50 bg-muted/20 text-muted-foreground hover:border-primary/30"
    }`;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Nouveau projet</h1>
          <Progress value={((step + 1) / STEPS.length) * 100} className="mb-2 h-1.5" />
          <div className="flex justify-between text-[10px] text-muted-foreground mb-8">
            {STEPS.map((s, i) => (
              <span key={s} className={i <= step ? "text-primary" : ""}>{s}</span>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-foreground">Nom du projet</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Ex: Studio Massy, Immeuble Lyon 3…"
                        className="bg-muted/30 border-border/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-foreground">Perimetre V2</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { v: "locatif", l: "Investissement locatif", d: "Location nue, meuble, colocation, LCD" },
                        ].map((o) => (
                          <button key={o.v} className={selectBtn(form.objectif === o.v)} onClick={() => update("objectif", o.v)}>
                            <p className="font-semibold">{o.l}</p>
                            <p className="text-xs mt-0.5 opacity-70">{o.d}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-3">
                    <Label className="text-foreground">Stratégie locative</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { v: "ld-nue", l: "Location nue", d: "Bail classique 3 ans" },
                        { v: "meuble", l: "Meublé", d: "Bail meublé 1 an / 9 mois" },
                        { v: "coloc", l: "Colocation", d: "Loyers par chambre" },
                        { v: "lcd", l: "Courte durée", d: "Type Airbnb / saisonnier" },
                      ].map((o) => (
                        <button key={o.v} className={selectBtn(form.strategie === o.v)} onClick={() => update("strategie", o.v)}>
                          <p className="font-semibold">{o.l}</p>
                          <p className="text-xs mt-0.5 opacity-70">{o.d}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-foreground">Mode de financement</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { v: "credit", l: "Crédit immobilier" },
                          { v: "comptant", l: "Comptant" },
                        ].map((o) => (
                          <button key={o.v} className={selectBtn(form.financement === o.v)} onClick={() => update("financement", o.v)}>
                            <p className="font-semibold">{o.l}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    {form.financement === "credit" && (
                      <div className="space-y-4 pl-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-foreground text-xs">Apport (€)</Label>
                            <Input type="number" value={form.apport} onChange={(e) => update("apport", +e.target.value)} className="bg-muted/30 border-border/50" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground text-xs">Durée (années)</Label>
                            <Input type="number" value={form.duree_credit} onChange={(e) => update("duree_credit", +e.target.value)} className="bg-muted/30 border-border/50" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-foreground text-xs">Taux d'intérêt (%)</Label>
                            <Input type="number" step="0.1" value={form.taux_interet} onChange={(e) => update("taux_interet", +e.target.value)} className="bg-muted/30 border-border/50" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-foreground text-xs">Assurance (%/an)</Label>
                            <Input type="number" step="0.01" value={form.assurance_emprunteur} onChange={(e) => update("assurance_emprunteur", +e.target.value)} className="bg-muted/30 border-border/50" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <p className="text-xs text-muted-foreground">Ces hypothèses sont modifiables dans les paramètres du projet. <span className="text-primary">Méthode v0.1</span></p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <Label className="text-foreground">Frais de notaire</Label>
                          <span className="text-primary font-semibold">{form.frais_notaire_pct}%</span>
                        </div>
                        <Slider
                          value={[form.frais_notaire_pct]}
                          onValueChange={([v]) => update("frais_notaire_pct", v)}
                          min={6} max={10} step={0.5}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground text-xs">Vacance locative (mois/an)</Label>
                          <Input type="number" value={form.vacance_locative} onChange={(e) => update("vacance_locative", +e.target.value)} className="bg-muted/30 border-border/50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground text-xs">Croiss. valeur (%/an)</Label>
                          <Input type="number" step="0.5" value={form.croissance_valeur} onChange={(e) => update("croissance_valeur", +e.target.value)} className="bg-muted/30 border-border/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground text-xs">Croiss. loyers (%/an)</Label>
                          <Input type="number" step="0.5" value={form.croissance_loyers} onChange={(e) => update("croissance_loyers", +e.target.value)} className="bg-muted/30 border-border/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground text-xs">Inflation charges (%/an)</Label>
                          <Input type="number" step="0.5" value={form.inflation_charges} onChange={(e) => update("inflation_charges", +e.target.value)} className="bg-muted/30 border-border/50" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
              >
                <ArrowLeft size={16} /> Retour
              </Button>
              {step < STEPS.length - 1 ? (
                <Button variant="hero" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                  Suivant <ArrowRight size={16} />
                </Button>
              ) : (
                <Button variant="hero" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <><Check size={16} /> Créer le projet</>}
                </Button>
              )}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground text-center mt-4">
            Aide à la décision — à vérifier avant engagement.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default NewProject;


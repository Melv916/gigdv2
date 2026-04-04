import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Check,
  CreditCard,
  Gem,
  Mail,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { getMe } from "@/lib/v2/api";

const ADVANCED_WHATSAPP_LINK = "https://chat.whatsapp.com/JBgAs0K2CIII3l1RWEiwXb";

type MeResponse = {
  email?: string;
  plan?: string;
  advancedAccess?: boolean;
};

const planLabels: Record<string, string> = {
  free: "Free",
  avance: "Avance",
  premium: "Premium",
  pro: "Pro",
};

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    getMe()
      .then((data) => setMe(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-muted-foreground">Chargement...</div>
      </AppLayout>
    );
  }

  const advancedEnabled = me?.advancedAccess || me?.plan === "avance";
  const planLabel = planLabels[me?.plan || ""] || me?.plan || "-";

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <section className="flex flex-col gap-2 rounded-[2rem] border border-white/6 bg-white/[0.02] px-5 py-5 shadow-[0_16px_50px_rgba(2,8,20,0.18)] backdrop-blur-xl md:px-7">
          <p className="premium-eyebrow">Compte & accès premium</p>
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-foreground md:text-[2.4rem]">Compte</h1>
            <p className="max-w-2xl text-sm text-slate-300/84 md:text-[15px]">
              Gérez vos informations, votre formule et vos accès premium.
            </p>
          </div>
        </section>

        <section className="dashboard-panel-muted rounded-[2rem] p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="dashboard-mini-card rounded-[1.55rem] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-[1rem] border border-white/8 bg-white/[0.04] p-2.5 text-sky-300">
                  <UserCircle2 size={17} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Identite du compte</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">Compte principal GIGD</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail size={14} />
                    <p className="text-[11px] uppercase tracking-[0.18em]">Email</p>
                  </div>
                  <p className="mt-3 break-all text-sm font-medium text-foreground">{me?.email || "-"}</p>
                </div>

                <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BadgeCheck size={14} />
                    <p className="text-[11px] uppercase tracking-[0.18em]">Statut du compte</p>
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">Actif</p>
                </div>
              </div>
            </div>

            <div className="dashboard-mini-card rounded-[1.55rem] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-[1rem] border border-white/8 bg-white/[0.04] p-2.5 text-sky-300">
                  <CreditCard size={17} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Formule active</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{planLabel}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck size={14} />
                    <p className="text-[11px] uppercase tracking-[0.18em]">Statut premium</p>
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    {advancedEnabled ? "Accès premium actif" : "Accès standard"}
                  </p>
                </div>

                <div className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Gem size={14} />
                    <p className="text-[11px] uppercase tracking-[0.18em]">Acces avances</p>
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    {advancedEnabled ? "Ressources membres débloquées" : "Disponibles avec le plan Avance"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel-muted rounded-[2rem] p-5 md:p-6">
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <p className="premium-eyebrow">Accès membres avancés</p>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Accès membres avancés</h2>
                <p className="mt-1 text-sm text-slate-300/76">
                  Vos accès premium et ressources complémentaires.
                </p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="space-y-3">
                {[
                  "Accès WhatsApp avancé",
                  "Espace avancé",
                  "Ressources complémentaires",
                ].map((item) => (
                  <div key={item} className="dashboard-mini-card rounded-[1.25rem] px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-cyan-400/18 bg-cyan-400/10 p-1.5 text-cyan-200">
                        <Check size={12} />
                      </div>
                      <p className="text-sm font-medium text-foreground">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              {advancedEnabled ? (
                <div className="flex flex-col gap-2.5 lg:min-w-[240px]">
                  <Button asChild variant="hero">
                    <a href={ADVANCED_WHATSAPP_LINK} target="_blank" rel="noreferrer">
                      Rejoindre le WhatsApp avancé
                    </a>
                  </Button>
                  <Button asChild variant="hero-outline">
                    <Link to="/app/avance">Ouvrir l'espace avancé</Link>
                  </Button>
                </div>
              ) : (
                <div className="dashboard-mini-card rounded-[1.35rem] p-4 lg:min-w-[280px]">
                  <p className="text-sm text-slate-300/78">
                    Cette section est réservée aux membres ayant le plan Avance.
                  </p>
                  <div className="mt-4">
                    <Button asChild variant="hero-outline">
                      <Link to="/app/abonnement">Voir les abonnements</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Account;

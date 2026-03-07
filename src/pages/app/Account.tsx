import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { getMe } from "@/lib/v2/api";

const ADVANCED_WHATSAPP_LINK = "https://chat.whatsapp.com/JBgAs0K2CIII3l1RWEiwXb";

type MeResponse = {
  email?: string;
  plan?: string;
  advancedAccess?: boolean;
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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-card rounded-2xl p-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Compte</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Email: <b>{me?.email || "-"}</b>
          </p>
          <p className="text-sm text-muted-foreground">
            Plan actif: <b>{me?.plan || "-"}</b>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground">Acces membres avances</h2>
          {advancedEnabled ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="hero">
                <a href={ADVANCED_WHATSAPP_LINK} target="_blank" rel="noreferrer">
                  Rejoindre le WhatsApp avance
                </a>
              </Button>
              <Button asChild variant="hero-outline">
                <Link to="/app/avance">Ouvrir l'espace avance</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-muted-foreground">
                Cette section est reservee aux membres ayant le plan Avance.
              </p>
              <Button asChild variant="hero-outline">
                <Link to="/app/abonnement">Voir les abonnements</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Account;

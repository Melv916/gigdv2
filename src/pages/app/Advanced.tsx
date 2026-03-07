import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { getMe } from "@/lib/v2/api";

const ADVANCED_WHATSAPP_LINK = "https://chat.whatsapp.com/JBgAs0K2CIII3l1RWEiwXb";

const Advanced = () => {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    getMe()
      .then((data) => setMe(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><div className="py-20 text-center text-muted-foreground">Chargement...</div></AppLayout>;

  if (!me?.advancedAccess) return <Navigate to="/tarifs" replace />;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Espace Avancé</h1>
          <p className="text-sm text-muted-foreground mt-2">Ce que tu as débloqué :</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li>analyses illimitées</li>
            <li>accès WhatsApp direct (toi + pros)</li>
            <li>accès book privé (optimisation fiscale & stratégie patrimoine)</li>
            <li>accès vidéos explicatives</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild variant="hero"><a href={me.advancedLinks?.whatsapp || ADVANCED_WHATSAPP_LINK} target="_blank" rel="noreferrer">WhatsApp</a></Button>
            <Button asChild variant="hero-outline"><a href={me.advancedLinks?.book || "#"} target="_blank" rel="noreferrer">Book privé</a></Button>
            <Button asChild variant="hero-outline"><a href={me.advancedLinks?.videos || "#"} target="_blank" rel="noreferrer">Vidéos</a></Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Advanced;
